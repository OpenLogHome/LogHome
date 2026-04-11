import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load secret.json
const secretPath = path.join(__dirname, '../secret.json');
let secret;
try {
    secret = JSON.parse(fs.readFileSync(secretPath, 'utf-8'));
} catch (e) {
    console.error("Failed to load secret.json", e);
    secret = {};
}

const MLLM_CONFIG_LIST = secret.MLLM_CONFIG_LIST || [];
export const IMAGE_MLLM_CONFIG = secret.IMAGE_MLLM_CONFIG || null;
export const MLLM_TEMPORARILY_UNAVAILABLE_CODE = 'MLLM_TEMPORARILY_UNAVAILABLE';

function createTemporarilyUnavailableError() {
    const error = new Error("All MLLM models are temporarily unavailable. Task stopped.");
    error.code = MLLM_TEMPORARILY_UNAVAILABLE_CODE;
    return error;
}

function isMllmTemporarilyUnavailableError(error) {
    return error?.code === MLLM_TEMPORARILY_UNAVAILABLE_CODE
        || error?.message === "All MLLM models are temporarily unavailable. Task stopped.";
}

class MLLMClient {
    constructor() {
        this.logDir = path.join(process.cwd(), 'logs');
        if (!fs.existsSync(this.logDir)) {
            fs.mkdirSync(this.logDir, { recursive: true });
        }
        this.configs = MLLM_CONFIG_LIST;
        this.currentConfigIndex = 0;
        this.consecutiveFailures = 0;
    }

    getMaxContextLength() {
        if (!this.configs || this.configs.length === 0) {
            return 128000;
        }
        const config = this.configs[this.currentConfigIndex];
        return config.maxContextLength || 128000;
    }

    /**
     * 调用 MLLM 模型
     * @param {string|Array} prompt - 提示词 (string) 或 多模态内容数组 (Array)
     * @param {string} mode - 访问类型：'极速'/'speed', '快速'/'fast', '深思'/'deep'
     * @param {Object} [specificConfig] - 可选：指定的配置对象 (如 IMAGE_MLLM_CONFIG)
     * @returns {Promise<string>} - 模型返回的内容
     */
    async call(prompt, mode = 'fast', specificConfig = null) {
        let config;
        let model;

        if (specificConfig) {
            config = specificConfig;
            if (typeof config.model === 'object' && config.model !== null) {
                model = config.model[mode] || config.model['fast'] || Object.values(config.model)[0];
            } else {
                model = config.model;
            }
        } else {
            if (!this.configs || this.configs.length === 0) {
                throw new Error("No MLLM configurations found in secret.json (MLLM_CONFIG_LIST).");
            }
            config = this.configs[this.currentConfigIndex];
            const modelMap = config.modelMap || {};
            model = modelMap[mode] || modelMap['fast'];
        }

        let baseUrl = config.baseUrl;
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
        const url = `${baseUrl}/chat/completions`;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.apiKey}`
        };

        const content = typeof prompt === 'string' ? prompt : prompt;

        const requestBody = {
            model: model,
            messages: [{ role: "user", content: content }],
            stream: false
        };

        const startTime = new Date();
        let responseContent = null;
        let errorObj = null;

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(requestBody)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API call failed: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();
            responseContent = data.choices?.[0]?.message?.content || null;
            
            if (responseContent === null) {
                throw new Error("Model returned null content");
            }

            // Remove <think> tags and their content
            responseContent = responseContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

            if (!specificConfig) {
                this.consecutiveFailures = 0;
            }
            return responseContent;
        } catch (error) {
            errorObj = error;
            if (specificConfig) {
                console.error(`Specific Config MLLM Call failed:`, error.message);
                throw error; // Don't failover if using specific config
            }
            return this._handleFailure(prompt, mode, error);
        } finally {
            this._logTransaction(startTime, mode, model, prompt, responseContent, errorObj);
        }
    }

    async _handleFailure(prompt, mode, error) {
        console.error(`MLLM Call failed (Config ${this.currentConfigIndex}):`, error.message);
        this.consecutiveFailures++;

        if (this.consecutiveFailures > 3) {
            console.warn(`Config ${this.currentConfigIndex} failed > 3 times. Switching...`);
            this.currentConfigIndex++;
            this.consecutiveFailures = 0;

            if (this.currentConfigIndex >= this.configs.length) {
                throw createTemporarilyUnavailableError();
            }

            console.log(`Retrying with Config ${this.currentConfigIndex}...`);
            return this.call(prompt, mode);
        }

        console.log(`Retrying with current Config ${this.currentConfigIndex} (Attempt ${this.consecutiveFailures})...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.call(prompt, mode);
    }

    _logTransaction(startTime, mode, model, prompt, response, error) {
        const isoString = startTime.toISOString();
        const hourDir = isoString.slice(0, 13).replace('T', '_');
        const logSubDir = path.join(this.logDir, hourDir);
        if (!fs.existsSync(logSubDir)) {
            fs.mkdirSync(logSubDir, { recursive: true });
        }
        const timestamp = isoString.replace(/[:.]/g, '-');
        const logFile = path.join(logSubDir, `mllm_${timestamp}.log`);
        
        const logContent = `
=== MLLM Transaction Log ===
Time: ${startTime.toISOString()}
Mode: ${mode}
Model: ${model}
Status: ${error ? 'ERROR' : 'SUCCESS'}

--- Request Prompt ---
${prompt}

--- Response ---
${error ? `Error: ${error.message}\nStack: ${error.stack}` : response}
============================
`;

        try {
            fs.writeFileSync(logFile, logContent, 'utf8');
        } catch (logError) {
            console.error("Failed to write log file:", logError);
        }
    }
}

export const mllmClient = new MLLMClient();
export { isMllmTemporarilyUnavailableError };
