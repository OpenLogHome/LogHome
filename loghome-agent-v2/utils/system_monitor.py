"""
系统监控工具
用于跟踪信息检索系统的性能和上下文状态
"""

import time
import threading
import json
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional
from dataclasses import dataclass, field
from collections import defaultdict, deque
import statistics

@dataclass
class PerformanceMetrics:
    """性能指标数据结构"""
    retrieval_count: int = 0
    success_count: int = 0
    failure_count: int = 0
    total_response_time: float = 0.0
    avg_response_time: float = 0.0
    max_response_time: float = 0.0
    min_response_time: float = float('inf')
    recent_response_times: deque = field(default_factory=lambda: deque(maxlen=100))
    
    def update_response_time(self, response_time: float):
        """更新响应时间统计"""
        self.total_response_time += response_time
        self.recent_response_times.append(response_time)
        
        if response_time > self.max_response_time:
            self.max_response_time = response_time
        if response_time < self.min_response_time:
            self.min_response_time = response_time
        
        # 计算平均响应时间
        if self.retrieval_count > 0:
            self.avg_response_time = self.total_response_time / self.retrieval_count
    
    def get_recent_avg_response_time(self) -> float:
        """获取最近的平均响应时间"""
        if self.recent_response_times:
            return statistics.mean(self.recent_response_times)
        return 0.0

class SystemMonitor:
    """系统监控器"""
    
    def __init__(self, monitoring_interval: int = 60):
        """
        初始化系统监控器
        
        Args:
            monitoring_interval: 监控间隔（秒）
        """
        self.monitoring_interval = monitoring_interval
        self.start_time = datetime.now()
        
        # 性能指标
        self.performance_metrics = PerformanceMetrics()
        
        # 上下文状态统计
        self.context_stats = {
            "active_sessions": 0,
            "total_sessions_created": 0,
            "sessions_expired": 0,
            "active_retrievals": 0,
            "total_retrievals": 0
        }
        
        # 错误统计
        self.error_stats = defaultdict(int)
        
        # 检索类型统计
        self.retrieval_type_stats = defaultdict(int)
        
        # 用户活动统计
        self.user_activity_stats = defaultdict(int)
        
        # 监控历史记录
        self.monitoring_history = deque(maxlen=1440)  # 保留24小时的记录（每分钟一条）
        
        # 线程锁
        self.lock = threading.RLock()
        
        # 启动监控线程
        self.monitoring_thread = threading.Thread(target=self._monitoring_loop, daemon=True)
        self.monitoring_thread.start()
        
        print("✅ 系统监控器启动成功")
    
    def record_retrieval_start(self, user_id: int, request_type: str, keywords: List[str]) -> str:
        """
        记录检索开始
        
        Args:
            user_id: 用户ID
            request_type: 请求类型
            keywords: 关键词列表
            
        Returns:
            str: 检索请求ID
        """
        with self.lock:
            request_id = f"monitor_{user_id}_{int(time.time())}_{len(self.performance_metrics.recent_response_times)}"
            
            # 更新统计
            self.performance_metrics.retrieval_count += 1
            self.context_stats["total_retrievals"] += 1
            self.context_stats["active_retrievals"] += 1
            self.retrieval_type_stats[request_type] += 1
            self.user_activity_stats[user_id] += 1
            
            # 记录开始时间
            setattr(self, f"_start_time_{request_id}", time.time())
            
            print(f"📊 记录检索开始: {request_id}, 用户: {user_id}, 类型: {request_type}")
            return request_id
    
    def record_retrieval_end(self, request_id: str, success: bool, error_type: str = None):
        """
        记录检索结束
        
        Args:
            request_id: 检索请求ID
            success: 是否成功
            error_type: 错误类型（如果失败）
        """
        with self.lock:
            start_time_attr = f"_start_time_{request_id}"
            
            if hasattr(self, start_time_attr):
                start_time = getattr(self, start_time_attr)
                response_time = time.time() - start_time
                
                # 更新性能指标
                self.performance_metrics.update_response_time(response_time)
                
                if success:
                    self.performance_metrics.success_count += 1
                else:
                    self.performance_metrics.failure_count += 1
                    if error_type:
                        self.error_stats[error_type] += 1
                
                # 更新活跃检索数
                self.context_stats["active_retrievals"] = max(0, self.context_stats["active_retrievals"] - 1)
                
                # 清理开始时间记录
                delattr(self, start_time_attr)
                
                print(f"📊 记录检索结束: {request_id}, 成功: {success}, 耗时: {response_time:.2f}s")
    
    def record_session_created(self, user_id: int, session_id: str):
        """记录会话创建"""
        with self.lock:
            self.context_stats["total_sessions_created"] += 1
            self.context_stats["active_sessions"] += 1
            print(f"📊 记录会话创建: 用户 {user_id}, 会话 {session_id}")
    
    def record_session_expired(self, user_id: int, session_id: str):
        """记录会话过期"""
        with self.lock:
            self.context_stats["sessions_expired"] += 1
            self.context_stats["active_sessions"] = max(0, self.context_stats["active_sessions"] - 1)
            print(f"📊 记录会话过期: 用户 {user_id}, 会话 {session_id}")
    
    def record_error(self, error_type: str, error_message: str, context: Dict[str, Any] = None):
        """
        记录错误
        
        Args:
            error_type: 错误类型
            error_message: 错误消息
            context: 错误上下文
        """
        with self.lock:
            self.error_stats[error_type] += 1
            
            error_record = {
                "timestamp": datetime.now().isoformat(),
                "error_type": error_type,
                "error_message": error_message,
                "context": context or {}
            }
            
            print(f"❌ 记录错误: {error_type} - {error_message}")
    
    def get_performance_summary(self) -> Dict[str, Any]:
        """获取性能摘要"""
        with self.lock:
            uptime = datetime.now() - self.start_time
            
            success_rate = 0.0
            if self.performance_metrics.retrieval_count > 0:
                success_rate = (self.performance_metrics.success_count / self.performance_metrics.retrieval_count) * 100
            
            return {
                "uptime": str(uptime),
                "uptime_seconds": uptime.total_seconds(),
                "retrieval_stats": {
                    "total_retrievals": self.performance_metrics.retrieval_count,
                    "successful_retrievals": self.performance_metrics.success_count,
                    "failed_retrievals": self.performance_metrics.failure_count,
                    "success_rate": f"{success_rate:.2f}%",
                    "active_retrievals": self.context_stats["active_retrievals"]
                },
                "response_time_stats": {
                    "average_response_time": f"{self.performance_metrics.avg_response_time:.2f}s",
                    "recent_average_response_time": f"{self.performance_metrics.get_recent_avg_response_time():.2f}s",
                    "max_response_time": f"{self.performance_metrics.max_response_time:.2f}s",
                    "min_response_time": f"{self.performance_metrics.min_response_time:.2f}s" if self.performance_metrics.min_response_time != float('inf') else "N/A"
                },
                "context_stats": self.context_stats.copy(),
                "retrieval_type_distribution": dict(self.retrieval_type_stats),
                "top_active_users": self._get_top_active_users(),
                "error_summary": dict(self.error_stats)
            }
    
    def get_real_time_status(self) -> Dict[str, Any]:
        """获取实时状态"""
        try:
            from utils.context_manager import get_context_manager
            context_manager = get_context_manager()
            session_info = context_manager.get_session_info()
            
            with self.lock:
                return {
                    "timestamp": datetime.now().isoformat(),
                    "system_status": "running",
                    "active_sessions": session_info["total_sessions"],
                    "active_retrievals": session_info["active_retrievals"],
                    "recent_avg_response_time": f"{self.performance_metrics.get_recent_avg_response_time():.2f}s",
                    "recent_success_rate": self._calculate_recent_success_rate(),
                    "memory_usage": self._get_memory_usage_estimate(),
                    "session_details": session_info["sessions"][:5]  # 只显示前5个会话
                }
        except Exception as e:
            return {
                "timestamp": datetime.now().isoformat(),
                "system_status": "error",
                "error": str(e)
            }
    
    def _get_top_active_users(self, limit: int = 5) -> List[Dict[str, Any]]:
        """获取最活跃的用户"""
        sorted_users = sorted(self.user_activity_stats.items(), key=lambda x: x[1], reverse=True)
        return [{"user_id": user_id, "activity_count": count} for user_id, count in sorted_users[:limit]]
    
    def _calculate_recent_success_rate(self) -> str:
        """计算最近的成功率"""
        recent_total = min(50, self.performance_metrics.retrieval_count)
        if recent_total == 0:
            return "N/A"
        
        # 这里简化处理，实际应该基于时间窗口
        recent_success = min(self.performance_metrics.success_count, recent_total)
        return f"{(recent_success / recent_total) * 100:.1f}%"
    
    def _get_memory_usage_estimate(self) -> str:
        """估算内存使用情况"""
        # 简单的内存使用估算
        session_count = self.context_stats["active_sessions"]
        history_size = len(self.monitoring_history)
        
        estimated_mb = (session_count * 0.1) + (history_size * 0.001)  # 粗略估算
        return f"{estimated_mb:.2f} MB"
    
    def _monitoring_loop(self):
        """监控循环（后台线程）"""
        while True:
            try:
                # 收集当前状态快照
                snapshot = {
                    "timestamp": datetime.now().isoformat(),
                    "active_sessions": self.context_stats["active_sessions"],
                    "active_retrievals": self.context_stats["active_retrievals"],
                    "total_retrievals": self.performance_metrics.retrieval_count,
                    "success_rate": (self.performance_metrics.success_count / max(1, self.performance_metrics.retrieval_count)) * 100,
                    "avg_response_time": self.performance_metrics.get_recent_avg_response_time()
                }
                
                with self.lock:
                    self.monitoring_history.append(snapshot)
                
                # 检查是否需要告警
                self._check_alerts(snapshot)
                
            except Exception as e:
                print(f"❌ 监控循环出错: {e}")
            
            time.sleep(self.monitoring_interval)
    
    def _check_alerts(self, snapshot: Dict[str, Any]):
        """检查告警条件"""
        # 响应时间告警
        if snapshot["avg_response_time"] > 10.0:  # 超过10秒
            print(f"⚠️ 告警: 平均响应时间过长 ({snapshot['avg_response_time']:.2f}s)")
        
        # 成功率告警
        if snapshot["success_rate"] < 80.0 and self.performance_metrics.retrieval_count > 10:
            print(f"⚠️ 告警: 成功率过低 ({snapshot['success_rate']:.1f}%)")
        
        # 活跃会话数告警
        if snapshot["active_sessions"] > 100:
            print(f"⚠️ 告警: 活跃会话数过多 ({snapshot['active_sessions']})")
    
    def export_monitoring_data(self, filepath: str):
        """导出监控数据"""
        try:
            export_data = {
                "export_time": datetime.now().isoformat(),
                "performance_summary": self.get_performance_summary(),
                "monitoring_history": list(self.monitoring_history),
                "error_details": dict(self.error_stats),
                "retrieval_type_stats": dict(self.retrieval_type_stats),
                "user_activity_stats": dict(self.user_activity_stats)
            }
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(export_data, f, ensure_ascii=False, indent=2)
            
            print(f"✅ 监控数据已导出到: {filepath}")
            
        except Exception as e:
            print(f"❌ 导出监控数据失败: {e}")
    
    def get_monitoring_dashboard_data(self) -> Dict[str, Any]:
        """获取监控仪表板数据"""
        return {
            "performance_summary": self.get_performance_summary(),
            "real_time_status": self.get_real_time_status(),
            "recent_history": list(self.monitoring_history)[-60:],  # 最近60个数据点
            "system_health": self._assess_system_health()
        }
    
    def get_system_health(self) -> Dict[str, Any]:
        """获取系统健康状况"""
        current_time = time.time()
        
        # 计算健康分数
        health_score = 100
        issues = []
        recommendations = []
        
        # 检查成功率
        if self.performance_metrics.retrieval_count > 0:
            success_rate = self.performance_metrics.success_count / self.performance_metrics.retrieval_count
            if success_rate < 0.5:
                health_score -= 30
                issues.append("检索成功率过低")
                recommendations.append("检查数据源连接和查询逻辑")
            elif success_rate < 0.8:
                health_score -= 15
                issues.append("检索成功率偏低")
        
        # 检查响应时间
        if self.performance_metrics.recent_response_times:
            avg_response_time = statistics.mean(self.performance_metrics.recent_response_times)
            if avg_response_time > 10.0:
                health_score -= 20
                issues.append("平均响应时间过长")
                recommendations.append("优化查询性能或增加缓存")
            elif avg_response_time > 5.0:
                health_score -= 10
                issues.append("响应时间偏长")
        
        # 检查错误率
        total_errors = sum(self.error_stats.values())
        if total_errors > 10:
            health_score -= 25
            issues.append("错误次数过多")
            recommendations.append("检查系统日志，修复常见错误")
        elif total_errors > 5:
            health_score -= 10
            issues.append("存在一些错误")
        
        # 检查活跃会话数
        active_sessions = self.context_stats["active_sessions"]
        if active_sessions > 100:
            health_score -= 15
            issues.append("活跃会话数过多")
            recommendations.append("考虑增加服务器资源或优化会话管理")
        
        # 确定健康状态
        if health_score >= 90:
            status = "excellent"
        elif health_score >= 75:
            status = "good"
        elif health_score >= 60:
            status = "fair"
        else:
            status = "poor"
        
        return {
            "health_score": max(0, health_score),
            "status": status,
            "issues": issues,
            "recommendations": recommendations,
            "last_check": datetime.now().isoformat()
        }
    
    def _assess_system_health(self) -> Dict[str, Any]:
        """评估系统健康状况"""
        health_score = 100
        issues = []
        
        # 检查成功率
        if self.performance_metrics.retrieval_count > 0:
            success_rate = (self.performance_metrics.success_count / self.performance_metrics.retrieval_count) * 100
            if success_rate < 90:
                health_score -= 20
                issues.append(f"成功率偏低: {success_rate:.1f}%")
        
        # 检查响应时间
        recent_avg = self.performance_metrics.get_recent_avg_response_time()
        if recent_avg > 5.0:
            health_score -= 15
            issues.append(f"响应时间偏长: {recent_avg:.2f}s")
        
        # 检查错误数量
        total_errors = sum(self.error_stats.values())
        if total_errors > self.performance_metrics.retrieval_count * 0.1:
            health_score -= 10
            issues.append(f"错误数量较多: {total_errors}")
        
        # 确定健康状态
        if health_score >= 90:
            status = "excellent"
        elif health_score >= 70:
            status = "good"
        elif health_score >= 50:
            status = "fair"
        else:
            status = "poor"
        
        return {
            "health_score": max(0, health_score),
            "status": status,
            "issues": issues,
            "recommendations": self._get_health_recommendations(issues)
        }
    
    def _get_health_recommendations(self, issues: List[str]) -> List[str]:
        """获取健康改进建议"""
        recommendations = []
        
        for issue in issues:
            if "成功率" in issue:
                recommendations.append("检查数据库连接和API配置")
            elif "响应时间" in issue:
                recommendations.append("优化数据库查询和缓存策略")
            elif "错误数量" in issue:
                recommendations.append("检查错误日志并修复常见问题")
        
        if not recommendations:
            recommendations.append("系统运行良好，继续保持")
        
        return recommendations

# 全局监控器实例
_system_monitor = None

def get_system_monitor() -> SystemMonitor:
    """获取全局系统监控器实例"""
    global _system_monitor
    if _system_monitor is None:
        _system_monitor = SystemMonitor()
    return _system_monitor