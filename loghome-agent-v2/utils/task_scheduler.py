import time
import threading
from typing import Dict, Any, List, Callable, Optional
from dataclasses import dataclass
from enum import Enum
import logging
import os

class TaskType(Enum):
    """任务类型枚举"""
    ACTIVE = "active"    # 主动任务：按时间间隔执行
    PASSIVE = "passive"  # 被动任务：在主动任务空闲时执行

@dataclass
class TaskConfig:
    """任务配置类"""
    name: str                    # 任务名称
    task_type: TaskType         # 任务类型
    module_path: str            # 任务模块路径
    interval_hours: float = 6.0 # 主动任务执行间隔（小时）
    enabled: bool = True        # 是否启用
    run_immediately: bool = False # 是否立即执行（仅对主动任务有效）

class TaskScheduler:
    """任务调度器"""
    
    def __init__(self):
        self.tasks: Dict[str, TaskConfig] = {}
        self.active_tasks: List[TaskConfig] = []
        self.passive_tasks: List[TaskConfig] = []
        self.current_task: Optional[str] = None
        self.task_lock = threading.Lock()
        self.running = False
        self.scheduler_thread: Optional[threading.Thread] = None
        self.last_execution_times: Dict[str, float] = {}
        
        # 设置日志 - 只输出到文件，不输出到控制台
        self.logger = logging.getLogger(__name__)
        self.logger.setLevel(logging.INFO)
        
        # 避免重复添加处理器
        if not self.logger.handlers:
            # 确保logs目录存在
            logs_dir = "./logs"
            if not os.path.exists(logs_dir):
                os.makedirs(logs_dir)
            
            # 创建文件处理器
            timestamp = time.strftime("%Y%m%d_%H%M%S")
            log_filename = f"{logs_dir}/task_scheduler_{timestamp}.log"
            file_handler = logging.FileHandler(log_filename, encoding='utf-8')
            file_handler.setLevel(logging.INFO)
            
            # 创建格式化器
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
                datefmt='%Y-%m-%d %H:%M:%S'
            )
            file_handler.setFormatter(formatter)
            
            # 添加处理器到记录器
            self.logger.addHandler(file_handler)
            
            # 防止日志传播到根记录器（避免输出到控制台）
            self.logger.propagate = False
        
    def add_task(self, config: TaskConfig):
        """添加任务配置"""
        self.tasks[config.name] = config
        
        if config.task_type == TaskType.ACTIVE:
            self.active_tasks.append(config)
        else:
            self.passive_tasks.append(config)
            
        self.logger.info(f"添加任务: {config.name} ({config.task_type.value})")
    
    def remove_task(self, task_name: str):
        """移除任务"""
        if task_name in self.tasks:
            config = self.tasks[task_name]
            del self.tasks[task_name]
            
            if config in self.active_tasks:
                self.active_tasks.remove(config)
            if config in self.passive_tasks:
                self.passive_tasks.remove(config)
                
            self.logger.info(f"移除任务: {task_name}")
    
    def is_task_running(self) -> bool:
        """检查是否有任务正在运行"""
        with self.task_lock:
            return self.current_task is not None
    
    def should_run_active_task(self, config: TaskConfig) -> bool:
        """判断主动任务是否应该执行"""
        if not config.enabled:
            return False
            
        current_time = time.time()
        last_run = self.last_execution_times.get(config.name, 0)
        
        # 如果设置了立即执行且从未执行过
        if config.run_immediately and last_run == 0:
            return True
            
        # 如果从未执行过且没有设置立即执行，则不执行
        if last_run == 0 and not config.run_immediately:
            return False
            
        # 检查是否到了执行时间
        interval_seconds = config.interval_hours * 3600
        return (current_time - last_run) >= interval_seconds
    
    def execute_task(self, config: TaskConfig, api_info, community_token, db, memory_db) -> bool:
        """执行单个任务"""
        with self.task_lock:
            if self.current_task is not None:
                self.logger.warning(f"任务 {config.name} 被跳过，当前正在执行: {self.current_task}")
                return False
                
            self.current_task = config.name
        
        try:
            self.logger.info(f"🚀 开始执行任务: {config.name}")
            start_time = time.time()
            
            # 动态导入任务模块
            task_module = __import__(f"tasks.{config.module_path}.index", fromlist=["logic"])
            
            # 统一使用 api_info 参数
            task_module.logic(api_info, community_token, db, memory_db)
            
            # 记录执行时间
            execution_time = time.time() - start_time
            self.last_execution_times[config.name] = time.time()
            
            self.logger.info(f"✅ 任务 {config.name} 执行完成，耗时: {execution_time:.2f}秒")
            return True
            
        except Exception as e:
            self.logger.error(f"❌ 任务 {config.name} 执行失败: {e}")
            return False
            
        finally:
            with self.task_lock:
                self.current_task = None
    
    def run_passive_tasks(self, api_info, community_token, db, memory_db):
        """运行被动任务（在主动任务空闲时）"""
        for config in self.passive_tasks:
            if not config.enabled:
                continue
                
            if self.is_task_running():
                break
                
            try:
                self.execute_task(config, api_info, community_token, db, memory_db)
                # 被动任务执行后短暂休息
                time.sleep(1)
            except Exception as e:
                self.logger.error(f"❌ 被动任务 {config.name} 执行出错: {e}")
                time.sleep(5)  # 出错后等待更长时间
    
    def scheduler_loop(self, api_info, community_token, db, memory_db):
        """调度器主循环"""
        self.logger.info("🔄 任务调度器启动")
        
        while self.running:
            try:
                # 检查并执行主动任务
                active_task_executed = False
                for config in self.active_tasks:
                    if self.should_run_active_task(config):
                        if self.execute_task(config, api_info, community_token, db, memory_db):
                            active_task_executed = True
                            break  # 一次只执行一个主动任务
                
                # 如果没有主动任务执行，运行被动任务
                if not active_task_executed and not self.is_task_running():
                    self.run_passive_tasks(api_info, community_token, db, memory_db)
                
                # 短暂休息后继续循环
                time.sleep(5)
                
            except Exception as e:
                self.logger.error(f"❌ 调度器循环出错: {e}")
                time.sleep(10)
        
        self.logger.info("🛑 任务调度器已停止")
    
    def start(self, api_info, community_token, db, memory_db):
        """启动调度器"""
        if self.running:
            self.logger.warning("调度器已在运行中")
            return
            
        self.running = True
        self.scheduler_thread = threading.Thread(
            target=self.scheduler_loop, 
            args=(api_info, community_token, db, memory_db),
            daemon=True,
            name="TaskScheduler"
        )
        self.scheduler_thread.start()
        self.logger.info("✅ 任务调度器已启动")
    
    def stop(self):
        """停止调度器"""
        self.running = False
        if self.scheduler_thread and self.scheduler_thread.is_alive():
            self.scheduler_thread.join(timeout=10)
        self.logger.info("🛑 任务调度器已停止")
    
    def get_status(self) -> Dict[str, Any]:
        """获取调度器状态"""
        return {
            "running": self.running,
            "current_task": self.current_task,
            "total_tasks": len(self.tasks),
            "active_tasks": len(self.active_tasks),
            "passive_tasks": len(self.passive_tasks),
            "last_execution_times": self.last_execution_times.copy()
        }
    
    def update_task_config(self, task_name: str, **kwargs):
        """更新任务配置"""
        if task_name not in self.tasks:
            raise ValueError(f"任务 {task_name} 不存在")
            
        config = self.tasks[task_name]
        
        # 更新配置属性
        for key, value in kwargs.items():
            if hasattr(config, key):
                setattr(config, key, value)
                self.logger.info(f"更新任务 {task_name} 的配置: {key} = {value}")
            else:
                self.logger.warning(f"任务 {task_name} 没有配置项: {key}")