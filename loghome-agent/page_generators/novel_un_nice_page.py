import requests
import json
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    # 需要novel_id参数
    if 'novel_id' not in params:
        return "错误：缺少必要参数novel_id"
    
    novel_id = params['novel_id']
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 调用取消点赞接口（使用相同的nice_novel接口，它会自动切换状态）
        nice_response = requests.get(f"{base_url}/library/nice_novel?id={novel_id}", headers=headers)
        
        if nice_response.status_code == 200:
            # 获取小说信息用于显示
            novel_response = requests.get(f"{base_url}/library/get_novel_by_id?id={novel_id}")
            if novel_response.status_code == 200:
                novel_info = novel_response.json()[0] if novel_response.json() else {}
                novel_name = novel_info.get('name', '未知小说')
            else:
                novel_name = f"小说ID:{novel_id}"
            
            return f"""
            你成功取消点赞了小说《{novel_name}》（ID：{novel_id}）。
            """
        else:
            print(nice_response)
            return f"""
            取消点赞小说失败，错误代码：{nice_response.status_code}
            """
            
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        取消点赞小说时发生错误：{str(e)}
        """ 