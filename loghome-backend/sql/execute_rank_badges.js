process.env.TZ = 'Asia/Shanghai';
require('../bin/rankBadgeSchema')
	.ensureRankBadgeSchema()
	.then(() => {
		console.log('榜单标签表与历史基线已就绪');
		process.exit(0);
	})
	.catch(error => {
		console.error(error.message);
		process.exit(1);
	});
