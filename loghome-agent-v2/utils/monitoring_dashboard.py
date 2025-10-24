"""
监控仪表板
提供Web界面来查看系统状态和性能指标
"""

import json
import time
from datetime import datetime
from typing import Dict, Any
from http.server import HTTPServer, BaseHTTPRequestHandler
import threading
import urllib.parse

class MonitoringDashboardHandler(BaseHTTPRequestHandler):
    """监控仪表板HTTP处理器"""
    
    def do_GET(self):
        """处理GET请求"""
        try:
            if self.path == '/':
                self._serve_dashboard_html()
            elif self.path == '/api/status':
                self._serve_status_api()
            elif self.path == '/api/performance':
                self._serve_performance_api()
            elif self.path == '/api/sessions':
                self._serve_sessions_api()
            elif self.path == '/api/health':
                self._serve_health_api()
            elif self.path.startswith('/static/'):
                self._serve_static_file()
            else:
                self._send_404()
        except Exception as e:
            self._send_error(500, str(e))
    
    def _serve_dashboard_html(self):
        """提供仪表板HTML页面"""
        html_content = self._generate_dashboard_html()
        
        self.send_response(200)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(html_content.encode('utf-8'))
    
    def _serve_status_api(self):
        """提供状态API"""
        try:
            from utils.system_monitor import get_system_monitor
            monitor = get_system_monitor()
            
            status_data = monitor.get_real_time_status()
            
            self._send_json_response(status_data)
        except Exception as e:
            self._send_error(500, f"获取状态失败: {e}")
    
    def _serve_performance_api(self):
        """提供性能API"""
        try:
            from utils.system_monitor import get_system_monitor
            monitor = get_system_monitor()
            
            performance_data = monitor.get_performance_summary()
            
            self._send_json_response(performance_data)
        except Exception as e:
            self._send_error(500, f"获取性能数据失败: {e}")
    
    def _serve_sessions_api(self):
        """提供会话API"""
        try:
            from utils.context_manager import get_context_manager
            context_manager = get_context_manager()
            
            session_data = context_manager.get_session_info()
            
            self._send_json_response(session_data)
        except Exception as e:
            self._send_error(500, f"获取会话数据失败: {e}")
    
    def _serve_health_api(self):
        """提供健康状态API"""
        try:
            from utils.system_monitor import get_system_monitor
            monitor = get_system_monitor()
            
            dashboard_data = monitor.get_monitoring_dashboard_data()
            
            self._send_json_response(dashboard_data)
        except Exception as e:
            self._send_error(500, f"获取健康数据失败: {e}")
    
    def _send_json_response(self, data: Dict[str, Any]):
        """发送JSON响应"""
        json_data = json.dumps(data, ensure_ascii=False, indent=2)
        
        self.send_response(200)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json_data.encode('utf-8'))
    
    def _send_404(self):
        """发送404响应"""
        self.send_response(404)
        self.send_header('Content-type', 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(b'<h1>404 Not Found</h1>')
    
    def _send_error(self, code: int, message: str):
        """发送错误响应"""
        self.send_response(code)
        self.send_header('Content-type', 'application/json; charset=utf-8')
        self.end_headers()
        
        error_data = {"error": message, "timestamp": datetime.now().isoformat()}
        self.wfile.write(json.dumps(error_data, ensure_ascii=False).encode('utf-8'))
    
    def _generate_dashboard_html(self) -> str:
        """生成仪表板HTML"""
        return '''
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>信息检索系统监控仪表板</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f5f5;
            color: #333;
        }
        
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        
        .header p {
            font-size: 1.1em;
            opacity: 0.9;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .card {
            background: white;
            border-radius: 10px;
            padding: 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            transition: transform 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.3em;
            border-bottom: 2px solid #f0f0f0;
            padding-bottom: 10px;
        }
        
        .metric {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 10px 0;
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }
        
        .metric:last-child {
            border-bottom: none;
        }
        
        .metric-label {
            font-weight: 500;
            color: #666;
        }
        
        .metric-value {
            font-weight: bold;
            color: #333;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        
        .status-running {
            background-color: #4CAF50;
        }
        
        .status-warning {
            background-color: #FF9800;
        }
        
        .status-error {
            background-color: #F44336;
        }
        
        .health-score {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        
        .health-excellent { color: #4CAF50; }
        .health-good { color: #8BC34A; }
        .health-fair { color: #FF9800; }
        .health-poor { color: #F44336; }
        
        .refresh-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1em;
            margin: 10px 5px;
            transition: all 0.3s ease;
        }
        
        .refresh-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .auto-refresh {
            text-align: center;
            margin: 20px 0;
        }
        
        .loading {
            text-align: center;
            color: #666;
            font-style: italic;
        }
        
        .error {
            color: #F44336;
            text-align: center;
            padding: 20px;
            background-color: #ffebee;
            border-radius: 5px;
            margin: 10px 0;
        }
        
        .sessions-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }
        
        .sessions-table th,
        .sessions-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        
        .sessions-table th {
            background-color: #f8f9fa;
            font-weight: 600;
            color: #495057;
        }
        
        .sessions-table tr:hover {
            background-color: #f8f9fa;
        }
        
        @media (max-width: 768px) {
            .dashboard-grid {
                grid-template-columns: 1fr;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .container {
                padding: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔍 信息检索系统监控仪表板</h1>
        <p>实时监控系统性能、上下文状态和用户活动</p>
    </div>
    
    <div class="container">
        <div class="auto-refresh">
            <button class="refresh-btn" onclick="refreshAll()">🔄 立即刷新</button>
            <button class="refresh-btn" onclick="toggleAutoRefresh()" id="autoRefreshBtn">⏰ 开启自动刷新</button>
            <span id="lastUpdate">最后更新: --</span>
        </div>
        
        <div class="dashboard-grid">
            <!-- 系统状态卡片 -->
            <div class="card">
                <h3>🚀 系统状态</h3>
                <div id="systemStatus" class="loading">加载中...</div>
            </div>
            
            <!-- 性能指标卡片 -->
            <div class="card">
                <h3>📊 性能指标</h3>
                <div id="performanceMetrics" class="loading">加载中...</div>
            </div>
            
            <!-- 健康状况卡片 -->
            <div class="card">
                <h3>💚 系统健康</h3>
                <div id="systemHealth" class="loading">加载中...</div>
            </div>
        </div>
        
        <!-- 活跃会话卡片 -->
        <div class="card">
            <h3>👥 活跃会话</h3>
            <div id="activeSessions" class="loading">加载中...</div>
        </div>
    </div>
    
    <script>
        let autoRefreshInterval = null;
        let isAutoRefreshing = false;
        
        // 刷新所有数据
        async function refreshAll() {
            updateLastUpdateTime();
            await Promise.all([
                loadSystemStatus(),
                loadPerformanceMetrics(),
                loadSystemHealth(),
                loadActiveSessions()
            ]);
        }
        
        // 加载系统状态
        async function loadSystemStatus() {
            try {
                const response = await fetch('/api/status');
                const data = await response.json();
                
                const statusHtml = `
                    <div class="metric">
                        <span class="metric-label">
                            <span class="status-indicator status-${data.system_status === 'running' ? 'running' : 'error'}"></span>
                            系统状态
                        </span>
                        <span class="metric-value">${data.system_status === 'running' ? '运行中' : '异常'}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">活跃会话</span>
                        <span class="metric-value">${data.active_sessions || 0}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">进行中的检索</span>
                        <span class="metric-value">${data.active_retrievals || 0}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">最近平均响应时间</span>
                        <span class="metric-value">${data.recent_avg_response_time || 'N/A'}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">最近成功率</span>
                        <span class="metric-value">${data.recent_success_rate || 'N/A'}</span>
                    </div>
                `;
                
                document.getElementById('systemStatus').innerHTML = statusHtml;
            } catch (error) {
                document.getElementById('systemStatus').innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
            }
        }
        
        // 加载性能指标
        async function loadPerformanceMetrics() {
            try {
                const response = await fetch('/api/performance');
                const data = await response.json();
                
                const metricsHtml = `
                    <div class="metric">
                        <span class="metric-label">总检索次数</span>
                        <span class="metric-value">${data.retrieval_stats?.total_retrievals || 0}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">成功次数</span>
                        <span class="metric-value">${data.retrieval_stats?.successful_retrievals || 0}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">成功率</span>
                        <span class="metric-value">${data.retrieval_stats?.success_rate || 'N/A'}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">平均响应时间</span>
                        <span class="metric-value">${data.response_time_stats?.average_response_time || 'N/A'}</span>
                    </div>
                    <div class="metric">
                        <span class="metric-label">系统运行时间</span>
                        <span class="metric-value">${data.uptime || 'N/A'}</span>
                    </div>
                `;
                
                document.getElementById('performanceMetrics').innerHTML = metricsHtml;
            } catch (error) {
                document.getElementById('performanceMetrics').innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
            }
        }
        
        // 加载系统健康状况
        async function loadSystemHealth() {
            try {
                const response = await fetch('/api/health');
                const data = await response.json();
                
                const health = data.system_health;
                const healthClass = `health-${health.status}`;
                
                let issuesHtml = '';
                if (health.issues && health.issues.length > 0) {
                    issuesHtml = '<div style="margin-top: 15px;"><strong>问题:</strong><ul>';
                    health.issues.forEach(issue => {
                        issuesHtml += `<li style="margin: 5px 0;">${issue}</li>`;
                    });
                    issuesHtml += '</ul></div>';
                }
                
                let recommendationsHtml = '';
                if (health.recommendations && health.recommendations.length > 0) {
                    recommendationsHtml = '<div style="margin-top: 15px;"><strong>建议:</strong><ul>';
                    health.recommendations.forEach(rec => {
                        recommendationsHtml += `<li style="margin: 5px 0;">${rec}</li>`;
                    });
                    recommendationsHtml += '</ul></div>';
                }
                
                const healthHtml = `
                    <div class="health-score ${healthClass}">${health.health_score}/100</div>
                    <div class="metric">
                        <span class="metric-label">健康状态</span>
                        <span class="metric-value ${healthClass}">${getHealthStatusText(health.status)}</span>
                    </div>
                    ${issuesHtml}
                    ${recommendationsHtml}
                `;
                
                document.getElementById('systemHealth').innerHTML = healthHtml;
            } catch (error) {
                document.getElementById('systemHealth').innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
            }
        }
        
        // 加载活跃会话
        async function loadActiveSessions() {
            try {
                const response = await fetch('/api/sessions');
                const data = await response.json();
                
                if (!data.sessions || data.sessions.length === 0) {
                    document.getElementById('activeSessions').innerHTML = '<div class="loading">暂无活跃会话</div>';
                    return;
                }
                
                let tableHtml = `
                    <div class="metric">
                        <span class="metric-label">总会话数</span>
                        <span class="metric-value">${data.total_sessions}</span>
                    </div>
                    <table class="sessions-table">
                        <thead>
                            <tr>
                                <th>用户ID</th>
                                <th>用户名</th>
                                <th>消息数</th>
                                <th>待处理请求</th>
                                <th>空闲时间</th>
                                <th>状态</th>
                            </tr>
                        </thead>
                        <tbody>
                `;
                
                data.sessions.slice(0, 10).forEach(session => {
                    const status = session.has_active_retrieval ? '检索中' : '空闲';
                    const statusClass = session.has_active_retrieval ? 'status-warning' : 'status-running';
                    
                    tableHtml += `
                        <tr>
                            <td>${session.user_id}</td>
                            <td>${session.user_name}</td>
                            <td>${session.message_count}</td>
                            <td>${session.pending_requests}</td>
                            <td>${formatDuration(session.idle_duration)}</td>
                            <td><span class="status-indicator ${statusClass}"></span>${status}</td>
                        </tr>
                    `;
                });
                
                tableHtml += '</tbody></table>';
                
                document.getElementById('activeSessions').innerHTML = tableHtml;
            } catch (error) {
                document.getElementById('activeSessions').innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
            }
        }
        
        // 切换自动刷新
        function toggleAutoRefresh() {
            const btn = document.getElementById('autoRefreshBtn');
            
            if (isAutoRefreshing) {
                clearInterval(autoRefreshInterval);
                isAutoRefreshing = false;
                btn.textContent = '⏰ 开启自动刷新';
            } else {
                autoRefreshInterval = setInterval(refreshAll, 30000); // 30秒刷新一次
                isAutoRefreshing = true;
                btn.textContent = '⏸️ 停止自动刷新';
            }
        }
        
        // 更新最后更新时间
        function updateLastUpdateTime() {
            const now = new Date();
            document.getElementById('lastUpdate').textContent = `最后更新: ${now.toLocaleTimeString()}`;
        }
        
        // 获取健康状态文本
        function getHealthStatusText(status) {
            const statusMap = {
                'excellent': '优秀',
                'good': '良好',
                'fair': '一般',
                'poor': '较差'
            };
            return statusMap[status] || status;
        }
        
        // 格式化持续时间
        function formatDuration(duration) {
            // 简单的持续时间格式化
            if (duration.includes('day')) {
                return duration.split(',')[0];
            }
            return duration.split('.')[0];
        }
        
        // 页面加载时初始化
        document.addEventListener('DOMContentLoaded', function() {
            refreshAll();
        });
    </script>
</body>
</html>
        '''
    
    def log_message(self, format, *args):
        """重写日志方法，减少输出"""
        pass

class MonitoringDashboard:
    """监控仪表板服务器"""
    
    def __init__(self, host: str = 'localhost', port: int = 8888):
        """
        初始化监控仪表板
        
        Args:
            host: 服务器主机
            port: 服务器端口
        """
        self.host = host
        self.port = port
        self.server = None
        self.server_thread = None
        
    def start(self):
        """启动仪表板服务器"""
        try:
            self.server = HTTPServer((self.host, self.port), MonitoringDashboardHandler)
            self.server_thread = threading.Thread(target=self.server.serve_forever, daemon=True)
            self.server_thread.start()
            
            print(f"✅ 监控仪表板已启动: http://{self.host}:{self.port}")
            print(f"   📊 实时状态: http://{self.host}:{self.port}/api/status")
            print(f"   📈 性能指标: http://{self.host}:{self.port}/api/performance")
            print(f"   👥 会话信息: http://{self.host}:{self.port}/api/sessions")
            print(f"   💚 健康状况: http://{self.host}:{self.port}/api/health")
            
        except Exception as e:
            print(f"❌ 启动监控仪表板失败: {e}")
    
    def stop(self):
        """停止仪表板服务器"""
        if self.server:
            self.server.shutdown()
            self.server.server_close()
            print("🛑 监控仪表板已停止")
    
    def get_dashboard_url(self) -> str:
        """获取仪表板URL"""
        return f"http://{self.host}:{self.port}"

# 全局仪表板实例
_dashboard = None

def get_monitoring_dashboard(host: str = 'localhost', port: int = 8888) -> MonitoringDashboard:
    """获取全局监控仪表板实例"""
    global _dashboard
    if _dashboard is None:
        _dashboard = MonitoringDashboard(host, port)
    return _dashboard

def start_monitoring_dashboard(host: str = 'localhost', port: int = 8888) -> str:
    """启动监控仪表板并返回URL"""
    dashboard = get_monitoring_dashboard(host, port)
    dashboard.start()
    return dashboard.get_dashboard_url()