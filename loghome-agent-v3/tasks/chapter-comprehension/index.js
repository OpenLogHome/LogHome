import { 
  genIndComprePrompt, 
  genIndCompreResultExtractPrompt, 
  genCharacterAnalysisPrompt, 
  genCharacterAnalysisResultExtractPrompt,
  genMemoryRefinementPrompt,
  genMemoryRefinementExtractPrompt
} from './prompts.js';
import { mllmClient } from '../../utils/mllmClient.js';
import parseJson from '../../utils/parseJson.js';
import pool from '../../utils/db.js';
import { initMemoryTable, saveMemory, getNovelMemories } from '../../utils/memoryManager.js';
import { processRichText } from '../../utils/contentParser.js';

async function comprehendChapter(title, content) {
  let retryCount = 0;

  // 重试机制
  while (retryCount < 3) {
    try {
      // 独立理解
      const prompt1 = genIndComprePrompt(title, content);
      const result = await mllmClient.call(prompt1, 'fast');

      // 提取理解结果
      const prompt2 = genIndCompreResultExtractPrompt(result);
      const result2 = parseJson(await mllmClient.call(prompt2, 'speed'));
      if (result2 === null || result2.result === 'failed') {
        throw new Error('Chapter comprehension failed');
      }

      return result2;
    } catch (error) {
      console.error(`Chapter comprehension failed on try ${retryCount + 1}: ${error.message}`);
      retryCount++;
    }
  }

  throw new Error('Chapter comprehension failed after 3 retries');
}

async function comprehendCharacter(title, content) {
  let retryCount = 0;

  // 重试机制
  while (retryCount < 3) {
    try {
      // 独立理解
      const prompt1 = genCharacterAnalysisPrompt(title, content);
      const result = await mllmClient.call(prompt1, 'fast');

      // 提取理解结果
      const prompt2 = genCharacterAnalysisResultExtractPrompt(result);
      const result2 = parseJson(await mllmClient.call(prompt2, 'speed'));
      if (result2 === null || result2.result === 'failed') {
        throw new Error('Character comprehension failed');
      }

      return result2;
    } catch (error) {
      console.error(`Character comprehension failed on try ${retryCount + 1}: ${error.message}`);
      retryCount++;
    }
  }

  throw new Error('Character comprehension failed after 3 retries');
}

async function refineMemory(title, chapterRes, characterRes, contextMemories) {
  let retryCount = 0;
  while (retryCount < 3) {
    try {
      const prompt1 = genMemoryRefinementPrompt(title, chapterRes, characterRes, contextMemories);
      const result = await mllmClient.call(prompt1, 'fast'); 
      
      const prompt2 = genMemoryRefinementExtractPrompt(result);
      const result2 = parseJson(await mllmClient.call(prompt2, 'speed'));
      
      if (result2 === null || result2.result === 'failed') {
        throw new Error('Memory refinement failed');
      }
      return result2;
    } catch (error) {
       console.error(`Memory refinement failed on try ${retryCount + 1}: ${error.message}`);
       retryCount++;
    }
  }
  // Fallback to original results if refinement fails
  console.warn('Memory refinement failed after retries, using original results.');
  return {
      chapterComprehensionResult: chapterRes,
      characterComprehensionResult: characterRes.characterComprehensionResult,
  };
}

async function doChapterComprehension(articleId) {
  // Ensure table exists
  await initMemoryTable();

  // Get article data
  const [rows] = await pool.query('SELECT * FROM articles WHERE article_id = ?', [articleId]);
  if (rows.length === 0) {
    throw new Error(`Article with id ${articleId} not found`);
  }
  const article = rows[0];
  const title = article.title || '';
  const content = await processRichText(article.content);
  
  // 1. Independent Comprehension
  let chapterComprehensionResult = await comprehendChapter(title, content);
  let characterComprehensionResult = await comprehendCharacter(title, content);

  // 2. Fetch Context Memories
  let contextMemoriesStr = "";
  try {
      const allMemories = await getNovelMemories(article.novel_id);
      // Filter out current article's memory if it exists (to avoid circular confirmation bias or just use others)
      contextMemoriesStr = allMemories
        .filter(m => m.article_id !== articleId)
        .map(m => {
            const chapMem = typeof m.chapter_comprehension === 'string' ? JSON.parse(m.chapter_comprehension) : m.chapter_comprehension;
            return `Chapter ${m.article_chapter} (${m.title || 'Untitled'}): ${chapMem.abstract || 'No abstract'} ${chapMem.implication || 'No implication'}`;
        })
        .join('\n');
  } catch (err) {
      console.warn("Failed to fetch context memories:", err);
  }

  // 3. Refine Memory
  // Only refine if we have some context, otherwise independent comprehension is the best we have
  // But user said "combine prior memory optimization... supplement...". Even if no other memory, maybe we just pass empty context?
  // The prompt expects context. If empty, it might just return the same.
  // Let's call it anyway to ensure the flow is consistent.
  const refinedResult = await refineMemory(title, chapterComprehensionResult, characterComprehensionResult, contextMemoriesStr);
  
  if (refinedResult.chapterComprehensionResult) chapterComprehensionResult = refinedResult.chapterComprehensionResult;
  if (refinedResult.characterComprehensionResult) characterComprehensionResult = refinedResult.characterComprehensionResult;

  // 4. Save to DB
  await saveMemory(article.novel_id, articleId, chapterComprehensionResult, characterComprehensionResult);

  return {chapterComprehensionResult, characterComprehensionResult};
}

export { doChapterComprehension };
