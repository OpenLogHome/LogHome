import time
import json
import requests
from typing import Dict, Any, List, Optional
from utils.mysql_client import MySQLClient
from utils.mllm_client import MLLMClient
base_url = "https://loghomeservice.codesocean.top"

class MessageHandler:
    """消息处理器类"""
    
    def __init__(self, api_info: Dict[str, Any], community_token: str, db: MySQLClient, memory_db: MySQLClient):
        """
        初始化消息处理器
        
        Args:
            api_info: API配置信息
            community_token: 社区令牌
            db: 主数据库连接
            memory_db: 内存数据库连接
        """
        self.api_info = api_info
        self.community_token = community_token
        self.db = db
        self.memory_db = memory_db
        
        self.base_url = base_url
        
        # 设置API请求头
        self.headers = {"Authorization": f"Bearer {community_token}"}
        
    def process_unread_messages(self):
        """处理未读消息"""
        
        try:
            # 获取有未读消息的用户列表
            users_with_unread = self.get_users_with_unread_messages()
            
            if not users_with_unread:
                return
            
            print(f"📨 发现 {len(users_with_unread)} 个用户有未读消息")
            
            # 处理每个用户的未读消息
            for user in users_with_unread:
                self.process_user_messages(user)
                
        except Exception as e:
            print(f"❌ 处理未读消息时出错: {e}")
    
    def get_users_with_unread_messages(self) -> List[Dict[str, Any]]:
        """
        从API获取有未读消息的用户列表
        
        Returns:
            List[Dict]: 有未读消息的用户列表
        """
        try:
            # 获取私信好友列表，查找有未读消息的用户
            response = requests.get(f"{self.base_url}/community/chat_friends", headers=self.headers)
            if response.status_code != 200:
                print(f"❌ 获取私信好友列表失败: {response.status_code}")
                return []
            
            friends = response.json()
            users_with_unread = []
            
            # 遍历每个好友，找出有未读消息的用户
            for friend in friends:
                unread_count = friend.get('unread_count', 0)
                if unread_count > 0:
                    user_info = {
                        "user_id": friend.get('user_id'),
                        "user_name": friend.get('name', '未知用户'),
                        "unread_count": unread_count
                    }
                    users_with_unread.append(user_info)
            
            return users_with_unread
                
        except Exception as e:
            print(f"❌ 获取有未读消息的用户时出错: {e}")
            return []
    
    def process_user_messages(self, user: Dict[str, Any]):
        """
        处理单个用户的所有未读消息
        
        Args:
            user: 用户信息，包含user_id, user_name, unread_count
        """
        try:
            user_id = user.get("user_id")
            user_name = user.get("user_name", "未知用户")
            unread_count = user.get("unread_count", 0)
            
            print(f"📝 处理来自 {user_name} 的 {unread_count} 条未读消息...")
            
            # 获取该用户的未读消息
            unread_messages = self.get_user_unread_messages(user_id)
            
            if not unread_messages:
                print(f"❌ 未找到用户 {user_name} 的未读消息")
                return

            # 标记该用户的所有未读消息为已读
            if unread_messages:
                message_ids = [msg.get('id') for msg in unread_messages if msg.get('id')]
                if message_ids:
                    self.mark_user_messages_as_read(message_ids)
            
            # 为该用户创建新的MLLMClient实例
            client = MLLMClient(
                api_key=self.api_info.get("api_key", ""),
                base_url=self.api_info.get("base_url", "https://api.moonshot.cn")
            )
            
            # 生成回复（基于所有未读消息的上下文）
            reply_content = self.generate_reply_for_user(user, unread_messages, client)
            
            if reply_content:
                # 发送回复
                success = self.send_reply_to_user(user_id, user_name, reply_content)
                
                if success:
                    print(f"✅ 已回复用户 {user_name}: {reply_content[:50]}...")
                else:
                    print(f"❌ 发送回复失败")
            else:
                print(f"❌ 生成回复失败")
            
        except Exception as e:
            print(f"❌ 处理用户消息时出错: {e}")
    
    def get_user_unread_messages(self, user_id: int) -> List[Dict[str, Any]]:
        """
        获取指定用户的未读消息
        
        Args:
            user_id: 用户ID
            
        Returns:
            List[Dict]: 未读消息列表
        """
        try:
            # 获取与该用户的消息历史
            response = requests.get(
                f"{self.base_url}/community/message_history?friend_id={user_id}&pageSize=100", 
                headers=self.headers
            )
            
            if response.status_code != 200:
                print(f"❌ 获取用户 {user_id} 的消息历史失败: {response.status_code}")
                return []
            
            messages = response.json()
            current_user_id = 520  # 原木娘的ID
            unread_messages = []
            
            # 筛选出发给当前用户（原木娘）的未读消息
            for message in messages:
                if (message.get('sender_id') == user_id and 
                    message.get('receiver_id') == current_user_id and
                    message.get('is_read') == 0):
                    
                    unread_message = {
                        "id": message.get('id'),
                        "content": message.get('message_content', ''),
                        "created_at": message.get('sent_at', '')
                    }
                    unread_messages.append(unread_message)
            
            # 按时间排序
            unread_messages.sort(key=lambda x: x.get('created_at', ''))
            return unread_messages
                
        except Exception as e:
            print(f"❌ 获取用户未读消息时出错: {e}")
            return []
    
    def generate_reply_for_user(self, user: Dict[str, Any], unread_messages: List[Dict[str, Any]], client: MLLMClient) -> Optional[str]:
        """
        为用户生成回复内容
        
        Args:
            user: 用户信息
            unread_messages: 用户的未读消息列表
            client: MLLMClient实例
            
        Returns:
            str: 生成的回复内容
        """
        try:
            user_id = user.get("user_id")
            user_name = user.get("user_name", "朋友")
            
            # 获取历史消息上下文
            history = self.get_message_history(user_id)
            
            # 构建历史对话上下文
            context_str = ""
            if history:
                context_str = "\n\n历史对话记录：\n"
                for i, hist_msg in enumerate(history[-100:]):  # 只显示最近100条消息作为上下文
                    role = "用户" if hist_msg["is_from_user"] else "原木娘"
                    context_str += f"{role}: {hist_msg['content']}\n"
            
            # 构建未读消息内容
            unread_content = ""
            if len(unread_messages) == 1:
                unread_content = f"{user_name}: {unread_messages[0]['content']}"
            else:
                unread_content = f"{user_name} 发送了 {len(unread_messages)} 条消息：\n"
                for i, msg in enumerate(unread_messages, 1):
                    unread_content += f"{i}. {msg['content']}\n"
            
            # 构建AI提示词
            prompt = f"""你是原木社区中的一个友善、热情的小说阅读爱好者，名字叫"原木娘"，正在回复来自读者"{user_name}(ID:{user_id})"的私信。

{context_str}

当前收到的新消息：
{unread_content}

"""
            add_prompt = """
请生成一个合适的回复，要求：
1. 语气友善、自然，像朋友间的对话
2. 回复长度控制在150字以内
3. 避免过于正式或机械化的表达
4. 结合历史对话上下文，保持对话的连贯性
5. 请不要自己编造任何信息，如果用户询问了具体的内容，请一定要先通过<memory>额外获取信息，确保信息的准确性。
            
请回复“<memory>需要搜索什么关键词，用逗号隔开。</memory>”，先根据用户的问题搜索可能需要的信息，确保信息的准确性。"""

            # 调用AI生成初始回复
            response = client.chat(
                message=prompt + add_prompt,
                model="glm-4-plus",
                use_search=False
            )
            
            # 提取AI回复
            initial_reply = client.get_last_response(response)
            
            if not initial_reply:
                return None
            
            # 检查是否需要信息检索
            reply = self._handle_memory_request(initial_reply, prompt, user, client)
            
            return reply
            
        except Exception as e:
            print(f"❌ 生成回复时出错: {e}")
            return None
    
    def _handle_memory_request(self, initial_reply: str, original_prompt: str, 
                              user: Dict[str, Any], client: MLLMClient) -> str:
        """
        处理记忆请求，实现上下文隔离的信息检索
        
        Args:
            initial_reply: 初始回复
            original_prompt: 原始提示词
            user: 用户信息
            client: MLLMClient实例
            
        Returns:
            str: 最终回复
        """
        try:
            # 初始化上下文管理器
            from utils.context_manager import get_context_manager
            context_manager = get_context_manager()
            
            # 创建或获取用户上下文
            user_context = context_manager.create_or_get_context(
                user.get("user_id"), 
                user.get("user_name")
            )
            
            # 添加当前对话到上下文
            user_context.add_message({
                "type": "ai_initial_reply",
                "content": initial_reply,
                "prompt": original_prompt
            })
            
            # 初始化信息检索管理器
            from utils.info_retrieval_manager import InfoRetrievalManager
            retrieval_manager = InfoRetrievalManager(self.db, self.memory_db, self.api_info)
            
            # 检查是否有记忆请求
            has_request, retrieved_info = retrieval_manager.process_memory_request(
                initial_reply, 
                context={"user_id": user.get("user_id"), "user_name": user.get("user_name")}
            )
            
            if not has_request:
                # 没有记忆请求，直接返回初始回复
                user_context.add_message({
                    "type": "final_reply",
                    "content": initial_reply,
                    "has_retrieval": False
                })
                return initial_reply
            
            if not retrieved_info:
                # 有记忆请求但没有检索到信息，使用备用回复
                fallback_reply = self._generate_fallback_reply(user, client)
                user_context.add_message({
                    "type": "final_reply",
                    "content": fallback_reply,
                    "has_retrieval": True,
                    "retrieval_success": False
                })
                return fallback_reply
            
            # 有检索到信息，生成增强回复
            enhanced_reply = retrieval_manager.generate_enhanced_response(
                original_prompt, retrieved_info, client, 
                context={"user_id": user.get("user_id"), "user_name": user.get("user_name")}
            )
            
            if enhanced_reply:
                user_context.add_message({
                    "type": "final_reply",
                    "content": enhanced_reply,
                    "has_retrieval": True,
                    "retrieval_success": True,
                    "retrieved_info_summary": str(retrieved_info)[:200] + "..." if len(str(retrieved_info)) > 200 else str(retrieved_info)
                })
                return enhanced_reply
            else:
                # 增强回复生成失败，使用备用回复
                fallback_reply = self._generate_fallback_reply(user, client)
                user_context.add_message({
                    "type": "final_reply",
                    "content": fallback_reply,
                    "has_retrieval": True,
                    "retrieval_success": False,
                    "error": "enhanced_reply_generation_failed"
                })
                return fallback_reply
                
        except Exception as e:
            print(f"❌ 处理记忆请求时出错: {e}")
            
            # 记录错误到用户上下文
            try:
                from utils.context_manager import get_context_manager
                context_manager = get_context_manager()
                user_context = context_manager.get_context_by_user_id(user.get("user_id"))
                if user_context:
                    user_context.add_message({
                        "type": "error",
                        "content": f"处理记忆请求时出错: {str(e)}",
                        "error_type": "memory_request_processing_error"
                    })
            except:
                pass
            
            # 出错时返回初始回复
            return initial_reply
    
    def _generate_fallback_reply(self, user: Dict[str, Any], client: MLLMClient) -> str:
        """
        生成备用回复（当信息检索失败时使用）
        
        Args:
            user: 用户信息
            client: MLLMClient实例
            
        Returns:
            str: 备用回复
        """
        try:
            user_name = user.get("user_name", "朋友")
            
            fallback_prompt = f"""基于你的请求，我们搜索了可能相关的信息，但很遗憾暂时无法获取到。

请直接回复内容，不要包含任何格式标记："""
            
            response = client.chat(
                message=fallback_prompt,
                model="glm-4-plus",
                use_search=False
            )
            
            fallback_reply = client.get_last_response(response)
            
            return fallback_reply if fallback_reply else f"谢谢你的消息，{user_name}！我很乐意和你聊聊小说相关的话题。"
            
        except Exception as e:
            print(f"❌ 生成备用回复时出错: {e}")
            return f"谢谢你的消息，{user.get('user_name', '朋友')}！我很乐意和你继续交流。"
    
    def _process_reply_content(self, reply_content: str, user_name: str) -> List[str]:
        """
        处理回复内容，将其口语化并分成多句话
        
        Args:
            reply_content: 原始回复内容
            user_name: 用户名
            
        Returns:
            List[str]: 分句后的回复列表
        """
        try:
            # 创建新的MLLMClient实例用于内容处理
            client = MLLMClient(
                api_key=self.api_info.get("api_key", ""),
                base_url=self.api_info.get("base_url", "https://api.moonshot.cn")
            )
            
            # 构建口语化和分句的提示词
            process_prompt = f"""请将以下回复内容进行口语化处理并分成最多4句话，每句话单独发送会更自然：

原始回复：
{reply_content}

要求：
1. 将内容改写得更加口语化、自然
2. 将长句拆分成多个短句，数量最多4个
3. 每个短句应该是完整的表达，可以独立发送
4. 保持原意不变，语气友善
5. 适合在聊天中逐句发送
6. 每句话控制在50字以内
7. 返回格式：每句话占一行，不要添加序号或其他标记

请直接返回处理后的分句内容："""

            # 调用AI进行内容处理
            response = client.chat(
                message=process_prompt,
                model="glm-4-plus",
                use_search=False
            )
            
            # 提取处理后的内容
            processed_content = client.get_last_response(response)
            
            if not processed_content:
                # 如果处理失败，返回原始内容的简单分句
                return self._simple_split_content(reply_content)
            
            # 将处理后的内容按行分割
            sentences = [line.strip() for line in processed_content.split('\n') if line.strip()]
            
            # 过滤掉过短或过长的句子
            filtered_sentences = []
            for sentence in sentences:
                if sentence[-1] == "。" or sentence[-1] == "，":
                    sentence = sentence[:-1]
                filtered_sentences.append(sentence)
            
            # 如果过滤后没有合适的句子，使用简单分句
            if not filtered_sentences:
                return self._simple_split_content(reply_content)
            
            return filtered_sentences
            
        except Exception as e:
            print(f"❌ 处理回复内容时出错: {e}")
            # 出错时使用简单分句方法
            return self._simple_split_content(reply_content)
    
    def _simple_split_content(self, content: str) -> List[str]:
        """
        简单的内容分句方法（备用方案）
        
        Args:
            content: 原始内容
            
        Returns:
            List[str]: 分句后的内容列表
        """
        try:
            # 按句号、问号、感叹号分句
            import re
            sentences = re.split(r'[。！？\n]', content)
            
            # 清理和过滤句子
            result = []
            for sentence in sentences:
                sentence = sentence.strip()
                if sentence and len(sentence) >= 3:
                    # 如果句子太长，尝试按逗号分割
                    if len(sentence) > 80:
                        sub_sentences = sentence.split('，')
                        for sub in sub_sentences:
                            sub = sub.strip()
                            if sub and len(sub) >= 3:
                                result.append(sub)
                    else:
                        result.append(sentence)
            
            # 如果分句结果为空，返回原始内容
            if not result:
                return [content]
            
            return result
            
        except Exception as e:
            print(f"❌ 简单分句时出错: {e}")
            return [content]

    def send_reply_to_user(self, user_id: int, user_name: str, reply_content: str) -> bool:
        """
        发送回复消息给用户（支持分条发送）
        
        Args:
            user_id: 用户ID
            user_name: 用户名
            reply_content: 回复内容
            
        Returns:
            bool: 发送是否成功
        """
        try:
            # 处理回复内容，将其口语化并分成多句话
            processed_sentences = self._process_reply_content(reply_content, user_name)
            
            print(f"📝 准备向用户 {user_name} 发送 {len(processed_sentences)} 条分句回复")
            
            success_count = 0
            total_sentences = len(processed_sentences)
            
            # 逐条发送每个句子
            for i, sentence in enumerate(processed_sentences, 1):
                try:
                    # 准备发送消息的数据
                    send_data = {
                        "to_id": user_id,
                        "message_content": sentence
                    }
                    
                    # 发送消息
                    response = requests.post(
                        f"{self.base_url}/community/send_message",
                        headers=self.headers,
                        json=send_data
                    )
                    
                    if response.status_code == 200:
                        print(f"✅ 成功发送第 {i}/{total_sentences} 条消息给 {user_name}: {sentence[:30]}...")
                        success_count += 1
                        
                        # 在消息之间添加短暂延迟，模拟自然的聊天节奏
                        if i < total_sentences:  # 不是最后一条消息
                            time.sleep(1.5)  # 延迟1.5秒
                    else:
                        print(f"❌ 发送第 {i}/{total_sentences} 条消息失败: {response.status_code}, {response.text}")
                        
                except Exception as e:
                    print(f"❌ 发送第 {i}/{total_sentences} 条消息时出错: {e}")
            
            # 判断整体发送是否成功
            if success_count == total_sentences:
                print(f"✅ 成功向用户 {user_name} 发送了全部 {total_sentences} 条回复")
                return True
            elif success_count > 0:
                print(f"⚠️ 部分发送成功: {success_count}/{total_sentences} 条消息发送成功")
                return True  # 只要有部分成功就认为是成功的
            else:
                print(f"❌ 所有消息发送失败")
                return False
                
        except Exception as e:
            print(f"❌ 发送回复时出错: {e}")
            # 如果处理失败，尝试发送原始内容
            try:
                send_data = {
                    "to_id": user_id,
                    "message_content": reply_content
                }
                
                response = requests.post(
                    f"{self.base_url}/community/send_message",
                    headers=self.headers,
                    json=send_data
                )
                
                if response.status_code == 200:
                    print(f"✅ 备用方案成功回复用户 {user_name}: {reply_content[:50]}...")
                    return True
                else:
                    print(f"❌ 备用方案发送失败: {response.status_code}, {response.text}")
                    return False
            except Exception as backup_e:
                print(f"❌ 备用方案也失败了: {backup_e}")
                return False
    
    def mark_user_messages_as_read(self, message_ids: List[int]) -> bool:
        """
        标记指定消息为已读
        
        Args:
            message_ids: 消息ID列表
            
        Returns:
            bool: 标记是否成功
        """
        try:
            success_count = 0
            for message_id in message_ids:
                response = requests.post(
                    f"{self.base_url}/community/mark_as_read",
                    headers=self.headers,
                    json={"message_id": message_id}
                )
                
                if response.status_code == 200:
                    success_count += 1
                else:
                    print(f"❌ 标记消息 {message_id} 为已读失败: {response.status_code}")
            
            if success_count == len(message_ids):
                print(f"✅ 成功标记 {success_count} 条消息为已读")
                return True
            else:
                print(f"⚠️ 部分消息标记失败，成功: {success_count}/{len(message_ids)}")
                return False
                
        except Exception as e:
            print(f"❌ 标记消息为已读时出错: {e}")
            return False

    
    def mark_message_as_replied(self, message_id: int) -> bool:
        """
        标记消息为已回复
        
        Args:
            message_id: 消息ID
            
        Returns:
            bool: 标记是否成功
        """
        try:
            query = "UPDATE messages SET is_replied = 1, replied_at = NOW() WHERE id = %s"
            result = self.db.execute_query(query, (message_id,))
            
            return result["success"]
            
        except Exception as e:
            print(f"❌ 标记消息已回复时出错: {e}")
            return False
    
    def get_message_history(self, sender_id: int, max_messages: int = 100, max_chars: int = 10000) -> List[Dict[str, Any]]:
        """
        获取用户的历史消息上下文
        
        Args:
            sender_id: 发送者ID
            max_messages: 最大消息数量，默认100条
            max_chars: 最大字符数，默认10000字
            
        Returns:
            List[Dict]: 历史消息列表
        """
        try:
            # 获取与该用户的消息历史
            response = requests.get(
                f"{self.base_url}/community/message_history?friend_id={sender_id}&pageSize={max_messages}", 
                headers=self.headers
            )
            
            if response.status_code != 200:
                print(f"❌ 获取用户 {sender_id} 的消息历史失败: {response.status_code}")
                return []
            
            messages = response.json()
            current_user_id = 520  # 原木娘的ID
            
            # 按时间排序并限制消息数量和字符数
            sorted_messages = sorted(messages, key=lambda x: x.get('sent_at', ''))
            
            history = []
            total_chars = 0
            
            for message in sorted_messages:
                content = message.get('message_content', '')
                sender_id_msg = message.get('sender_id')
                receiver_id_msg = message.get('receiver_id')
                
                # 构建消息对象
                msg_obj = {
                    "sender_id": sender_id_msg,
                    "receiver_id": receiver_id_msg,
                    "content": content,
                    "sent_at": message.get('sent_at', ''),
                    "is_from_user": sender_id_msg == sender_id,  # 是否来自用户
                    "is_from_bot": sender_id_msg == current_user_id  # 是否来自机器人
                }
                
                # 检查字符数限制
                if total_chars + len(content) > max_chars:
                    break
                
                history.append(msg_obj)
                total_chars += len(content)
                
                # 检查消息数量限制
                if len(history) >= max_messages:
                    break
            
            return history
                
        except Exception as e:
            print(f"❌ 获取消息历史时出错: {e}")
            return []

    def get_user_context(self, sender_id: int) -> Dict[str, Any]:
        """
        获取用户上下文信息（可选功能）
        
        Args:
            sender_id: 发送者ID
            
        Returns:
            Dict: 用户上下文信息
        """
        try:
            # 查询用户的历史互动记录
            query = """
            SELECT COUNT(*) as message_count, MAX(created_at) as last_message_time
            FROM messages 
            WHERE sender_id = %s
            """
            
            result = self.db.execute_query(query, (sender_id,))
            
            if result["success"] and result["data"]:
                return result["data"][0]
            else:
                return {"message_count": 0, "last_message_time": None}
                
        except Exception as e:
            print(f"❌ 获取用户上下文时出错: {e}")

            return {"message_count": 0, "last_message_time": None}