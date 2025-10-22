import requests

base_url = "https://loghomeservice.codesocean.top"

def like_book(community_token: str, book_id: str):
    """
    点赞书籍
    
    Args:
        community_token: 社区令牌
        book_id: 书籍ID
    """
    headers = {"Authorization": f"Bearer {community_token}"}

    is_niced = False
    try:
        nice_response = requests.get(f"{base_url}/library/get_nice_status?id={book_id}", headers=headers)
        if nice_response.status_code == 200:
            nice_data = nice_response.json()
            is_niced = nice_data[0].get("nices", 0) > 0
        if is_niced:
            print(f"ID：{book_id}已被点赞！")
            return
    except Exception as e:
        print(f"获取小说点赞状态失败: {str(e)}")
        return
    
    try:
        # 调用点赞接口
        nice_response = requests.get(f"{base_url}/library/nice_novel?id={book_id}", headers=headers)
        
        if nice_response.status_code == 200:
            # 获取小说信息用于显示
            novel_response = requests.get(f"{base_url}/library/get_novel_by_id?id={book_id}")
            if novel_response.status_code == 200:
                novel_info = novel_response.json()[0] if novel_response.json() else {}
                novel_name = novel_info.get('name', '未知小说')
            else:
                novel_name = f"小说ID:{book_id}"
            
            print(f"""
            你成功点赞了小说《{novel_name}》（ID：{book_id}）！
            """)
        else:
            print(f"""
            点赞小说失败，错误代码：{nice_response.status_code}
            """)
    except Exception as e:
        print(f"API调用异常: {str(e)}")