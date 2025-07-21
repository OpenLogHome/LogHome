import requests
import json
from typing import List, Dict, Any, Optional, Union

class MLLMClient:
    """
    A client for interacting with Kimi AI API that follows OpenAI's chat completion API format.
    
    This client supports:
    - Multi-turn conversations
    - Text chat completions
    - Document interpretation
    - Image processing
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