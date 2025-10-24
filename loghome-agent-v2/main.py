import sys
import os
import time
import threading
import logging
from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient
from utils.task_scheduler import TaskScheduler, TaskConfig, TaskType
from secret import DB_CONFIG, MEMORY_DB_CONFIG, API_INFO, COMMUNITY_TOKEN

sys.path.append(os.path.join(os.path.dirname(__file__), 'utils'))

# 任务配置
TASK_CONFIGS = [
    TaskConfig(
        name="read_and_interact",
        task_type=TaskType.ACTIVE,
        module_path="read_and_interact",
        interval_hours=6.0,  # 每6小时执行一次
        enabled=True,
        run_immediately=False  # 可以设置为True来立即启动阅读任务
    ),
    TaskConfig(
        name="private_messages",
        task_type=TaskType.PASSIVE,
        module_path="private_messages",
        enabled=True
    )
]

def main():
    print("🚀 LogHome Agent v2 启动中...")
    
    # 初始化数据库连接
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
    
    # 创建任务调度器
    scheduler = TaskScheduler()
    
    # 添加任务配置
    for config in TASK_CONFIGS:
        scheduler.add_task(config)
    
    print(f"📋 已配置 {len(TASK_CONFIGS)} 个任务:")
    for config in TASK_CONFIGS:
        task_type_desc = "主动任务" if config.task_type == TaskType.ACTIVE else "被动任务"
        interval_desc = f"(每{config.interval_hours}小时)" if config.task_type == TaskType.ACTIVE else "(空闲时执行)"
        print(f"  - {config.name}: {task_type_desc} {interval_desc}")
    
    try:
        # 启动任务调度器
        print("🔄 启动任务调度器...")
        
        # 根据任务类型传递不同的参数
        # 统一使用 API_INFO
        scheduler.start(API_INFO, COMMUNITY_TOKEN, db, memory_db)
        
        print("✅ 任务调度器已启动，系统正在运行...")
        print("📊 系统状态:")
        print(f"  - 主动任务: {len([c for c in TASK_CONFIGS if c.task_type == TaskType.ACTIVE])} 个")
        print(f"  - 被动任务: {len([c for c in TASK_CONFIGS if c.task_type == TaskType.PASSIVE])} 个")
        print("  - 调度策略: 主动任务按时间间隔执行，被动任务在空闲时执行")
        print("  - 并发控制: 同时只能有一个任务执行")
        
        # 主线程保持运行
        while True:
            time.sleep(60)  # 每分钟检查一次
            
            # 可以在这里添加状态监控
            status = scheduler.get_status()
            if status["current_task"]:
                print(f"🔄 当前执行任务: {status['current_task']}")
                
    except KeyboardInterrupt:
        print("\n🛑 接收到停止信号，正在关闭系统...")
        scheduler.stop()
        print("✅ 系统已安全关闭")
    except Exception as e:
        print(f"❌ 系统运行出错: {e}")
        scheduler.stop()
        raise

if __name__ == "__main__":
    main()