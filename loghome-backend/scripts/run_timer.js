/**
 * 手动执行一次定时任务（调试 / 运维补跑用），不等待 cron 周期：
 *   node scripts/run_timer.js <任务名>
 *   或 npm run timer:run -- <任务名>
 *
 * 任务名参见 timers/config.js 的 jobs 配置项：
 *   scheduledPublish | treeplant | membershipRenewal | homepageUpdate | searchKeywords
 */
const { runOnce, registry } = require('../timers');

const name = process.argv[2];

if (!name || !registry[name]) {
	console.log('用法: node scripts/run_timer.js <任务名>');
	console.log(`可用任务: ${Object.keys(registry).join(', ')}`);
	process.exit(1);
}

runOnce(name)
	.then((result) => {
		// 连接池会保持进程存活，执行完主动退出
		process.exit(result && result.result === 'failed' ? 1 : 0);
	})
	.catch((error) => {
		console.error(`Timer ${name} 执行异常:`, error);
		process.exit(1);
	});
