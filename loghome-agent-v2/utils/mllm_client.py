import requests
import json
import logging
import os
from datetime import datetime
from typing import List, Dict, Any, Optional, Union

class MLLMClient:
    """
    A client for interacting with Kimi AI API that follows OpenAI's chat completion API format.
    
    This client supports:
    - Multi-turn conversations
    - Text chat completions
    - Document interpretation
    - Image processing
    - Automatic logging of all interactions
    """
    
    def __init__(self, api_key: str, base_url: str = "https://api.moonshot.cn"):
        """
        Initialize the KimiClient.
        
        Args:
            api_key: The API key (refresh token) for authentication
            base_url: The base URL for the API (default: https://api.moonshot.cn)
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.conversation_id = None
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # 设置日志
        self._setup_logging()
    
    def _setup_logging(self):
        """设置日志配置，每次启动程序时创建新的日志文件"""
        # 确保logs目录存在
        logs_dir = "./logs"
        if not os.path.exists(logs_dir):
            os.makedirs(logs_dir)
        
        # 创建基于时间戳的日志文件名
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        log_filename = f"{logs_dir}/mllm_interactions_{timestamp}.log"
        
        # 配置日志记录器
        self.logger = logging.getLogger(f"MLLMClient_{timestamp}")
        self.logger.setLevel(logging.INFO)
        
        # 避免重复添加处理器
        if not self.logger.handlers:
            # 创建文件处理器
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
        
        # 记录初始化信息
        self.logger.info("MLLMClient initialized")
        self.logger.info(f"Base URL: {self.base_url}")
        self.logger.info(f"Log file: {log_filename}")
    
    def chat(self, message: str, model: str = "kimi", use_search: bool = False, 
             stream: bool = False) -> Dict[str, Any]:
        """
        Send a text message and get a response.
        
        Args:
            message: The message to send
            model: The model to use (default: "kimi")
            use_search: Whether to enable web search (default: False)
            stream: Whether to use streaming response (default: False)
            
        Returns:
            The response from the API
        """
        # 记录请求信息
        self.logger.info("=" * 50)
        self.logger.info("CHAT REQUEST")
        self.logger.info(f"Message: {message}")
        self.logger.info(f"Model: {model}")
        self.logger.info(f"Use Search: {use_search}")
        self.logger.info(f"Stream: {stream}")
        self.logger.info(f"Conversation ID: {self.conversation_id}")
        
        # Prepare request data
        request_data = {
            "model": model,
            "messages": [{"role": "user", "content": message}],
            "use_search": use_search,
            "stream": stream
        }
        
        # Add conversation_id if we have one, else use "none" for first message
        if self.conversation_id:
            request_data["conversation_id"] = self.conversation_id
        else:
            request_data["conversation_id"] = "none"
            
        # Make the API call
        response = requests.post(
            f"{self.base_url}/v1/chat/completions",
            headers=self.headers,
            json=request_data
        )
        
        # Parse the response
        result = response.json()
        
        # 记录响应信息
        self.logger.info("CHAT RESPONSE")
        self.logger.info(f"Status Code: {response.status_code}")
        if "choices" in result and len(result["choices"]) > 0:
            if "message" in result["choices"][0]:
                response_content = result["choices"][0]["message"]["content"]
                self.logger.info(f"Response: {response_content}")
        if "id" in result:
            self.logger.info(f"New Conversation ID: {result['id']}")
        if "error" in result:
            self.logger.error(f"API Error: {result['error']}")
        self.logger.info("=" * 50)
        
        # Store conversation ID if available
        if "id" in result:
            self.conversation_id = result["id"]
            
        return result
    
    def analyze_document(self, file_url: str, query: str = "Please analyze this document", 
                         model: str = "kimi", use_search: bool = False) -> Dict[str, Any]:
        """
        Analyze a document from a URL.
        
        Args:
            file_url: The URL of the document to analyze
            query: The query about the document (default: "Please analyze this document")
            model: The model to use (default: "kimi")
            use_search: Whether to enable web search (default: False)
            
        Returns:
            The response from the API
        """
        # 记录文档分析请求信息
        self.logger.info("=" * 50)
        self.logger.info("DOCUMENT ANALYSIS REQUEST")
        self.logger.info(f"File URL: {file_url}")
        self.logger.info(f"Query: {query}")
        self.logger.info(f"Model: {model}")
        self.logger.info(f"Use Search: {use_search}")
        self.logger.info(f"Conversation ID: {self.conversation_id}")
        
        content = [
            {
                "type": "file",
                "file_url": {
                    "url": file_url
                }
            },
            {
                "type": "text",
                "text": query
            }
        ]
        
        # Prepare request data
        request_data = {
            "model": model,
            "messages": [{"role": "user", "content": content}],
            "use_search": use_search
        }
        
        # Add conversation_id if we have one, else use "none" for first message
        if self.conversation_id:
            request_data["conversation_id"] = self.conversation_id
        else:
            request_data["conversation_id"] = "none"
            
        # Make the API call
        response = requests.post(
            f"{self.base_url}/v1/chat/completions",
            headers=self.headers,
            json=request_data
        )
        
        # Parse the response
        result = response.json()
        
        # 记录文档分析响应信息
        self.logger.info("DOCUMENT ANALYSIS RESPONSE")
        self.logger.info(f"Status Code: {response.status_code}")
        if "choices" in result and len(result["choices"]) > 0:
            if "message" in result["choices"][0]:
                response_content = result["choices"][0]["message"]["content"]
                self.logger.info(f"Response: {response_content}")
        if "id" in result:
            self.logger.info(f"New Conversation ID: {result['id']}")
        if "error" in result:
            self.logger.error(f"API Error: {result['error']}")
        self.logger.info("=" * 50)
        
        # Store conversation ID if available
        if "id" in result:
            self.conversation_id = result["id"]
            
        return result
    
    def analyze_image(self, image_url: str, query: str = "Please describe this image", 
                      model: str = "kimi", use_search: bool = False) -> Dict[str, Any]:
        """
        Analyze an image from a URL.
        
        Args:
            image_url: The URL of the image to analyze
            query: The query about the image (default: "Please describe this image")
            model: The model to use (default: "kimi")
            use_search: Whether to enable web search (default: False)
            
        Returns:
            The response from the API
        """
        # 记录图像分析请求信息
        self.logger.info("=" * 50)
        self.logger.info("IMAGE ANALYSIS REQUEST")
        self.logger.info(f"Image URL: {image_url}")
        self.logger.info(f"Query: {query}")
        self.logger.info(f"Model: {model}")
        self.logger.info(f"Use Search: {use_search}")
        self.logger.info(f"Conversation ID: {self.conversation_id}")
        
        content = [
            {
                "type": "image_url",
                "image_url": {
                    "url": image_url
                }
            },
            {
                "type": "text",
                "text": query
            }
        ]
        
        # Prepare request data
        request_data = {
            "model": model,
            "messages": [{"role": "user", "content": content}],
            "use_search": use_search
        }
        
        # Add conversation_id if we have one, else use "none" for first message
        if self.conversation_id:
            request_data["conversation_id"] = self.conversation_id
        else:
            request_data["conversation_id"] = "none"
            
        # Make the API call
        response = requests.post(
            f"{self.base_url}/v1/chat/completions",
            headers=self.headers,
            json=request_data
        )
        
        # Parse the response
        result = response.json()
        
        # 记录图像分析响应信息
        self.logger.info("IMAGE ANALYSIS RESPONSE")
        self.logger.info(f"Status Code: {response.status_code}")
        if "choices" in result and len(result["choices"]) > 0:
            if "message" in result["choices"][0]:
                response_content = result["choices"][0]["message"]["content"]
                self.logger.info(f"Response: {response_content}")
        if "id" in result:
            self.logger.info(f"New Conversation ID: {result['id']}")
        if "error" in result:
            self.logger.error(f"API Error: {result['error']}")
        self.logger.info("=" * 50)
        
        # Store conversation ID if available
        if "id" in result:
            self.conversation_id = result["id"]
            
        return result
    
    def clear_conversation(self) -> None:
        """Reset the conversation by clearing conversation_id."""
        self.conversation_id = None
    
    def get_last_response(self, response_data: Dict[str, Any]) -> Optional[str]:
        """Get the response from the provided API response data.
        
        Args:
            response_data: The API response data
            
        Returns:
            The content of the assistant message, or None if no message found
        """
        if "choices" in response_data and len(response_data["choices"]) > 0:
            if "message" in response_data["choices"][0]:
                return response_data["choices"][0]["message"]["content"]
        return None