/**
 * MLLM Client for calling LLM APIs.
 */

const fs = require('fs');
const path = require('path');
const config = require('../config');

const MLLM_TEMPORARILY_UNAVAILABLE_CODE = 'MLLM_TEMPORARILY_UNAVAILABLE';

function createTemporarilyUnavailableError() {
    const error = new Error("All MLLM models are temporarily unavailable. Task stopped.");
    error.code = MLLM_TEMPORARILY_UNAVAILABLE_CODE;
    return error;
}

function isMllmTemporarilyUnavailableError(error) {
    return error?.code === MLLM_TEMPORARILY_UNAVAILABLE_CODE
        || error?.message === "All MLLM models are temporarily unavailable. Task stopped.";
}

function buildMllmConfigList() {
    const list = [];
    const api = config.api?.chapterSummary;

    if (api?.baseUrl && api?.apiKey) {
        list.push({
            baseUrl: api.baseUrl,
            apiKey: api.apiKey,
            modelMap: {
                fast: api.model || 'qwen-reasoner',
                speed: api.model || 'qwen-reasoner',
                deep: api.model || 'qwen-reasoner',
            },
            maxContextLength: config.llmContextLimitTokens || 200000,
        });
    }

    return list;
}

const MLLM_CONFIG_LIST = buildMllmConfigList();
const IMAGE_MLLM_CONFIG = (() => {
    const api = config.api?.imageUnderstanding;
    return api?.baseUrl && api?.apiKey
        ? {
            baseUrl: api.baseUrl,
            apiKey: api.apiKey,
            model: api.model || 'qwen3.6-chat',
            maxContextLength: config.llmContextLimitTokens || 200000,
        }
        : null;
})();

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
        const cfg = this.configs[this.currentConfigIndex];
        return cfg.maxContextLength || 128000;
    }

    async call(prompt, mode = 'fast', specificConfig = null) {
        let cfg;
        let model;

        if (specificConfig) {
            cfg = specificConfig;
            if (typeof cfg.model === 'object' && cfg.model !== null) {
                model = cfg.model[mode] || cfg.model['fast'] || Object.values(cfg.model)[0];
            } else {
                model = cfg.model;
            }
        } else {
            if (!this.configs || this.configs.length === 0) {
                throw new Error("No MLLM configurations found.");
            }
            cfg = this.configs[this.currentConfigIndex];
            const modelMap = cfg.modelMap || {};
            model = modelMap[mode] || modelMap['fast'];
        }

        let baseUrl = cfg.baseUrl;
        if (baseUrl.endsWith('/')) baseUrl = baseUrl.slice(0, -1);
        const url = `${baseUrl}/chat/completions`;

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${cfg.apiKey}`
        };

        const content = typeof prompt === 'string' ? prompt : prompt;

        const requestBody = {
            model: model,
            messages: [{ role: "user", content: content }],
            max_completion_tokens: Math.max(1, Math.min(Number(config.llmMaxCompletionTokens || 2048), 8192)),
            stream: false
        };

        const startTime = new Date();
        let responseContent = null;
        let errorObj = null;

        try {
            const fetch = require('node-fetch');
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
            if (data.base_resp && Number(data.base_resp.status_code || 0) !== 0) {
                throw new Error(data.base_resp.status_msg || 'OpenAI-compatible gateway business error');
            }
            responseContent = data.choices?.[0]?.message?.content || null;

            if (!responseContent && data.choices?.[0]?.message?.reasoning_content) {
                responseContent = data.choices[0].message.reasoning_content;
            }

            if (responseContent === null) {
                throw new Error("Model returned null content");
            }

            responseContent = responseContent.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

            if (!specificConfig) {
                this.consecutiveFailures = 0;
            }
            return responseContent;
        } catch (error) {
            errorObj = error;
            if (specificConfig) {
                console.error(`Specific Config MLLM Call failed:`, error.message);
                throw error;
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

const mllmClient = new MLLMClient();

module.exports = {
    mllmClient,
    MLLM_TEMPORARILY_UNAVAILABLE_CODE,
    IMAGE_MLLM_CONFIG,
    isMllmTemporarilyUnavailableError,
};
