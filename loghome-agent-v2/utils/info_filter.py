"""
信息过滤器
负责过滤、整合和格式化从各个数据源检索到的信息
"""

from typing import Dict, List, Any, Optional
import json


class InfoFilter:
    """信息过滤器"""
    
    def __init__(self):
        self.max_summary_length = 2000  # 最大摘要长度
        self.max_items_per_category = 5  # 每个类别最大条目数
    
    def filter_and_integrate(self, platform_data: Dict[str, Any], 
                           memory_data: Dict[str, Any], 
                           keywords: List[str], 
                           context: Dict[str, Any] = None) -> str:
        """
        过滤和整合信息
        
        Args:
            platform_data: 平台数据
            memory_data: 记忆数据
            keywords: 关键词列表
            context: 上下文信息
            
        Returns:
            str: 整合后的信息摘要
        """
        try:
            summary_parts = []
            
            # 处理书籍信息
            books_summary = self._process_books(platform_data.get("books", []), keywords)
            if books_summary:
                summary_parts.append(f"📚 相关书籍信息：\n{books_summary}")
            
            # 处理文章/章节信息
            articles_summary = self._process_articles(platform_data.get("articles", []), keywords)
            if articles_summary:
                summary_parts.append(f"📄 相关章节信息：\n{articles_summary}")
            
            # 处理章节记忆
            memories_summary = self._process_chapter_memories(memory_data.get("chapter_memories", []), keywords)
            if memories_summary:
                summary_parts.append(f"🧠 相关阅读记忆：\n{memories_summary}")
            
            # 处理阅读想法
            thoughts_summary = self._process_reading_thoughts(memory_data.get("reading_thoughts", []), keywords)
            if thoughts_summary:
                summary_parts.append(f"💭 相关阅读想法：\n{thoughts_summary}")
            
            # 整合所有信息
            if summary_parts:
                full_summary = "\n\n".join(summary_parts)
                # 控制总长度
                if len(full_summary) > self.max_summary_length:
                    full_summary = full_summary[:self.max_summary_length] + "..."
                return full_summary
            else:
                return "未找到相关信息。"
                
        except Exception as e:
            print(f"❌ 信息过滤整合出错: {e}")
            return "信息处理出错。"
    
    def _process_books(self, books: List[Dict[str, Any]], keywords: List[str]) -> str:
        """处理书籍信息"""
        if not books:
            return ""
        
        # 限制数量并按相关性排序
        relevant_books = self._rank_by_relevance(books, keywords, ["name", "author", "description"])
        relevant_books = relevant_books[:self.max_items_per_category]
        
        book_summaries = []
        for book in relevant_books:
            summary = f"《{book.get('name', '未知')}》"
            if book.get('author'):
                summary += f" - 作者：{book['author']}"
            if book.get('clicks'):
                summary += f" - 阅读量：{book['clicks']}"
            if book.get('description'):
                desc = book['description'][:100] + "..." if len(book['description']) > 100 else book['description']
                summary += f" - 简介：{desc}"
            book_summaries.append(summary)
        
        return "\n".join(book_summaries)
    
    def _process_articles(self, articles: List[Dict[str, Any]], keywords: List[str]) -> str:
        """处理文章/章节信息"""
        if not articles:
            return ""
        
        relevant_articles = self._rank_by_relevance(articles, keywords, ["title", "novel_name"])
        relevant_articles = relevant_articles[:self.max_items_per_category]
        
        article_summaries = []
        for article in relevant_articles:
            summary = f"《{article.get('novel_name', '未知书籍')}》"
            if article.get('title'):
                summary += f" - {article['title']}"
            if article.get('article_chapter'):
                summary += f" (第{article['article_chapter']}章)"
            article_summaries.append(summary)
        
        return "\n".join(article_summaries)
    
    def _process_chapter_memories(self, memories: List[Dict[str, Any]], keywords: List[str]) -> str:
        """处理章节记忆"""
        if not memories:
            return ""
        
        relevant_memories = self._rank_by_relevance(
            memories, keywords, 
            ["chapter_title", "chapter_summary", "key_characters", "key_events", "thoughts"]
        )
        relevant_memories = relevant_memories[:self.max_items_per_category]
        
        memory_summaries = []
        for memory in relevant_memories:
            summary = ""
            if memory.get('chapter_title'):
                summary += f"章节：{memory['chapter_title']}\n"
            if memory.get('chapter_summary'):
                summary += f"摘要：{memory['chapter_summary'][:200]}...\n" if len(memory['chapter_summary']) > 200 else f"摘要：{memory['chapter_summary']}\n"
            if memory.get('key_characters'):
                summary += f"关键人物：{memory['key_characters']}\n"
            if memory.get('key_events'):
                summary += f"关键事件：{memory['key_events']}\n"
            if memory.get('thoughts'):
                summary += f"阅读感想：{memory['thoughts'][:100]}..." if len(memory['thoughts']) > 100 else f"阅读感想：{memory['thoughts']}"
            
            memory_summaries.append(summary.strip())
        
        return "\n---\n".join(memory_summaries)
    
    def _process_reading_thoughts(self, thoughts: List[Dict[str, Any]], keywords: List[str]) -> str:
        """处理阅读想法"""
        if not thoughts:
            return ""
        
        relevant_thoughts = self._rank_by_relevance(thoughts, keywords, ["novel_name", "thoughts"])
        relevant_thoughts = relevant_thoughts[:self.max_items_per_category]
        
        thought_summaries = []
        for thought in relevant_thoughts:
            summary = f"《{thought.get('novel_name', '未知书籍')}》的阅读想法：\n"
            if thought.get('thoughts'):
                content = thought['thoughts']
                if len(content) > 300:
                    content = content[:300] + "..."
                summary += content
            thought_summaries.append(summary)
        
        return "\n---\n".join(thought_summaries)
    
    def _rank_by_relevance(self, items: List[Dict[str, Any]], 
                          keywords: List[str], 
                          search_fields: List[str]) -> List[Dict[str, Any]]:
        """
        根据关键词相关性对项目进行排序
        
        Args:
            items: 要排序的项目列表
            keywords: 关键词列表
            search_fields: 要搜索的字段列表
            
        Returns:
            List: 按相关性排序的项目列表
        """
        if not items or not keywords:
            return items
        
        # 计算每个项目的相关性分数
        scored_items = []
        for item in items:
            score = 0
            for keyword in keywords:
                for field in search_fields:
                    field_value = str(item.get(field, "")).lower()
                    keyword_lower = keyword.lower()
                    
                    # 完全匹配得分更高
                    if keyword_lower == field_value:
                        score += 10
                    # 包含关键词
                    elif keyword_lower in field_value:
                        score += 5
                    # 部分匹配
                    elif any(word in field_value for word in keyword_lower.split()):
                        score += 2
            
            scored_items.append((score, item))
        
        # 按分数降序排序
        scored_items.sort(key=lambda x: x[0], reverse=True)
        
        # 返回排序后的项目列表
        return [item for score, item in scored_items]
    
    def format_for_context(self, summary: str, max_length: int = 1000) -> str:
        """
        为上下文格式化信息摘要
        
        Args:
            summary: 原始摘要
            max_length: 最大长度
            
        Returns:
            str: 格式化后的摘要
        """
        if not summary or summary == "未找到相关信息。":
            return ""
        
        # 控制长度
        if len(summary) > max_length:
            summary = summary[:max_length] + "..."
        
        # 添加前缀说明
        formatted = f"以下是根据你的需求检索到的相关信息：\n\n{summary}\n\n请基于这些信息来回答用户的问题。"
        
        return formatted