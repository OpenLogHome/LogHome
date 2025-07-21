import requests
import json
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 需要article_id参数
    if 'article_id' not in params:
        return "错误：缺少必要参数article_id"
    
    article_id = params['article_id']
    page = params.get('page', 1)  # 默认第1页
    page_size = 10  # 每页显示10条评论
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 获取文章基本信息
        article_response = requests.get(f"{base_url}/articles/get_article_info?id={article_id}")
        if article_response.status_code != 200:
            return f"获取文章信息失败: {article_response.status_code}"
        
        article_info = article_response.json()[0] if article_response.json() else {}
        
        # 获取小说信息
        novel_id = article_info.get('novel_id')
        novel_info = {}
        if novel_id:
            novel_response = requests.get(f"{base_url}/library/get_novel_by_id?id={novel_id}")
            if novel_response.status_code == 200 and novel_response.json():
                novel_info = novel_response.json()[0]
        
        # 获取评论总数 - 使用小说评论接口，但指定article_id
        count_response = requests.get(f"{base_url}/community/novel_commonts_amount?id={novel_id}&articleId={article_id}")
        if count_response.status_code != 200:
            return f"获取评论总数失败: {count_response.status_code}"
        
        total_count = count_response.json()[0]['COUNT(*)'] if count_response.json() else 0
        total_pages = (total_count + page_size - 1) // page_size if total_count > 0 else 1
        
        # 获取评论列表 - 使用小说评论接口，但指定article_id
        comments_response = requests.get(f"{base_url}/community/novel_commonts_all?id={novel_id}&articleId={article_id}&page={page}&pageSize={page_size}")
        if comments_response.status_code != 200:
            return f"获取评论列表失败: {comments_response.status_code}"
        
        comments = comments_response.json()
        
        # 格式化评论信息
        formatted_comments = []
        for comment in comments:
            formatted_comment = comment.copy()
            
            # 格式化评论时间
            if 'comment_time' in formatted_comment and formatted_comment['comment_time']:
                if 'T' in formatted_comment['comment_time']:
                    formatted_comment['comment_time'] = TimeFormatter.format_relative_time(formatted_comment['comment_time'])
            
            # 获取段落信息
            if formatted_comment.get('cento_id') and formatted_comment['cento_id']:
                try:
                    # 使用评论中的cento信息
                    cento_info = formatted_comment.get('cento', {})
                    if cento_info:
                        formatted_comment['paragraph_info'] = {
                            'paragraph': cento_info.get('paragraph', ''),
                            'paragraph_id': cento_info.get('paragraph_id', '')
                        }
                except Exception as e:
                    formatted_comment['paragraph_info'] = {'error': str(e)}
            
            # 获取回复评论
            if formatted_comment.get('essay_comment_id'):
                try:
                    replies_response = requests.get(
                        f"{base_url}/community/novel_commonts_reply_to?id={formatted_comment['essay_comment_id']}"
                    )
                    if replies_response.status_code == 200:
                        replies = replies_response.json()
                        # 格式化回复时间
                        for reply in replies:
                            if 'create_time' in reply and reply['create_time']:
                                if 'T' in reply['create_time']:
                                    reply['create_time'] = TimeFormatter.format_relative_time(reply['create_time'])
                        formatted_comment['replies'] = replies
                    else:
                        formatted_comment['replies'] = []
                except:
                    formatted_comment['replies'] = []
            
            # 确定评论类型
            comment_type = "章节评论"
            if formatted_comment.get('cento_id') and formatted_comment['cento_id']:
                comment_type = "段落评论"
            formatted_comment['comment_type'] = comment_type
            
            formatted_comments.append(formatted_comment)
        
        # 构建评论展示信息
        comments_display = {
            "novel_info": {
                "name": novel_info.get('name', '未知标题'),
                "author_name": novel_info.get('author_name', '未知作者')
            },
            "article_info": {
                "title": article_info.get('title', '未知章节'),
                "chapter": article_info.get('article_chapter', '未知章节号')
            },
            "pagination": {
                "current_page": page,
                "total_pages": total_pages,
                "total_count": total_count,
                "page_size": page_size
            },
            "comments": formatted_comments
        }
        
        comments_json = json.dumps(comments_display, ensure_ascii=False, indent=2)
        
        # 构建页面信息
        page_info = f"""
        你打开了小说《{novel_info.get('name', '未知标题')}》章节《{article_info.get('title', '未知章节')}》的评论页面:
        
        章节信息:
        - 小说: {novel_info.get('name', '未知标题')}
        - 作者: {novel_info.get('author_name', '未知作者')}
        - 章节: {article_info.get('title', '未知章节')}
        - 章节号: 第{article_info.get('article_chapter', '未知')}章
        
        分页信息:
        - 当前页: {page}/{total_pages}
        - 总评论数（不包括回复）: {total_count}
        - 每页显示: {page_size}条评论
        
        评论列表:
        {comments_json}
        
        注意：评论可能包含两种类型：
        - 章节评论：针对整个章节的评论
        - 段落评论：针对特定段落的评论，会显示段落内容和上下文
        """
        
        return page_info
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        你打开了章节评论页面，但加载失败了。
        错误信息: {str(e)}
        
        你可以返回章节页面或重试。
        """ 