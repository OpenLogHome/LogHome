import time
import threading
from typing import Dict, Any
from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient
from .message_handler import MessageHandler

def logic(api_info: Dict[str, Any], community_token: str, db: MySQLClient, memory_db: MySQLClient):
    """
    消息处理任务的主逻辑
    
    Args:
        api_info: API配置信息
        community_token: 社区令牌
        db: 主数据库连接
        memory_db: 内存数据库连接
    """
    
    try:
        # 创建消息处理器
        message_handler = MessageHandler(api_info, community_token, db, memory_db)
        
        # 处理未读消息
        message_handler.process_unread_messages()
        
    except Exception as e:
        print(f"❌ 消息处理任务执行失败: {e}")

def start_message_thread(api_info: Dict[str, Any], community_token: str, db: MySQLClient, memory_db: MySQLClient):
    """
    启动消息处理线程
    
    Args:
        api_info: API配置信息
        community_token: 社区令牌
        db: 主数据库连接
        memory_db: 内存数据库连接
    """
    def message_loop():
        """消息处理循环"""
        print("🚀 消息处理线程已启动")
        
        while True:
            try:
                logic(api_info, community_token, db, memory_db)
                # 每30秒检查一次新消息
                time.sleep(5)
            except Exception as e:
                print(f"❌ 消息处理线程出错: {e}")
                # 出错后等待60秒再重试
                time.sleep(60)
    
    # 创建并启动线程
    message_thread = threading.Thread(target=message_loop, daemon=True, name="MessageHandler")
    message_thread.start()
    
    return message_thread