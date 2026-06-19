/**
 * Parses rich text content (JSON string) and converts it to plain text.
 */

const { mllmClient, IMAGE_MLLM_CONFIG } = require('./mllmClient');

/**
 * @param {string} content - The raw content string (potentially JSON).
 * @returns {Promise<string>} - The parsed text content.
 */
async function processRichText(content) {
    let contentArr;
    try {
        contentArr = JSON.parse(content);
    } catch (e) {
        return content;
    }

    if (!Array.isArray(contentArr)) {
        return typeof contentArr === 'string' ? contentArr : JSON.stringify(contentArr);
    }

    let resultText = '';

    for (const item of contentArr) {
        if (item.type === 'text') {
            resultText += (item.value || '');
        } else if (item.type === 'image') {
            const imgUrl = item.img ? item.img.trim() : null;
            if (imgUrl) {
                try {
                    const description = await mllmClient.call([
                        { type: 'text', text: '请简要描述这张图片的内容，重点关注人物外貌、场景氛围和对小说理解有帮助的信息。保持简短。' },
                        { type: 'image_url', image_url: { url: imgUrl } },
                    ], 'speed', IMAGE_MLLM_CONFIG);

                    resultText += `\n[图片描述: ${description}]\n`;
                } catch (error) {
                    console.error(`Failed to describe image ${imgUrl}:`, error);
                    resultText += `\n[图片内容暂未解析: ${imgUrl}]\n`;
                }
            }
        }
    }

    return resultText;
}

module.exports = { processRichText };
