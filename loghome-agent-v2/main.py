import sys
import os
import time
from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient

sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))



# 配置任务参数
TASKS = ["read_and_interact"]

def main():

    db = MySQLClient(
        host=DB_CONFIG["host"],
        port=DB_CONFIG["port"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        database=DB_CONFIG["database"]
    )
    db.connect()

    memory_db = MySQLClient(
        host=MEMORY_DB_CONFIG["host"],
        port=MEMORY_DB_CONFIG["port"],
        user=MEMORY_DB_CONFIG["user"],
        password=MEMORY_DB_CONFIG["password"],
        database=MEMORY_DB_CONFIG["database"]
    )
    memory_db.connect()
    
    while True:
        for task in TASKS:
            task_module = __import__(f"tasks.{task}.index", fromlist=["logic"])
            task_module.logic(API_INFO, COMMUNITY_TOKEN, db, memory_db)

        time.sleep(3600)

        # response = client.chat(
        #     message=user_input,
        #     model=GLM_MODEL,
        #     use_search=False
        # )
        
        # # 提取并显示回复
        # ai_response = client.get_last_response(response)
        # if ai_response:
        #     print(f"🤖 AI: {ai_response}")
        # else:
        #     print("❌ 未能获取有效回复")
        #     print(f"响应数据: {response}")

if __name__ == "__main__":
    main()