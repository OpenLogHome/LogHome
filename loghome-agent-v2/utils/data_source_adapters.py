"""
数据源适配器
负责从不同的数据源（平台数据、记忆库）检索信息
"""

from typing import Dict, List, Any, Optional
from utils.mysql_client import MySQLClient
import re


class PlatformDataAdapter:
    """平台数据适配器，负责从主数据库检索书籍、用户、帖子等信息"""
    
    def __init__(self, db: MySQLClient):
        self.db = db
    
    def search_by_keywords(self, keywords: List[str], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        根据关键词搜索平台数据
        
        Args:
            keywords: 关键词列表
            context: 上下文信息
            
        Returns:
            Dict: 搜索结果
        """
        results = {
            "books": [],
            "users": [],
            "articles": []
        }
        
        try:
            # 搜索书籍
            books = self._search_books(keywords)
            results["books"] = books
            
            # 搜索文章/章节
            articles = self._search_articles(keywords)
            results["articles"] = articles
            
            # 如果有用户相关关键词，搜索用户信息
            user_keywords = [kw for kw in keywords if self._is_user_related(kw)]
            if user_keywords:
                users = self._search_users(user_keywords, context)
                results["users"] = users
            
            return results
            
        except Exception as e:
            print(f"❌ 平台数据搜索出错: {e}")
            return results
    
    def _search_books(self, keywords: List[str]) -> List[Dict[str, Any]]:
        """搜索书籍"""
        if not keywords:
            return []
        
        # 构建搜索条件
        conditions = []
        params = []
        
        for keyword in keywords:
            conditions.append("novels.name LIKE %s OR novels.content LIKE %s OR u.name LIKE %s")
            params.extend([f"%{keyword}%", f"%{keyword}%", f"%{keyword}%"])
        
        where_clause = " OR ".join(conditions)
        
        query = f"""
        SELECT novels.novel_id, novels.name, novels.author_id, novels.content, novels.clicks, novels.update_time, u.name
        FROM novels 
        LEFT JOIN users u ON novels.author_id = u.user_id
        WHERE novels.deleted = 0 AND ({where_clause})
        ORDER BY novels.clicks DESC, novels.update_time DESC
        LIMIT 10
        """
        
        result = self.db.execute_query(query, tuple(params))
        return result["data"] if result["success"] else []
    
    def _search_articles(self, keywords: List[str]) -> List[Dict[str, Any]]:
        """搜索文章/章节"""
        if not keywords:
            return []
        
        conditions = []
        params = []
        
        for keyword in keywords:
            conditions.append("(title LIKE %s OR a.content LIKE %s)")
            params.extend([f"%{keyword}%", f"%{keyword}%"])
        
        where_clause = " OR ".join(conditions)
        
        query = f"""
        SELECT a.article_id, a.title, a.novel_id, a.article_chapter, 
               a.update_time, n.name as novel_name
        FROM articles a
        LEFT JOIN novels n ON a.novel_id = n.novel_id
        WHERE a.deleted = 0 AND a.is_draft = 0 AND ({where_clause})
        ORDER BY a.update_time DESC
        LIMIT 10
        """
        
        result = self.db.execute_query(query, tuple(params))
        return result["data"] if result["success"] else []
    
    def _search_users(self, keywords: List[str], context: Dict[str, Any] = None) -> List[Dict[str, Any]]:
        """搜索用户信息（这里主要是占位，实际可能需要调用API）"""
        # 由于用户信息可能需要通过API获取，这里返回空列表
        # 实际实现时可以根据需要调用相应的API
        return []
    
    def _is_user_related(self, keyword: str) -> bool:
        """判断关键词是否与用户相关"""
        user_indicators = ["用户", "读者", "作者", "朋友", "粉丝"]
        return any(indicator in keyword for indicator in user_indicators)


class MemoryDataAdapter:
    """记忆数据适配器，负责从记忆库检索章节记忆和阅读想法"""
    
    def __init__(self, memory_db: MySQLClient):
        self.memory_db = memory_db
    
    def search_by_keywords(self, keywords: List[str], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        根据关键词搜索记忆数据
        
        Args:
            keywords: 关键词列表
            context: 上下文信息
            
        Returns:
            Dict: 搜索结果
        """
        results = {
            "chapter_memories": [],
            "reading_thoughts": []
        }
        
        try:
            # 搜索章节记忆
            chapter_memories = self._search_chapter_memories(keywords)
            results["chapter_memories"] = chapter_memories
            
            # 搜索阅读想法
            reading_thoughts = self._search_reading_thoughts(keywords)
            results["reading_thoughts"] = reading_thoughts
            
            return results
            
        except Exception as e:
            print(f"❌ 记忆数据搜索出错: {e}")
            return results
    
    def _search_chapter_memories(self, keywords: List[str]) -> List[Dict[str, Any]]:
        """搜索章节记忆"""
        if not keywords:
            return []
        
        conditions = []
        params = []
        
        for keyword in keywords:
            conditions.append("""
                (chapter_title LIKE %s OR chapter_summary LIKE %s OR 
                 key_characters LIKE %s OR key_events LIKE %s OR thoughts LIKE %s)
            """)
            params.extend([f"%{keyword}%"] * 5)
        
        where_clause = " OR ".join(conditions)
        
        query = f"""
        SELECT novel_id, article_id, chapter_title, chapter_summary, 
               key_characters, key_events, thoughts, created_at
        FROM chapter_memories 
        WHERE {where_clause}
        ORDER BY created_at DESC
        LIMIT 20
        """
        
        result = self.memory_db.execute_query(query, tuple(params))
        return result["data"] if result["success"] else []
    
    def _search_reading_thoughts(self, keywords: List[str]) -> List[Dict[str, Any]]:
        """搜索阅读想法"""
        if not keywords:
            return []
        
        conditions = []
        params = []
        
        for keyword in keywords:
            conditions.append("(novel_name LIKE %s OR thoughts LIKE %s)")
            params.extend([f"%{keyword}%", f"%{keyword}%"])
        
        where_clause = " OR ".join(conditions)
        
        query = f"""
        SELECT id, novel_id, novel_name, thoughts, created_at
        FROM reading_thoughts 
        WHERE {where_clause}
        ORDER BY created_at DESC
        LIMIT 10
        """
        
        result = self.memory_db.execute_query(query, tuple(params))
        return result["data"] if result["success"] else []
    
    def get_recent_memories_by_book(self, novel_id: int, limit: int = 5) -> Dict[str, Any]:
        """
        获取指定书籍的最近记忆
        
        Args:
            novel_id: 书籍ID
            limit: 返回数量限制
            
        Returns:
            Dict: 记忆数据
        """
        results = {
            "chapter_memories": [],
            "reading_thoughts": []
        }
        
        try:
            # 获取章节记忆
            chapter_query = """
            SELECT article_id, chapter_title, chapter_summary, 
                   key_characters, key_events, thoughts, created_at
            FROM chapter_memories 
            WHERE novel_id = %s
            ORDER BY created_at DESC
            LIMIT %s
            """
            chapter_result = self.memory_db.execute_query(chapter_query, (novel_id, limit))
            if chapter_result["success"]:
                results["chapter_memories"] = chapter_result["data"]
            
            # 获取阅读想法
            thoughts_query = """
            SELECT novel_name, thoughts, created_at
            FROM reading_thoughts 
            WHERE novel_id = %s
            ORDER BY created_at DESC
            LIMIT %s
            """
            thoughts_result = self.memory_db.execute_query(thoughts_query, (novel_id, limit))
            if thoughts_result["success"]:
                results["reading_thoughts"] = thoughts_result["data"]
            
            return results
            
        except Exception as e:
            print(f"❌ 获取书籍记忆出错: {e}")
            return results
    
    def get_memories_by_books(self, novel_ids: List[int], limit_per_book: int = 10) -> Dict[str, Any]:
        """
        批量获取多个书籍的记忆数据
        
        Args:
            novel_ids: 书籍ID列表
            limit_per_book: 每本书的记忆数量限制
            
        Returns:
            Dict: 记忆数据
        """
        results = {
            "chapter_memories": [],
            "reading_thoughts": []
        }
        
        if not novel_ids:
            return results
        
        try:
            # 构建IN子句的占位符
            placeholders = ','.join(['%s'] * len(novel_ids))
            
            # 获取章节记忆
            chapter_query = f"""
            SELECT novel_id, article_id, chapter_title, chapter_summary, 
                   key_characters, key_events, thoughts, created_at
            FROM chapter_memories 
            WHERE novel_id IN ({placeholders})
            ORDER BY novel_id, created_at DESC
            """
            chapter_result = self.memory_db.execute_query(chapter_query, tuple(novel_ids))
            if chapter_result["success"]:
                # 按书籍分组并限制数量
                book_chapters = {}
                for memory in chapter_result["data"]:
                    novel_id = memory["novel_id"]
                    if novel_id not in book_chapters:
                        book_chapters[novel_id] = []
                    if len(book_chapters[novel_id]) < limit_per_book:
                        book_chapters[novel_id].append(memory)
                
                # 合并所有记忆
                for memories in book_chapters.values():
                    results["chapter_memories"].extend(memories)
            
            # 获取阅读想法
            thoughts_query = f"""
            SELECT id, novel_id, novel_name, thoughts, created_at
            FROM reading_thoughts 
            WHERE novel_id IN ({placeholders})
            ORDER BY novel_id, created_at DESC
            """
            thoughts_result = self.memory_db.execute_query(thoughts_query, tuple(novel_ids))
            if thoughts_result["success"]:
                # 按书籍分组并限制数量
                book_thoughts = {}
                for thought in thoughts_result["data"]:
                    novel_id = thought["novel_id"]
                    if novel_id not in book_thoughts:
                        book_thoughts[novel_id] = []
                    if len(book_thoughts[novel_id]) < limit_per_book:
                        book_thoughts[novel_id].append(thought)
                
                # 合并所有想法
                for thoughts in book_thoughts.values():
                    results["reading_thoughts"].extend(thoughts)
            
            return results
            
        except Exception as e:
            print(f"❌ 批量获取书籍记忆出错: {e}")
            return results
    
    def get_memories_by_articles(self, article_ids: List[int]) -> Dict[str, Any]:
        """
        根据文章ID获取对应的章节记忆
        
        Args:
            article_ids: 文章ID列表
            
        Returns:
            Dict: 记忆数据
        """
        results = {
            "chapter_memories": [],
            "reading_thoughts": []
        }
        
        if not article_ids:
            return results
        
        try:
            # 构建IN子句的占位符
            placeholders = ','.join(['%s'] * len(article_ids))
            
            # 获取章节记忆
            chapter_query = f"""
            SELECT novel_id, article_id, chapter_title, chapter_summary, 
                   key_characters, key_events, thoughts, created_at
            FROM chapter_memories 
            WHERE article_id IN ({placeholders})
            ORDER BY created_at DESC
            """
            chapter_result = self.memory_db.execute_query(chapter_query, tuple(article_ids))
            if chapter_result["success"]:
                results["chapter_memories"] = chapter_result["data"]
            
            return results
            
        except Exception as e:
            print(f"❌ 根据文章ID获取记忆出错: {e}")
            return results