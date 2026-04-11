function escapeRegExp(value) {
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export class VolcengineClient {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
        this.apiKey = config.apiKey;
        this.toolCallMode = String(config.toolCallMode || config.tool_call_mode || 'native').trim().toLowerCase();
    }

    shouldSendNativeTools() {
        return this.toolCallMode === 'native' || this.toolCallMode === 'auto';
    }

    buildExplicitToolInstruction(tools) {
        const toolNames = (tools || []).map((tool) => tool?.function?.name).filter(Boolean);
        const toolSchemas = (tools || []).map((tool) => ({
            name: tool?.function?.name,
            description: tool?.function?.description,
            parameters: tool?.function?.parameters,
        }));

        return {
            role: 'system',
            content: `当前模型不支持原生 tool_calls，你必须使用显式工具调用协议。
当你需要调用工具时，不要输出给用户的解释文本，只输出一个或多个如下格式的块：
<explicit_tool_call>
{"name":"工具名","arguments":{"参数名":"参数值"}}
</explicit_tool_call>

要求：
- 只能调用这些工具：${toolNames.join(', ')}
- <explicit_tool_call> 标签内必须是合法 JSON
- 必须使用 <explicit_tool_call> 而非 <tool_call>
- arguments 必须是对象
- 如果需要连续调用多个工具，就连续输出多个 <explicit_tool_call> 块
- 不要在工具调用后追加 FINISHED、说明文字或 markdown
- 只有当你已经得出最终结论时，才调用 sendMessage

以下是可用工具定义：
${JSON.stringify(toolSchemas, null, 2)}`
        };
    }

    buildMessages(messages, tools) {
        if (this.toolCallMode !== 'explicit' || !tools || tools.length === 0) {
            return messages;
        }

        return [
            this.buildExplicitToolInstruction(tools),
            ...this.normalizeMessagesForExplicitMode(messages),
        ];
    }

    normalizeMessagesForExplicitMode(messages) {
        const normalized = [];
        for (const message of Array.isArray(messages) ? messages : []) {
            if (!message || typeof message !== 'object') {
                continue;
            }

            if (message.role === 'tool') {
                const toolName = message.name || message.tool_name || 'unknown_tool';
                normalized.push({
                    role: 'system',
                    content: `工具 ${toolName} 返回结果：\n${message.content || ''}`,
                });
                continue;
            }

            if (message.role === 'assistant' && Array.isArray(message.tool_calls) && message.tool_calls.length > 0) {
                const cleanedContent = this.stripControlBlocks(message.content || '');
                if (cleanedContent) {
                    normalized.push({
                        role: 'assistant',
                        content: cleanedContent,
                    });
                }
                continue;
            }

            normalized.push(message);
        }
        return normalized;
    }

    parseExplicitToolCalls(content) {
        const source = String(content || '');
        const matches = [...source.matchAll(/<explicit_tool_call>\s*([\s\S]*?)\s*<\/explicit_tool_call>/gi)];
        if (matches.length === 0) {
            return null;
        }

        const toolCalls = [];
        for (let index = 0; index < matches.length; index += 1) {
            const rawJson = String(matches[index][1] || '').trim();
            let parsed;
            try {
                parsed = JSON.parse(rawJson);
            } catch (error) {
                return null;
            }

            if (!parsed || typeof parsed !== 'object' || !parsed.name) {
                return null;
            }

            toolCalls.push({
                id: `explicit_call_${Date.now()}_${index}`,
                type: 'function',
                function: {
                    name: String(parsed.name),
                    arguments: JSON.stringify(
                        parsed.arguments && typeof parsed.arguments === 'object'
                            ? parsed.arguments
                            : {}
                    ),
                }
            });
        }

        return toolCalls;
    }

    stripControlBlocks(content) {
        let cleaned = String(content || '');
        cleaned = cleaned.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
        cleaned = cleaned.replace(/<explicit_tool_call>\s*[\s\S]*?<\/explicit_tool_call>/gi, '').trim();
        cleaned = cleaned.replace(/\bFINISHED\b/gi, '').trim();
        return cleaned;
    }

    getDisplayContent(message) {
        return this.stripControlBlocks(message?.content || '');
    }

    extractMessagePayload(data) {
        if (!data || typeof data !== 'object') {
            throw new Error('API returned an empty response body');
        }

        if (typeof data.code === 'number' && data.code !== 0) {
            const message = data.message || data.msg || 'Unknown API error';
            throw new Error(`API business error: ${message} (code: ${data.code})`);
        }

        if (Array.isArray(data.choices) && data.choices.length > 0 && data.choices[0]?.message) {
            return {
                message: data.choices[0].message,
                usage: data.usage || null,
                model: data.model || null,
            };
        }

        if (data.message && typeof data.message === 'object' && (data.message.content !== undefined || data.message.tool_calls)) {
            return {
                message: data.message,
                usage: data.usage || null,
                model: data.model || null,
            };
        }

        if (data.data && typeof data.data === 'object') {
            if (Array.isArray(data.data.choices) && data.data.choices.length > 0 && data.data.choices[0]?.message) {
                return {
                    message: data.data.choices[0].message,
                    usage: data.data.usage || data.usage || null,
                    model: data.data.model || data.model || null,
                };
            }

            if (data.data.message && typeof data.data.message === 'object') {
                return {
                    message: data.data.message,
                    usage: data.data.usage || data.usage || null,
                    model: data.data.model || data.model || null,
                };
            }
        }

        throw new Error(`API returned an unsupported response shape: ${JSON.stringify(data).slice(0, 400)}`);
    }

    async chat(messages, tools = null, modelType = 'deep', agentName = 'System') {
        const model = this.config.model[modelType];
        if (!model) throw new Error(`Model type ${modelType} not found in config`);

        console.log(`\n=== [${agentName}] 开始思考 (Model: ${modelType}) ===`);

        const url = `${this.baseUrl}/chat/completions`;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.apiKey}`
        };

        const requestMessages = this.buildMessages(messages, tools);
        const body = {
            model,
            messages: requestMessages,
            stream: false
        };

        if (tools && this.shouldSendNativeTools()) {
            body.tools = tools;
        }

        if (this.logger) this.logger.write(`[${agentName}] Request Payload`, body);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            if (this.logger) this.logger.write(`[${agentName}] Response Data`, data);

            const payload = this.extractMessagePayload(data);
            const message = payload.message;
            const explicitToolCalls = !message.tool_calls ? this.parseExplicitToolCalls(message.content) : null;
            if (explicitToolCalls && explicitToolCalls.length > 0) {
                message.tool_calls = explicitToolCalls;
            }

            if (message.content) {
                const thinkMatch = message.content.match(/<think>([\s\S]*?)<\/think>/i);
                if (thinkMatch) {
                    console.log(`\n[${agentName} - 深度思考]:\n${thinkMatch[1].trim()}\n`);
                }

                const contentDisplay = this.getDisplayContent(message);
                if (contentDisplay) {
                    console.log(`[${agentName} - 回复]: ${contentDisplay}`);
                }
            }

            if (message.tool_calls) {
                console.log(`[${agentName} - 工具调用]: 准备调用 ${message.tool_calls.length} 个工具`);
            }

            console.log(`=== [${agentName}] 思考结束 ===\n`);
            return {
                message,
                usage: payload.usage || null,
                model: payload.model || model,
            };
        } catch (error) {
            console.error("LLM Call Error:", error);
            throw error;
        }
    }
}
