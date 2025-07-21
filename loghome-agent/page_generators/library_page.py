import requests
import json
import random
import sys
import os

# 添加父目录到路径以导入memory_manager
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from tools.memory_manager import MemoryManager
from tools.time_formatter import TimeFormatter

def generate_page(token: str, base_url: str, params: dict, memory_manager: MemoryManager | None = None, reading_record_manager=None):
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        # 获取原木力爆棚推荐小说
        popular_response = requests.get(f"{base_url}/library/recommand/get_library_recommend_titles?title=原木力爆棚", headers=headers)
        if popular_response.status_code == 200:
            popular_novels = popular_response.json()[:6]  # 限制显示前6本
        else:
            print(f"获取原木力爆棚小说失败: {popular_response.status_code}")
            popular_novels = []
        
        # 获取最近更新小说
        recent_response = requests.get(f"{base_url}/library/recommand/get_library_recommend_titles?title=最近更新", headers=headers)
        if recent_response.status_code == 200:
            recent_novels = recent_response.json()[:6]  # 限制显示前6本
        else:
            print(f"获取最近更新小说失败: {recent_response.status_code}")
            recent_novels = []
        
        # 展示随机推荐的小说
        response = requests.get(f"{base_url}/library/get_novels_all", headers=headers)
        if response.status_code == 200:
            all_novels = response.json()
            # 过滤掉已经在其他推荐中出现的小说
            existing_ids = set([n.get("novel_id") for n in popular_novels + recent_novels])
            random_novels = [n for n in all_novels if n.get("novel_id") not in existing_ids and n["novel_type"] == "novel"][:6]
        else:
            print(f"获取推荐小说失败: {response.status_code}")
            random_novels = []
        
        # 处理原木力爆棚小说
        popular_display = []
        for novel in popular_novels:
            novel_id = novel.get("novel_id")
            novel_info = {
                "novel_id": novel_id,
                "name": novel.get("name", "未知标题"),
                "author": novel.get("user_name", "未知作者"),
                "description": novel.get("content", "暂无简介")[:50] + "..." if novel.get("content", "") else "暂无简介",
                "update_time": TimeFormatter.format_relative_time(novel.get("update_time", "未知更新时间")),
                "ranking": novel.get("ranking", "未知")
            }
            
            # 获取小说相关记忆
            if memory_manager and novel_id:
                novel_memories = memory_manager.get_memories_text("novel", str(novel_id), 2)
                if novel_memories:
                    novel_info["memories"] = novel_memories
            
            popular_display.append(novel_info)
        
        # 处理最近更新小说
        recent_display = []
        for novel in recent_novels:
            novel_id = novel.get("novel_id")
            novel_info = {
                "novel_id": novel_id,
                "name": novel.get("name", "未知标题"),
                "author": novel.get("user_name", "未知作者"),
                "description": novel.get("content", "暂无简介")[:50] + "..." if novel.get("content", "") else "暂无简介",
                "update_time": TimeFormatter.format_relative_time(novel.get("update_time", "未知更新时间"))
            }
            
            # 获取小说相关记忆
            if memory_manager and novel_id:
                novel_memories = memory_manager.get_memories_text("novel", str(novel_id), 2)
                if novel_memories:
                    novel_info["memories"] = novel_memories
            
            recent_display.append(novel_info)
        
        # 处理随机推荐小说
        random_display = []
        for novel in random_novels:
            novel_id = novel.get("novel_id")
            novel_info = {
                "novel_id": novel_id,
                "name": novel.get("name", "未知标题"),
                "author": novel.get("author_name", "未知作者"),
                "description": novel.get("content", "暂无简介")[:50] + "..." if novel.get("content", "") else "暂无简介",
                "update_time": TimeFormatter.format_relative_time(novel.get("update_time", "未知更新时间"))
            }
            
            # 获取小说相关记忆
            if memory_manager and novel_id:
                novel_memories = memory_manager.get_memories_text("novel", str(novel_id), 2)
                if novel_memories:
                    novel_info["memories"] = novel_memories
            
            random_display.append(novel_info)
        
        # 选择特别推荐小说
        all_recommendations = []
        if popular_display:
            all_recommendations.extend([(novel, "原木力爆棚") for novel in popular_display])
        if recent_display:
            all_recommendations.extend([(novel, "最近更新") for novel in recent_display])
        if random_display:
            all_recommendations.extend([(novel, "随机推荐") for novel in random_display])
        
        special_recommendation = None
        if all_recommendations:
            selected_novel, source = random.choice(all_recommendations)
            special_recommendation = {
                "novel": selected_novel,
                "source": source,
                "recommendation_reason": f"这是从{source}中特别挑选的推荐作品，推荐你今天一定要读它！！"
            }
        
        # 构建页面内容
        page_content = f"""
        你正在浏览小说社区的书库页面。
        """
        
        if special_recommendation:
            page_content += f"""
        
        【特别推荐】{special_recommendation['source']}精选:
        {special_recommendation['recommendation_reason']}
        {json.dumps(special_recommendation['novel'], ensure_ascii=False, indent=2)}
        """
        
        page_content += f"""
    
        """

        # 【原木力爆棚】热门作品:
        # {json.dumps(popular_display, ensure_ascii=False, indent=2)}
        
        # 【最近更新】最近更新的作品:
        # {json.dumps(recent_display, ensure_ascii=False, indent=2)}
        
        # 【随机推荐】你可能感兴趣:
        # {json.dumps(random_display, ensure_ascii=False, indent=2)}
        
        return page_content
        
    except Exception as e:
        print(f"API调用异常: {str(e)}")
        return f"""
        你打开了书库页面，但加载失败了。
        错误信息: {str(e)}
        
        你可以刷新页面或返回首页。
        """ 