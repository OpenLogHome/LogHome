import pymysql
import json
from typing import List, Dict, Optional
from datetime import datetime

class ReadingRecordManager:
    def __init__(self, db_config: dict):
        """
        初始化阅读记录管理器
        
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
    
    def create_reading_record(self, article_id: int, novel_id: int = None, 
                            read_duration: int = 0, read_progress: float = 0.0, 
                            is_finished: bool = False) -> bool:
        """
        创建阅读记录
        
        Args:
            article_id: 文章ID
            novel_id: 小说ID（可选）
            read_duration: 阅读时长（秒）
            read_progress: 阅读进度（0-100）
            is_finished: 是否读完
            
        Returns:
            bool: 是否创建成功
        """
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                sql = """
                INSERT INTO reading_records (article_id, novel_id, read_duration, read_progress, is_finished)
                VALUES (%s, %s, %s, %s, %s)
                """
                cursor.execute(sql, (article_id, novel_id, read_duration, read_progress, is_finished))
                return True
        except Exception as e:
            print(f"创建阅读记录失败: {str(e)}")
            return False
    
    def update_reading_record(self, article_id: int, read_duration: int = None,
                            read_progress: float = None, is_finished: bool = None) -> bool:
        """
        更新阅读记录
        
        Args:
            article_id: 文章ID
            read_duration: 阅读时长（秒）
            read_progress: 阅读进度（0-100）
            is_finished: 是否读完
            
        Returns:
            bool: 是否更新成功
        """
        try:
            conn = self._get_connection()
            with conn.cursor() as cursor:
                # 构建更新字段
                update_fields = []
                params = []
                
                if read_duration is not None:
                    update_fields.append("read_duration = %s")
                    params.append(read_duration)
                
                if read_progress is not None:
                    update_fields.append("read_progress = %s")
                    params.append(read_progress)
                
                if is_finished is not None:
                    update_fields.append("is_finished = %s")
                    params.append(1 if is_finished else 0)
                
                if not update_fields:
                    return False
                
                # 添加WHERE条件参数
                params.append(article_id)
                
                sql = f"""
                UPDATE reading_records 
                SET {', '.join(update_fields)}
                WHERE article_id = %s
                """
                cursor.execute(sql, params)
                return cursor.rowcount > 0
        except Exception as e:
            print(f"更新阅读记录失败: {str(e)}")
            return False
    
    def get_reading_record(self, article_id: int) -> Optional[Dict]:
        """
        获取指定文章的阅读记录
        
        Args:
            article_id: 文章ID
            
        Returns:
            Dict: 阅读记录，如果不存在返回None
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT * FROM reading_records 
                WHERE article_id = %s
                ORDER BY read_time DESC
                LIMIT 1
                """
                cursor.execute(sql, (article_id,))
                record = cursor.fetchone()
                return record
        except Exception as e:
            print(f"获取阅读记录失败: {str(e)}")
            return None
    
    def get_reading_history(self, limit: int = 10) -> List[Dict]:
        """
        获取阅读历史
        
        Args:
            limit: 返回记录数量限制
            
        Returns:
            List[Dict]: 阅读记录列表
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT * FROM reading_records 
                ORDER BY read_time DESC
                LIMIT %s
                """
                cursor.execute(sql, (limit,))
                records = cursor.fetchall()
                return records
        except Exception as e:
            print(f"获取阅读历史失败: {str(e)}")
            return []
    
    def get_novel_reading_records(self, novel_id: int) -> List[Dict]:
        """
        获取指定小说的阅读记录
        
        Args:
            novel_id: 小说ID
            
        Returns:
            List[Dict]: 阅读记录列表
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                sql = """
                SELECT * FROM reading_records 
                WHERE novel_id = %s
                ORDER BY read_time DESC
                """
                cursor.execute(sql, (novel_id,))
                records = cursor.fetchall()
                return records
        except Exception as e:
            print(f"获取小说阅读记录失败: {str(e)}")
            return []
    
    def mark_article_as_finished(self, article_id: int) -> bool:
        """
        标记文章为已读完
        
        Args:
            article_id: 文章ID
            
        Returns:
            bool: 是否标记成功
        """
        return self.update_reading_record(article_id, is_finished=True)
    
    def get_reading_statistics(self) -> Dict:
        """
        获取阅读统计信息
        
        Returns:
            Dict: 统计信息
        """
        try:
            conn = self._get_connection()
            with conn.cursor(pymysql.cursors.DictCursor) as cursor:
                # 总阅读文章数
                cursor.execute("SELECT COUNT(DISTINCT article_id) as total_articles FROM reading_records")
                total_articles = cursor.fetchone()['total_articles']
                
                # 已读完的文章数
                cursor.execute("SELECT COUNT(DISTINCT article_id) as finished_articles FROM reading_records WHERE is_finished = 1")
                finished_articles = cursor.fetchone()['finished_articles']
                
                # 总阅读时长
                cursor.execute("SELECT SUM(read_duration) as total_duration FROM reading_records")
                total_duration = cursor.fetchone()['total_duration'] or 0
                
                # 阅读的小说数
                cursor.execute("SELECT COUNT(DISTINCT novel_id) as total_novels FROM reading_records WHERE novel_id IS NOT NULL")
                total_novels = cursor.fetchone()['total_novels']
                
                return {
                    'total_articles': total_articles,
                    'finished_articles': finished_articles,
                    'total_duration': total_duration,
                    'total_novels': total_novels,
                    'completion_rate': round(finished_articles / total_articles * 100, 2) if total_articles > 0 else 0
                }
        except Exception as e:
            print(f"获取阅读统计失败: {str(e)}")
            return {}
    
    def close(self):
        """关闭数据库连接"""
        if self.connection and self.connection.open:
            self.connection.close() 