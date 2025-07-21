import requests
import json
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 需要article_id和content参数
    if 'article_id' not in params:
        return "错误：缺少必要参数article_id"
    
    if 'content' not in params:
        return "错误：缺少必要参数content"
    
    article_id = params['article_id']
    content = params['content']
    paragraph_id = params.get('paragraph_id', -1)  # 可选参数，段落ID，默认为-1表示整章评论
    reply_to_comment_id = params.get('reply_to_comment_id')  # 可选参数，回复的评论ID
    
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
        
        # 如果是段落评论，获取段落内容
        paragraph_info = ""
        if paragraph_id != -1:
            try:
                # 获取文章内容以找到段落
                article_content_resp = requests.get(f"{base_url}/articles/get_article?id={article_id}")
                if article_content_resp.status_code == 200 and article_content_resp.json():
                    article_content_data = article_content_resp.json()[0]
                    if 'content' in article_content_data:
                        content_array = json.loads(article_content_data.get('content', '[]'))
                        # 找到目标段落
                        for para in content_array:
                            if para.get('id') == paragraph_id:
                                paragraph_text = para.get('value', '')
                                paragraph_info = f"段落内容: {paragraph_text[:100]}..." if len(paragraph_text) > 100 else paragraph_text
                                break
            except Exception as e:
                paragraph_info = f"获取段落信息失败: {str(e)}"
        
        # 如果是回复评论，获取被回复的评论信息
        reply_comment_info = ""
        if reply_to_comment_id and reply_to_comment_id != -1:
            try:
                reply_response = requests.get(f"{base_url}/community/novel_commonts_all?id={novel_id}&articleId={article_id}&page=1&pageSize=100")
                if reply_response.status_code == 200:
                    comments = reply_response.json()
                    for comment in comments:
                        if comment.get('essay_comment_id') == reply_to_comment_id:
                            reply_comment_info = f"回复评论: {comment.get('content', '')[:50]}..."
                            break
            except:
                pass
        
        # 提交评论 - 使用小说评论接口
        comment_data = {
            "novel_id": novel_id,
            "content": content,
            "article_id": article_id,
            "paragraph_id": paragraph_id
        }
        
        # 如果是回复评论，添加回复相关信息
        if reply_to_comment_id:
            comment_data["essay_comment_id"] = reply_to_comment_id
            comment_data["fatherId"] = reply_to_comment_id
        
        # 发送评论请求
        if reply_to_comment_id:
            # 回复评论
            comment_response = requests.post(
                f"{base_url}/community/reply_to_novel_comment",
                headers=headers,
                data=comment_data
            )
        else:
            # 新评论
            comment_response = requests.post(
                f"{base_url}/community/comment_on_novel",
                headers=headers,
                data=comment_data
            )
        
        if comment_response.status_code != 200:
            print(comment_response.text)
            return f"提交评论失败: {comment_response.status_code}"
        
        comment_result = comment_response.json()
        
        # 格式化提交时间
        submit_time = TimeFormatter.format_relative_time(comment_result.get('create_time', '')) if comment_result.get('create_time') else '刚刚'
        
        # 确定评论类型
        comment_type = "章节评论"
        if paragraph_id != -1:
            comment_type = "段落评论"
        
        # 构建成功信息
        success_info = f"""
        评论提交成功！不太可能立刻收到回复，现在你可以返回去看看别的内容哦~
        
        章节信息:
        - 小说: {novel_info.get('name', '未知标题')}
        - 作者: {novel_info.get('author_name', '未知作者')}
        - 章节: {article_info.get('title', '未知章节')}
        - 章节号: 第{article_info.get('article_chapter', '未知')}章
        
        评论信息:
        - 评论类型: {comment_type}
        - 评论内容: {content}
        - 提交时间: {submit_time}
        - 评论ID: {comment_result.get('essay_comment_id', '未知')}
        """
        
        if paragraph_id != -1:
            success_info += f"""
        段落信息:
        - 段落ID: {paragraph_id}
        - {paragraph_info}
        """
        
        if reply_to_comment_id:
            success_info += f"""
        回复信息:
        - 回复的评论ID: {reply_to_comment_id}
        - {reply_comment_info}
        """
        
        return success_info
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        提交评论失败。
        错误信息: {str(e)}
        
        你可以返回章节页面或重试。
        """ 