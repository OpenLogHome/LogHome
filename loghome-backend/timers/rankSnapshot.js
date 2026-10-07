/**
 * 首页榜单快照定时任务
 * 先全局重算原木力，再将四榜四专区（含全部混排）的名次与标签作为同一批次发布
 */
const rankBoards = require('../bin/rankBoards.js');

async function run() {
	const counts = await rankBoards.run();
	return { counts };
}

module.exports = { run };
