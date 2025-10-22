from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient
import json
from datetime import datetime

def is_book_change(current_chapter, next_chapter):
    """
    检测是否换书了
    
    Args:
        current_chapter: 当前章节信息
        next_chapter: 下一章节信息，如果为None表示是最后一个章节
        
    Returns:
        bool: 是否换书了
    """
    # 如果是最后一个章节，则认为换书了
    if next_chapter is None:
        return True
    
    # 如果下一章节的书籍ID与当前章节不同，则换书了
    if current_chapter['novel_id'] != next_chapter['novel_id']:
        return True
    
    return False

def get_book_reading_chapters(memory_db: MySQLClient, novel_id: int):
    """
    获取本次阅读该书的所有章节记录
    
    Args:
        memory_db: 记忆数据库连接
        novel_id: 小说ID
        
    Returns:
        list: 本次阅读的章节列表
    """
    # 获取该书的章节记忆，按章节ID排序
    query = """
    SELECT novel_id, article_id, chapter_title, chapter_summary, 
           key_characters, key_events, created_at
    FROM chapter_memories 
    WHERE novel_id = %s 
    ORDER BY article_id ASC
    """
    result = memory_db.execute_query(query, (novel_id,))
    return result["data"] if result["success"] else []

def generate_reading_thoughts(db: MySQLClient, memory_db: MySQLClient, client: MLLMClient, novel_id: int, novel_name: str):
    """
    生成阅读想法
    
    Args:
        db: 主数据库连接
        memory_db: 记忆数据库连接
        client: MLLM客户端
        novel_id: 小说ID
        novel_name: 小说名称
        
    Returns:
        str: 生成的阅读想法（500字左右）
    """
    # 导入get_chapter_memories函数
    from .chapter_reader import get_chapter_memories
    
    # 获取该书的所有章节记忆，使用一个很大的章节号来获取所有章节
    previous_memories = get_chapter_memories(db, memory_db, novel_id, 999999999)
    
    if not previous_memories or previous_memories == "暂无之前的章节记忆。":
        return None

    # 构建提示词
    prompt = f"""
现在你阅读了这本书的一部分，请基于以上阅读的内容，写一篇1000字左右的阶段性的阅读想法和感受。

书籍名称：{novel_name}

这是你之前阅读时记录下的所有章节的摘要与记忆：
{previous_memories}

请从以下几个角度来写阅读想法：
1. 对故事情节发展的看法
2. 对主要人物的印象和评价
3. 对作者写作手法的感受
4. 个人的情感共鸣或思考
5. 对后续情节的期待

要求：
- 字数控制在1000字左右
- 语言自然流畅，体现真实的阅读感受
- 避免过于学术化的表达
- 可以包含一些个人的情感色彩
"""

    try:
        # 调用AI生成阅读想法
        response = client.chat(
            message=prompt,
            model="moonshot-v1-8k",
            use_search=False
        )
        
        # 提取AI回复
        thoughts = client.get_last_response(response)
        return thoughts
        
    except Exception as e:
        print(f"❌ 生成阅读想法失败: {e}")
        return None

def save_reading_thoughts(memory_db: MySQLClient, novel_id: int, novel_name: str, thoughts: str):
    """
    保存阅读想法到数据库
    
    Args:
        memory_db: 记忆数据库连接
        novel_id: 小说ID
        novel_name: 小说名称
        thoughts: 阅读想法内容
        chapters_count: 本次阅读的章节数量
        
    Returns:
        bool: 是否保存成功
    """
    query = """
    INSERT INTO reading_thoughts (novel_id, novel_name, thoughts, created_at)
    VALUES (%s, %s, %s, NOW())
    """
    
    result = memory_db.execute_query(query, (novel_id, novel_name, thoughts))
    return result["success"]

def process_book_reading_completion(db: MySQLClient, memory_db: MySQLClient, client: MLLMClient, novel_id: int, novel_name: str):
    """
    处理书籍阅读完成，生成并保存阅读想法
    
    Args:
        db: 主数据库连接
        memory_db: 记忆数据库连接
        client: MLLM客户端
        novel_id: 小说ID
        novel_name: 小说名称
        
    Returns:
        bool: 是否处理成功
    """
    print(f"\n📝 开始为《{novel_name}》生成阅读想法...")
    
    
    # 生成阅读想法
    thoughts = generate_reading_thoughts(db, memory_db, client, novel_id, novel_name)
    
    if not thoughts:
        print(f"   ❌ 阅读想法生成失败")
        return False
    
    # 保存阅读想法
    success = save_reading_thoughts(memory_db, novel_id, novel_name, thoughts)
    
    if success:
        print(f"   ✅ 阅读想法保存成功")
        print(f"   💭 想法内容预览: {thoughts[:100]}...")
        return True
    else:
        print(f"   ❌ 阅读想法保存失败")
        return False