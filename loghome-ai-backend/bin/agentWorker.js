/**
 * Agent worker - auto-runs chapter comprehension indexing tasks.
 * Can be started from main.js by setting the worker in config, or run independently.
 */

const {
  doChapterComprehension,
  SourceVersionChangedError,
} = require('../tasks/chapter-comprehension/index');
const { closePool } = require('../sql');
const { initMemoryTable, getPendingChapters } = require('../utils/memoryManager');
const {
  claimNextQueueJob,
  hasQueuedManualJob,
  heartbeatQueueJob,
  initIndexQueueTable,
  removeQueueJob,
  requeueQueueJob,
  resetQueueOnStartup,
  requeueStaleJobs,
  syncAutoQueue,
} = require('../utils/indexQueueManager');
const { isMllmTemporarilyUnavailableError } = require('../utils/mllmClient');
const config = require('../config');

const CHAPTER_DELAY_MS = 3000;
const IDLE_POLL_MS = 120000;
const AUTO_SYNC_INTERVAL_MS = 60000;
const HEARTBEAT_INTERVAL_MS = 15000;
const STALE_JOB_MINUTES = 5;
const RETRY_DELAY_MINUTES = 5;
const MLLM_OUTAGE_PAUSE_MINUTES = 120;
const activeDelayEntries = new Set();
const activeHeartbeatTimers = new Set();

function delay(ms) {
  return new Promise((resolve) => {
    const entry = {
      timer: null,
      resolve: () => {
        if (entry.timer) {
          clearTimeout(entry.timer);
          entry.timer = null;
        }
        activeDelayEntries.delete(entry);
        resolve();
      },
    };

    entry.timer = setTimeout(() => {
      entry.resolve();
    }, ms);

    activeDelayEntries.add(entry);
  });
}

let shuttingDown = false;
let lastAutoSyncAt = 0;
let pausedUntil = 0;

function pauseWorkerForMllmOutage() {
  pausedUntil = Math.max(
    pausedUntil,
    Date.now() + MLLM_OUTAGE_PAUSE_MINUTES * 60 * 1000
  );
  console.warn(
    `All MLLM models are temporarily unavailable. Pausing worker until ${new Date(
      pausedUntil
    ).toISOString()}.`
  );
}

async function waitIfPaused() {
  const remainingMs = pausedUntil - Date.now();
  if (remainingMs <= 0) {
    pausedUntil = 0;
    return false;
  }

  console.log(
    `Worker paused for MLLM recovery. Waiting ${Math.ceil(
      remainingMs / 1000
    )} seconds before retrying.`
  );
  await delay(Math.min(remainingMs, IDLE_POLL_MS));
  return true;
}

async function runWithHeartbeat(novelId, fields, work) {
  let heartbeatTimer = null;

  try {
    await heartbeatQueueJob(novelId, fields);
    heartbeatTimer = setInterval(() => {
      heartbeatQueueJob(novelId, fields).catch((error) => {
        console.error('Heartbeat update failed:', error);
      });
    }, HEARTBEAT_INTERVAL_MS);
    activeHeartbeatTimers.add(heartbeatTimer);

    return await work();
  } finally {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer);
      activeHeartbeatTimers.delete(heartbeatTimer);
    }
  }
}

async function processNovelJob(job) {
  const chapters = await getPendingChapters(job.novel_id);

  if (chapters.length === 0) {
    console.log(`Novel ${job.novel_id} has no pending chapters. Removing from queue.`);
    await removeQueueJob(job.novel_id);
    return;
  }

  console.log(
    `Processing novel ${job.novel_id}. Pending chapters: ${chapters.length}.`
  );

  let failed = false;
  let lastError = null;

  for (let index = 0; index < chapters.length; index++) {
    if (shuttingDown) {
      return;
    }

    const chapter = chapters[index];
    const scopeLabel = chapter.memory_scope === 'author' ? '作者稿' : '正式版';
    const completedChapters = index;
    const pendingChapters = chapters.length - index;
    const heartbeatFields = {
      status: 'indexing',
      currentArticleId: chapter.article_id,
      currentArticleTitle: `${scopeLabel}：${chapter.title}`,
      totalChapters: chapters.length,
      pendingChapters,
      completedChapters,
    };

    console.log(
      `Processing ${scopeLabel} chapter ${chapter.article_chapter}: ${chapter.title} (Article ID: ${chapter.article_id})`
    );

    try {
      await runWithHeartbeat(job.novel_id, heartbeatFields, async () => {
        await doChapterComprehension(chapter);
      });

      await heartbeatQueueJob(job.novel_id, {
        ...heartbeatFields,
        pendingChapters: chapters.length - index - 1,
        completedChapters: index + 1,
      });

      console.log(`Finished ${scopeLabel} chapter ${chapter.article_chapter}.`);
    } catch (error) {
      failed = true;
      lastError = error?.message || String(error);
      console.error(
        `Error processing ${scopeLabel} chapter ${chapter.article_chapter}:`,
        error
      );

      if (isMllmTemporarilyUnavailableError(error)) {
        pauseWorkerForMllmOutage();
        await requeueQueueJob(
          job.novel_id,
          lastError,
          MLLM_OUTAGE_PAUSE_MINUTES
        );
        return;
      }

      if (error instanceof SourceVersionChangedError || error?.code === 'SOURCE_VERSION_CHANGED') {
        console.log(
          `Source changed while processing novel ${job.novel_id}. Requeueing immediately.`
        );
        await requeueQueueJob(job.novel_id, lastError, 0);
        return;
      }
    }

    if (index < chapters.length - 1) {
      if (
        job.trigger_source === 'auto' &&
        (await hasQueuedManualJob(job.novel_id))
      ) {
        console.log(
          `Manual indexing request detected. Requeueing auto novel ${job.novel_id} to give way.`
        );
        await requeueQueueJob(job.novel_id, null, 0);
        return;
      }

      await delay(CHAPTER_DELAY_MS);
    }
  }

  const remainingChapters = await getPendingChapters(job.novel_id);
  if (remainingChapters.length === 0) {
    console.log(`Novel ${job.novel_id} indexing finished.`);
    await removeQueueJob(job.novel_id);
    return;
  }

  console.log(
    `Novel ${job.novel_id} still has ${remainingChapters.length} pending chapters. Requeueing.`
  );
  await requeueQueueJob(
    job.novel_id,
    failed ? lastError || 'chapter processing failed' : null,
    failed ? RETRY_DELAY_MINUTES : 0
  );
}

async function syncAutoQueueIfNeeded(force = false) {
  const now = Date.now();
  if (!force && now - lastAutoSyncAt < AUTO_SYNC_INTERVAL_MS) {
    return;
  }

  const candidates = await syncAutoQueue(100);
  lastAutoSyncAt = now;
  console.log(`Auto queue synced. Active novels: ${candidates.length}.`);
}

async function workerLoop() {
  console.log('Agent worker starting...');

  await initMemoryTable();
  await initIndexQueueTable();
  await resetQueueOnStartup();
  await syncAutoQueueIfNeeded(true);

  while (!shuttingDown) {
    try {
      if (await waitIfPaused()) {
        continue;
      }

      await requeueStaleJobs(STALE_JOB_MINUTES);
      await syncAutoQueueIfNeeded();

      const job = await claimNextQueueJob();
      if (!job) {
        await delay(IDLE_POLL_MS);
        continue;
      }

      await processNovelJob(job);
    } catch (error) {
      console.error('Worker loop error:', error);
      await delay(IDLE_POLL_MS);
    }
  }
}

async function shutdown() {
  if (shuttingDown) {
    return;
  }

  shuttingDown = true;
  console.log('Shutting down agent worker...');

  for (const timer of activeHeartbeatTimers) {
    clearInterval(timer);
    activeHeartbeatTimers.delete(timer);
  }

  for (const entry of activeDelayEntries) {
    entry.resolve();
  }

  // Give MySQL pool a chance to drain. Don't exit() here — let main.js control it.
  await delay(1000);
  console.log('Agent worker shut down.');
}

async function startAgentWorker(options = {}) {
  const { installSignalHandlers = true } = options;

  if (installSignalHandlers) {
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  }

  try {
    await workerLoop();
  } catch (error) {
    console.error('Fatal worker error:', error);
    await shutdown();
  } finally {
    if (installSignalHandlers) {
      await closePool();
    }
  }
}

module.exports = {
  startAgentWorker,
  shutdown,
  processNovelJob,
};
