export class VolcengineClient {
    constructor(config, logger) {
        this.config = config;
        this.logger = logger;
        this.baseUrl = config.baseUrl.endsWith('/') ? config.baseUrl.slice(0, -1) : config.baseUrl;
        this.apiKey = config.apiKey;
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

        const body = {
            model: model,
            messages: messages,
            stream: false
        };

        if (tools) {
            body.tools = tools;
        }

        // Log request to file
        if (this.logger) this.logger.write(`[${agentName}] Request Payload`, body);

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            
            // Log response to file
            if (this.logger) this.logger.write(`[${agentName}] Response Data`, data);

            const message = data.choices[0].message;

            // Log thinking/content
            if (message.content) {
                const thinkMatch = message.content.match(/<think>([\s\S]*?)<\/think>/i);
                if (thinkMatch) {
                    console.log(`\n[${agentName} - 深度思考]:\n${thinkMatch[1].trim()}\n`);
                } 
                
                const contentDisplay = message.content.replace(/<think>[\s\S]*?<\/think>/gi, '[...Think Block...]').trim();
                if (contentDisplay) {
                    console.log(`[${agentName} - 回复]: ${contentDisplay}`);
                }
            }

            if (message.tool_calls) {
                console.log(`[${agentName} - 工具调用]: 准备调用 ${message.tool_calls.length} 个工具`);
            }

            console.log(`=== [${agentName}] 思考结束 ===\n`);
            return message;
        } catch (error) {
            console.error("LLM Call Error:", error);
            throw error;
        }
    }
}
