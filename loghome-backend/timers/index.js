/**
 * 定时任务调度入口
 *
 * 原先 5 个 timer_loghome_* 为独立部署的腾讯云 SCF 定时触发云函数，
 * 现统一收敛到 loghome-backend 进程内，由 node-schedule 驱动。
 *
 * 运行周期统一在 timers/config.js 中配置（cron 表达式），
 * 也可通过环境变量 TIMERS_ENABLED=false 在启动时整体关闭（便于本地调试）。
 */
const schedule = require('node-schedule');
const timerConfig = require('./config.js');

const registry = {
	scheduledPublish: { module: () => require('./scheduledPublish.js'), label: '定时发布' },
	treeplant: { module: () => require('./treeplant.js'), label: '树场经验球' },
	membershipRenewal: { module: () => require('./membershipRenewal.js'), label: '会员自动续费' },
	homepageUpdate: { module: () => require('./homepageUpdate.js'), label: '首页榜单更新' },
	rankSnapshot: { module: () => require('./rankSnapshot.js'), label: '首页四榜快照' },
	searchKeywords: { module: () => require('./searchKeywords.js'), label: '搜索关键词维护' },
};

const running = new Set();
const scheduledJobs = new Map();
let started = false;

async function runOnce(name) {
	const entry = registry[name];
	if (!entry) {
		throw new Error(`未知的定时任务: ${name}`);
	}
	if (running.has(name)) {
		console.log(`Timer ${name}: 上一次执行尚未结束，跳过本次触发。`);
		return { skipped: 'running' };
	}
	running.add(name);
	const startTime = new Date();
	console.log(`[${startTime.toLocaleString()}] Timer ${name} (${entry.label}) 开始执行`);
	try {
		const mod = entry.module();
		const detail = await mod.run();
		const endTime = new Date();
		console.log(
			`[${endTime.toLocaleString()}] Timer ${name} 执行成功，耗时${endTime - startTime}ms`,
			detail || '',
		);
		return { result: 'success', detail };
	} catch (error) {
		console.log(`Timer ${name} (${entry.label}) 执行失败:`, error);
		return { result: 'failed', error: String(error && error.message ? error.message : error) };
	} finally {
		running.delete(name);
	}
}

function start() {
	if (started) return;
	started = true;

	if (timerConfig.enabled === false || process.env.TIMERS_ENABLED === 'false') {
		console.log('定时任务已通过配置或环境变量禁用，跳过注册。');
		return;
	}

	// Older deployment configs may not yet include the new ranking job.
	// Explicit per-job/global switches still take precedence.
	const jobs = {
		rankSnapshot: { enabled: true, cron: '0 5 * * * *' },
		...(timerConfig.jobs || {}),
	};
	for (const name of Object.keys(registry)) {
		const jobConfig = jobs[name];
		if (!jobConfig || jobConfig.enabled === false) {
			console.log(`Timer ${name}: 未在配置中启用，跳过。`);
			continue;
		}
		if (!jobConfig.cron) {
			console.log(`Timer ${name}: 缺少 cron 表达式，跳过。`);
			continue;
		}
		try {
			const job = schedule.scheduleJob(jobConfig.cron, () => runOnce(name));
			if (!job) {
				console.log(`Timer ${name}: cron 表达式无效: ${jobConfig.cron}，跳过。`);
				continue;
			}
			scheduledJobs.set(name, job);
			console.log(
				`Timer ${name} (${registry[name].label}) 已注册，cron: ${jobConfig.cron}`,
			);
		} catch (error) {
			console.log(`Timer ${name}: 注册失败 (cron: ${jobConfig.cron})`, error);
		}
	}
}

function stop() {
	// 只取消本模块注册的定时任务，不影响进程中其它 node-schedule 任务
	for (const [name, job] of scheduledJobs) {
		try {
			job.cancel();
			console.log(`Timer ${name}: 已取消。`);
		} catch (error) {
			console.log(`Timer ${name}: 取消失败`, error);
		}
	}
	scheduledJobs.clear();
	started = false;
}

module.exports = {
	start,
	stop,
	runOnce,
	registry,
};
