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
    page = params.get('page', 1)  # 默认第1页
    page_size = 10  # 每页显示10条评论
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 获取小说基本信息
        novel_response = requests.get(f"{base_url}/library/get_novel_by_id?id={novel_id}")
        if novel_response.status_code != 200:
            return f"获取小说信息失败: {novel_response.status_code}"
        
        novel_info = novel_response.json()[0] if novel_response.json() else {}
        
        # 获取评论总数
        count_response = requests.get(f"{base_url}/community/novel_commonts_amount?id={novel_id}")
        if count_response.status_code != 200:
            return f"获取评论总数失败: {count_response.status_code}"
        
        total_count = count_response.json()[0]['COUNT(*)'] if count_response.json() else 0
        total_pages = (total_count + page_size - 1) // page_size
        
        # 获取评论列表
        comments_response = requests.get(f"{base_url}/community/novel_commonts_all?id={novel_id}&page={page}&pageSize={page_size}")
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

            # 获取章节信息
            article_info = None
            if formatted_comment.get('article_id') and formatted_comment['article_id']:
                try:
                    article_resp = requests.get(f"{base_url}/articles/get_article_info?id={formatted_comment['article_id']}")
                    if article_resp.status_code == 200:
                        article_data = article_resp.json()
                        if article_data and isinstance(article_data, list):
                            article_info = article_data[0]
                            formatted_comment['article_info'] = {
                                'title': article_info.get('title', ''),
                                'chapter': article_info.get('article_chapter', ''),
                                'article_id': article_info.get('article_id', '')
                            }
                except Exception as e:
                    formatted_comment['article_info'] = {'error': str(e)}

            # 获取段落信息 - 修复版
            if formatted_comment.get('cento_id') and formatted_comment['cento_id'] and formatted_comment.get('cento'):
                try:
                    # 直接使用评论中的cento字段
                    cento_info = formatted_comment['cento']
                    if cento_info:
                        # 获取段落内容
                        paragraph_text = cento_info.get('paragraph', '')
                        paragraph_id = cento_info.get('paragraph_id', '')
                        
                        # 如果有文章ID，尝试获取完整文章内容以获取更多上下文
                        context_before = ""
                        context_after = ""
                        if formatted_comment.get('article_id'):
                            try:
                                article_content_resp = requests.get(f"{base_url}/articles/get_article?id={formatted_comment['article_id']}")
                                if article_content_resp.status_code == 200 and article_content_resp.json():
                                    article_content_data = article_content_resp.json()[0]
                                    if 'content' in article_content_data:
                                        content = json.loads(article_content_data.get('content', '[]'))
                                        # 找到当前段落的位置
                                        for i, para in enumerate(content):
                                            if para.get('id') == paragraph_id or para.get('value') == paragraph_text:
                                                # 获取前后文
                                                if i > 0:
                                                    context_before = content[i-1].get('value', '')[:100] + "..."
                                                if i < len(content) - 1:
                                                    context_after = "..." + content[i+1].get('value', '')[:100]
                                                break
                            except:
                                pass
                        
                        formatted_comment['cento_info'] = {
                            'paragraph': paragraph_text,
                            'paragraph_id': paragraph_id,
                            'context_before': context_before,
                            'context_after': context_after
                        }
                except Exception as e:
                    formatted_comment['cento_info'] = {'error': str(e)}
            elif formatted_comment.get('cento_id') and formatted_comment['cento_id']:
                # 如果有cento_id但没有cento字段，尝试获取段落信息
                try:
                    # 尝试从文章内容中查找段落
                    if formatted_comment.get('article_id'):
                        article_content_resp = requests.get(f"{base_url}/articles/get_article?id={formatted_comment['article_id']}")
                        if article_content_resp.status_code == 200 and article_content_resp.json():
                            article_content_data = article_content_resp.json()[0]
                            if 'content' in article_content_data:
                                content = json.loads(article_content_data.get('content', '[]'))
                                # 遍历段落，尝试找到匹配的cento_id
                                for para in content:
                                    if para.get('id') == formatted_comment.get('cento_id'):
                                        formatted_comment['cento_info'] = {
                                            'paragraph': para.get('value', ''),
                                            'paragraph_id': para.get('id', '')
                                        }
                                        break
                except Exception as e:
                    formatted_comment['cento_info'] = {'error': str(e)}

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
            comment_type = "小说评论"
            if formatted_comment.get('article_id') and formatted_comment['article_id']:
                if formatted_comment.get('cento_id') and formatted_comment['cento_id']:
                    comment_type = "段落评论"
                else:
                    comment_type = "章节评论"
            formatted_comment['comment_type'] = comment_type
            
            formatted_comments.append(formatted_comment)
        
        # 构建评论展示信息
        comments_display = {
            "novel_info": {
                "name": novel_info.get('name', '未知标题'),
                "author_name": novel_info.get('author_name', '未知作者')
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
        你打开了小说《{novel_info.get('name', '未知标题')}》的评论页面:
        
        小说信息:
        - 标题: {novel_info.get('name', '未知标题')}
        - 作者: {novel_info.get('author_name', '未知作者')}
        
        分页信息:
        - 当前页: {page}/{total_pages}
        - 总评论数: {total_count}
        - 每页显示: {page_size}条评论
        
        评论列表:
        {comments_json}
        
        注意：评论可能包含三种类型：
        - 小说评论：针对整本小说的评论
        - 章节评论：针对特定章节的评论，会显示章节标题和章节号
        - 段落评论：针对特定段落的评论，会显示段落内容和上下文
        """
        
        return page_info
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        你打开了小说评论页面，但加载失败了。
        错误信息: {str(e)}
        
        你可以返回小说页面或重试。
        """ 