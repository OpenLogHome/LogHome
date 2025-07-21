import pymysql
import json
from typing import Dict, Optional, List
from datetime import datetime

class LogManager:
    """页面操作日志管理器"""
    
    def __init__(self, db_config: dict):
        """
        初始化日志管理器
        
        Args:
            db_config: 数据库配置
        """
        self.db_config = db_config
        self.connection = None
    
    def _get_connection(self):
        """获取数据库连接"""
        if self.connection is None or not self.connection.open:
            self.connection = pymysql.connect(
                host=self.db_config['host'],
                port=self.db_config['port'],
                user=self.db_config['user'],
                password=self.db_config['password'],
                database=self.db_config['database'],
                charset='utf8mb4',
                autocommit=True
            )
        return self.connection
    
    def log_page_operation(self, page_name: str, operation: Optional[str] = None, 
                          params: Optional[dict] = None, reason: Optional[str] = None,
                          page_content: Optional[str] = None, ai_response: Optional[str] = None,
                          energy_before: Optional[int] = None, energy_after: Optional[int] = None,
                          memory_created: bool = False, memory_content: Optional[str] = None,
                          status: str = 'success', error_message: Optional[str] = None) -> bool:
        """
        记录页面操作日志
        
        Args:
            page_name: 页面名称
            operation: 执行的操作
            params: 操作参数
            reason: 操作原因
            page_content: 页面内容
            ai_response: AI响应内容
            energy_before: 操作前能量
            energy_after: 操作后能量
            memory_created: 是否创建了记忆
            memory_content: 记忆内容
            status: 操作状态
            error_message: 错误信息
            
        Returns:
            bool: 是否记录成功
        """
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = """
                INSERT INTO page_operation_logs 
                (page_name, operation, params, reason, page_content, ai_response, 
                 energy_before, energy_after, memory_created, memory_content, 
                 status, error_message)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                
                params_json = json.dumps(params, ensure_ascii=False) if params else None
                
                cursor.execute(sql, (
                    page_name, operation, params_json, reason, page_content, ai_response,
                    energy_before, energy_after, memory_created, memory_content,
                    status, error_message
                ))
                return True
        except Exception as e:
            print(f"记录页面操作日志失败: {str(e)}")
            return False
    
    def get_recent_logs(self, limit: int = 10) -> List[Dict]:
        """
        获取最近的日志记录
        
        Args:
            limit: 返回记录数量限制
            
        Returns:
            List[Dict]: 日志记录列表
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT * FROM page_operation_logs 
                ORDER BY created_at DESC
                LIMIT %s
                """
                cursor.execute(sql, (limit,))
                logs = cursor.fetchall()
                return logs
        except Exception as e:
            print(f"获取日志记录失败: {str(e)}")
            return []
    
    def get_logs_by_page(self, page_name: str, limit: int = 10) -> List[Dict]:
        """
        获取指定页面的日志记录
        
        Args:
            page_name: 页面名称
            limit: 返回记录数量限制
            
        Returns:
            List[Dict]: 日志记录列表
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT * FROM page_operation_logs 
                WHERE page_name = %s
                ORDER BY created_at DESC
                LIMIT %s
                """
                cursor.execute(sql, (page_name, limit))
                logs = cursor.fetchall()
                return logs
        except Exception as e:
            print(f"获取页面日志记录失败: {str(e)}")
            return []
    
    def get_logs_by_operation(self, operation: str, limit: int = 10) -> List[Dict]:
        """
        获取指定操作的日志记录
        
        Args:
            operation: 操作名称
            limit: 返回记录数量限制
            
        Returns:
            List[Dict]: 日志记录列表
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT * FROM page_operation_logs 
                WHERE operation = %s
                ORDER BY created_at DESC
                LIMIT %s
                """
                cursor.execute(sql, (operation, limit))
                logs = cursor.fetchall()
                return logs
        except Exception as e:
            print(f"获取操作日志记录失败: {str(e)}")
            return []
    
    def get_error_logs(self, limit: int = 10) -> List[Dict]:
        """
        获取错误日志记录
        
        Args:
            limit: 返回记录数量限制
            
        Returns:
            List[Dict]: 错误日志记录列表
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT * FROM page_operation_logs 
                WHERE status = 'error'
                ORDER BY created_at DESC
                LIMIT %s
                """
                cursor.execute(sql, (limit,))
                logs = cursor.fetchall()
                return logs
        except Exception as e:
            print(f"获取错误日志记录失败: {str(e)}")
            return []
    
    def get_statistics(self) -> Dict:
        """
        获取日志统计信息
        
        Returns:
            Dict: 统计信息
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                # 总操作数
                cursor.execute("SELECT COUNT(*) as total_operations FROM page_operation_logs")
                total_operations = cursor.fetchone()['total_operations']
                
                # 错误操作数
                cursor.execute("SELECT COUNT(*) as error_operations FROM page_operation_logs WHERE status = 'error'")
                error_operations = cursor.fetchone()['error_operations']
                
                # 记忆创建数
                cursor.execute("SELECT COUNT(*) as memory_creations FROM page_operation_logs WHERE memory_created = 1")
                memory_creations = cursor.fetchone()['memory_creations']
                
                # 最常用的页面
                cursor.execute("""
                    SELECT page_name, COUNT(*) as count 
                    FROM page_operation_logs 
                    GROUP BY page_name 
                    ORDER BY count DESC 
                    LIMIT 5
                """)
                top_pages = cursor.fetchall()
                
                # 最常用的操作
                cursor.execute("""
                    SELECT operation, COUNT(*) as count 
                    FROM page_operation_logs 
                    WHERE operation IS NOT NULL
                    GROUP BY operation 
                    ORDER BY count DESC 
                    LIMIT 5
                """)
                top_operations = cursor.fetchall()
                
                return {
                    'total_operations': total_operations,
                    'error_operations': error_operations,
                    'memory_creations': memory_creations,
                    'success_rate': round((total_operations - error_operations) / total_operations * 100, 2) if total_operations > 0 else 0,
                    'top_pages': top_pages,
                    'top_operations': top_operations
                }
        except Exception as e:
            print(f"获取日志统计失败: {str(e)}")
            return {}
    
    def cleanup_old_logs(self, days: int = 30) -> bool:
        """
        清理旧日志记录
        
        Args:
            days: 保留天数
            
        Returns:
            bool: 是否清理成功
        """
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = """
                DELETE FROM page_operation_logs 
                WHERE created_at < DATE_SUB(NOW(), INTERVAL %s DAY)
                """
                cursor.execute(sql, (days,))
                deleted_count = cursor.rowcount
                print(f"清理了 {deleted_count} 条旧日志记录")
                return True
        except Exception as e:
            print(f"清理旧日志失败: {str(e)}")
            return False 