import requests
import json
import random
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 获取用户书架中的小说
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 调用API获取用户收藏的小说列表
        response = requests.get(f"{base_url}/bookcase/get_likes_of", headers=headers)
        if response.status_code == 200:
            books = response.json()
        else:
            print(f"获取书架数据失败: {response.status_code}")
            books = []
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        books = []
    
    # 获取书籍的最新章节信息和记忆
    for book in books:
        try:
            # 使用TimeFormatter处理时间字段
            if 'create_time' in book:
                book['create_time_formatted'] = TimeFormatter.format_relative_time(book['create_time'])
            
            if 'update_time' in book:
                book['update_time_formatted'] = TimeFormatter.format_relative_time(book['update_time'])
            
            articles_response = requests.get(f"{base_url}/library/get_latest_articles?id={book['novel_id']}")
            if articles_response.status_code == 200:
                latest_articles = articles_response.json()
                book["new_chapters"] = len(latest_articles)
                if latest_articles:
                    book["latest_chapter"] = latest_articles[0]["title"]
                    # 如果最新章节有时间信息，也进行格式化
                    if 'create_time' in latest_articles[0]:
                        book["latest_chapter_time"] = TimeFormatter.format_relative_time(latest_articles[0]['create_time'])
            else:
                book["new_chapters"] = 0
        except Exception as e:
            print(f"获取小说章节异常: {str(e)}")
            book["new_chapters"] = 0
        
        # 获取小说相关记忆
        novel_id = book.get('novel_id')
        if memory_manager and novel_id:
            novel_memories = memory_manager.get_memories_text("novel", str(novel_id), 2)
            if novel_memories:
                book["memories"] = novel_memories
    
    # 构建书籍展示列表
    books_display = json.dumps(random.sample(books, min(5, len(books))), ensure_ascii=False, indent=2)
    
    return f"""
        你打开了书架，里面是你收藏的书籍。书架中有{len(books)}本书，以下是其中的一些：
        {books_display}
        
        你可以选择一本书进入查看详情，或者返回首页，也可以前往书库寻找更多的书籍。
    """