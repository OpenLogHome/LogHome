from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient
import json
import re

def select_book(db: MySQLClient, memory_db: MySQLClient):
    """
    根据指定逻辑挑选最多3本书阅读
    
    STEP 1: 选出所有最近更新的10本书
    STEP 2: 按顺序过滤，如果存在章节无阅读记录，或阅读记录时间晚于更新时间，则选中该书
    STEP 4: STEP 1 中的所有书都未被选中，则所有书按阅读量降序依次检查，重复STEP 2
    
    Returns:
        List: 选中的书籍列表，最多3本
    """
    selected_books = []
    
    # STEP 1: 选出最近更新的10本书
    recent_books = get_recent_updated_books(db, 10)
    
    # STEP 2: 按顺序过滤最近更新的书籍
    for book in recent_books:
        if len(selected_books) >= 3:
            break
        if should_read_book(db, memory_db, book):
            selected_books.append(book)
    
    # STEP 4: 如果选中的书籍不足3本，按阅读量降序检查所有书籍
    if len(selected_books) < 3:
        page_size = 100
        offset = 0
        
        while len(selected_books) < 3:
            # 分页获取书籍
            books_page = get_all_books_by_clicks(db, limit=page_size, offset=offset)
            
            if not books_page:
                # 没有更多书籍了，退出循环
                break
            
            for book in books_page:
                if len(selected_books) >= 3:
                    break
                # 避免重复选择
                if not any(selected['novel_id'] == book['novel_id'] for selected in selected_books):
                    if should_read_book(db, memory_db, book):
                        selected_books.append(book)
            
            # 准备下一页
            offset += page_size
    
    return selected_books


def get_recent_updated_books(db: MySQLClient, limit: int = 10):
    """
    获取最近更新的书籍
    
    Args:
        db: 数据库连接
        limit: 返回数量限制
        
    Returns:
        List: 最近更新的书籍列表
    """
    query = """
    SELECT * FROM novels 
    WHERE deleted = 0 
    ORDER BY update_time DESC 
    LIMIT %s
    """
    result = db.execute_query(query, (limit,))
    return result["data"] if result["success"] else []


def get_all_books_by_clicks(db: MySQLClient, limit: int = 100, offset: int = 0):
    """
    分页获取书籍，按阅读量降序排列
    
    Args:
        db: 数据库连接
        limit: 每页数量，默认100
        offset: 偏移量，默认0
        
    Returns:
        List: 按阅读量降序排列的书籍列表
    """
    query = """
    SELECT * FROM novels 
    WHERE deleted = 0 
    ORDER BY clicks DESC
    LIMIT %s OFFSET %s
    """
    result = db.execute_query(query, (limit, offset))
    return result["data"] if result["success"] else []


def should_read_book(db: MySQLClient, memory_db: MySQLClient, book):
    """
    判断是否应该阅读某本书
    
    检查逻辑：如果存在章节无阅读记录，或阅读记录时间晚于更新时间，则应该阅读
    
    Args:
        db: 主数据库连接
        memory_db: 记忆数据库连接
        book: 书籍信息
        
    Returns:
        bool: 是否应该阅读
    """
    novel_id = book['novel_id']
    
    # 获取该书的所有章节
    chapters_query = """
    SELECT article_id, update_time 
    FROM articles 
    WHERE novel_id = %s AND deleted = 0 AND is_draft = 0
    ORDER BY article_chapter ASC
    """
    chapters_result = db.execute_query(chapters_query, (novel_id,))
    
    if not chapters_result["success"] or not chapters_result["data"]:
        return False  # 没有章节，不需要阅读
    
    chapters = chapters_result["data"]
    
    # 检查每个章节的阅读记录
    for chapter in chapters:
        article_id = chapter['article_id']
        chapter_update_time = chapter['update_time']
        
        # 查询该章节的阅读记录
        read_record_query = """
        SELECT read_time 
        FROM reading_records 
        WHERE article_id = %s
        """
        read_result = memory_db.execute_query(read_record_query, (article_id,))
        
        if not read_result["success"] or not read_result["data"]:
            # 没有阅读记录，应该阅读
            return True
        
        read_time = read_result["data"][0]['read_time']
        
        # 如果阅读记录时间早于章节更新时间，应该重新阅读
        if read_time < chapter_update_time:
            return True
    
    # 所有章节都已阅读且是最新的
    return False


def mark_chapter_as_read(memory_db: MySQLClient, novel_id: int, article_id: int):
    """
    标记章节为已阅读
    
    Args:
        memory_db: 记忆数据库连接
        novel_id: 小说ID
        article_id: 章节ID
    """
    insert_query = """
    INSERT INTO reading_records (novel_id, article_id, read_time) 
    VALUES (%s, %s, NOW())
    ON DUPLICATE KEY UPDATE read_time = NOW()
    """
    result = memory_db.execute_query(insert_query, (novel_id, article_id))
    return result["success"]


def parse_chapter_text_content(content_json: str):
    """
    解析章节内容JSON并统计字数
    
    Args:
        content_json: 章节内容的JSON字符串
        
    Returns:
        tuple: (解析后的内容列表, 总字数)
    """
    try:
        content_list = json.loads(content_json)
        total_chars = 0
        
        for item in content_list:
            if item.get('type') == 'text' and 'value' in item:
                # 统计文本字数（去除空白字符）
                text_content = item['value'].strip()
                total_chars += len(text_content)
        
        return content_list, total_chars
    except (json.JSONDecodeError, TypeError):
        return [], 0


def get_chapters_to_read(db: MySQLClient, memory_db: MySQLClient, books: list, max_chars: int = 10000):
    """
    为选中的书籍获取需要阅读的章节，确保总字数不超过限制
    
    Args:
        db: 主数据库连接
        memory_db: 记忆数据库连接
        books: 选中的书籍列表
        max_chars: 最大字数限制，默认2万字
        
    Returns:
        list: 需要阅读的章节列表，包含章节信息和字数
    """
    chapters_to_read = []
    total_chars = 0
    
    for book in books:
        novel_id = book['novel_id']
        
        # 获取该书需要阅读的章节
        book_chapters = get_unread_chapters_for_book(db, memory_db, novel_id)
        
        for chapter in book_chapters:
            # 解析章节内容并统计字数
            content_list, chapter_chars = parse_chapter_text_content(chapter['content'])
            
            # 检查是否超过字数限制
            if total_chars > max_chars:
                break
            
            # 添加章节信息
            chapter_info = {
                'novel_id': novel_id,
                'novel_name': book['name'],
                'article_id': chapter['article_id'],
                'title': chapter['title'],
                'content': content_list,
                'char_count': chapter_chars,
                'update_time': chapter['update_time']
            }
            
            chapters_to_read.append(chapter_info)
            total_chars += chapter_chars
            
            # 如果达到字数限制，停止添加
            if total_chars >= max_chars:
                break
        
        # 如果已经达到字数限制，不再处理其他书籍
        if total_chars >= max_chars:
            break
    
    return chapters_to_read


def get_unread_chapters_for_book(db: MySQLClient, memory_db: MySQLClient, novel_id: int):
    """
    获取某本书需要阅读的章节（未读或需要重新阅读的）
    
    Args:
        db: 主数据库连接
        memory_db: 记忆数据库连接
        novel_id: 小说ID
        
    Returns:
        list: 需要阅读的章节列表
    """
    # 获取该书的所有章节，按章节顺序排列
    chapters_query = """
    SELECT article_id, title, content, update_time, article_chapter
    FROM articles 
    WHERE novel_id = %s AND deleted = 0 AND is_draft = 0
    ORDER BY article_chapter ASC
    """
    chapters_result = db.execute_query(chapters_query, (novel_id,))
    
    if not chapters_result["success"] or not chapters_result["data"]:
        return []
    
    chapters = chapters_result["data"]
    unread_chapters = []
    
    for chapter in chapters:
        article_id = chapter['article_id']
        chapter_update_time = chapter['update_time']
        
        # 查询该章节的阅读记录
        read_record_query = """
        SELECT read_time 
        FROM reading_records 
        WHERE article_id = %s
        """
        read_result = memory_db.execute_query(read_record_query, (article_id,))
        
        should_read = False
        
        if not read_result["success"] or not read_result["data"]:
            # 没有阅读记录，需要阅读
            should_read = True
        else:
            read_time = read_result["data"][0]['read_time']
            # 如果阅读记录时间早于章节更新时间，需要重新阅读
            if read_time < chapter_update_time:
                should_read = True
        
        if should_read:
            unread_chapters.append(chapter)
    
    return unread_chapters


def extract_full_text_from_chapter_content(chapter_title: str,content_list, api_info: dict = None):
    """
    从章节内容列表中提取纯文本和图片描述
    
    Args:
        content_list: 章节内容列表
        api_info: API配置信息，用于创建MLLM客户端处理图片
        
    Returns:
        str: 提取的纯文本内容（包含图片描述）
    """
    text_parts = []
    text_parts.append(f"章节标题：{chapter_title}")
    
    for item in content_list:
        if item.get('type') == 'text' and 'value' in item:
            text_parts.append(item['value'].strip())
        elif item.get('type') == 'image' and 'img' in item and image_client:
            # 为图片分析创建单独的MLLM客户端
            if api_info:
                image_client = MLLMClient(**api_info)
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
    
    return '\n'.join(text_parts)
