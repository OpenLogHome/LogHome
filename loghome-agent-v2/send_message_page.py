import requests
import json
import sys
import os
from datetime import datetime

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 需要to_id和message_content参数
    if 'to_id' not in params:
        return "错误：缺少必要参数to_id（接收者ID）"
    
    if 'message_content' not in params:
        return "错误：缺少必要参数message_content（消息内容）"
    
    to_id = params['to_id']
    message_content = params['message_content']
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 获取接收者信息
        user_response = requests.get(f"{base_url}/users/user_profile_of?id={to_id}")
        if user_response.status_code != 200:
            return f"获取用户信息失败: {user_response.status_code}"
        
        user_info = user_response.json()[0] if user_response.json() else {}
        
        # 发送私信
        message_data = {
            "to_id": to_id,
            "message_content": message_content
        }
        
        send_response = requests.post(
            f"{base_url}/community/send_message",
            headers=headers,
            json=message_data
        )
        
        if send_response.status_code != 200:
            return f"发送私信失败: {send_response.status_code}"
        
        result = send_response.json()
        message_id = result.get('id', '未知')
        
        # 获取当前时间
        current_time = TimeFormatter.format_relative_time(datetime.now().isoformat())
        
        # 构建成功信息
        success_info = f"""
        私信发送成功！
        
        接收者信息:
        - 用户名: {user_info.get('name', '未知用户')}
        - 用户ID: {to_id}
        
        消息信息:
        - 消息ID: {message_id}
        - 发送时间: {current_time if current_time else '刚刚'}
        - 消息内容: {message_content}
        
        你可以继续发送私信，或查看与该用户的私信对话历史。
        """
        
        return success_info
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        发送私信失败。
        错误信息: {str(e)}
        
        你可以返回私信列表或重试。
        """ 