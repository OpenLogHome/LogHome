let { query } = require('./sql.js');
let https = require('https');
const config = require("./config.js")

// 定义 API Key，实际使用时请替换为真实 Key
const API_KEY = config.API_KEY;

/**
 * 调用 GLM-4.5-flash 进行文本审核
 * @param {string} content - 需要审核的文本内容
 * @returns {Promise<Array>} - 返回审核结果数组
 */
async function checkTextWithGLM(content) {
    const maxRetries = 8;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
        try {
            return await new Promise((resolve, reject) => {
                const data = JSON.stringify({
                    "model": "glm-4.5-flash",
                    "messages": [
                        {
                            "role": "system",
                            "content": `你现在是文本合规审核器，按以下规则完成审核：
1. 你需要审核以下4类不合规内容：违法违规类、色情低俗类、暴力血腥类、恶意营销类
1.1 违法违规类：	违反国家法律法规、政策的内容，以及教唆、诱导他人违法的内容。
1.2 色情低俗类：	直接描绘性行为或含有性暗示的内容，以及诱导产生性联想的低俗内容。
1.3 暴力血腥类：宣扬暴力、虐待、残害或展示血腥场面的内容，以及教唆、诱导他人使用暴力或进行自残的内容。
1.4 恶意营销类：推荐特定品牌的商品，或是推荐原木文社以外的平台账号，例如抖音、B站、微信/QQ群的内容。
2. 判定规则：只有文本有确凿相关表述/明显倾向/鼓励性质才判定问题，每类给1-5的倾向分数：
1分=完全无倾向；2分=极微弱表述，不违规；3分=违规风险较高；4分=表述明确证据较足，高违规倾向；5分=表述直接证据确凿，确定违规
3. 必须按以下格式返回（后端可识别）：
[
{"类型":"违法违规类","分数":数值},
{"类型":"色情低俗类","分数":数值},
{"类型":"暴力血腥类","分数":数值},
{"类型":"恶意营销类","分数":数值}
]
请完成上述需求。`
                        },
                        {
                            "role": "user",
                            "content": content
                        }
                    ],
                    "temperature": 0.2,
                    "stream": false,
                    "do_sample": true,
                    "top_p": 0.95,
                    "response_format": {
                        "type": "text" // GLM-4 currently might return text that is json string
                    }
                });

                const options = {
                    hostname: 'open.bigmodel.cn',
                    path: '/api/paas/v4/chat/completions',
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${API_KEY}`,
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(data)
                    }
                };

                const req = https.request(options, (res) => {
                    let responseBody = '';

                    res.on('data', (chunk) => {
                        responseBody += chunk;
                    });

                    res.on('end', () => {
                        if (res.statusCode >= 200 && res.statusCode < 300) {
                            try {
                                const parsedBody = JSON.parse(responseBody);
                                if (parsedBody.error) {
                                     reject(new Error(`API Error: ${JSON.stringify(parsedBody.error)}`));
                                     return;
                                }

                                const content = parsedBody.choices[0].message.content;
                                // 尝试解析返回的 JSON 字符串
                                // 有时候模型可能返回 ```json ... ``` 格式，需要处理
                                let jsonStr = content;
                                const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) || content.match(/```\s*([\s\S]*?)\s*```/);
                                if (jsonMatch) {
                                    jsonStr = jsonMatch[1];
                                }
                                const result = JSON.parse(jsonStr);
                                resolve(result);
                            } catch (e) {
                                console.error('解析 GLM 返回结果失败:', e, responseBody);
                                // 如果解析失败，但调用成功，可能需要人工复核，或者默认通过？这里选择抛出错误
                                reject(new Error('解析 GLM 返回结果失败'));
                            }
                        } else {
                            console.error('GLM API 调用失败:', res.statusCode, responseBody);
                            reject(new Error(`GLM API 调用失败: ${res.statusCode}`));
                        }
                    });
                });

                req.on('error', (error) => {
                    console.error('请求 GLM API 出错:', error);
                    reject(error);
                });

                req.write(data);
                req.end();
            });
        } catch (error) {
            lastError = error;
            if (attempt <= maxRetries) {
                const waitTime = attempt * 3000; // 线性退避: 3s, 6s, 9s, 12s, 15s
                console.warn(`GLM请求失败 (第 ${attempt} 次重试)，等待 ${waitTime}ms 后重试... 错误: ${error.message}`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }
    throw lastError || new Error("GLM API 请求多次失败");
}

/**
 * 将长文本拆分为多个片段
 * @param {string} text - 待拆分的文本
 * @param {number} maxLen - 每个片段的最大长度，默认8000
 * @returns {Array<string>} - 拆分后的文本数组
 */
function splitText(text, maxLen = 8000) {
    if (text.length <= maxLen) return [text];
    const parts = Math.ceil(text.length / maxLen);
    const chunkSize = Math.ceil(text.length / parts);
    const chunks = [];
    for (let i = 0; i < parts; i++) {
        chunks.push(text.slice(i * chunkSize, (i + 1) * chunkSize));
    }
    return chunks;
}

/**
 * 执行文章审核任务
 */
async function auditArticles() {
    try {
        console.log('开始执行文章自动审核任务');
        
        // 1. 获取未审核的文章
        const articlesToAudit = await query(
            'SELECT * FROM articles WHERE audit_status = \'Uncheck\' and is_draft = 0'
        );

        if (!articlesToAudit || articlesToAudit.length === 0) {
            console.log('没有待审核的文章');
            return { success: true, message: '没有待审核的文章' };
        }

        for (let i = 0; i < articlesToAudit.length; i++) {
            const article = articlesToAudit[i];
            console.log(`正在自动审核文章 ${article.article_id} ${article.title}`);

            let contentToAudit = "";
            
            // 处理富文本内容
            if (article.article_type == "richtext") {
                try {
                    const parsedContent = JSON.parse(article.content);
                    if (Array.isArray(parsedContent)) {
                        for (let j = 0; j < parsedContent.length; j++) {
                            if (parsedContent[j].type == "text") {
                                contentToAudit += parsedContent[j].value;
                            }
                        }
                    } else {
                        // 如果不是数组，可能已经是纯文本或者格式不对，直接拼接到 title 后
                        contentToAudit = String(article.content);
                    }
                } catch (e) {
                    // JSON 解析失败，当作普通文本处理
                    contentToAudit = String(article.content);
                }
            } else {
                contentToAudit = String(article.content);
            }

            // 拼接标题和内容
            const fullText = article.title + ' ' + contentToAudit;
            
            // 拆分长文本，限制为 6000 字符以确保加上系统 prompt 后不超过 8k token 上下文限制
            const textChunks = splitText(fullText, 6000);
            
            try {
                let allAuditResults = [];
                let isViolation = false;
                let violationReasons = [];
                
                // 对每个片段进行审核
                for (const chunk of textChunks) {
                    // 调用 GLM 进行审核
                    const chunkResult = await checkTextWithGLM(chunk);
                    
                    if (!chunkResult || !Array.isArray(chunkResult)) {
                         throw new Error("单次审核返回结果无效");
                    }

                    console.log(JSON.stringify(chunkResult))
                    
                    allAuditResults = allAuditResults.concat(chunkResult);
                    
                    // 检查该片段是否有违规项 (分数 >= 4)
                    for (const item of chunkResult) {
                        if (item["分数"] >= 4) {
                            isViolation = true;
                            violationReasons.push(`${item["类型"]}(${item["分数"]}分)`);
                        }
                    }
                    
                    // 简单的延时，避免 QPS 过高
                    await new Promise(resolve => setTimeout(resolve, 5000));
                }

                if (!isViolation) {
                    console.log("审核通过");
                    await query(
                        'UPDATE articles SET audit_status = \'Checked\' WHERE article_id = ?',
                        [article.article_id]
                    );
                } else {
                    const reasonStr = violationReasons.join('; ');
                    console.log("审核完毕，存在问题：" + reasonStr);
                    
                    // 去重违规原因并合并结果（这里简化处理，直接存储所有返回结果或仅存储违规的）
                    // 考虑到数据库字段长度限制，如果有违规，我们优先存违规的项
                    // 为了保持格式一致，我们过滤出分数>=3的项作为最终结果存入，如果没有>=3但被判定有问题（逻辑上不应该走到这里），则存全部
                    
                    // 重新整理最终结果，如果过长可能需要截断，但这里先存全部违规项
                    // 为了符合前端展示习惯，我们尽量保持 [{类型:..., 分数:...}] 的结构
                    // 这里我们筛选出最高分数的几项
                    
                    // 简单的策略：只保留分数>=3的项存入数据库
                    const violationItems = allAuditResults.filter(item => item["分数"] >= 3);
                    
                    // 如果因为某种原因 violationItems 为空但 isViolation 为真（逻辑防御），则存原始结果
                    const finalResult = violationItems.length > 0 ? violationItems : allAuditResults;

                    await query(
                        'UPDATE articles SET audit_status = ? WHERE article_id = ?',
                        [JSON.stringify(finalResult), article.article_id]
                    );
                }

            } catch (error) {
                console.error(`审核文章 ${article.article_id} 失败:`, error);
                // 审核失败不更新状态，等待下一次重试
            } finally {
                // 确保每次循环结束后延时，避免 QPS 过高
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }

        return {
            success: true,
            message: '文章自动审核任务执行完成'
        };
    } catch (error) {
        console.error('文章自动审核任务执行失败:', error);
        return {
            success: false,
            message: '文章自动审核任务执行失败',
            error: error.message
        };
    }
}

/**
 * 云函数入口函数
 */
exports.main_handler = async (event, context, callback) => {
    try {
        const result = await auditArticles();
        console.log("文章审核操作执行完成。", result);
        event.result = "success";
        return event;
    } catch (error) {
        console.error("文章审核操作执行失败:", error);
        event.result = "failed";
        event.error = error.message;
        return event;
    }
};

exports.main_handler()
