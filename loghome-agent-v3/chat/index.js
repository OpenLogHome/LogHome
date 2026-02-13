
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { searchMemoriesByKeywords } from '../utils/memoryManager.js';
import { searchNovelsByName, searchNovelsByKeyword, getNovelInfo } from '../utils/libraryHelper.js';
import { SessionLogger } from './utils/sessionLogger.js';
import { VolcengineClient } from './clients/volcengine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load secret.json
const secretPath = path.join(__dirname, '../secret.json');
let secret;
try {
    secret = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));
} catch (e) {
    console.error("Failed to load secret.json", e);
    process.exit(1);
}

const CHAT_CONFIG = secret.CHAT_MLLM_CONFIG;

const logger = new SessionLogger();

class ChatSystem {
    constructor() {
        this.client = new VolcengineClient(CHAT_CONFIG, logger);
        this.messages = [
            {
                role: "system",
                content: `你是一个小说阅读平台的聊天助手。
你的任务是根据章节信息与自己的记忆理解与用户聊天。
你拥有以下工具：
1. extractFromMemory: 从记忆库中提取信息。当用户询问之前的剧情、角色状态等需要回忆的信息时使用。
2. sendMessage: 向用户发送消息。这是你回复用户的唯一方式。
3. search_novels_by_keyword: 根据关键词搜索小说。当用户询问包含特定关键词的小说时使用。
4. search_novels_by_name: 根据书名搜索小说。当用户询问特定小说的信息时使用。

请根据用户的输入，灵活使用工具。你可以多次调用工具来收集信息，最后必须使用 sendMessage 回复用户。
`
            }
        ];
        
        // Tools definition
        this.tools = [
            {
                type: "function",
                function: {
                    name: "extractFromMemory",
                    description: "从记忆库中搜索相关信息。使用fast模型进行分析。",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "需要从记忆中搜索的问题或关键词"
                            },
                            novel_id: {
                                type: "integer",
                                description: "指定搜索的小说ID。"
                            }
                        },
                        required: ["query", "novel_id"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "search_novels_by_name",
                    description: "根据书名搜索小说",
                    parameters: {
                        type: "object",
                        properties: {
                            name: {
                                type: "string",
                                description: "小说名称关键词"
                            }
                        },
                        required: ["name"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "search_novels_by_keyword",
                    description: "根据关键词搜索小说（按所有章节中关键词匹配数量降序）",
                    parameters: {
                        type: "object",
                        properties: {
                            keyword: {
                                type: "string",
                                description: "搜索关键词"
                            }
                        },
                        required: ["keyword"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "sendMessage",
                    description: "向用户发送消息",
                    parameters: {
                        type: "object",
                        properties: {
                            message: {
                                type: "string",
                                description: "发送给用户的消息内容"
                            }
                        },
                        required: ["message"]
                    }
                }
            }
        ];
    }

    async start() {
        console.log("正在初始化聊天系统...");
        logger.init();

        console.log("聊天系统就绪！请输入内容开始聊天 (输入 'exit' 退出)");
        
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.on('line', async (input) => {
            if (input.trim().toLowerCase() === 'exit') {
                rl.close();
                process.exit(0);
            }
            await this.handleUserInput(input);
        });
    }

    async handleUserInput(input) {
        this.messages.push({ role: "user", content: input });
        
        let finished = false;
        while (!finished) {
            // console.log("思考中..."); // Removing simple log for verbose logs
            try {
                const responseMessage = await this.client.chat(this.messages, this.tools, 'deep', 'Main Agent');
                this.messages.push(responseMessage);

                if (responseMessage.tool_calls) {
                    for (const toolCall of responseMessage.tool_calls) {
                        const fnName = toolCall.function.name;
                        const args = JSON.parse(toolCall.function.arguments);
                        console.log(`>> 执行工具: ${fnName}`, args);

                        let result;
                        if (fnName === 'sendMessage') {
                            console.log(`\n\x1b[32mAgent: ${args.message}\x1b[0m\n`);
                            result = "Message sent.";
                            finished = true; // End the turn after sending message
                        } else if (fnName === 'extractFromMemory') {
                            result = await this.extractFromMemory(args.query, args.novel_id);
                        } else if (fnName === 'search_novels_by_name') {
                            result = await searchNovelsByName(args.name);
                        } else if (fnName === 'search_novels_by_keyword') {
                            result = await searchNovelsByKeyword(args.keyword);
                        } else {
                            result = "Unknown tool.";
                        }
                        
                        const resultStr = typeof result === 'string' ? result : JSON.stringify(result);
                        console.log(`<< 工具结果 (${fnName}):`, resultStr.substring(0, 200) + (resultStr.length > 200 ? "..." : ""));

                        this.messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: JSON.stringify(result)
                        });
                    }
                } else {
                    // Model didn't call a tool, usually means it's done or just chatting. 
                    // But we enforced sendMessage. If it returns text content directly, we print it.
                    if (responseMessage.content) {
                        // console.log(`\nAgent (Direct): ${responseMessage.content}\n`); // Handled by client logging
                        // We still want to show it clearly as final output if it's not a thought
                        const finalContent = responseMessage.content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
                        if (finalContent) {
                             console.log(`\n\x1b[32mAgent (Direct): ${finalContent}\x1b[0m\n`);
                        }
                        finished = true;
                    }
                }
            } catch (error) {
                console.error("Error in chat loop:", error);
                finished = true;
            }
        }
    }

    async extractFromMemory(query, novelId) {
        const targetNovelId = novelId;
        console.log(`  [SubAgent-Memory] 正在搜索记忆: ${query} (Novel ID: ${targetNovelId})`);
        
        if (!targetNovelId) {
             return "Error: Novel ID is required for memory extraction. Please search for the novel first to get its ID.";
        }

        const novelInfo = await getNovelInfo(targetNovelId);
        if (!novelInfo) {
            return "Error: Novel not found. Please search for the novel first to get its ID.";
        }

        const tools = [
            {
                type: "function",
                function: {
                    name: "search_keywords",
                    description: "根据关键词搜索相关的记忆条目（返回最相关的10条）。支持分页。",
                    parameters: {
                        type: "object",
                        properties: {
                            keywords: {
                                type: "array",
                                items: { type: "string" },
                                description: "关键词列表"
                            },
                            page: {
                                type: "integer",
                                description: "页码，从1开始。每页10条。默认为1。",
                                default: 1
                            }
                        },
                        required: ["keywords"]
                    }
                }
            }
        ];

        const messages = [
            {
                role: "system",
                content: `你是一个负责从记忆库中提取信息的子Agent，
你的任务是从之前阅读小说时留下的记忆库中提取记忆信息，具体而言是根据用户的问题，生成相关的关键词，并使用 search_keywords 工具在数据库中搜索相关记忆。
你可以进行多次搜索，每次搜索结果会包含最相关的10条记忆。
如果第一页的结果不理想，你可以尝试搜索下一页（page=2, page=3...）或更换关键词。
当你认为收集到足够的信息后，请根据搜索到的记忆内容回答用户的问题。
如果记忆中没有相关信息，请说明。

你正在回答关于小说《${novelInfo.name}》的问题。
小说的作者是: ${novelInfo.author}
小说的简介是: ${novelInfo.content}`
            },
            {
                role: "user",
                content: `请根据记忆回答我的问题: "${query}"`
            }
        ];

        let loopCount = 0;
        const MAX_LOOPS = 5;

        while (loopCount < MAX_LOOPS) {
            loopCount++;
            try {
                // Use 'fast' model for sub-agent
                const response = await this.client.chat(messages, tools, 'fast', 'Memory Sub-Agent');
                messages.push(response);

                if (response.tool_calls) {
                    for (const toolCall of response.tool_calls) {
                        const fnName = toolCall.function.name;
                        const args = JSON.parse(toolCall.function.arguments);
                        console.log(`  [SubAgent-Memory] 执行工具: ${fnName}`, args);

                        let result;
                        if (fnName === 'search_keywords') {
                            const page = args.page || 1;
                            const memories = await searchMemoriesByKeywords(targetNovelId, args.keywords, page);
                            if (memories && memories.length > 0) {
                                result = memories.map(m => {
                                    let chap = typeof m.chapter_comprehension === 'string' ? JSON.parse(m.chapter_comprehension) : m.chapter_comprehension;
                                    let char = typeof m.character_comprehension === 'string' ? JSON.parse(m.character_comprehension) : m.character_comprehension;
                                    return `Chapter ${m.article_chapter} (${m.title}):\nSummary: ${JSON.stringify(chap)}\nCharacters: ${JSON.stringify(char)}`;
                                }).join('\n\n');
                                result = `Page ${page} Results:\n${result}`;
                            } else {
                                result = `Page ${page}: No memories found for these keywords.`;
                            }
                        } else {
                            result = "Unknown tool.";
                        }
                        
                        console.log(`  [SubAgent-Memory] Tool Result Length: ${result.length} chars`);

                        // Add a system reminder to keep the model focused on the original query
                        const resultWithReminder = result + `\n\n[系统提示: 记得回答用户的问题: "${query}". 如果你有足够的信息，请现在就回答用户的问题.]`;

                        messages.push({
                            role: "tool",
                            tool_call_id: toolCall.id,
                            content: resultWithReminder
                        });
                    }
                } else {
                    // No tool calls, return the content
                    return response.content;
                }
            } catch (e) {
                console.error("Memory sub-agent loop failed:", e);
                return "Failed to extract from memory due to error.";
            }
        }
        return "Failed to extract from memory (max loops reached).";
    }
}

// Start the system
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const chatSystem = new ChatSystem();
    chatSystem.start();
}

export { ChatSystem };
