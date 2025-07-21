import requests
import json
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    article_id = params['article_id']
    headers = {"Authorization": f"Bearer {token}"}
    
    # 获取文章相关记忆
    article_memories = ""
    if memory_manager:
        article_memories = memory_manager.get_memories_text("article", str(article_id), 5)
    
    try:
        # 获取文章内容
        article_response = requests.get(f"{base_url}/articles/get_article?id={article_id}", headers=headers)
        if article_response.status_code != 200:
            return f"获取文章内容失败: {article_response.status_code}"
        
        article_data = article_response.json()[0] if article_response.json() else {}
        
        # 获取小说信息
        novel_id = article_data.get('novel_id')
        novel_info = {}
        if novel_id:
            novel_response = requests.get(f"{base_url}/library/get_novel_by_id?id={novel_id}")
            if novel_response.status_code == 200 and novel_response.json():
                novel_info = novel_response.json()[0]
        
        # 获取文章评论数量
        comment_count = 0
        try:
            comments_response = requests.get(f"{base_url}/articles/get_article_comment_amount?article_id={article_id}")
            if comments_response.status_code == 200 and comments_response.json():
                comment_count = comments_response.json()[0].get('count', 0)
        except:
            pass
        
        # 记录阅读行为
        try:
            requests.get(f"{base_url}/articles/novel_clicked?id={article_id}")
        except:
            pass
        
        # 获取前后章节
        prev_chapter = None
        next_chapter = None
        if novel_id:
            try:
                chapters_response = requests.get(f"{base_url}/library/get_articles?id={novel_id}")
                if chapters_response.status_code == 200:
                    all_chapters = chapters_response.json()
                    current_index = -1
                    for i, chapter in enumerate(all_chapters):
                        if str(chapter.get('article_id')) == str(article_id):
                            current_index = i
                            break
                    
                    if current_index > 0:
                        prev_chapter = all_chapters[current_index - 1]
                    if current_index >= 0 and current_index < len(all_chapters) - 1:
                        next_chapter = all_chapters[current_index + 1]
            except Exception as e:
                print(e)
                pass

        article_types = {"richtext": "普通章节", "spliter": "分卷大标题"}
        
        # 解析文章内容
        content_str = ""
        if(article_types[article_data["article_type"]] == "普通章节"):
            content = json.loads(article_data.get('content', ''))
            for para in content:
                if para["type"] == "text":
                    content_str = content_str + "\n" + f"(段落ID： {para['id']})" + para["value"]
                elif para["type"] == "image":
                    content_str = content_str + "\n" + f"(段落ID： {para['id']})" + "[图片]"
        
        # 章节信息
        update_time = article_data.get('update_time', '')
        if update_time and 'T' in update_time:
            update_time = TimeFormatter.format_relative_time(update_time)
        
        chapter_info = {
            "title": article_data.get('title', '未知标题'),
            "chapter": article_data.get('article_chapter', 0),
            "update_time": update_time,
            "word_count": len(content_str) if content_str else 0
        }
        
        # 构建记忆信息
        memory_info = ""
        if article_memories:
            memory_info = f"""
        
        关于这篇文章的记忆：
        {article_memories}
        """
        
        # 创建或更新阅读记录
        reading_info = ""
        if reading_record_manager:
            try:
                # 检查是否已有阅读记录
                existing_record = reading_record_manager.get_reading_record(article_id)
                
                if existing_record:
                    # 更新阅读记录，标记为已读完
                    reading_record_manager.mark_article_as_finished(article_id)
                    reading_info = f"""
        
        阅读记录：你第一次阅读这篇文章，阅读记录已更新。建议创建记忆，来记录这篇文章的主要内容和你的想法。
        """
                else:
                    # 创建新的阅读记录
                    reading_record_manager.create_reading_record(
                        article_id=article_id,
                        novel_id=novel_id,
                        read_duration=300,  # 假设阅读5分钟
                        read_progress=100.0,
                        is_finished=True
                    )
                    reading_info = f"""
        
        阅读记录：你再次阅读了这篇文章，阅读记录已更新。建议创建记忆，来记录你的最新想法。
        """
            except Exception as e:
                print(f"创建阅读记录失败: {str(e)}")
                reading_info = f"""
        
        阅读记录：创建阅读记录时出现错误，但不影响阅读。
        """
        
        return f"""
        你正在阅读小说《{novel_info.get('name', '未知小说')}》的章节:
        
        标题: {chapter_info['title']}
        章节序号: 第{chapter_info['chapter']}章
        更新时间: {chapter_info['update_time']}
        字数: {chapter_info['word_count']}
        章节类型：{article_types[article_data["article_type"]]}
        评论数: {comment_count}
        {"还没有评论噢，要不要去评论一下？" if comment_count == 0 else ("好多人在讨论哦，要不要参与一下？" if comment_count >= 3 else "")}
        
        内容:
        {content_str}

        上一章节：
        {prev_chapter}

        下一章节：
        {next_chapter}{memory_info}{reading_info}
        """
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        if e.__traceback__:
            print('文件', e.__traceback__.tb_frame.f_globals['__file__'])
            print('行号', e.__traceback__.tb_lineno)
        return f"""
        你打开了一个章节，但加载失败了。
        错误信息: {str(e)}
        
        你可以返回小说页面或重试。
        """