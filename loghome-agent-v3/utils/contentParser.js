import { mllmClient, IMAGE_MLLM_CONFIG } from './mllmClient.js';

/**
 * Parses rich text content (JSON string) and converts it to plain text.
 * Images are described using MLLM and inserted into the text.
 * 
 * @param {string} content - The raw content string (potentially JSON).
 * @returns {Promise<string>} - The parsed text content.
 */
export async function processRichText(content) {
    let contentArr;
    try {
        contentArr = JSON.parse(content);
    } catch (e) {
        // Not JSON, assume it's plain text
        return content;
    }

    if (!Array.isArray(contentArr)) {
        // Valid JSON but not an array, treat as string
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
                    console.log(`Analyzing image: ${imgUrl}`);
                    const description = await mllmClient.call([
                        { type: "text", text: "请简要描述这张图片的内容，重点关注人物外貌、场景氛围等对小说理解有帮助的信息。" },
                        { type: "image_url", image_url: { url: imgUrl } }
                    ], 'fast', IMAGE_MLLM_CONFIG);
                    
                    resultText += `\n[图片描述: ${description}]\n`;
                } catch (err) {
                    console.error(`Failed to describe image ${imgUrl}:`, err);
                    resultText += `\n[图片: ${imgUrl} (无法获取描述)]\n`;
                }
            }
        }
    }

    return resultText;
}
