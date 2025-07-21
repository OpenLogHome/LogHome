from tools import mllm_client
import json
import importlib
import time
from typing import Optional
from tools.memory_manager import MemoryManager
from tools.reading_record_manager import ReadingRecordManager
from tools.log_manager import LogManager
import os
import traceback
import random
import sys

class Simulator:
    def __init__(self, api_key: str, base_url: str, model: str, community_token: str, community_base_url: str, db_config: dict | None = None, energy: int = 50):
        self.client = mllm_client.MLLMClient(api_key, base_url)
        self.model = model
        self.community_token = community_token
        self.community_base_url = community_base_url
        self.current_page = "home"
        self.current_page_params = {}
        self.pages = self.load_pages()
        self.page_generators = self.load_page_generators()
        self.energy_limit = energy
        self.energy = energy
        self.invalid_operation = False
        self.json_parse_error = False
        self.json_parse_error_count = 0  # 添加JSON解析错误计数器

        # 初始化管理器
        self.memory_manager = MemoryManager(db_config) if db_config else None
        self.reading_record_manager = ReadingRecordManager(db_config) if db_config else None
        self.log_manager = LogManager(db_config) if db_config else None

    def load_pages(self):
        """加载页面配置"""
        with open("pages.json", "r", encoding="utf8") as f:
            pageList = json.load(f)
            pageDict = {}
            for page in pageList:
                pageDict[page["name"]] = page
            return pageDict

    def load_page_generators(self):
        """加载页面生成器"""
        page_generators = {}
        for page in self.pages.values():
            if page["name"] == "exit" or page["name"] == "sleep": 
                continue
            module_name = page["generator"]
            module = importlib.import_module("page_generators." + module_name)
            page_generators[page["name"]] = module.generate_page
        return page_generators

    def _str2type(self, type_str: str):
        """字符串类型转换为Python类型"""
        if type_str == "int":
            return int
        elif type_str == "string":
            return str
        else:
            return None

    def _validate_params(self, params: dict, page_params: dict):
        """验证参数"""
        for param in page_params:
            if page_params[param]["required"] and param not in params:
                return False

            param_type = self._str2type(page_params[param]["type"])
            if param_type is not None and param in params:
                param_value = params[param]
                
                # 如果期望类型是int但参数是字符串，尝试转换
                if param_type == int and isinstance(param_value, str):
                    try:
                        params[param] = int(param_value)
                        print(f"自动转换参数 {param} 从字符串 '{param_value}' 到整数 {params[param]}")
                    except ValueError:
                        print(f"参数 {param} 无法从字符串 '{param_value}' 转换为整数")
                        return False
                # 如果类型不匹配且无法转换，返回False
                elif not isinstance(param_value, param_type):
                    print(f"参数 {param} 类型错误：期望 {param_type.__name__}，实际为 {type(param_value).__name__}")
                    return False
        return True

    def _generate_meta_prompt(self, page_name: str):
        """生成元提示信息"""
        operations = []
        for operation_name in self.pages[page_name]["operations"]:
            operation = self.pages[operation_name]
            operations.append(f""" - {operation["name"]}({operation["description"]})，所需参数为：{json.dumps(operation["params"], ensure_ascii=False)}，消耗能量：{operation["energy_cost"]}""")
        print('可执行的操作有：\n' + '\n'.join(operations))
        return f"""
            ===================================
            在该页面你可选的操作如下，请仅从以下操作中选择一个来执行，不要执行其他操作：
            {os.linesep.join(operations)}
            ===================================
            在上述操作之外，你还可以针对小说，文章或用户创建记忆，格式为：
            {{
                "operation": "create_memory",
                "params": {{
                    "object_type": "[novel/article/user]",
                    "object_id": "[小说/文章/用户ID]",
                    "content": "[记忆内容]"
                }},
                "reason":"[进行该操作的原因]"
            }}
            每一次创建记忆时，请尽量详细地描述记忆以保留更多的信息。这些记忆将作为你的记忆库，会在你下次针对同一对象进行操作时被自动调用并提供给你。
            ===================================
            请严格以JSON格式返回你的操作，不要使用代码块包裹，格式为：
            {{
                "operation": "[选择的操作名称]",
                "params": {{
                    "[参数名]": "[参数值]"
                }},
                "reason":"[进行该操作的原因]"
            }}
            请务必确保JSON格式正确（输出应当包含JSON的开始和结束符号），并且请确保操作名称和参数名称严格遵照所提供的格式，不要修改大小写、命名风格等，不要漏掉下划线和任何参数。每次请只返回一个操作，不要返回多个操作。
            ===================================
            你现在是小说社区“原木社区”的吉祥物，名字是原木娘。你是这个社区中唯一的智能体用户，与人类进行友好的互动与交流。
            原木社区是一个Minecraft同人文艺作品的创作社区，其中有非常多的友好的用户，请自由地与他们交流。
            社区中可能包含与Minecraft无关的内容，请不要因为它们与Minecraft无关而忽略它们，都可以阅读与操作。
            你不需要负责社区的管理，你只需要参与社区的互动，并且按照你的兴趣阅读你感兴趣的内容，因此请放轻松。
            你是一个真实用户，请根据你的兴趣做出选择。希望你在社区中度过一个愉快的时光。
            你被鼓励更多地阅读没读过的内容，参与社区的互动，并且更多地阅读你感兴趣的内容。
            如果你已经存在了某些记忆，请根据记忆从阅读进度开始继续阅读，**而不是**重新阅读已经读过的章节。
            你在访问一个真实的平台，每次启动时，你所执行的一串操作都是在短时间内连续执行的，因此请避免反复执行相同的操作。
            如果你有“搜索网页”工具，请不要使用它，因为会干扰你的判断。
        """

    def _get_page_content(self, memory_created: bool, invalid_operation: bool, json_parse_error: bool):
        """获取页面内容"""
        if memory_created:
            return "你成功创建了记忆，下次相关的记忆将提供给你。"
        elif invalid_operation:
            return "你刚刚做出了无效的操作，请重新做出选择。"
        elif json_parse_error:
            return "你刚刚没有正确输出JSON，请仔细检查：JSON格式是否完整，参数是否正确，参数的类型是否符合要求。请重新输出。"
        elif self.energy <= 0:
            print("能量耗尽，需要休息，休息3小时")
            time.sleep(60*60*3)
            self.energy = 200
            return "你刚刚休息了3小时，现在可以继续了。"
        else:
            # 获取页面生成器函数
            generator_func = self.page_generators[self.current_page]
            
            # 检查函数签名，适应不同的参数数量
            import inspect
            sig = inspect.signature(generator_func)
            param_count = len(sig.parameters)
            
            if param_count == 3:
                # 只有基本参数：token, base_url, params
                return generator_func(
                    self.community_token, 
                    self.community_base_url, 
                    self.current_page_params
                )
            elif param_count == 4:
                # 有memory_manager参数
                return generator_func(
                    self.community_token, 
                    self.community_base_url, 
                    self.current_page_params, 
                    self.memory_manager
                )
            elif param_count == 5:
                # 有memory_manager和reading_record_manager参数
                return generator_func(
                    self.community_token, 
                    self.community_base_url, 
                    self.current_page_params, 
                    self.memory_manager, 
                    self.reading_record_manager
                )
            else:
                # 默认情况，尝试传递所有参数
                return generator_func(
                    self.community_token, 
                    self.community_base_url, 
                    self.current_page_params, 
                    self.memory_manager, 
                    self.reading_record_manager
                )

    def _log_page_operation(self, page_name: str, operation: Optional[str] = None, 
                           params: Optional[dict] = None, reason: Optional[str] = None,
                           page_content: Optional[str] = None, ai_response: Optional[str] = None,
                           energy_before: Optional[int] = None, energy_after: Optional[int] = None,
                           memory_created: bool = False, memory_content: Optional[str] = None,
                           status: str = 'success', error_message: Optional[str] = None):
        """记录页面操作日志"""
        if self.log_manager:
            self.log_manager.log_page_operation(
                page_name=page_name,
                operation=operation,
                params=params,
                reason=reason,
                page_content=page_content,
                ai_response=ai_response,
                energy_before=energy_before,
                energy_after=energy_after,
                memory_created=memory_created,
                memory_content=memory_content,
                status=status,
                error_message=error_message
            )

    def _handle_ai_response_error(self, content: Optional[str], energy_before: Optional[int], error_type: str, error_message: str):
        """处理AI响应错误"""
        print(f"{error_message}")
        self._log_page_operation(
            page_name=self.current_page,
            status='error',
            error_message=error_message,
            energy_before=energy_before,
            energy_after=self.energy
        )
        exit()

    def _handle_json_parse_error(self, content: str, energy_before: int, error: Exception):
        """处理JSON解析错误"""
        print(f"JSON解析失败: {error}")
        print("Invalid response")
        self.json_parse_error_count += 1  # 增加错误计数
        
        # 检查是否连续出现3次JSON解析错误
        if self.json_parse_error_count >= 3:
            print("连续3次JSON解析错误，需要休息，休息3小时")
            self._log_page_operation(
                page_name=self.current_page,
                ai_response=content,
                status='error',
                error_message=f'连续3次JSON解析错误，休息3小时',
                energy_before=energy_before,
                energy_after=self.energy
            )
            time.sleep(60*60*3)  # 休息3小时
            self.energy = 300  # 恢复能量到300
            self.json_parse_error_count = 0  # 重置错误计数器
            print(f"休息完毕，能量恢复到 {self.energy}")
        else:
            self._log_page_operation(
                page_name=self.current_page,
                ai_response=content,
                status='error',
                error_message=f'JSON解析失败: {str(error)}',
                energy_before=energy_before,
                energy_after=self.energy
            )

    def _handle_memory_creation(self, contentJson: dict, energy_before: int) -> bool:
        """处理记忆创建操作"""
        try:
            memory_params = contentJson["params"]
            object_type = memory_params.get("object_type")
            object_id = memory_params.get("object_id")
            memory_content = memory_params.get("content")
            
            if not all([object_type, object_id, memory_content]):
                print("Invalid memory params")
                self.json_parse_error = True
                self._log_page_operation(
                    page_name=self.current_page,
                    operation="create_memory",
                    params=memory_params,
                    reason=contentJson.get("reason", ""),
                    ai_response=json.dumps(contentJson),
                    status='error',
                    error_message='Invalid memory params',
                    energy_before=energy_before,
                    energy_after=self.energy
                )
                return False
            
            if not self.memory_manager:
                print("记忆管理器未初始化")
                self._log_page_operation(
                    page_name=self.current_page,
                    operation="create_memory",
                    params=memory_params,
                    reason=contentJson.get("reason", ""),
                    ai_response=json.dumps(contentJson),
                    status='error',
                    error_message='记忆管理器未初始化',
                    energy_before=energy_before,
                    energy_after=self.energy
                )
                return False
            
            success = self.memory_manager.create_memory(object_type, object_id, memory_content)
            if success:
                print(f"成功创建记忆: {object_type}/{object_id}")
                self._log_page_operation(
                    page_name=self.current_page,
                    operation="create_memory",
                    params=memory_params,
                    reason=contentJson.get("reason", ""),
                    ai_response=json.dumps(contentJson),
                    energy_before=energy_before,
                    energy_after=self.energy,
                    memory_created=True,
                    memory_content=memory_content
                )
                return True
            else:
                print("创建记忆失败")
                self._log_page_operation(
                    page_name=self.current_page,
                    operation="create_memory",
                    params=memory_params,
                    reason=contentJson.get("reason", ""),
                    ai_response=json.dumps(contentJson),
                    status='error',
                    error_message='创建记忆失败',
                    energy_before=energy_before,
                    energy_after=self.energy
                )
                return False
                
        except Exception as e:
            print(f"处理记忆创建失败: {str(e)}")
            self._log_page_operation(
                page_name=self.current_page,
                operation="create_memory",
                params=contentJson.get("params", {}),
                reason=contentJson.get("reason", ""),
                ai_response=json.dumps(contentJson),
                status='error',
                error_message=f'处理记忆创建失败: {str(e)}',
                energy_before=energy_before,
                energy_after=self.energy
            )
            return False

    def _handle_page_navigation(self, contentJson: dict, energy_before: int):
        """处理页面导航操作"""
        operation = contentJson["operation"]
        params = contentJson.get("params", {})
        reason = contentJson.get("reason", "")
        
        # 验证参数
        if not self._validate_params(params, self.pages[operation]["params"]):
            print("Invalid params")
            self.json_parse_error = True
            self._log_page_operation(
                page_name=self.current_page,
                operation=operation,
                params=params,
                reason=reason,
                ai_response=json.dumps(contentJson),
                status='error',
                error_message='Invalid params',
                energy_before=energy_before,
                energy_after=self.energy
            )
            return False
        
        # 记录成功的页面跳转操作
        energy_cost = self.pages[operation]["energy_cost"]
        self._log_page_operation(
            page_name=self.current_page,
            operation=operation,
            params=params,
            reason=reason,
            ai_response=json.dumps(contentJson),
            energy_before=energy_before,
            energy_after=self.energy - energy_cost
        )
        
        # 更新状态
        self.current_page_params = params
        self.current_page = operation
        self.energy -= energy_cost
        print("进入页面：", self.current_page)
        return True

    def _handle_exit_operation(self, contentJson: dict, energy_before: int):
        """处理退出操作"""
        self._log_page_operation(
            page_name=self.current_page,
            operation="exit",
            reason=contentJson.get("reason", ""),
            ai_response=json.dumps(contentJson),
            energy_before=energy_before,
            energy_after=self.energy
        )
        return True

    def _handle_invalid_operation(self, contentJson: dict, energy_before: int):
        """处理无效操作"""
        print("Invalid operation")
        self._log_page_operation(
            page_name=self.current_page,
            operation=contentJson.get("operation", "unknown"),
            params=contentJson.get("params", {}),
            reason=contentJson.get("reason", ""),
            ai_response=json.dumps(contentJson),
            status='error',
            error_message='Invalid operation',
            energy_before=energy_before,
            energy_after=self.energy
        )
        return False

    def _process_ai_response(self, content: str, energy_before: int):
        """处理AI响应"""
        print(f"剩余能量：{self.energy}")

        is_think = False
        think_content = ""

        # 处理<think>块
        if "<think>" in content:
            think_content = content.split("<think>")[1].split("</think>")[0]
            is_think = True
            content = content.split("</think>")[1].replace("\n", "").replace("\r", "")

        if "搜索结果来自：" in content:
            content = content.split("搜索结果来自：")[0].replace("\n", "").replace("\r", "")

        if "```json" in content and "```" in content:
            content = content.split("```json")[1].split("```")[0]
        
        try:
            contentJson = json.loads(content)
            if is_think:
                contentJson["reason"] = think_content + "\n" + contentJson["reason"]
            # 成功解析JSON，重置错误计数器
            self.json_parse_error_count = 0
        except Exception as e:
            self.json_parse_error = True
            self._handle_json_parse_error(content, energy_before, e)
            return False, None
        
        # 处理不同类型的操作
        if contentJson["operation"] == "exit":
            return self._handle_exit_operation(contentJson, energy_before), contentJson
        elif contentJson["operation"] == "create_memory":
            return self._handle_memory_creation(contentJson, energy_before), contentJson
        elif contentJson["operation"] in self.pages[self.current_page]["operations"]:
            return self._handle_page_navigation(contentJson, energy_before), contentJson
        else:
            self.invalid_operation = True
            return self._handle_invalid_operation(contentJson, energy_before), contentJson

    def _handle_exception(self, error: Exception, energy_before: Optional[int] = None):
        """处理异常"""
        print(error)
        energy_before_value = energy_before if energy_before is not None else None
        self._log_page_operation(
            page_name=self.current_page,
            status='error',
            error_message=f'程序异常: {str(error)}',
            energy_before=energy_before_value,
            energy_after=self.energy
        )

    def start(self):
        """启动模拟器主循环"""
        memory_created = False  # 标记是否刚创建了记忆
        
        while True:
            try:
                # 记录操作前的能量
                energy_before = self.energy
                
                # 获取页面内容
                page_info = self._get_page_content(memory_created, self.invalid_operation, self.json_parse_error)
                memory_created = False  # 重置记忆创建标记
                self.invalid_operation = False # 重置无效操作标记
                self.json_parse_error = False # 重置JSON解析错误标记

                # 生成完整页面信息
                meta_prompt = self._generate_meta_prompt(self.current_page)
                page_info = page_info + "\n" + meta_prompt
                
                # 记录页面内容
                self._log_page_operation(
                    page_name=self.current_page,
                    page_content=page_info,
                    energy_before=energy_before
                )
                
                # 获取AI响应
                response = self.client.chat(page_info, model=self.model)
                content = self.client.get_last_response(response)
                print("原木娘做出了以下动作：")
                print(content)

                # 检查响应有效性
                if content is None:
                    self._handle_ai_response_error(None, energy_before, "invalid_response", "Content is None, invalid response")
                    return

                if "[内容由于不合规被停止生成，我们换个话题吧]" in content:
                    self._handle_ai_response_error(content, energy_before, "content_filter", "触发系统风控，退出程序。")
                    return

                # 处理AI响应
                result, contentJson = self._process_ai_response(content, energy_before)
                if result and contentJson is not None:
                    # 如果是退出操作，结束循环
                    if contentJson["operation"] == "exit":
                        break
                        # 如果是记忆创建操作，设置标记
                    elif contentJson["operation"] == "create_memory":
                        memory_created = True
                
            except Exception as e:
                print(traceback.format_exc())
                self._handle_exception(e, energy_before)
            
            finally:
                time.sleep(10 + random.randint(0, 10))

def main():
    community_token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUyMCIsInB3ZCI6IiQyYSQxMCRKSTdQMFVZblhtNFU2Tmt2c0tnSHguVER3b2twNXRmNjRxb2ZkWkZRM05wZzNPdUNMZjMzNiIsImV4cGlyZXNJbiI6NjA0ODAwLCJpYXQiOjE3NTIzMjY2Mjh9.nnfU7rnoJ7SgZLvVVZ7zZ1Ue2k59HkmOzL1Zi4iIaFU"
    
    kimi_api = "http://8.152.99.246:8000/"
    kimi_model = "kimi"
    kimi_api_key = "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJ1c2VyLWNlbnRlciIsImV4cCI6MTc2MDA4NzkxMSwiaWF0IjoxNzUyMzExOTExLCJqdGkiOiJkMXAyZ3B0anFlZDdpZ212c29mZyIsInR5cCI6InJlZnJlc2giLCJhcHBfaWQiOiJraW1pIiwic3ViIjoiZDFwMmdwdGpxZWQ3aWdtdnNvZWciLCJzcGFjZV9pZCI6ImQxcDJncHRqcWVkN2lnbXZzb2UwIiwiYWJzdHJhY3RfdXNlcl9pZCI6ImQxcDJncHRqcWVkN2lnbXZzb2RnIiwic3NpZCI6IjE3MzAzMTAyNDQ3MzQyOTA1MDIiLCJkZXZpY2VfaWQiOiI3NDQ3NTE4NTc3Mzk5MjY4ODczIiwicmVnaW9uIjoiY24ifQ.j3YRQSZjRGzN32IWOUI7zVGrJBn5zuewqb9LznEH3slA0J_r5K2gay-gO9rqzgAY3fUlsEe90Gtr721naqLscw"

    spark_api = "http://8.152.99.246:8003/"
    spark_model = "spark"
    spark_api_key = "2de25c8a-30d8-46c5-8fba-b1e82cabf34b"

    glm_api = "http://8.152.99.246:8002/"
    glm_model = "glm-4-plus"
    glm_api_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiLnlKjmiLdfejkyc1N2IiwiZXhwIjoxNzY3OTI4MDczLCJuYmYiOjE3NTIzNzYwNzMsImlhdCI6MTc1MjM3NjA3MywianRpIjoiMTFhY2RlOTA0OTQzNDJhNGIxYjM0NGFkYjMzOGYxZDUiLCJ1aWQiOiI2ODczMjJmMWZkMjNkNWE4MWM3MGU4OTgiLCJkZXZpY2VfaWQiOiI2ODYzOGZhZjc4MjM0NGMxYmZkZmUyYzczMmM1MjIxYSIsInR5cGUiOiJyZWZyZXNoIn0.rWcQxVpeW2elcS3ji2prdLDYSdHvIPCNtStJQHeNXuI"

    simulator = Simulator(kimi_api_key, kimi_api, kimi_model, community_token, "https://loghomeservice.codesocean.top", db_config={
        "host": "sql.ricepastem.cafe",
        "port": 20345,
        "user": "loghome_agent",
        "password": "loghome_agent250712",
        "database": "loghome_agent"
    }, energy=200)
    simulator.start()

if __name__ == "__main__":
    main()

# 创建一个新的启动脚本，用于在服务器端持续运行
def run_forever():
    """
    持续运行simulator，如果出现异常则自动重启
    这个函数可以被Supervisor等进程管理工具调用，以确保服务持续运行
    """
    while True:
        try:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] 启动LogHome模拟器...")
            main()
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] LogHome模拟器正常退出，3秒后重启...")
        except KeyboardInterrupt:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] 收到键盘中断，退出程序")
            break
        except Exception as e:
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] LogHome模拟器发生异常: {str(e)}")
            print(traceback.format_exc())
            print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] 3秒后重启...")
        time.sleep(3)  # 等待3秒后重启，避免立即重启可能导致的资源占用问题

# 如果直接运行这个脚本，则调用run_forever函数
if __name__ == "__main__" and len(sys.argv) > 1 and sys.argv[1] == "--forever":
    run_forever()