import requests
import json
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 获取私信好友列表
        response = requests.get(f"{base_url}/community/chat_friends", headers=headers)
        if response.status_code != 200:
            return f"获取私信好友列表失败: {response.status_code}"
        
        friends = response.json()
        
        # 格式化好友列表信息
        formatted_friends = []
        total_unread = 0
        for friend in friends:
            # 格式化最后消息时间
            last_message_time = friend.get('last_message_time', '')
            if last_message_time and 'T' in last_message_time:
                last_message_time = TimeFormatter.format_relative_time(last_message_time)

            total_unread += friend.get('unread_count', 0)
            
            formatted_friend = {
                "user_id": friend.get('user_id'),
                "name": friend.get('name', '未知用户'),
                "avatar_url": friend.get('avatar_url', ''),
                "last_message": friend.get('last_message_content', '')[:50] + ('...' if len(friend.get('last_message_content', '')) > 50 else ''),
                "last_message_time": last_message_time,
                "unread_count": friend.get('unread_count', 0)
            }
            
            formatted_friends.append(formatted_friend)
        
        # 构建页面内容
        if formatted_friends:
            friends_json = json.dumps(formatted_friends, ensure_ascii=False, indent=2)
            page_content = f"""
            你打开了私信列表页面。
            
            你有 {total_unread} 条未读私信。
            
            以下是你的私信联系人列表（优先显示有未读消息的用户）：
            {friends_json}
            
            你可以选择一个用户查看与他/她的私信对话，或者发送新的私信。
            """
        else:
            page_content = """
            你打开了私信列表页面。
            
            你目前没有任何私信联系人。
            
            你可以发送新的私信开始对话。
            """
        
        return page_content
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        你打开了私信列表页面，但加载失败了。
        错误信息: {str(e)}
        
        你可以返回首页或重试。
        """ 