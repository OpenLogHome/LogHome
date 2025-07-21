#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from datetime import datetime
from log_manager import LogManager
from time_formatter import TimeFormatter

def print_logs(logs, title="日志记录"):
    """打印日志记录"""
    print(f"\n=== {title} ===")
    if not logs:
        print("暂无记录")
        return
    
    for i, log in enumerate(logs, 1):
        print(f"\n--- 记录 {i} ---")
        print(f"页面: {log['page_name']}")
        print(f"操作: {log['operation'] or '无'}")
        print(f"状态: {log['status']}")
        
        # 格式化时间显示
        created_at = log['created_at']
        if created_at and isinstance(created_at, str) and 'T' in created_at:
            created_at = TimeFormatter.format_relative_time(created_at)
        print(f"时间: {created_at}")
        
        print(f"能量变化: {log['energy_before']} -> {log['energy_after']}")
        
        if log['reason']:
            print(f"原因: {log['reason']}")
        
        if log['memory_created']:
            print(f"记忆创建: 是")
            if log['memory_content']:
                print(f"记忆内容: {log['memory_content'][:100]}...")
        
        if log['error_message']:
            print(f"错误信息: {log['error_message']}")

def main():
    # 数据库配置
    db_config = {
        "host": "sql.ricepastem.cafe",
        "port": 20345,
        "user": "loghome_agent",
        "password": "loghome_agent250712",
        "database": "loghome_agent"
    }
    
    log_manager = LogManager(db_config)
    
    while True:
        print("\n=== 日志查看工具 ===")
        print("1. 查看最近的日志")
        print("2. 查看指定页面的日志")
        print("3. 查看指定操作的日志")
        print("4. 查看错误日志")
        print("5. 查看统计信息")
        print("6. 清理旧日志")
        print("0. 退出")
        
        choice = input("\n请选择操作 (0-6): ").strip()
        
        if choice == "0":
            break
        elif choice == "1":
            limit = input("请输入记录数量限制 (默认10): ").strip()
            limit = int(limit) if limit.isdigit() else 10
            logs = log_manager.get_recent_logs(limit)
            print_logs(logs, f"最近 {len(logs)} 条日志")
        elif choice == "2":
            page_name = input("请输入页面名称: ").strip()
            if page_name:
                limit = input("请输入记录数量限制 (默认10): ").strip()
                limit = int(limit) if limit.isdigit() else 10
                logs = log_manager.get_logs_by_page(page_name, limit)
                print_logs(logs, f"页面 '{page_name}' 的日志")
            else:
                print("页面名称不能为空")
        elif choice == "3":
            operation = input("请输入操作名称: ").strip()
            if operation:
                limit = input("请输入记录数量限制 (默认10): ").strip()
                limit = int(limit) if limit.isdigit() else 10
                logs = log_manager.get_logs_by_operation(operation, limit)
                print_logs(logs, f"操作 '{operation}' 的日志")
            else:
                print("操作名称不能为空")
        elif choice == "4":
            limit = input("请输入记录数量限制 (默认10): ").strip()
            limit = int(limit) if limit.isdigit() else 10
            logs = log_manager.get_error_logs(limit)
            print_logs(logs, f"错误日志 (最近 {len(logs)} 条)")
        elif choice == "5":
            stats = log_manager.get_statistics()
            print("\n=== 统计信息 ===")
            print(f"总操作数: {stats.get('total_operations', 0)}")
            print(f"错误操作数: {stats.get('error_operations', 0)}")
            print(f"记忆创建数: {stats.get('memory_creations', 0)}")
            print(f"成功率: {stats.get('success_rate', 0)}%")
            
            print("\n最常用的页面:")
            for page in stats.get('top_pages', []):
                print(f"  {page['page_name']}: {page['count']} 次")
            
            print("\n最常用的操作:")
            for op in stats.get('top_operations', []):
                print(f"  {op['operation']}: {op['count']} 次")
        elif choice == "6":
            days = input("请输入保留天数 (默认30): ").strip()
            days = int(days) if days.isdigit() else 30
            confirm = input(f"确定要清理 {days} 天前的日志吗? (y/N): ").strip().lower()
            if confirm == 'y':
                success = log_manager.cleanup_old_logs(days)
                if success:
                    print("清理完成")
                else:
                    print("清理失败")
            else:
                print("取消清理")
        else:
            print("无效选择")

if __name__ == "__main__":
    main() 