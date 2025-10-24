"""
信息检索管理器
负责处理模型的主动信息获取请求，协调各种数据源的查询，并提供上下文隔离机制
"""

import re
import json
import os
import jieba
from typing import Dict, List, Any, Optional, Tuple
from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient


class InfoRetrievalManager:
    """信息检索管理器"""
    
    def __init__(self, db: MySQLClient, memory_db: MySQLClient, api_info: Dict[str, Any]):
        """
        初始化信息检索管理器
        
        Args:
            db: 主数据库连接
            memory_db: 记忆数据库连接
            api_info: API配置信息
        """
        self.db = db
        self.memory_db = memory_db
        self.api_info = api_info
        
        # 初始化数据源适配器
        from .data_source_adapters import PlatformDataAdapter, MemoryDataAdapter
        self.platform_adapter = PlatformDataAdapter(db)
        self.memory_adapter = MemoryDataAdapter(memory_db)
        
        # 初始化信息过滤器
        from .info_filter import InfoFilter
        self.info_filter = InfoFilter()
        
        # 加载停用词
        self.stopwords = self._load_stopwords()
    
    def _load_stopwords(self) -> set:
        """
        加载停用词列表
        
        Returns:
            set: 停用词集合
        """
        stopwords = set()
        try:
            # 获取当前文件所在目录
            current_dir = os.path.dirname(os.path.abspath(__file__))
            stopwords_file = os.path.join(current_dir, 'stopwords.txt')
            
            if os.path.exists(stopwords_file):
                with open(stopwords_file, 'r', encoding='utf-8') as f:
                    for line in f:
                        word = line.strip()
                        if word:
                            stopwords.add(word)
                print(f"✅ 成功加载 {len(stopwords)} 个停用词")
            else:
                print("⚠️ 停用词文件不存在，使用默认停用词")
                # 默认停用词
                stopwords = {'的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己'}
        except Exception as e:
            print(f"❌ 加载停用词时出错: {e}")
            # 使用默认停用词
            stopwords = {'的', '了', '在', '是', '我', '有', '和', '就', '不', '人', '都', '一', '上', '也', '很', '到', '说', '要', '去', '你', '会', '着', '没有', '看', '好', '自己'}
        
        return stopwords
    
    def detect_memory_request(self, response_text: str) -> Optional[str]:
        """
        检测模型回复中是否包含信息获取请求
        
        Args:
            response_text: 模型的回复文本
            
        Returns:
            str: 提取的关键词字符串，如果没有请求则返回None
        """
        # 匹配 <memory>关键词</memory> 格式
        pattern = r'<memory>(.*?)</memory>'
        match = re.search(pattern, response_text, re.IGNORECASE | re.DOTALL)
        
        if match:
            keywords = match.group(1).strip()
            return keywords if keywords else None
        
        return None
    
    def parse_keywords(self, keywords_str: str) -> List[str]:
        """
        解析关键词字符串
        
        Args:
            keywords_str: 关键词字符串，用逗号分隔
            
        Returns:
            List[str]: 关键词列表
        """
        if not keywords_str:
            return []
        
        # 按逗号分割并清理空白字符
        keywords = [kw.strip() for kw in keywords_str.split(',')]
        # 过滤空关键词
        keywords = [kw for kw in keywords if kw]
        
        return keywords
    
    def segment_keywords(self, keywords: List[str]) -> List[str]:
        """
        对关键词进行分词处理，使用jieba分词并去除停用词
        
        Args:
            keywords: 原始关键词列表
            
        Returns:
            List[str]: 分词后的关键词列表（去重）
        """
        segmented_keywords = set()
        
        for keyword in keywords:
            # 添加原始关键词（如果不是停用词）
            if keyword not in self.stopwords and len(keyword) >= 2:
                segmented_keywords.add(keyword)
            
            # 使用jieba进行分词
            try:
                # 精确模式分词
                segments = jieba.cut(keyword, cut_all=False)
                for segment in segments:
                    segment = segment.strip()
                    # 过滤停用词、空字符串、单字符和纯数字
                    if (segment and 
                        len(segment) >= 2 and 
                        segment not in self.stopwords and
                        not segment.isdigit() and
                        not re.match(r'^[^\u4e00-\u9fff\w]+$', segment)):  # 过滤纯标点符号
                        segmented_keywords.add(segment)
                
                # 全模式分词（获取更多可能的词汇）
                segments_all = jieba.cut(keyword, cut_all=True)
                for segment in segments_all:
                    segment = segment.strip()
                    # 过滤停用词、空字符串、单字符和纯数字
                    if (segment and 
                        len(segment) >= 2 and 
                        segment not in self.stopwords and
                        not segment.isdigit() and
                        not re.match(r'^[^\u4e00-\u9fff\w]+$', segment)):  # 过滤纯标点符号
                        segmented_keywords.add(segment)
                        
            except Exception as e:
                print(f"⚠️ jieba分词出错: {e}，使用原始关键词")
                # 如果jieba分词失败，回退到原始方法
                if keyword not in self.stopwords and len(keyword) >= 2:
                    segmented_keywords.add(keyword)
        
        # 转换为列表并排序（便于调试和一致性）
        result = sorted(list(segmented_keywords))
        print(f"🔤 分词结果: {len(result)} 个词汇 - {result[:10]}{'...' if len(result) > 10 else ''}")
        
        return result
    
    def merge_search_results(self, original_results: Dict[str, Any], 
                           segmented_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        合并原始关键词搜索结果和分词搜索结果
        
        Args:
            original_results: 原始关键词搜索结果
            segmented_results: 分词搜索结果
            
        Returns:
            Dict[str, Any]: 合并后的结果
        """
        merged_results = {
            "platform_data": {},
            "memory_data": {},
            "summary": ""
        }
        
        # 合并平台数据
        merged_platform = {}
        for key in ["books", "users", "articles"]:
            original_items = original_results.get("platform_data", {}).get(key, [])
            segmented_items = segmented_results.get("platform_data", {}).get(key, [])
            
            # 使用字典去重（基于ID）
            items_dict = {}
            
            # 添加原始结果（优先级更高）
            for item in original_items:
                item_id = self._get_item_id(item, key)
                if item_id:
                    items_dict[item_id] = item
            
            # 添加分词结果
            for item in segmented_items:
                item_id = self._get_item_id(item, key)
                if item_id and item_id not in items_dict:
                    items_dict[item_id] = item
            
            merged_platform[key] = list(items_dict.values())
        
        merged_results["platform_data"] = merged_platform
        
        # 合并记忆数据
        merged_memory = {}
        for key in ["chapter_memories", "reading_thoughts"]:
            original_items = original_results.get("memory_data", {}).get(key, [])
            segmented_items = segmented_results.get("memory_data", {}).get(key, [])
            
            # 使用字典去重
            items_dict = {}
            
            # 添加原始结果（优先级更高）
            for item in original_items:
                item_id = self._get_memory_item_id(item, key)
                if item_id:
                    items_dict[item_id] = item
            
            # 添加分词结果
            for item in segmented_items:
                item_id = self._get_memory_item_id(item, key)
                if item_id and item_id not in items_dict:
                    items_dict[item_id] = item
            
            merged_memory[key] = list(items_dict.values())
        
        merged_results["memory_data"] = merged_memory
        
        return merged_results
    
    def _get_item_id(self, item: Dict[str, Any], item_type: str) -> Optional[str]:
        """获取平台数据项的唯一ID"""
        if item_type == "books":
            return item.get("novel_id")
        elif item_type == "users":
            return item.get("user_id")
        elif item_type == "articles":
            return item.get("article_id")
        return None
    
    def _get_memory_item_id(self, item: Dict[str, Any], item_type: str) -> Optional[str]:
        """获取记忆数据项的唯一ID"""
        if item_type == "chapter_memories":
            # 使用novel_id和article_id组合作为唯一标识
            novel_id = item.get('novel_id')
            article_id = item.get('article_id')
            if novel_id and article_id:
                return f"{novel_id}_{article_id}"
            # 如果没有article_id，使用novel_id和章节标题的组合
            elif novel_id and item.get('chapter_title'):
                return f"{novel_id}_{hash(item.get('chapter_title'))}"
        elif item_type == "reading_thoughts":
            # 优先使用id字段
            if item.get("id"):
                return str(item.get("id"))
            # 如果没有id，使用novel_id和想法内容的hash作为标识
            elif item.get('novel_id') and item.get('thoughts'):
                return f"thought_{item.get('novel_id')}_{hash(item.get('thoughts'))}"
        return None
    
    def retrieve_information(self, keywords: List[str], context: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        根据关键词检索信息
        
        Args:
            keywords: 关键词列表
            context: 上下文信息（如用户ID、当前对话等）
            
        Returns:
            Dict: 检索到的信息，包含各个数据源的结果
        """
        results = {
            "platform_data": {},
            "memory_data": {},
            "summary": ""
        }
        
        try:
            print(f"🔍 开始检索信息，原始关键词: {keywords}")
            
            # 1. 使用原始关键词检索
            print("📝 使用原始关键词检索...")
            original_platform_results = self.platform_adapter.search_by_keywords(keywords, context)
            original_memory_results = self.memory_adapter.search_by_keywords(keywords, context)
            
            # 2. 根据平台搜索结果获取对应的记忆数据
            print("🔗 获取搜索结果对应的记忆数据...")
            additional_memories = self._get_memories_for_platform_results(original_platform_results)
            
            # 3. 合并记忆数据
            merged_memory_results = self._merge_memory_results(original_memory_results, additional_memories)
            
            original_results = {
                "platform_data": original_platform_results,
                "memory_data": merged_memory_results,
                "summary": ""
            }
            
            # 4. 对关键词进行分词
            segmented_keywords = self.segment_keywords(keywords)
            print(f"✂️ 分词后关键词: {segmented_keywords}")
            
            # 5. 使用分词后的关键词检索
            segmented_results = {
                "platform_data": {},
                "memory_data": {},
                "summary": ""
            }
            
            if segmented_keywords and len(segmented_keywords) > len(keywords):
                print("📝 使用分词关键词检索...")
                segmented_platform_results = self.platform_adapter.search_by_keywords(segmented_keywords, context)
                segmented_memory_results = self.memory_adapter.search_by_keywords(segmented_keywords, context)
                
                # 获取分词搜索结果对应的记忆数据
                segmented_additional_memories = self._get_memories_for_platform_results(segmented_platform_results)
                merged_segmented_memory_results = self._merge_memory_results(segmented_memory_results, segmented_additional_memories)
                
                segmented_results = {
                    "platform_data": segmented_platform_results,
                    "memory_data": merged_segmented_memory_results,
                    "summary": ""
                }
            
            # 6. 合并结果
            print("🔄 合并搜索结果...")
            merged_results = self.merge_search_results(original_results, segmented_results)
            
            # 7. 过滤和整合信息
            filtered_info = self.info_filter.filter_and_integrate(
                merged_results["platform_data"], 
                merged_results["memory_data"], 
                keywords, 
                context
            )
            merged_results["summary"] = filtered_info
            
            # 输出统计信息
            platform_count = sum(len(v) for v in merged_results["platform_data"].values())
            memory_count = sum(len(v) for v in merged_results["memory_data"].values())
            print(f"✅ 检索完成，平台数据: {platform_count} 条，记忆数据: {memory_count} 条")
            
            return merged_results
            
        except Exception as e:
            print(f"❌ 信息检索过程中出错: {e}")
            return results
    
    def _get_memories_for_platform_results(self, platform_results: Dict[str, Any]) -> Dict[str, Any]:
        """
        根据平台搜索结果获取对应的记忆数据
        
        Args:
            platform_results: 平台搜索结果
            
        Returns:
            Dict: 对应的记忆数据
        """
        memories = {
            "chapter_memories": [],
            "reading_thoughts": []
        }
        
        try:
            # 收集所有书籍ID
            novel_ids = set()
            article_ids = []
            
            # 从书籍结果中收集novel_id
            for book in platform_results.get("books", []):
                if book.get("novel_id"):
                    novel_ids.add(book["novel_id"])
            
            # 从文章结果中收集novel_id和article_id
            for article in platform_results.get("articles", []):
                if article.get("novel_id"):
                    novel_ids.add(article["novel_id"])
                if article.get("article_id"):
                    article_ids.append(article["article_id"])
            
            # 根据书籍ID批量获取记忆
            if novel_ids:
                book_memories = self.memory_adapter.get_memories_by_books(list(novel_ids))
                memories["chapter_memories"].extend(book_memories.get("chapter_memories", []))
                memories["reading_thoughts"].extend(book_memories.get("reading_thoughts", []))
            
            # 根据文章ID获取章节记忆
            if article_ids:
                article_memories = self.memory_adapter.get_memories_by_articles(article_ids)
                memories["chapter_memories"].extend(article_memories.get("chapter_memories", []))
            
            print(f"📚 根据平台结果获取到 {len(memories['chapter_memories'])} 条章节记忆，{len(memories['reading_thoughts'])} 条阅读想法")
            
        except Exception as e:
            print(f"❌ 获取平台结果对应记忆时出错: {e}")
        
        return memories
    
    def _merge_memory_results(self, original_memories: Dict[str, Any], additional_memories: Dict[str, Any]) -> Dict[str, Any]:
        """
        合并记忆搜索结果
        
        Args:
            original_memories: 原始记忆搜索结果
            additional_memories: 额外的记忆数据
            
        Returns:
            Dict: 合并后的记忆数据
        """
        merged = {
            "chapter_memories": [],
            "reading_thoughts": []
        }
        
        # 合并章节记忆（去重）
        chapter_ids = set()
        
        # 添加原始结果（优先级更高）
        for memory in original_memories.get("chapter_memories", []):
            memory_id = f"{memory.get('novel_id')}_{memory.get('article_id')}"
            if memory_id not in chapter_ids:
                chapter_ids.add(memory_id)
                merged["chapter_memories"].append(memory)
        
        # 添加额外结果
        for memory in additional_memories.get("chapter_memories", []):
            memory_id = f"{memory.get('novel_id')}_{memory.get('article_id')}"
            if memory_id not in chapter_ids:
                chapter_ids.add(memory_id)
                merged["chapter_memories"].append(memory)
        
        # 合并阅读想法（去重）
        thought_ids = set()
        
        # 添加原始结果（优先级更高）
        for thought in original_memories.get("reading_thoughts", []):
            thought_id = thought.get("id")
            if thought_id and thought_id not in thought_ids:
                thought_ids.add(thought_id)
                merged["reading_thoughts"].append(thought)
        
        # 添加额外结果
        for thought in additional_memories.get("reading_thoughts", []):
            thought_id = thought.get("id")
            if thought_id and thought_id not in thought_ids:
                thought_ids.add(thought_id)
                merged["reading_thoughts"].append(thought)
        
        return merged
    
    def process_memory_request(self, response_text: str, context: Dict[str, Any] = None) -> tuple[bool, Optional[Dict[str, Any]]]:
        """
        处理记忆请求
        
        Args:
            response_text: AI回复文本
            context: 上下文信息
            
        Returns:
            tuple: (是否有记忆请求, 检索到的信息)
        """
        try:
            # 检测是否有记忆请求
            keywords_str = self.detect_memory_request(response_text)
            
            if not keywords_str:
                return False, None
            
            # 解析关键词
            keywords = self.parse_keywords(keywords_str)
            
            if not keywords:
                print("⚠️ 未能解析出有效关键词")
                return True, None
            
            print(f"🔍 检测到记忆请求，关键词: {keywords}")
            
            # 使用上下文管理器创建隔离的检索上下文
            if context and context.get("user_id"):
                from utils.context_manager import get_context_manager
                context_manager = get_context_manager()
                
                # 创建隔离的检索上下文
                request_id = context_manager.isolate_retrieval_context(
                    context["user_id"],
                    {
                        "keywords": keywords,
                        "original_response": response_text,
                        "request_type": "memory_retrieval"
                    }
                )
                
                # 获取隔离的上下文进行检索
                isolated_context = context_manager.get_isolated_context_for_retrieval(
                    context["user_id"], 
                    request_id
                )
                
                # 更新检索状态为进行中
                context_manager.update_retrieval_status(
                    context["user_id"], 
                    request_id, 
                    "in_progress"
                )
                
                # 在隔离的上下文中检索信息
                retrieved_info = self.retrieve_information(keywords, isolated_context)
                
                # 更新检索状态为完成
                context_manager.update_retrieval_status(
                    context["user_id"], 
                    request_id, 
                    "completed", 
                    retrieved_info
                )
                
                return True, retrieved_info
            else:
                # 没有用户上下文时的回退处理
                retrieved_info = self.retrieve_information(keywords, context)
                return True, retrieved_info
            
        except Exception as e:
            print(f"❌ 处理记忆请求时出错: {e}")
            
            # 如果有用户上下文，更新检索状态为失败
            if context and context.get("user_id"):
                try:
                    from utils.context_manager import get_context_manager
                    context_manager = get_context_manager()
                    user_context = context_manager.get_context_by_user_id(context["user_id"])
                    if user_context and user_context.retrieval_state.get("status") == "in_progress":
                        context_manager.update_retrieval_status(
                            context["user_id"],
                            user_context.retrieval_state.get("request_id"),
                            "failed"
                        )
                except:
                    pass
            
            return False, None
    
    def generate_enhanced_response(self, original_prompt: str, retrieved_info: str, 
                                 client: MLLMClient, context: Dict[str, Any] = None) -> Optional[str]:
        """
        基于检索到的信息生成增强回复
        
        Args:
            original_prompt: 原始提示词
            retrieved_info: 检索到的信息
            client: MLLM客户端
            context: 上下文信息
            
        Returns:
            str: 生成的增强回复
        """
        try:
            # 构建增强提示词
            enhanced_prompt = f"""
{original_prompt}

补充信息：
{retrieved_info}

你应该如何理解上述补充信息：
1. platform_data 包含了从平台检索到的相关信息，它是客观存在的数据。
2. memory_data 包含了你之前在平台上阅读、记录的相关信息，它是你个人的记忆。
3. 如果 platform_data 中存在某个内容，你应该结合 memory_data 中的相关信息来看看之前你的记忆。
4. 如果 platform_data 中的内容在 memory_data 中不存在，说明你以前没有看过这个内容。

请基于以上补充信息重新生成回复，要求：
1. 自然地融入相关信息，不要显得突兀
2. 保持原有的语气和风格
3. 如果补充信息与当前对话不相关，可以忽略
4. 不要提及"根据检索到的信息"等字样
5. 直接回复内容，不要包含任何格式标记
"""
            
            # 调用AI生成增强回复
            response = client.chat(
                message=enhanced_prompt,
                model="glm-4-plus",
                use_search=False
            )
            
            # 提取AI回复
            enhanced_reply = client.get_last_response(response)
            
            return enhanced_reply
            
        except Exception as e:
            print(f"❌ 生成增强回复时出错: {e}")
            return None