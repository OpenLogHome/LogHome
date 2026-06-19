/**
 * Chapter comprehension task - generates summaries for novel chapters.
 */

const { genChapterSummaryPrompt } = require('./prompts');
const {
  isMllmTemporarilyUnavailableError,
  mllmClient,
} = require('../../utils/mllmClient');
const parseJson = require('../../utils/parseJson');
const {
  initMemoryTable,
  getChapterSource,
  getNovelMemories,
  normalizeMemoryScope,
  saveMemory,
} = require('../../utils/memoryManager');
const { processRichText } = require('../../utils/contentParser');
const { getNovelInfo } = require('../../utils/libraryHelper');

class SourceVersionChangedError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'SourceVersionChangedError';
    this.code = 'SOURCE_VERSION_CHANGED';
    Object.assign(this, details);
  }
}

function estimateTokenCount(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fff]/g) || []).length;
    const otherChars = text.length - chineseChars;
    return Math.ceil(chineseChars * 0.6 + otherChars * 0.3);
}

function buildPreviousSummaries(memories, maxTokens, currentChapterContent) {
    if (!memories || memories.length === 0) {
        return '';
    }

    const basePromptTokens = 500;
    const contentTokens = estimateTokenCount(currentChapterContent);
    const availableForSummaries = maxTokens - basePromptTokens - contentTokens;

    if (availableForSummaries <= 0) {
        return '';
    }

    const summaries = memories.map(m => ({
        chapter: m.article_chapter,
        title: m.title,
        long: m.long_summary || '',
        short: m.short_summary || ''
    }));

    let result = summaries.map(s =>
        `【${s.title}】\n${s.long}`
    ).join('\n\n');

    let totalTokens = estimateTokenCount(result);

    for (let i = 0; i < summaries.length && totalTokens > availableForSummaries; i++) {
        summaries[i] = {
            ...summaries[i],
            long: summaries[i].short
        };

        result = summaries.map(s =>
            `【第${s.chapter}章 ${s.title}】\n${s.long}`
        ).join('\n\n');

        totalTokens = estimateTokenCount(result);
    }

    if (totalTokens > availableForSummaries) {
        let keptSummaries = [];
        for (let i = summaries.length - 1; i >= 0; i--) {
            const testSummaries = [summaries[i], ...keptSummaries];
            const testResult = testSummaries.map(s =>
                `【第${s.chapter}章 ${s.title}】\n${s.long}`
            ).join('\n\n');

            if (estimateTokenCount(testResult) <= availableForSummaries) {
                keptSummaries = testSummaries;
            } else {
                break;
            }
        }

        if (keptSummaries.length === 0) {
            return '';
        }

        result = keptSummaries.map(s =>
            `【第${s.chapter}章 ${s.title}】\n${s.long}`
        ).join('\n\n');
    }

    return result;
}

async function summarizeChapter(title, content, previousSummaries = '', novelInfo = null) {
  let retryCount = 0;
  while (retryCount < 3) {
    try {
      const prompt = genChapterSummaryPrompt(title, content, previousSummaries, novelInfo);
      const result = await mllmClient.call(prompt, 'fast');
      const parsed = parseJson(result);

      if (!parsed || !parsed.long_summary || !parsed.short_summary) {
        throw new Error('Invalid summary result');
      }

      return {
        long_summary: parsed.long_summary,
        short_summary: parsed.short_summary,
        characters: parsed.characters || []
      };
    } catch (error) {
      if (isMllmTemporarilyUnavailableError(error)) {
        throw error;
      }
      console.error(`Chapter summary failed on try ${retryCount + 1}: ${error.message}`);
      retryCount++;
    }
  }
  throw new Error('Chapter summary failed after 3 retries');
}

function normalizeTaskInput(input) {
  if (typeof input === 'number') {
    return {
      article_id: input,
      memory_scope: 'reader',
      writer_id: null,
    };
  }

  return {
    article_id: Number(input?.article_id || 0),
    memory_scope: normalizeMemoryScope(input?.memory_scope || input?.scope, 'reader'),
    writer_id: input?.writer_id ? Number(input.writer_id) : null,
  };
}

function isSameSourceVersion(previousSource, nextSource) {
  if (!previousSource || !nextSource) {
    return false;
  }

  return (
    previousSource.scope === nextSource.scope
    && Number(previousSource.article_id) === Number(nextSource.article_id)
    && Number(previousSource.writer_id || 0) === Number(nextSource.writer_id || 0)
    && String(previousSource.title || '') === String(nextSource.title || '')
    && String(previousSource.content_hash || '') === String(nextSource.content_hash || '')
    && String(previousSource.source_updated_at || '') === String(nextSource.source_updated_at || '')
  );
}

async function doChapterComprehension(input) {
  await initMemoryTable();
  const task = normalizeTaskInput(input);
  const scope = task.memory_scope;

  const source = await getChapterSource(task, { scope });
  if (!source) {
    throw new SourceVersionChangedError(
      `Source for article ${task.article_id} (${scope}) changed before indexing started.`,
      { task }
    );
  }

  const title = source.title || '';
  const content = await processRichText(source.content);
  const novelInfo = await getNovelInfo(source.novel_id);
  const memories = await getNovelMemories(source.novel_id, {
    scope,
    fallbackToReaderWhenDraftMissing: scope === 'author',
  });
  const currentChapterMemories = memories.filter((memory) => {
    return Number(memory.article_chapter) < Number(source.article_chapter);
  });
  const maxContextLength = mllmClient.getMaxContextLength();
  const previousSummaries = buildPreviousSummaries(currentChapterMemories, maxContextLength, content);
  const summary = await summarizeChapter(title, content, previousSummaries, novelInfo);

  const latestSource = await getChapterSource(task, { scope });
  if (!isSameSourceVersion(source, latestSource)) {
    throw new SourceVersionChangedError(
      `Source for article ${task.article_id} (${scope}) changed during indexing.`,
      {
        task,
        previousSource: source,
        latestSource,
      }
    );
  }

  await saveMemory(latestSource, summary, { scope });

  return summary;
}

module.exports = { doChapterComprehension, SourceVersionChangedError };