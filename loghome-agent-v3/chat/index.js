import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';
import { getChapterContext, getNovelChapterIndex, searchMemoriesByKeywords } from '../utils/memoryManager.js';
import {
    getFullChapter,
    getNovelProfile,
    getReaderFeedbackSummary,
    searchChapters,
    searchNovelsByKeyword,
    searchNovelsByName,
} from '../utils/libraryHelper.js';
import { SessionLogger } from './utils/sessionLogger.js';
import { VolcengineClient } from './clients/volcengine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const secretPath = path.join(__dirname, '../secret.json');
let secret;
try {
    secret = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));
} catch (e) {
    console.error("Failed to load secret.json", e);
    process.exit(1);
}

const CHAT_CONFIG = secret.CHAT_MLLM_CONFIG;
const MAX_TOOL_STEPS = 8;
const MAX_CONTEXT_CHARS = 120000;
const TOKENS_PER_MILLION = 1_000_000;

const MODEL_PRICING_RULES = [
    {
        id: 'doubao-seed-1.6-lite',
        matcher: (model) => model.includes('doubao-seed-1-6-lite'),
        tiers: [
            { maxInputK: 32, inputPerMillion: 0.15, outputPerMillion: 1.2, shortOutputMaxK: 0.2, shortOutputPerMillion: 0.3 },
            { maxInputK: 128, inputPerMillion: 0.3, outputPerMillion: 2.0 },
            { maxInputK: 256, inputPerMillion: 0.6, outputPerMillion: 6.0 },
        ],
    },
    {
        id: 'doubao-seed-1.6-flash',
        matcher: (model) => model.includes('doubao-seed-1-6-flash'),
        tiers: [
            { maxInputK: 32, inputPerMillion: 0.075, outputPerMillion: 0.75 },
            { maxInputK: 128, inputPerMillion: 0.15, outputPerMillion: 1.5 },
            { maxInputK: 256, inputPerMillion: 0.3, outputPerMillion: 3.0 },
        ],
    },
    {
        id: 'doubao-seed-1.6',
        matcher: (model) => model.includes('doubao-seed-1-6') && !model.includes('lite') && !model.includes('flash'),
        tiers: [
            { maxInputK: 32, inputPerMillion: 0.4, outputPerMillion: 4.0, shortOutputMaxK: 0.2, shortOutputPerMillion: 1.0 },
            { maxInputK: 128, inputPerMillion: 0.6, outputPerMillion: 8.0 },
            { maxInputK: 256, inputPerMillion: 1.2, outputPerMillion: 12.0 },
        ],
    },
];

const logger = new SessionLogger();

function safeParseToolArgs(rawArgs) {
    try {
        return rawArgs ? JSON.parse(rawArgs) : {};
    } catch (error) {
        return {};
    }
}

function normalizeModelName(model) {
    return String(model || '').trim().toLowerCase().replace(/\./g, '-');
}

function pickPricingRule(modelName) {
    const normalized = normalizeModelName(modelName);
    return MODEL_PRICING_RULES.find((rule) => rule.matcher(normalized)) || null;
}

function pickPricingTier(rule, promptTokens) {
    const promptK = Number(promptTokens || 0) / 1000;
    return rule.tiers.find((tier) => promptK <= tier.maxInputK) || rule.tiers[rule.tiers.length - 1];
}

function estimateUsageCost(modelName, usage) {
    const rule = pickPricingRule(modelName);
    if (!rule || !usage) {
        return {
            supported: false,
            model: modelName,
        };
    }

    const promptTokens = Number(usage.prompt_tokens || 0);
    const completionTokens = Number(usage.completion_tokens || 0);
    const cachedTokens = Number(usage.prompt_tokens_details?.cached_tokens || 0);
    const tier = pickPricingTier(rule, promptTokens);
    const completionK = completionTokens / 1000;
    const outputPerMillion = tier.shortOutputPerMillion && completionK <= Number(tier.shortOutputMaxK || 0)
        ? tier.shortOutputPerMillion
        : tier.outputPerMillion;
    const inputCost = (promptTokens / TOKENS_PER_MILLION) * tier.inputPerMillion;
    const outputCost = (completionTokens / TOKENS_PER_MILLION) * outputPerMillion;

    return {
        supported: true,
        model: modelName,
        ruleId: rule.id,
        promptTokens,
        completionTokens,
        cachedTokens,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
    };
}

class ChatSystem {
    constructor() {
        this.client = new VolcengineClient(CHAT_CONFIG, logger);
        this.currentNovelId = null;
        this.currentNovelProfile = null;
        this.currentNovelContextMessage = null;
        this.currentConversationUsage = null;
        this.messages = [
            {
                role: "system",
                content: `你是一个小说阅读平台的聊天助手。
你的任务是根据站内已有的作品信息、章节内容、章节记忆和读者反馈来回答问题。

你拥有以下工具：
1. search_novels_by_name: 根据书名搜索小说，适合用户已经提到作品名时。
2. search_novels_by_keyword: 根据关键词搜索小说，适合用户只记得设定、桥段或元素时。
3. set_current_novel: 设置当前对话的小说，并获取该作品的完整画像，包括作者、标签、章节数、热度和反馈概况。
4. search_keywords: 在当前小说的记忆库中检索相关摘要，适合问剧情、设定、角色关系、事件回顾。
5. search_chapters: 在当前小说的章节标题和正文中搜索，更适合找具体场景、原文片段、某句话或某个物件。
6. get_chapter_context: 获取某章前后若干章的上下文摘要，适合补齐前因后果。
7. get_full_chapter: 获取单章全文，适合在上下文摘要不足时确认具体细节、原句和段落内容。
8. get_reader_feedback_summary: 获取当前小说的读者反馈和评论摘要，适合回答读者评价、争议点、吐槽点。
9. sendMessage: 向用户发送最终消息。这是你回复用户的唯一方式。

工作原则：
- 只要用户问题明显对应某部小说，就先定位作品，再调用 set_current_novel。
- 当当前小说上下文已经注入时，你应先利用这份全书目录与章节短摘要判断答案范围，再决定是否继续调用工具。
- 回答时优先基于工具结果，不要凭空补完剧情。
- 能指出章节时尽量指出章节；证据不足时要明确说明不确定。
- 如果用户问的是读者看法、争议、错漏反馈，优先使用 get_reader_feedback_summary。
- 如果用户问的是具体桥段或句子，优先使用 search_chapters，再视情况用 get_chapter_context 补上下文；如果还不够，再用 get_full_chapter 看单章全文。
- 在收集到足够信息后，必须调用 sendMessage 结束本轮回复。`
            }
        ];

        this.tools = [
            {
                type: "function",
                function: {
                    name: "search_novels_by_name",
                    description: "根据书名搜索小说，返回候选作品的作者、标签、章节数与热度信息，便于消歧。",
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
                    description: "根据关键词搜索小说，适合用户描述设定、事件或元素时使用。",
                    parameters: {
                        type: "object",
                        properties: {
                            keyword: {
                                type: "string",
                                description: "搜索关键词，可以是多个词"
                            }
                        },
                        required: ["keyword"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "set_current_novel",
                    description: "设置当前对话的小说，并返回该作品的完整画像。设置后才可以使用小说内检索工具。",
                    parameters: {
                        type: "object",
                        properties: {
                            novel_id: {
                                type: "integer",
                                description: "小说ID"
                            }
                        },
                        required: ["novel_id"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "search_keywords",
                    description: "在当前小说的记忆库中搜索摘要，返回章节、命中字段、命中关键词和证据片段。",
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
                                description: "页码，从1开始。每页10条。",
                                default: 1
                            }
                        },
                        required: ["keywords"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "search_chapters",
                    description: "在当前小说的章节标题和正文中搜索，适合找具体情节、原文片段、细节道具或台词。",
                    parameters: {
                        type: "object",
                        properties: {
                            query: {
                                type: "string",
                                description: "搜索关键词或问题中的核心短语"
                            },
                            page: {
                                type: "integer",
                                description: "页码，从1开始。每页5条。",
                                default: 1
                            }
                        },
                        required: ["query"]
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "get_chapter_context",
                    description: "获取某章前后若干章的上下文摘要。请至少提供 article_id 或 chapter 其中之一。",
                    parameters: {
                        type: "object",
                        properties: {
                            article_id: {
                                type: "integer",
                                description: "章节 article_id"
                            },
                            chapter: {
                                type: "integer",
                                description: "章节号"
                            },
                            radius: {
                                type: "integer",
                                description: "向前向后各取多少章，默认2，最大5",
                                default: 2
                            }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "get_full_chapter",
                    description: "获取单章全文纯文本。适合在摘要和上下文仍不足时，确认具体细节、句子和场景。",
                    parameters: {
                        type: "object",
                        properties: {
                            article_id: {
                                type: "integer",
                                description: "章节 article_id"
                            },
                            chapter: {
                                type: "integer",
                                description: "章节号"
                            }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "get_reader_feedback_summary",
                    description: "获取当前小说的读者反馈与评论摘要，适合回答读者评价、吐槽和争议点。",
                    parameters: {
                        type: "object",
                        properties: {
                            limit: {
                                type: "integer",
                                description: "返回的反馈和评论条数，默认5",
                                default: 5
                            }
                        }
                    }
                }
            },
            {
                type: "function",
                function: {
                    name: "sendMessage",
                    description: "向用户发送最终消息。若证据不足，要明确说明不确定。",
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
        this.currentConversationUsage = {
            promptTokens: 0,
            completionTokens: 0,
            cachedTokens: 0,
            totalCost: 0,
            calls: 0,
            estimates: [],
            unsupportedModels: new Set(),
        };
        this.messages.push({ role: "user", content: input });

        let finished = false;
        let stepCount = 0;

        while (!finished && stepCount < MAX_TOOL_STEPS) {
            stepCount += 1;
            try {
                const completion = await this.client.chat(this.buildMessagesForModel(), this.tools, 'fast', 'Agent');
                const responseMessage = completion.message;
                this.recordUsage(completion.model, completion.usage);
                this.messages.push(responseMessage);

                if (responseMessage.tool_calls) {
                    for (const toolCall of responseMessage.tool_calls) {
                        if (finished) break;

                        const fnName = toolCall.function.name;
                        const args = safeParseToolArgs(toolCall.function.arguments);
                        console.log(`>> 执行工具: ${fnName}`, args);

                        let result;
                        if (fnName === 'sendMessage') {
                            console.log(`\n\x1b[32mAgent: ${args.message}\x1b[0m\n`);
                            result = { success: true, message: 'Message sent.' };
                            finished = true;
                        } else if (fnName === 'search_novels_by_name') {
                            result = await searchNovelsByName(args.name || '');
                        } else if (fnName === 'search_novels_by_keyword') {
                            result = await searchNovelsByKeyword(args.keyword || '');
                        } else if (fnName === 'set_current_novel') {
                            result = await this.setCurrentNovel(args.novel_id);
                        } else if (fnName === 'search_keywords') {
                            result = await this.searchKeywords(args.keywords || [], args.page || 1);
                        } else if (fnName === 'search_chapters') {
                            result = await this.searchChapters(args.query || '', args.page || 1);
                        } else if (fnName === 'get_chapter_context') {
                            result = await this.getChapterContext(args);
                        } else if (fnName === 'get_full_chapter') {
                            result = await this.getFullChapter(args);
                        } else if (fnName === 'get_reader_feedback_summary') {
                            result = await this.getReaderFeedbackSummary(args.limit || 5);
                        } else {
                            result = { error: "Unknown tool." };
                        }

                        const resultStr = typeof result === 'string' ? result : JSON.stringify(result);
                        console.log(`<< 工具结果 (${fnName}):`, resultStr.substring(0, 300) + (resultStr.length > 300 ? "..." : ""));
                        logger.write(`[Tool] ${fnName}`, { args, result });

                        this.messages.push({
                            role: "tool",
                            name: fnName,
                            tool_call_id: toolCall.id,
                            content: JSON.stringify(result)
                        });
                    }
                } else if (responseMessage.content) {
                    const finalContent = responseMessage.content.replace(/<think[\s\S]*?<\/think>/gi, '').trim();
                    if (finalContent) {
                        console.log(`\n\x1b[32mAgent (Direct): ${finalContent}\x1b[0m\n`);
                    }
                    finished = true;
                }
            } catch (error) {
                console.error("Error in chat loop:", error);
                finished = true;
            }
        }

        if (!finished && stepCount >= MAX_TOOL_STEPS) {
            const fallback = '我暂时没有收集到足够稳定的证据来回答这个问题。你可以补充作品名、角色名，或者直接问具体章节和桥段。';
            console.log(`\n\x1b[33mAgent: ${fallback}\x1b[0m\n`);
            this.messages.push({ role: 'assistant', content: fallback });
        }

        this.printConversationCostSummary();
    }

    buildMessagesForModel() {
        if (!this.currentNovelContextMessage) {
            return this.messages;
        }

        const baseMessages = Array.isArray(this.messages) ? [...this.messages] : [];
        baseMessages.splice(1, 0, {
            role: 'system',
            content: this.currentNovelContextMessage,
        });
        return baseMessages;
    }

    buildNovelContextMessage(profile, chapterIndex) {
        const headerLines = [
            '以下是当前已锁定作品的全局上下文，可直接用于回答问题和规划后续检索：',
            `作品ID：${profile.novel_id}`,
            `作品名：${profile.name}`,
            `作者：${profile.author || '未知'}`,
            `标签：${(profile.tags || []).join('、') || '无'}`,
            `章节数：${profile.chapter_count || 0}`,
            `最新章节：${profile.latest_chapter ?? '未知'}`,
            `总字数：${profile.text_count || 0}`,
            `最近更新时间：${profile.update_time || '未知'}`,
            `收藏数：${profile.bookcase_count || 0}`,
            `评论数：${profile.comment_count || 0}`,
            `待处理反馈数：${profile.pending_feedback_count || 0}`,
            `作品简介：${profile.description || '无'}`,
            '',
            '章节目录与短摘要：',
        ];

        const chapterLines = chapterIndex.map((item) => {
            const summary = item.short_summary
                ? `摘要：${item.short_summary}`
                : '摘要：暂无';
            return `第${item.chapter}章｜article_id=${item.article_id}｜标题：${item.title || '未命名'}｜${summary}`;
        });

        const fullContext = [...headerLines, ...chapterLines].join('\n');
        if (fullContext.length <= MAX_CONTEXT_CHARS) {
            return fullContext;
        }

        let truncated = [...headerLines];
        let length = truncated.join('\n').length;
        let includedCount = 0;
        for (const line of chapterLines) {
            if (length + line.length + 1 > MAX_CONTEXT_CHARS) {
                break;
            }
            truncated.push(line);
            length += line.length + 1;
            includedCount += 1;
        }
        truncated.push('');
        truncated.push(`注意：当前作品章节总览过长，已在上下文中注入前 ${includedCount} 章的目录与摘要。若问题涉及更后面的章节，请继续调用 search_keywords、search_chapters 或 get_chapter_context。`);
        return truncated.join('\n');
    }

    async setCurrentNovel(novelId) {
        const profile = await getNovelProfile(novelId);
        if (!profile) {
            return { success: false, error: "Novel not found." };
        }

        const chapterIndex = await getNovelChapterIndex(novelId);

        this.currentNovelId = Number(novelId);
        this.currentNovelProfile = profile;
        this.currentNovelContextMessage = this.buildNovelContextMessage(profile, chapterIndex);
        return {
            success: true,
            novel: profile,
            chapter_index_count: chapterIndex.length,
            context_ready: true,
        };
    }

    async searchKeywords(keywords, page = 1) {
        if (!this.currentNovelId) {
            return { error: "请先设置当前小说 (使用 set_current_novel 工具)。" };
        }

        return searchMemoriesByKeywords(this.currentNovelId, keywords, page);
    }

    async searchChapters(query, page = 1) {
        if (!this.currentNovelId) {
            return { error: "请先设置当前小说 (使用 set_current_novel 工具)。" };
        }

        return searchChapters(this.currentNovelId, query, page);
    }

    async getChapterContext(options = {}) {
        if (!this.currentNovelId) {
            return { error: "请先设置当前小说 (使用 set_current_novel 工具)。" };
        }

        return getChapterContext(this.currentNovelId, options);
    }

    async getFullChapter(options = {}) {
        if (!this.currentNovelId) {
            return { error: "请先设置当前小说 (使用 set_current_novel 工具)。" };
        }

        return getFullChapter(this.currentNovelId, options);
    }

    async getReaderFeedbackSummary(limit = 5) {
        if (!this.currentNovelId) {
            return { error: "请先设置当前小说 (使用 set_current_novel 工具)。" };
        }

        return getReaderFeedbackSummary(this.currentNovelId, limit);
    }

    recordUsage(modelName, usage) {
        if (!this.currentConversationUsage || !usage) {
            return;
        }

        this.currentConversationUsage.calls += 1;
        this.currentConversationUsage.promptTokens += Number(usage.prompt_tokens || 0);
        this.currentConversationUsage.completionTokens += Number(usage.completion_tokens || 0);
        this.currentConversationUsage.cachedTokens += Number(usage.prompt_tokens_details?.cached_tokens || 0);

        const estimate = estimateUsageCost(modelName, usage);
        if (estimate.supported) {
            this.currentConversationUsage.totalCost += estimate.totalCost;
            this.currentConversationUsage.estimates.push(estimate);
        } else if (modelName) {
            this.currentConversationUsage.unsupportedModels.add(modelName);
        }
    }

    printConversationCostSummary() {
        if (!this.currentConversationUsage) {
            return;
        }

        const summary = this.currentConversationUsage;
        const unsupportedModels = Array.from(summary.unsupportedModels);
        const lines = [
            '=== 本轮对话费用估算 ===',
            `API调用次数: ${summary.calls}`,
            `Prompt tokens: ${summary.promptTokens}`,
            `Completion tokens: ${summary.completionTokens}`,
            `Cached prompt tokens: ${summary.cachedTokens}`,
        ];

        if (summary.estimates.length > 0) {
            lines.push(`估算费用: ${summary.totalCost.toFixed(6)} 元`);
        } else {
            lines.push('估算费用: 当前模型未配置价格，无法计算');
        }

        if (unsupportedModels.length > 0) {
            lines.push(`未配置价格的模型: ${unsupportedModels.join(', ')}`);
        }

        const text = lines.join('\n');
        console.log(`\n${text}\n`);
        logger.write('[Conversation Cost Summary]', {
            calls: summary.calls,
            prompt_tokens: summary.promptTokens,
            completion_tokens: summary.completionTokens,
            cached_prompt_tokens: summary.cachedTokens,
            estimated_cost_cny: Number(summary.totalCost.toFixed(6)),
            unsupported_models: unsupportedModels,
        });
    }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
    const chatSystem = new ChatSystem();
    chatSystem.start();
}

export { ChatSystem };
