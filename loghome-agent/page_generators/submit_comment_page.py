import requests
import json
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 需要novel_id和content参数
    if 'novel_id' not in params:
        return "错误：缺少必要参数novel_id"
    
    if 'content' not in params:
        return "错误：缺少必要参数content"
    
    novel_id = params['novel_id']
    content = params['content']
    reply_to_comment_id = params.get('reply_to_comment_id')  # 可选参数，回复的评论ID
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 获取小说基本信息
        novel_response = requests.get(f"{base_url}/library/get_novel_by_id?id={novel_id}")
        if novel_response.status_code != 200:
            return f"获取小说信息失败: {novel_response.status_code}"
        
        novel_info = novel_response.json()[0] if novel_response.json() else {}
        
        # 如果是回复评论，获取被回复的评论信息
        reply_comment_info = ""
        if reply_to_comment_id:
            try:
                reply_response = requests.get(f"{base_url}/community/novel_commonts_all?id={novel_id}&page=1&pageSize=1")
                if reply_response.status_code == 200:
                    comments = reply_response.json()
                    for comment in comments:
                        if comment.get('essay_comment_id') == reply_to_comment_id:
                            reply_comment_info = f"回复评论: {comment.get('content', '')[:50]}..."
                            break
            except:
                pass
        
        # 提交评论
        comment_data = {
            "novel_id": novel_id,
            "content": content,
            "article_id": 0,  # 0表示小说评论，其他表示章节评论
            "paragraph_id": -1  # 非-1表示段落评论
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
        
        # 构建成功信息
        success_info = f"""
        评论提交成功！不太可能立刻收到回复，现在你可以返回去看看别的内容哦~
        
        小说信息:
        - 标题: {novel_info.get('name', '未知标题')}
        - 作者: {novel_info.get('author_name', '未知作者')}
        
        评论信息:
        - 评论内容: {content}
        - 提交时间: {submit_time}
        - 评论ID: {comment_result.get('essay_comment_id', '未知')}
        """
        
        if reply_to_comment_id:
            success_info += f"""
        回复信息:
        - 回复的评论ID: {reply_to_comment_id}
        - 回复的评论内容: {reply_comment_info}
        """
        
        return success_info
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        提交评论失败。
        错误信息: {str(e)}
        
        你可以返回小说页面或重试。
        """ 