import requests
import json
import sys
import os
import traceback

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 需要friend_id参数
    if 'user_id' not in params:
        return "错误：缺少必要参数user_id"
    
    user_id = params['user_id']
    page_size = params.get('page_size', 100)  # 默认显示最近100条消息
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 获取好友信息
        user_response = requests.get(f"{base_url}/users/user_profile_of?id={user_id}")
        if user_response.status_code != 200:
            return f"获取用户信息失败: {user_response.status_code}"
        
        user_info = user_response.json()[0] if user_response.json() else {}
        
        # 获取消息历史
        messages_response = requests.get(
            f"{base_url}/community/message_history?friend_id={user_id}&pageSize={page_size}", 
            headers=headers
        )
        if messages_response.status_code != 200:
            return f"获取消息历史失败: {messages_response.status_code}"
        
        messages = messages_response.json()
        current_user_id = 250  # 原木娘的ID
        
        # 将未读消息标记为已读
        try:
            # 找出所有发给当前用户（原木娘）且未读的消息ID
            unread_messages = [msg for msg in messages if msg.get('sender_id') == user_id]
            
            # 逐个标记为已读
            for msg in unread_messages:
                mark_response = requests.post(
                    f"{base_url}/community/mark_as_read",
                    headers=headers,
                    data={"message_id": msg.get('id')}
                )
                if mark_response.status_code != 200:
                    print(f"标记消息 {msg.get('id')} 为已读失败: {mark_response.status_code}")
        except Exception as e:
            print(f"标记消息为已读失败: {str(e)}")
            print(traceback.format_exc())
        
        # 格式化消息
        formatted_messages = []
        
        for message in messages:
            # 判断消息方向
            is_from_me = message.get('sender_id') == current_user_id
            direction = "发送" if is_from_me else "接收"
            
            # 格式化时间
            sent_time = message.get('sent_at', '')
            if sent_time and 'T' in sent_time:
                sent_time = TimeFormatter.format_relative_time(sent_time)
            
            formatted_message = {
                "id": message.get('id'),
                "content": message.get('message_content', ''),
                "time": sent_time,
                "direction": direction,
                "is_read": message.get('is_read', False)
            }
            
            formatted_messages.append(formatted_message)
        
        # 构建页面内容
        if formatted_messages:
            messages_json = json.dumps(formatted_messages, ensure_ascii=False, indent=2)
            page_content = f"""
            你正在查看与 {user_info.get('name', '未知用户')} 的私信对话。
            请注意：请不要连续给用户发送多条消息，以避免对用户造成打扰！
            
            用户信息:
            - 用户名: {user_info.get('name', '未知用户')}
            - 用户ID: {user_id}
            
            最近的 {len(formatted_messages)} 条消息:
            {messages_json}
            
            所有未读消息已被标记为已读。
            你可以回复消息，或返回私信列表。
            """
        else:
            page_content = f"""
            你正在查看与 {user_info.get('name', '未知用户')} 的私信对话。
            
            用户信息:
            - 用户名: {user_info.get('name', '未知用户')}
            - 用户ID: {user_id}
            
            你们之间还没有任何消息记录。
            
            你可以发送第一条消息开始对话，或返回私信列表。
            """
        
        return page_content
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        print(traceback.format_exc())
        return f"""
        你打开了与用户ID {user_id} 的私信对话，但加载失败了。
        错误信息: {str(e)}
        
        你可以返回私信列表或重试。
        """ 