#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from datetime import datetime, timezone
import re
from typing import Optional

class TimeFormatter:
    """时间格式化工具"""
    
    @staticmethod
    def parse_iso_time(iso_time_str: str) -> Optional[datetime]:
        """
        解析ISO时间字符串
        
        Args:
            iso_time_str: ISO时间字符串，如 "2024-05-26T08:40:24.000Z"
            
        Returns:
            datetime对象，如果解析失败返回None
        """
        try:
            # 移除毫秒部分，因为某些Python版本可能不支持
            iso_time_str = re.sub(r'\.\d+Z$', 'Z', iso_time_str)
            
            # 处理不同的时间格式
            if iso_time_str.endswith('Z'):
                # UTC时间，转换为+00:00格式
                dt = datetime.fromisoformat(iso_time_str.replace('Z', '+00:00'))
            elif '+' in iso_time_str or '-' in iso_time_str[-6:]:
                # 已经有时区信息
                dt = datetime.fromisoformat(iso_time_str)
            else:
                # 没有时区信息，假设为UTC时间
                dt = datetime.fromisoformat(iso_time_str + '+00:00')
            
            # 确保返回的datetime是带时区的
            if dt.tzinfo is None:
                dt = dt.replace(tzinfo=timezone.utc)
            
            return dt
        except Exception as e:
            print(f"解析时间失败: {iso_time_str}, 错误: {str(e)}")
            return None
    
    @staticmethod
    def format_relative_time(iso_time_str: str) -> str:
        """
        将ISO时间格式转换为相对时间描述
        
        Args:
            iso_time_str: ISO时间字符串
            
        Returns:
            相对时间描述，如 "刚刚"、"5分钟前"、"2小时前" 等
        """
        # 解析时间
        target_time = TimeFormatter.parse_iso_time(iso_time_str)
        if not target_time:
            return "未知时间"
        
        # 获取当前时间（确保带时区）
        now = datetime.now(timezone.utc)
        
        # 确保两个时间都是带时区的
        if target_time.tzinfo is None:
            target_time = target_time.replace(tzinfo=timezone.utc)
        if now.tzinfo is None:
            now = now.replace(tzinfo=timezone.utc)
        
        # 计算时间差
        time_diff = now - target_time
        total_seconds = time_diff.total_seconds()
        
        # 如果是未来时间
        if total_seconds < 0:
            return "刚刚"
        
        # 转换为相对时间描述
        if total_seconds < 60:
            return "刚刚"
        elif total_seconds < 3600:  # 1小时
            minutes = int(total_seconds // 60)
            return f"{minutes}分钟前"
        elif total_seconds < 86400:  # 1天
            hours = int(total_seconds // 3600)
            return f"{hours}小时前"
        elif total_seconds < 604800:  # 1周
            days = int(total_seconds // 86400)
            return f"{days}天前"
        elif total_seconds < 2592000:  # 30天
            weeks = int(total_seconds // 604800)
            return f"{weeks}周前"
        elif total_seconds < 31536000:  # 1年
            months = int(total_seconds // 2592000)
            return f"{months}个月前"
        else:
            years = int(total_seconds // 31536000)
            return f"{years}年前"
    
    @staticmethod
    def format_time_list(time_list: list) -> list:
        """
        批量格式化时间列表
        
        Args:
            time_list: 包含ISO时间字符串的列表
            
        Returns:
            格式化后的时间列表
        """
        formatted_list = []
        for item in time_list:
            if isinstance(item, dict):
                # 如果是字典，查找并格式化时间字段
                formatted_item = item.copy()
                for key, value in item.items():
                    if isinstance(value, str) and ('time' in key.lower() or 'date' in key.lower() or 'created' in key.lower() or 'updated' in key.lower()):
                        if 'T' in value and ('Z' in value or '+' in value):
                            formatted_item[key] = TimeFormatter.format_relative_time(value)
                formatted_list.append(formatted_item)
            else:
                formatted_list.append(item)
        return formatted_list
    
    @staticmethod
    def format_memory_time(memory_data: dict) -> dict:
        """
        格式化记忆数据中的时间
        
        Args:
            memory_data: 记忆数据字典
            
        Returns:
            格式化后的记忆数据
        """
        if not memory_data:
            return memory_data
        
        formatted_memory = memory_data.copy()
        
        # 格式化创建时间
        if 'created_at' in formatted_memory and formatted_memory['created_at']:
            formatted_memory['created_at'] = TimeFormatter.format_relative_time(formatted_memory['created_at'])
        
        # 格式化更新时间
        if 'updated_at' in formatted_memory and formatted_memory['updated_at']:
            formatted_memory['updated_at'] = TimeFormatter.format_relative_time(formatted_memory['updated_at'])
        
        return formatted_memory
    
    @staticmethod
    def format_reading_record_time(record_data: dict) -> dict:
        """
        格式化阅读记录中的时间
        
        Args:
            record_data: 阅读记录数据字典
            
        Returns:
            格式化后的阅读记录数据
        """
        if not record_data:
            return record_data
        
        formatted_record = record_data.copy()
        
        # 格式化阅读时间
        if 'read_time' in formatted_record and formatted_record['read_time']:
            formatted_record['read_time'] = TimeFormatter.format_relative_time(formatted_record['read_time'])
        
        # 格式化创建时间
        if 'created_at' in formatted_record and formatted_record['created_at']:
            formatted_record['created_at'] = TimeFormatter.format_relative_time(formatted_record['created_at'])
        
        # 格式化更新时间
        if 'updated_at' in formatted_record and formatted_record['updated_at']:
            formatted_record['updated_at'] = TimeFormatter.format_relative_time(formatted_record['updated_at'])
        
        return formatted_record
    
    @staticmethod
    def format_log_time(log_data: dict) -> dict:
        """
        格式化日志数据中的时间
        
        Args:
            log_data: 日志数据字典
            
        Returns:
            格式化后的日志数据
        """
        if not log_data:
            return log_data
        
        formatted_log = log_data.copy()
        
        # 格式化创建时间
        if 'created_at' in formatted_log and formatted_log['created_at']:
            formatted_log['created_at'] = TimeFormatter.format_relative_time(formatted_log['created_at'])
        
        return formatted_log

# 便捷函数
def format_time(iso_time_str: str) -> str:
    """便捷函数：格式化单个时间字符串"""
    return TimeFormatter.format_relative_time(iso_time_str)

def format_memories(memories: list) -> list:
    """便捷函数：格式化记忆列表"""
    return [TimeFormatter.format_memory_time(memory) for memory in memories]

def format_reading_records(records: list) -> list:
    """便捷函数：格式化阅读记录列表"""
    return [TimeFormatter.format_reading_record_time(record) for record in records]

def format_logs(logs: list) -> list:
    """便捷函数：格式化日志列表"""
    return [TimeFormatter.format_log_time(log) for log in logs] 