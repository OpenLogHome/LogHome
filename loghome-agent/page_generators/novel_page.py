import requests
import json
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 需要novel_id参数
    if 'novel_id' not in params:
        return "错误：缺少必要参数novel_id"
    
    novel_id = params['novel_id']
    headers = {"Authorization": f"Bearer {token}"}
    
    # 获取小说相关记忆
    novel_memories = ""
    if memory_manager:
        novel_memories = memory_manager.get_memories_text("novel", str(novel_id), 5)
    
    # 构建记忆信息
    memory_info = ""
    if novel_memories:
        memory_info = f"""
        \n关于这本小说的记忆：
        {novel_memories}
        """
    
    try:
        # 获取小说详情
        novel_response = requests.get(f"{base_url}/library/get_novel_by_id?id={novel_id}")
        if novel_response.status_code != 200:
            return f"获取小说信息失败: {novel_response.status_code}"
        
        novel_info = novel_response.json()[0] if novel_response.json() else {}
        
        # 获取小说章节
        articles_response = requests.get(f"{base_url}/library/get_articles?id={novel_id}")
        if articles_response.status_code != 200:
            return f"获取章节列表失败: {articles_response.status_code}"
        
        chapters = articles_response.json()
        
        # 获取小说标签
        tags_response = requests.get(f"{base_url}/library/get_novel_tags?novel_id={novel_id}")
        if tags_response.status_code == 200:
            tags = tags_response.json()
            tag_names = ", ".join([tag.get("tag_name", "") for tag in tags])
        else:
            tag_names = "暂无标签"
            
        # 获取小说统计信息（阅读量、点赞等）
        try:
            stats_response = requests.get(f"{base_url}/articles/get_novel_statistics?novel_id={novel_id}")
            if stats_response.status_code == 200:
                stats = stats_response.json()
                clicks = sum(s.get("clicks", 0) for s in stats) if stats else 0
            else:
                clicks = 0
        except:
            clicks = 0
        
        # 获取评论数量信息
        total_comments = 0
        try:
            comments_count_response = requests.get(f"{base_url}/community/novel_commonts_amount?id={novel_id}")
            if comments_count_response.status_code == 200:
                total_comments = comments_count_response.json()[0]['COUNT(*)'] if comments_count_response.json() else 0
        except:
            pass
        
        # 检查用户是否收藏了这本书
        is_in_bookcase = False
        try:
            bookcase_response = requests.get(f"{base_url}/bookcase/get_likes_of", headers=headers)
            if bookcase_response.status_code == 200:
                user_books = bookcase_response.json()
                is_in_bookcase = any(book.get("novel_id") == novel_id for book in user_books)
        except:
            pass
        
        # 检查用户是否点赞了这本书
        is_niced = False
        try:
            nice_response = requests.get(f"{base_url}/library/get_nice_status?id={novel_id}", headers=headers)
            if nice_response.status_code == 200:
                nice_data = nice_response.json()
                is_niced = nice_data[0].get("nices", 0) > 0
        except:
            pass
        
        # 格式化小说更新时间
        novel_update_time = novel_info.get('update_time', '未知更新时间')
        if novel_update_time and novel_update_time != '未知更新时间' and 'T' in novel_update_time:
            novel_update_time = TimeFormatter.format_relative_time(novel_update_time)
        
        # 格式化章节时间并添加阅读记录信息
        formatted_chapters = []
        for chapter in chapters:
            formatted_chapter = chapter.copy()
            if 'update_time' in formatted_chapter and formatted_chapter['update_time']:
                if 'T' in formatted_chapter['update_time']:
                    formatted_chapter['update_time'] = TimeFormatter.format_relative_time(formatted_chapter['update_time'])
            
            # 获取章节的阅读记录
            reading_info = ""
            if reading_record_manager and 'article_id' in formatted_chapter:
                reading_record = reading_record_manager.get_reading_record(formatted_chapter['article_id'])
                if reading_record:
                    read_time = reading_record.get('read_time')
                    is_finished = reading_record.get('is_finished', False)
                    read_progress = reading_record.get('read_progress', 0)
                    
                    if read_time:
                        # 格式化阅读时间
                        if isinstance(read_time, str) and 'T' in read_time:
                            formatted_read_time = TimeFormatter.format_relative_time(read_time)
                        else:
                            formatted_read_time = str(read_time)
                        
                        status = "已读完" if is_finished else f"阅读进度 {read_progress}%"
                        reading_info = f"阅读状态: {status} (阅读于: {formatted_read_time})"
                    else:
                        reading_info = "阅读状态: 已开始阅读" if is_finished else "阅读状态: 未阅读"
                else:
                    reading_info = "阅读状态: 未阅读"
            else:
                reading_info = "阅读状态: 未阅读"
            
            formatted_chapter['reading_info'] = reading_info
            
            # 为每个章节提取相关记忆
            chapter_memories = ""
            if memory_manager and 'article_id' in formatted_chapter:
                chapter_memories = memory_manager.get_memories_text("article", str(formatted_chapter['article_id']), 3)
                if chapter_memories:
                    formatted_chapter['memories'] = f"相关记忆：{chapter_memories}"
                else:
                    formatted_chapter['memories'] = "暂无相关记忆"
            else:
                formatted_chapter['memories'] = "暂无相关记忆"
            
            formatted_chapters.append(formatted_chapter)
        
        # 构建章节展示列表
        chapters_display = formatted_chapters
        chapters_json = json.dumps(chapters_display, ensure_ascii=False, indent=2)
        
        # 格式化小说信息
        novel_summary = f"""
        《{novel_info.get('name', '未知标题')}》
        
        作者: {novel_info.get('author_name', '未知作者')}
        类型: {tag_names}
        阅读量: {clicks}
        总字数: {novel_info.get('text_count', 0)}字
        评论数: {total_comments}
        更新时间: {novel_update_time}
        收藏状态: {'已收藏' if is_in_bookcase else '未收藏'}
        每日点赞状态: {'今日已点赞' if is_niced else '今日未点赞'}
        
        简介: {novel_info.get('content', '暂无简介')}
        """
        
        return f"""
        你打开了一本小说的详情页面:
        
        {novel_summary}
        
        这本小说共有{len(chapters)}章节，每个章节都包含了相关的记忆信息和阅读记录。这些记忆记录了你在阅读这些章节时的想法、感受和重要发现，可以帮助你更好地理解小说内容和做出阅读决策:
        {chapters_json}{memory_info}
        """
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        你打开了一本小说，但加载失败了。
        错误信息: {str(e)}
        
        你可以返回书架或重试。
        """