import sys
import os
import time
from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient
from secret import DB_CONFIG, MEMORY_DB_CONFIG, API_INFO, COMMUNITY_TOKEN

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

if __name__ == "__main__":
    main()