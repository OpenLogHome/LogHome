"""
上下文管理器
负责管理不同用户会话的上下文隔离和状态跟踪
"""

import threading
import time
from typing import Dict, Any, Optional, List
from dataclasses import dataclass, field
from datetime import datetime, timedelta
import uuid

@dataclass
class UserContext:
    """用户上下文数据结构"""
    user_id: int
    user_name: str
    session_id: str
    created_at: datetime
    last_active: datetime
    conversation_history: List[Dict[str, Any]] = field(default_factory=list)
    retrieval_state: Dict[str, Any] = field(default_factory=dict)
    pending_requests: List[str] = field(default_factory=list)
    
    def update_activity(self):
        """更新最后活跃时间"""
        self.last_active = datetime.now()
    
    def add_message(self, message: Dict[str, Any]):
        """添加消息到对话历史"""
        self.conversation_history.append({
            **message,
            "timestamp": datetime.now().isoformat()
        })
        self.update_activity()
    
    def set_retrieval_state(self, state: Dict[str, Any]):
        """设置检索状态"""
        self.retrieval_state = state
        self.update_activity()
    
    def add_pending_request(self, request_id: str):
        """添加待处理请求"""
        self.pending_requests.append(request_id)
        self.update_activity()
    
    def remove_pending_request(self, request_id: str):
        """移除待处理请求"""
        if request_id in self.pending_requests:
            self.pending_requests.remove(request_id)
        self.update_activity()

class ContextManager:
    """上下文管理器"""
    
    def __init__(self, session_timeout_minutes: int = 30, cleanup_interval_minutes: int = 5):
        """
        初始化上下文管理器
        
        Args:
            session_timeout_minutes: 会话超时时间（分钟）
            cleanup_interval_minutes: 清理间隔时间（分钟）
        """
        self.session_timeout = timedelta(minutes=session_timeout_minutes)
        self.cleanup_interval = timedelta(minutes=cleanup_interval_minutes)
        
        # 用户上下文存储 {user_id: UserContext}
        self.user_contexts: Dict[int, UserContext] = {}
        
        # 会话ID映射 {session_id: user_id}
        self.session_mapping: Dict[str, int] = {}
        
        # 线程锁，确保线程安全
        self.lock = threading.RLock()
        
        # 启动清理线程
        self.cleanup_thread = threading.Thread(target=self._cleanup_expired_sessions, daemon=True)
        self.cleanup_thread.start()
        
        print("✅ 上下文管理器初始化完成")
    
    def create_or_get_context(self, user_id: int, user_name: str) -> UserContext:
        """
        创建或获取用户上下文
        
        Args:
            user_id: 用户ID
            user_name: 用户名
            
        Returns:
            UserContext: 用户上下文对象
        """
        with self.lock:
            if user_id in self.user_contexts:
                # 更新现有上下文
                context = self.user_contexts[user_id]
                context.user_name = user_name  # 更新用户名（可能会变化）
                context.update_activity()
                return context
            else:
                # 创建新上下文
                session_id = str(uuid.uuid4())
                context = UserContext(
                    user_id=user_id,
                    user_name=user_name,
                    session_id=session_id,
                    created_at=datetime.now(),
                    last_active=datetime.now()
                )
                
                self.user_contexts[user_id] = context
                self.session_mapping[session_id] = user_id
                
                print(f"🆕 为用户 {user_name}(ID:{user_id}) 创建新上下文，会话ID: {session_id}")
                return context
    
    def get_context_by_user_id(self, user_id: int) -> Optional[UserContext]:
        """
        根据用户ID获取上下文
        
        Args:
            user_id: 用户ID
            
        Returns:
            Optional[UserContext]: 用户上下文对象，如果不存在则返回None
        """
        with self.lock:
            return self.user_contexts.get(user_id)
    
    def get_context_by_session_id(self, session_id: str) -> Optional[UserContext]:
        """
        根据会话ID获取上下文
        
        Args:
            session_id: 会话ID
            
        Returns:
            Optional[UserContext]: 用户上下文对象，如果不存在则返回None
        """
        with self.lock:
            user_id = self.session_mapping.get(session_id)
            if user_id:
                return self.user_contexts.get(user_id)
            return None
    
    def isolate_retrieval_context(self, user_id: int, retrieval_request: Dict[str, Any]) -> str:
        """
        为信息检索创建隔离的上下文
        
        Args:
            user_id: 用户ID
            retrieval_request: 检索请求信息
            
        Returns:
            str: 检索请求ID
        """
        with self.lock:
            context = self.get_context_by_user_id(user_id)
            if not context:
                raise ValueError(f"用户 {user_id} 的上下文不存在")
            
            # 生成检索请求ID
            request_id = f"retrieval_{user_id}_{int(time.time())}_{uuid.uuid4().hex[:8]}"
            
            # 设置检索状态
            retrieval_state = {
                "request_id": request_id,
                "request": retrieval_request,
                "status": "pending",
                "created_at": datetime.now().isoformat(),
                "isolated_context": {
                    "user_id": user_id,
                    "user_name": context.user_name,
                    "session_id": context.session_id,
                    "conversation_snapshot": context.conversation_history[-10:] if context.conversation_history else []
                }
            }
            
            context.set_retrieval_state(retrieval_state)
            context.add_pending_request(request_id)
            
            print(f"🔒 为用户 {context.user_name}(ID:{user_id}) 创建隔离检索上下文: {request_id}")
            return request_id
    
    def update_retrieval_status(self, user_id: int, request_id: str, status: str, result: Any = None):
        """
        更新检索状态
        
        Args:
            user_id: 用户ID
            request_id: 检索请求ID
            status: 新状态
            result: 检索结果（可选）
        """
        with self.lock:
            context = self.get_context_by_user_id(user_id)
            if not context:
                return
            
            if context.retrieval_state.get("request_id") == request_id:
                context.retrieval_state["status"] = status
                context.retrieval_state["updated_at"] = datetime.now().isoformat()
                
                if result is not None:
                    context.retrieval_state["result"] = result
                
                if status in ["completed", "failed"]:
                    context.remove_pending_request(request_id)
                
                print(f"📊 更新检索状态 {request_id}: {status}")
    
    def get_isolated_context_for_retrieval(self, user_id: int, request_id: str) -> Optional[Dict[str, Any]]:
        """
        获取用于检索的隔离上下文
        
        Args:
            user_id: 用户ID
            request_id: 检索请求ID
            
        Returns:
            Optional[Dict[str, Any]]: 隔离的上下文信息
        """
        with self.lock:
            context = self.get_context_by_user_id(user_id)
            if not context:
                return None
            
            retrieval_state = context.retrieval_state
            if retrieval_state.get("request_id") == request_id:
                return retrieval_state.get("isolated_context")
            
            return None
    
    def cleanup_user_context(self, user_id: int):
        """
        清理用户上下文
        
        Args:
            user_id: 用户ID
        """
        with self.lock:
            context = self.user_contexts.get(user_id)
            if context:
                # 移除会话映射
                if context.session_id in self.session_mapping:
                    del self.session_mapping[context.session_id]
                
                # 移除用户上下文
                del self.user_contexts[user_id]
                
                print(f"🧹 清理用户 {context.user_name}(ID:{user_id}) 的上下文")
    
    def _cleanup_expired_sessions(self):
        """清理过期会话（后台线程）"""
        while True:
            try:
                current_time = datetime.now()
                expired_users = []
                
                with self.lock:
                    for user_id, context in self.user_contexts.items():
                        if current_time - context.last_active > self.session_timeout:
                            expired_users.append(user_id)
                
                # 清理过期用户
                for user_id in expired_users:
                    self.cleanup_user_context(user_id)
                
                if expired_users:
                    print(f"🧹 清理了 {len(expired_users)} 个过期会话")
                
            except Exception as e:
                print(f"❌ 清理过期会话时出错: {e}")
            
            # 等待下次清理
            time.sleep(self.cleanup_interval.total_seconds())
    
    def get_active_sessions_count(self) -> int:
        """获取活跃会话数量"""
        with self.lock:
            return len(self.user_contexts)
    
    def get_session_info(self) -> Dict[str, Any]:
        """获取会话信息用于监控"""
        current_time = time.time()
        
        sessions = []
        for user_id, context in self.user_contexts.items():
            session_info = {
                "user_id": user_id,
                "user_name": context.user_name or f"用户{user_id}",
                "message_count": len(context.conversation_history),
                "pending_requests": len(context.pending_requests),
                "idle_duration": str(timedelta(seconds=int(current_time - context.last_activity))),
                "has_active_retrieval": context.retrieval_status == "in_progress",
                "last_activity": context.last_activity
            }
            sessions.append(session_info)
        
        # 按最后活动时间排序
        sessions.sort(key=lambda x: x["last_activity"], reverse=True)
        
        return {
            "total_sessions": len(sessions),
            "sessions": sessions
        }

# 全局上下文管理器实例
_context_manager = None

def get_context_manager() -> ContextManager:
    """获取全局上下文管理器实例"""
    global _context_manager
    if _context_manager is None:
        _context_manager = ContextManager()
    return _context_manager