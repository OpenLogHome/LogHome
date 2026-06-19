/**
 * Generates prompts for chapter summary generation.
 */

function genChapterSummaryPrompt(chapterTitle, chapterContent, previousSummaries = '', novelInfo = null) {
  const infoBlock = novelInfo
    ? `<info>
标题：${novelInfo.name}
作者：${novelInfo.author || '未知'}
简介：${novelInfo.content || '无'}
</info>

`
    : '';

  const previousBlock = previousSummaries
    ? `<previous>
${previousSummaries}
</previous>

`
    : '';

  return `${infoBlock}${previousBlock}<content>
${chapterContent}
</content>
你是小说读者，${novelInfo ? '<info></info>块内为这篇小说的基本信息，' : ''}${previousSummaries ? '<previous></previous>块内为这篇小说前文的摘要信息，' : ''}<content></content>块内为小说的当前章节《${chapterTitle}》。请按以下格式输出JSON：

{
  "long_summary": "长摘要（约500字，详细概括本章核心情节，包括人物、场景、事件发展）",
  "short_summary": "短摘要（约50字，一句话概括本章核心内容）",
  "characters": ["出场人物1", "出场人物2", ...]
}

注意：
1. 保持JSON格式合法
2. 长摘要控制在500字左右
3. 短摘要控制在50字左右
4. characters数组列出本章所有出场人物的名字或称呼
5. 只输出JSON，不要其他内容
6. 前文的摘要仅用于增强理解，输出只包含当前章节的信息，不要混入前文的摘要信息`;
}

module.exports = { genChapterSummaryPrompt };