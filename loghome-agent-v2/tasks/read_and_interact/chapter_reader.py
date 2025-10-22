from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient
import json
import re


def get_chapter_memories(db: MySQLClient, memory_db: MySQLClient, novel_id: int, up_to_article_chapter: int):
    """
    获取指定章节之前的所有章节记忆和阅读想法，按时间顺序排列
    
    Args:
        db: 主数据库连接
        memory_db: 内存数据库连接
        novel_id: 小说ID
        up_to_article_chapter: 当前章节号（不包含）
        
    Returns:
        str: 拼接后的章节记忆和阅读想法文本
    """
    # 1. 首先从主数据库获取所有章节的ID和章节号映射
    all_chapters_query = """
    SELECT article_id, article_chapter
    FROM articles 
    WHERE novel_id = %s AND article_chapter < %s AND deleted = 0 AND is_draft = 0
    ORDER BY article_chapter ASC
    """
    all_chapters_result = db.execute_query(all_chapters_query, (novel_id, up_to_article_chapter))
    
    if not all_chapters_result["success"] or not all_chapters_result["data"]:
        return "暂无之前的章节记忆。"
    
    # 获取所有符合条件的article_id
    valid_article_ids = [chapter['article_id'] for chapter in all_chapters_result["data"]]
    chapter_order_map = {chapter['article_id']: chapter['article_chapter'] for chapter in all_chapters_result["data"]}
    
    if not valid_article_ids:
        return "暂无之前的章节记忆。"
    
    # 2. 从记忆数据库查询章节记忆（只查询有效的article_id）
    chapter_query = f"""
    SELECT article_id, chapter_title, chapter_summary, 
           key_characters, key_events, thoughts, created_at
    FROM chapter_memories 
    WHERE novel_id = %s AND article_id IN ({','.join(['%s'] * len(valid_article_ids))})
    ORDER BY article_id ASC
    """
    chapter_result = memory_db.execute_query(chapter_query, (novel_id,) + tuple(valid_article_ids))
    chapters = chapter_result["data"] if chapter_result["success"] else []

    # 3. 获取阅读想法（基于章节号过滤）
    # 首先从主数据库获取当前章节号对应的article_id
    current_chapter_articles_query = """
    SELECT article_id FROM articles 
    WHERE novel_id = %s AND article_chapter = %s
    """
    current_chapter_articles_result = db.execute_query(current_chapter_articles_query, (novel_id, up_to_article_chapter))
    
    thoughts_query = """
    SELECT thoughts, created_at
    FROM reading_thoughts 
    WHERE novel_id = %s
    """
    
    # 如果找到了当前章节的article_id，则查询对应的最早创建时间
    if (current_chapter_articles_result["success"] and 
        current_chapter_articles_result["data"]):
        current_article_ids = [str(article['article_id']) for article in current_chapter_articles_result["data"]]
        
        if current_article_ids:
            # 查询这些article_id对应的最早创建时间
            current_chapter_query = f"""
            SELECT MIN(created_at) as min_created_at
            FROM chapter_memories 
            WHERE novel_id = %s AND article_id IN ({','.join(['%s'] * len(current_article_ids))})
            """
            current_chapter_result = memory_db.execute_query(current_chapter_query, (novel_id,) + tuple(current_article_ids))
            
            # 如果找到了创建时间，则过滤阅读想法
            if (current_chapter_result["success"] and 
                current_chapter_result["data"] and 
                current_chapter_result["data"][0]["min_created_at"]):
                thoughts_query += " AND created_at < %s"
                thoughts_result = memory_db.execute_query(thoughts_query + " ORDER BY created_at ASC", 
                                                        (novel_id, current_chapter_result["data"][0]["min_created_at"]))
            else:
                thoughts_result = memory_db.execute_query(thoughts_query + " ORDER BY created_at ASC", (novel_id,))
        else:
            thoughts_result = memory_db.execute_query(thoughts_query + " ORDER BY created_at ASC", (novel_id,))
    else:
        thoughts_result = memory_db.execute_query(thoughts_query + " ORDER BY created_at ASC", (novel_id,))
    
    thoughts = thoughts_result["data"] if thoughts_result["success"] else []
    
    # 4. 合并并按时间排序
    all_memories = []
    
    # 添加章节记忆
    for memory in chapters:
        memory_text = f"章节{memory['article_id']}"
        if memory['chapter_title']:
            memory_text += f"《{memory['chapter_title']}》"
        memory_text += f"：{memory['chapter_summary']}"
        
        if memory['key_characters']:
            memory_text += f" 主要人物：{memory['key_characters']}"
        if memory['key_events']:
            memory_text += f" 关键事件：{memory['key_events']}"
        if memory['thoughts']:
            memory_text += f" 阅读想法：{memory['thoughts']}"
        
        # 获取章节顺序，如果找不到则使用999999作为默认值
        chapter_order = chapter_order_map.get(memory['article_id'], 999999)
        
        all_memories.append({
            'type': 'chapter',
            'content': memory_text,
            'created_at': memory['created_at'],
            'chapter_order': chapter_order
        })

    # 按章节顺序和创建时间排序
    all_memories.sort(key=lambda x: x['chapter_order'])
    
    # 添加阅读想法，按照创建时间插入到章节记忆之间
    for thought in thoughts:
        # 找到对应的位置，插入到第一个大于当前阅读想法创建时间的章节记忆之间
        insert_index = next((i for i, mem in enumerate(all_memories) if mem['created_at'] > thought['created_at']), len(all_memories))
        all_memories.insert(insert_index, {
            'type': 'thought',
            'content': f"【阶段性阅读感想】{thought['thoughts']}",
            'created_at': thought['created_at'],
            'chapter_order': -1  # 阅读想法没有章节顺序，用-1表示
        })
    
    # 提取内容并拼接
    if not all_memories:
        return "暂无之前的章节记忆。"
    
    memory_texts = [memory['content'] for memory in all_memories]
    return "\n\n".join(memory_texts)


def save_chapter_memory(memory_db: MySQLClient, novel_id: int, article_id: int, 
                       chapter_title: str, summary: str, characters: str = None, events: str = None, thoughts: str = None):
    """
    保存章节记忆
    
    Args:
        memory_db: 内存数据库连接
        novel_id: 小说ID
        article_id: 章节ID
        chapter_title: 章节标题
        summary: 章节摘要
        characters: 关键人物
        events: 关键事件
    """
    query = """
    INSERT INTO chapter_memories (novel_id, article_id, chapter_title, chapter_summary, key_characters, key_events, thoughts)
    VALUES (%s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
    chapter_title = VALUES(chapter_title),
    chapter_summary = VALUES(chapter_summary),
    key_characters = VALUES(key_characters),
    key_events = VALUES(key_events),
    thoughts = VALUES(thoughts),
    updated_at = CURRENT_TIMESTAMP
    """
    
    result = memory_db.execute_query(query, (novel_id, article_id, chapter_title, summary, characters, events, thoughts))
    return result["success"]


def extract_text_from_content(content_json: str, api_info: dict = None):
    """
    从章节JSON内容中提取纯文本和图片描述
    
    Args:
        content_json: 章节内容的JSON字符串
        api_info: API配置信息，用于创建MLLM客户端处理图片
        
    Returns:
        str: 提取的纯文本内容（包含图片描述）
    """
    try:
        content_data = json.loads(content_json)
        
        # 为图片分析创建单独的MLLM客户端
        image_client = None
        if api_info:
            image_client = MLLMClient(**api_info)
        
        if isinstance(content_data, list):
            text_parts = []
            for item in content_data:
                if isinstance(item, dict):
                    if item.get('type') == 'text' and 'value' in item:
                        text_parts.append(item['value'])
                    elif 'text' in item:
                        text_parts.append(item['text'])
                    elif item.get('type') == 'image' and 'img' in item and image_client:
                        # 处理图片类型的内容
                        image_url = item['img']
                        try:
                            print(f"   正在分析图片: {image_url}")
                            # 使用analyze_image方法分析图片
                            response = image_client.analyze_image(
                                image_url=image_url,
                                query="请详细描述这张图片的内容，包括人物、场景、动作等细节。",
                                model="glm-4-plus",
                                use_search=False
                            )
                            
                            # 提取图片描述
                            image_description = image_client.get_last_response(response)
                            if image_description:
                                # 格式化图片描述
                                formatted_description = f"【图片】{image_description}"
                                text_parts.append(formatted_description)
                                print(f"   图片分析完成: {image_description[:50]}...")
                            else:
                                text_parts.append("【图片】无法获取图片描述")
                                print(f"   图片分析失败: 无法获取描述")
                                
                        except Exception as e:
                            print(f"   图片分析出错: {e}")
                            text_parts.append(f"【图片】图片分析失败: {str(e)}")
                elif isinstance(item, str):
                    text_parts.append(item)
            return '\n'.join(text_parts)
        elif isinstance(content_data, dict) and 'text' in content_data:
            return content_data['text']
        elif isinstance(content_data, str):
            return content_data
        else:
            return str(content_data)
    except (json.JSONDecodeError, TypeError):
        # 如果不是JSON格式，直接返回原文本
        return content_json


def generate_chapter_summary(client: MLLMClient, chapter_text: str, previous_memories: str, chapter_title: str = ""):
    """
    使用AI生成章节摘要
    
    Args:
        client: MLLM客户端
        chapter_text: 章节文本内容
        previous_memories: 之前章节的记忆
        chapter_title: 章节标题
        
    Returns:
        dict: 包含摘要、关键人物、关键事件的字典
    """
    prompt = f"""请阅读以下小说章节内容，并生成一个简洁的摘要。

之前章节的记忆：
{previous_memories if previous_memories else "这是第一章"}

当前章节标题：{chapter_title if chapter_title else "无标题"}

章节内容：
{chapter_text}

请按照以下格式回复：
摘要：[用2-3句话概括本章节的主要内容和情节发展]
关键人物：[本章节出现的重要人物，用逗号分隔]
关键事件：[本章节发生的重要事件，用逗号分隔]
感想：[本章节的个人思考或情感，100字左右]


要求：
1. 摘要要简洁明了，突出重点情节
2. 关键人物只列出在本章节中有重要作用的角色
3. 关键事件要突出推动剧情发展的重要情节
4. 如果某项内容为空，请写"无"
"""

    try:
        response = client.chat(
            message=prompt,
            model="glm-4-plus",
            use_search=False
        )
        
        ai_response = client.get_last_response(response)
        if not ai_response:
            return {
                "summary": "AI生成摘要失败",
                "characters": None,
                "events": None
            }
        
        # 解析AI回复
        lines = ai_response.strip().split('\n')
        summary = ""
        characters = None
        events = None
        
        for line in lines:
            line = line.strip()
            if line.startswith('摘要：'):
                summary = line[3:].strip()
            elif line.startswith('关键人物：'):
                chars = line[5:].strip()
                characters = chars if chars != "无" else None
            elif line.startswith('关键事件：'):
                evts = line[5:].strip()
                events = evts if evts != "无" else None
            elif line.startswith('感想：'):
                thoughts = line[3:].strip()
                thoughts = thoughts if thoughts != "无" else None
        
        return {
            "summary": summary if summary else "无法生成摘要",
            "characters": characters,
            "events": events,
            "thoughts": thoughts
        }
        
    except Exception as e:
        print(f"生成章节摘要时出错: {e}")
        return {
            "summary": f"生成摘要时出错: {str(e)}",
            "characters": None,
            "events": None,
            "thoughts": None
        }


def read_and_summarize_chapter(db: MySQLClient, memory_db: MySQLClient, client: MLLMClient, 
                              novel_id: int, article_id: int, chapter_content: str, chapter_title: str = "", api_info: dict = None):
    """
    阅读并总结单个章节
    
    Args:
        db: 主数据库连接
        memory_db: 内存数据库连接
        client: MLLM客户端
        novel_id: 小说ID
        article_id: 章节ID
        chapter_content: 章节内容
        chapter_title: 章节标题
        
    Returns:
        bool: 是否成功处理
    """
    try:
        # 1. 获取当前章节的章节号
        current_chapter_query = """
        SELECT article_chapter
        FROM articles 
        WHERE article_id = %s
        """
        current_chapter_result = db.execute_query(current_chapter_query, (article_id,))
        
        if not current_chapter_result["success"] or not current_chapter_result["data"]:
            print(f"❌ 无法获取章节 {article_id} 的章节号")
            return False
            
        current_article_chapter = current_chapter_result["data"][0]["article_chapter"]
        
        # 2. 获取之前章节的记忆
        previous_memories = get_chapter_memories(db, memory_db, novel_id, current_article_chapter)
        
        # 3. 提取章节文本内容
        chapter_text = extract_text_from_content(chapter_content, api_info)
        
        # 4. 生成章节摘要
        print(f"正在生成章节 {article_id} 的摘要...")
        summary_data = generate_chapter_summary(client, chapter_text, previous_memories, chapter_title)
        
        # 5. 保存章节记忆
        success = save_chapter_memory(
            memory_db, 
            novel_id, 
            article_id, 
            chapter_title,
            summary_data["summary"],
            summary_data["characters"],
            summary_data["events"],
            summary_data["thoughts"]
        )
        
        if success:
            print(f"✅ 章节 {article_id} 摘要保存成功")
            print(f"   摘要: {summary_data['summary']}")
            if summary_data["characters"]:
                print(f"   关键人物: {summary_data['characters']}")
            if summary_data["events"]:
                print(f"   关键事件: {summary_data['events']}")
            if summary_data["thoughts"]:
                print(f"   阅读想法: {summary_data['thoughts']}")
        else:
            print(f"❌ 章节 {article_id} 摘要保存失败")
        
        return success
        
    except Exception as e:
        print(f"处理章节 {article_id} 时出错: {e}")
        return False