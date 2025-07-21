import pymysql
import json
from typing import List, Dict, Optional
from datetime import datetime
from .time_formatter import TimeFormatter

class MemoryManager:
    def __init__(self, db_config: dict):
        """
        初始化记忆管理器
        
        Args:
            db_config: 数据库配置字典，包含host, port, user, password, database
        """
        self.db_config = db_config
        self.connection = None
    
    def _get_connection(self):
        """获取数据库连接"""
        if self.connection is None or not self.connection.open:
            self.connection = pymysql.connect(
                host=self.db_config['host'],
                port=self.db_config.get('port', 3306),
                user=self.db_config['user'],
                password=self.db_config['password'],
                database=self.db_config['database'],
                charset='utf8mb4',
                autocommit=True
            )
        return self.connection
    
    def create_memory(self, object_type: str, object_id: str, content: str) -> bool:
        """
        创建记忆
        
        Args:
            object_type: 对象类型 (novel/article/user)
            object_id: 对象ID
            content: 记忆内容
            
        Returns:
            bool: 是否创建成功
        """
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = """
                INSERT INTO memories (object_type, object_id, content)
                VALUES (%s, %s, %s)
                """
                cursor.execute(sql, (object_type, object_id, content))
                return True
        except Exception as e:
            print(f"创建记忆失败: {str(e)}")
            return False
    
    def get_memories(self, object_type: str, object_id: str, limit: int = 5) -> List[Dict]:
        """
        获取指定对象的记忆
        
        Args:
            object_type: 对象类型
            object_id: 对象ID
            limit: 返回记忆数量限制
            
        Returns:
            List[Dict]: 记忆列表
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT content, created_at, updated_at
                FROM memories 
                WHERE object_type = %s AND object_id = %s
                ORDER BY updated_at DESC
                LIMIT %s
                """
                cursor.execute(sql, (object_type, object_id, limit))
                memories = cursor.fetchall()
                return memories
        except Exception as e:
            print(f"获取记忆失败: {str(e)}")
            return []
    
    def get_memories_text(self, object_type: str, object_id: str, limit: int = 5) -> str:
        """
        获取记忆的文本格式
        
        Args:
            object_type: 对象类型
            object_id: 对象ID
            limit: 返回记忆数量限制
            
        Returns:
            str: 格式化的记忆文本
        """
        memories = self.get_memories(object_type, object_id, limit)
        if not memories:
            return ""
        
        memory_texts = []
        for i, memory in enumerate(memories, 1):
            content = memory['content']
            created_at = memory['created_at']
            
            # 如果是datetime对象，转换为ISO格式字符串
            if isinstance(created_at, datetime):
                created_at = created_at.isoformat()
            
            # 格式化时间
            if isinstance(created_at, str) and 'T' in created_at:
                created_at = TimeFormatter.format_relative_time(created_at)
            elif isinstance(created_at, datetime):
                created_at = created_at.strftime('%Y-%m-%d %H:%M:%S')
            
            memory_texts.append(f"{i}. {content} (记录于: {created_at})")
        
        return "\n".join(memory_texts)
    
    def update_memory(self, object_type: str, object_id: str, content: str) -> bool:
        """
        更新记忆（如果不存在则创建）
        
        Args:
            object_type: 对象类型
            object_id: 对象ID
            content: 记忆内容
            
        Returns:
            bool: 是否更新成功
        """
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                # 先检查是否存在
                check_sql = "SELECT id FROM memories WHERE object_type = %s AND object_id = %s LIMIT 1"
                cursor.execute(check_sql, (object_type, object_id))
                existing = cursor.fetchone()
                
                if existing:
                    # 更新现有记忆
                    update_sql = "UPDATE memories SET content = %s WHERE object_type = %s AND object_id = %s"
                    cursor.execute(update_sql, (content, object_type, object_id))
                else:
                    # 创建新记忆
                    insert_sql = "INSERT INTO memories (object_type, object_id, content) VALUES (%s, %s, %s)"
                    cursor.execute(insert_sql, (object_type, object_id, content))
                
                return True
        except Exception as e:
            print(f"更新记忆失败: {str(e)}")
            return False
    
    def delete_memory(self, object_type: str, object_id: str) -> bool:
        """
        删除记忆
        
        Args:
            object_type: 对象类型
            object_id: 对象ID
            
        Returns:
            bool: 是否删除成功
        """
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = "DELETE FROM memories WHERE object_type = %s AND object_id = %s"
                cursor.execute(sql, (object_type, object_id))
                return True
        except Exception as e:
            print(f"删除记忆失败: {str(e)}")
            return False
    
    def close(self):
        """关闭数据库连接"""
        if self.connection and self.connection.open:
            self.connection.close() 