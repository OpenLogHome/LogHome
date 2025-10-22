import mysql.connector
import json
import logging
from typing import Dict, List, Any, Union, Optional, Tuple

class MySQLClient:
    """
    MySQL数据库访问工具类，用于连接MySQL数据库、执行SQL语句并将结果转换为JSON格式
    """
    
    def __init__(self, host: str, user: str, password: str, database: str, port: int = 3306):
        """
        初始化MySQL客户端，配置数据库连接参数
        
        Args:
            host: 数据库主机地址
            user: 数据库用户名
            password: 数据库密码
            database: 数据库名称
            port: 数据库端口，默认为3306
        """
        self.config = {
            'host': host,
            'user': user,
            'password': password,
            'database': database,
            'port': port
        }
        self.connection = None
        self.logger = logging.getLogger(__name__)
        
    def connect(self) -> bool:
        """
        连接到MySQL数据库
        
        Returns:
            bool: 连接成功返回True，失败返回False
        """
        try:
            self.connection = mysql.connector.connect(**self.config)
            return True
        except mysql.connector.Error as err:
            self.logger.error(f"数据库连接失败: {err}")
            return False
            
    def disconnect(self) -> None:
        """
        断开与数据库的连接
        """
        if self.connection and self.connection.is_connected():
            self.connection.close()
            
    def execute_query(self, query: str, params: Optional[tuple] = None) -> Dict[str, Any]:
        """
        执行查询SQL语句并返回结果
        
        Args:
            query: SQL查询语句
            params: 查询参数，用于参数化查询，防止SQL注入
            
        Returns:
            Dict: 包含查询结果的字典，格式为:
                {
                    "success": bool,
                    "data": List[Dict] 或 None,
                    "error": str 或 None,
                    "affected_rows": int 或 None
                }
        """
        result = {
            "success": False,
            "data": None,
            "error": None,
            "affected_rows": None
        }
        
        if not self.connection or not self.connection.is_connected():
            if not self.connect():
                result["error"] = "数据库未连接"
                return result
                
        try:
            cursor = self.connection.cursor(dictionary=True)
            if params:
                cursor.execute(query, params)
            else:
                cursor.execute(query)
                
            if query.strip().upper().startswith(("SELECT", "SHOW", "DESCRIBE", "EXPLAIN")):
                result["data"] = cursor.fetchall()
                result["success"] = True
            else:
                self.connection.commit()
                result["affected_rows"] = cursor.rowcount
                result["success"] = True
                
            cursor.close()
            
        except mysql.connector.Error as err:
            self.logger.error(f"执行SQL失败: {err}")
            result["error"] = str(err)
            if self.connection:
                self.connection.rollback()
                
        return result
        
    def execute_many(self, query: str, params_list: List[tuple]) -> Dict[str, Any]:
        """
        批量执行SQL语句
        
        Args:
            query: 包含占位符的SQL语句
            params_list: 参数列表，每个元素对应一次执行的参数
            
        Returns:
            Dict: 包含执行结果的字典
        """
        result = {
            "success": False,
            "error": None,
            "affected_rows": None
        }
        
        if not self.connection or not self.connection.is_connected():
            if not self.connect():
                result["error"] = "数据库未连接"
                return result
                
        try:
            cursor = self.connection.cursor()
            cursor.executemany(query, params_list)
            self.connection.commit()
            
            result["affected_rows"] = cursor.rowcount
            result["success"] = True
            cursor.close()
            
        except mysql.connector.Error as err:
            self.logger.error(f"批量执行SQL失败: {err}")
            result["error"] = str(err)
            if self.connection:
                self.connection.rollback()
                
        return result
        
    def to_json(self, data: Any) -> str:
        """
        将数据转换为JSON字符串
        
        Args:
            data: 要转换的数据
            
        Returns:
            str: JSON格式的字符串
        """
        return json.dumps(data, ensure_ascii=False, default=str)
        
    def query_to_json(self, query: str, params: Optional[tuple] = None) -> str:
        """
        执行查询并将结果直接转换为JSON字符串
        
        Args:
            query: SQL查询语句
            params: 查询参数
            
        Returns:
            str: JSON格式的查询结果
        """
        result = self.execute_query(query, params)
        if result["success"]:
            return self.to_json(result["data"])
        else:
            raise Exception(result["error"])
