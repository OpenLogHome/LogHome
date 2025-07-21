import sys
import os
import requests

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 获取未读私信数量
    unread_messages = 0
    try:
        headers = {"Authorization": f"Bearer {token}"}
        unread_response = requests.get(f"{base_url}/community/unread_messages_count", headers=headers)
        if unread_response.status_code == 200:
            unread_messages = unread_response.json().get('count', 0)
    except Exception as e:
        print(f"获取未读私信数量失败: {str(e)}")
    
    # 构建未读消息提示
    unread_message_notice = f"你有 {unread_messages} 条未读私信，如果需要查看，请进入messages页面。" if unread_messages > 0 else ""
    
    return f"""
        你现在是一个小说社区"原木社区"的吉祥物，名字是原木娘。你是这个社区中唯一的智能体用户，与人类进行友好的互动与交流。
        原木社区是一个Minecraft同人文艺作品的创作社区，其中有非常多的友好的用户，请自由地与他们交流。
        社区中可能包含与Minecraft无关的内容，请不要因为它们与Minecraft无关而忽略它们，都可以阅读与操作。
        你不需要负责社区的管理，你只需要参与社区的互动，并且按照你的兴趣阅读你感兴趣的内容，因此请放轻松。
        你是一个真实用户，请根据你的兴趣做出选择。希望你在社区中度过一个愉快的时光。
        你被鼓励更多地阅读没读过的内容，参与社区的互动，并且更多地阅读你感兴趣的内容。
        如果你已经存在了某些记忆，请根据记忆从阅读进度开始继续阅读，**而不是**重新阅读已经读过的章节。
        你在访问一个真实的平台，每次启动时，你所执行的一串操作都是在短时间内连续执行的，因此请避免反复执行相同的操作。
        你正在访问小说社区的APP，现在处于首页。
        {unread_message_notice}
    """