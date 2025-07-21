import requests
import json
import os
from typing import List, Dict, Any, Optional, Union

class DoubaoClient:
    """
    A client for interacting with Doubao AI API that follows the same interface as MLLMClient.
    
    This client supports:
    - Multi-turn conversations
    - Text chat completions
    - Document interpretation
    - Image processing
    """
    
    def __init__(self, api_key: str, base_url: str = "http://localhost:8000"):
        """
        Initialize the DoubaoClient.
        
        Args:
            api_key: The API key for authentication (not used in Doubao API but kept for interface compatibility)
            base_url: The base URL for the API (default: http://localhost:8000)
        """
        self.api_key = api_key
        self.base_url = base_url.rstrip('/')
        self.conversation_id = None
        self.section_id = None
        self.headers = {
            "Content-Type": "application/json"
        }
        # Add Authorization header if API key is provided
        if api_key:
            self.headers["Authorization"] = f"Bearer {self.api_key}"
    
    def chat(self, message: str, model: str = "doubao", use_search: bool = False, use_deep_think: bool = False, use_auto_cot: bool = False,
             stream: bool = False) -> Dict[str, Any]:
        """
        Send a text message and get a response.
        
        Args:
            message: The message to send
            model: The model to use (not used in Doubao API but kept for interface compatibility)
            use_search: Whether to enable web search
            use_deep_think: Whether to enable deep thinking
            use_auto_cot: Whether to enable auto COT
            stream: Whether to use streaming response (not supported in Doubao API)
            
        Returns:
            The response from the API, reformatted to match MLLMClient's format
        """
        # Prepare request data
        request_data = {
            "prompt": message,
            "guest": False,
            "use_auto_cot": use_auto_cot,
            "use_deep_think": use_deep_think,
            "attachments": []
        }
        
        # Add conversation_id and section_id if we have them
        if self.conversation_id and self.section_id:
            request_data["conversation_id"] = self.conversation_id
            request_data["section_id"] = self.section_id
            
        # Make the API call
        response = requests.post(
            f"{self.base_url}/api/chat/completions",
            headers=self.headers,
            json=request_data
        )
        
        # Parse the response
        result = response.json()
        print(result)
        
        # Store conversation ID and section ID if available
        if "conversation_id" in result:
            self.conversation_id = result["conversation_id"]
        if "section_id" in result:
            self.section_id = result["section_id"]
            
        # Reformat the response to match MLLMClient format
        formatted_result = {
            "id": result.get("conversation_id", ""),
            "object": "chat.completion",
            "created": 0,
            "model": model,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": result.get("text", "")
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        }
        
        # Add any image URLs if present
        if "img_urls" in result and result["img_urls"]:
            formatted_result["img_urls"] = result["img_urls"]
            
        return formatted_result
    
    def analyze_document(self, file_url: str, query: str = "Please analyze this document", 
                         model: str = "doubao", use_search: bool = False) -> Dict[str, Any]:
        """
        Analyze a document from a URL.
        
        Args:
            file_url: The URL or path of the document to analyze
            query: The query about the document
            model: The model to use (not used in Doubao API but kept for interface compatibility)
            use_search: Whether to enable web search (maps to use_auto_cot in Doubao)
            
        Returns:
            The response from the API, reformatted to match MLLMClient's format
        """
        # For Doubao, we need to:
        # 1. Upload the file first
        # 2. Then send a chat message with the file attachment
        
        # Check if file_url is a local path or a URL
        if os.path.exists(file_url):
            # It's a local file, upload it
            file_info = self._upload_file(file_url)
        else:
            # It's a URL, we need to download it first and then upload
            response = requests.get(file_url)
            if response.status_code == 200:
                file_name = os.path.basename(file_url)
                file_type = self._get_file_type(file_name)
                file_info = self._upload_bytes(response.content, file_name, file_type)
            else:
                raise Exception(f"Failed to download file from {file_url}")
        
        # Now send a chat message with the file attachment
        request_data = {
            "prompt": query,
            "guest": False,
            "use_auto_cot": use_search,
            "use_deep_think": False,
            "attachments": [file_info]
        }
        
        # Add conversation_id and section_id if we have them
        if self.conversation_id and self.section_id:
            request_data["conversation_id"] = self.conversation_id
            request_data["section_id"] = self.section_id
        else:
            request_data["conversation_id"] = "0"
            request_data["section_id"] = ""  # Empty string instead of None
            
        # Make the API call
        response = requests.post(
            f"{self.base_url}/api/chat/completions",
            headers=self.headers,
            json=request_data
        )
        
        # Parse the response
        result = response.json()
        
        # Store conversation ID and section ID if available
        if "conversation_id" in result:
            self.conversation_id = result["conversation_id"]
        if "section_id" in result:
            self.section_id = result["section_id"]
            
        # Reformat the response to match MLLMClient format
        formatted_result = {
            "id": result.get("conversation_id", ""),
            "object": "chat.completion",
            "created": 0,
            "model": model,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": result.get("text", "")
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        }
        
        # Add any image URLs if present
        if "img_urls" in result and result["img_urls"]:
            formatted_result["img_urls"] = result["img_urls"]
            
        return formatted_result
    
    def analyze_image(self, image_url: str, query: str = "Please describe this image", 
                      model: str = "doubao", use_search: bool = False) -> Dict[str, Any]:
        """
        Analyze an image from a URL.
        
        Args:
            image_url: The URL or path of the image to analyze
            query: The query about the image
            model: The model to use (not used in Doubao API but kept for interface compatibility)
            use_search: Whether to enable web search (maps to use_auto_cot in Doubao)
            
        Returns:
            The response from the API, reformatted to match MLLMClient's format
        """
        # For Doubao, we need to:
        # 1. Upload the image first
        # 2. Then send a chat message with the image attachment
        
        # Check if image_url is a local path or a URL
        if os.path.exists(image_url):
            # It's a local file, upload it
            file_info = self._upload_file(image_url)
        else:
            # It's a URL, we need to download it first and then upload
            response = requests.get(image_url)
            if response.status_code == 200:
                file_name = os.path.basename(image_url)
                file_type = 1  # Assuming 1 is for images
                file_info = self._upload_bytes(response.content, file_name, file_type)
            else:
                raise Exception(f"Failed to download image from {image_url}")
        
        # Now send a chat message with the image attachment
        request_data = {
            "prompt": query,
            "guest": False,
            "use_auto_cot": use_search,
            "use_deep_think": False,
            "attachments": [file_info]
        }
        
        # Add conversation_id and section_id if we have them
        if self.conversation_id and self.section_id:
            request_data["conversation_id"] = self.conversation_id
            request_data["section_id"] = self.section_id
        else:
            request_data["conversation_id"] = "0"
            request_data["section_id"] = ""  # Empty string instead of None
            
        # Make the API call
        response = requests.post(
            f"{self.base_url}/api/chat/completions",
            headers=self.headers,
            json=request_data
        )
        
        # Parse the response
        result = response.json()
        
        # Store conversation ID and section ID if available
        if "conversation_id" in result:
            self.conversation_id = result["conversation_id"]
        if "section_id" in result:
            self.section_id = result["section_id"]
            
        # Reformat the response to match MLLMClient format
        formatted_result = {
            "id": result.get("conversation_id", ""),
            "object": "chat.completion",
            "created": 0,
            "model": model,
            "choices": [
                {
                    "index": 0,
                    "message": {
                        "role": "assistant",
                        "content": result.get("text", "")
                    },
                    "finish_reason": "stop"
                }
            ],
            "usage": {
                "prompt_tokens": 0,
                "completion_tokens": 0,
                "total_tokens": 0
            }
        }
        
        # Add any image URLs if present
        if "img_urls" in result and result["img_urls"]:
            formatted_result["img_urls"] = result["img_urls"]
            
        return formatted_result
    
    def clear_conversation(self) -> None:
        """Reset the conversation by clearing conversation_id and section_id.
        If a conversation_id exists, also delete the conversation from the server.
        """
        if self.conversation_id:
            try:
                requests.post(
                    f"{self.base_url}/api/chat/delete",
                    params={"conversation_id": self.conversation_id}
                )
            except Exception as e:
                print(f"Failed to delete conversation: {e}")
        
        self.conversation_id = None
        self.section_id = None
    
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
    
    def _upload_file(self, file_path: str) -> Dict[str, Any]:
        """Upload a file to the Doubao API.
        
        Args:
            file_path: Path to the file
            
        Returns:
            The file information returned by the API
        """
        file_name = os.path.basename(file_path)
        file_type = self._get_file_type(file_name)
        
        with open(file_path, 'rb') as f:
            file_data = f.read()
            
        return self._upload_bytes(file_data, file_name, file_type)
    
    def _upload_bytes(self, file_data: bytes, file_name: str, file_type: int) -> Dict[str, Any]:
        """Upload file bytes to the Doubao API.
        
        Args:
            file_data: The file data as bytes
            file_name: The name of the file
            file_type: The type of the file (1 for image, etc.)
            
        Returns:
            The file information returned by the API
        """
        params = {
            "file_type": file_type,
            "file_name": file_name
        }
        
        headers = {'Content-Type': 'application/octet-stream'}
        if self.api_key:
            headers["Authorization"] = f"Bearer {self.api_key}"
        
        response = requests.post(
            f"{self.base_url}/api/file/upload",
            params=params,
            data=file_data,
            headers=headers
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            raise Exception(f"Failed to upload file: {response.text}")
    
    def _get_file_type(self, file_name: str) -> int:
        """Determine the file type based on the file extension.
        
        Args:
            file_name: The name of the file
            
        Returns:
            The file type code (1 for image, 2 for document, etc.)
        """
        ext = os.path.splitext(file_name)[1].lower()
        
        # Image types
        if ext in ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']:
            return 1
        # Document types
        elif ext in ['.pdf', '.doc', '.docx', '.txt', '.md']:
            return 2
        # Default to document type
        else:
            return 2 