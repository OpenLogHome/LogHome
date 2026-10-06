let express = require('express');
require('./bin/objectFilter');

process.env.TZ = 'Asia/Shanghai';

let app = express();

app.use('/public', express.static('public'));
// const pino = require('pino');
// const expressPino = require('express-pino-logger');
// const logger = pino({
// 	level: process.env.LOG_LEVEL || 'info',
// 	transport: {
// 		target: 'pino-pretty',
// 		options: {
// 			singleLine: true,
// 			sync: true
// 		}
// 	},
// 	prettyPrint: true,
// });
// const expressLogger = expressPino({ logger });
// const svgCaptcha = require('svg-captcha');

// app.use(expressLogger);

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', req.get('Access-Control-Request-Headers') || 'Authorization, Content-Type');
	res.vary('Access-Control-Request-Headers');
	res.header('Access-Control-Allow-Methods', 'GET, HEAD, POST, PUT, PATCH, DELETE, OPTIONS');
	res.header('Content-Type', 'application/json;charset=utf-8');
	// Browser preflights have no login token; authenticate only the actual request.
	if (req.method === 'OPTIONS') return res.sendStatus(204);
	next();
});

// 漫画优先直接上传文件字节；保留 JSON 解析以兼容旧版本客户端。
app.use('/essays/upload_manga_page', express.raw({ type: 'application/octet-stream', limit: '96mb' }));
app.use('/essays/upload_manga_page', express.json({ limit: '96mb' }));
app.use('/essays/upload_manga_page', (error, req, res, next) => {
	if (error.type === 'entity.too.large') {
		return res.status(413).json({ msg: '图片超过单次上传容量，请压缩图片或拆分后重试' });
	}
	next(error);
});
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));

//活跃用户与QPS统计中间件
let QpsStatistic = new Array();
let SuspiciousUsers = new Array();
app.use(async (req, res, next) => {
	// 获取客户端IP
	next();
	QpsStatistic[req.ip] =
		QpsStatistic[req.ip] == undefined ? 0 : QpsStatistic[req.ip] + 1;
});

setInterval(function () {
	QpsStatistic = new Array();
}, 30000);

app.get('/get_online_amount', async function (req, res) {
	try {
		let result = QpsStatistic;
		res.end(String(Object.keys(result).length));
	} catch (e) {
		// logger.error(e);
		res.json(400, { msg: 'bad request' });
	}
});


//客户端请求版本和设备处理中间件
app.use(async (req, res, next) => {
	if(req.method != 'OPTIONS'){
		console.log(req.url,req.headers.appversion,req.method);
	}
	next();
});

//路由中间件
const libraryRouter = require('./routes/library');
const usersRouter = require('./routes/users');
const bookcaseRouter = require('./routes/bookcase');
const articlesRouter = require('./routes/articles');
const essaysRouter = require('./routes/essays');
const communityRouter = require('./routes/community');
const mangaDanmuRouter = require('./routes/manga-danmu');
const tangyuanExportRouter = require('./routes/tangyuanExport');
const postsRouter = require('./routes/posts');
const treePlantRouter = require('./routes/treePlant');
const resourcesRouter = require('./routes/resource');
const manageRouter = require('./routes/manage');
const appRouter = require('./routes/app');
const essayToolsRouter = require('./routes/essayTools');
const paymentsRouter = require('./routes/payment');
const worldRouter = require('./routes/world');
const creditRouter = require('./routes/credit');
const storeRouter = require('./routes/store');
const membershipRouter = require('./routes/membership');
const redstoneRouter = require('./routes/redstone');
const avatarFramesRouter = require('./routes/avatarFrames');
const popularityRouter = require('./routes/popularity');

app.use('/library', libraryRouter);
app.use('/users', usersRouter);
app.use('/bookcase', bookcaseRouter);
app.use('/articles', articlesRouter);
app.use('/essays', essaysRouter);
app.use('/community', communityRouter);
app.use('/community', mangaDanmuRouter);
app.use('/tangyuanExport', tangyuanExportRouter);
app.use('/posts', postsRouter);
app.use('/treePlant', treePlantRouter);
app.use('/resource', resourcesRouter);
app.use('/manage', manageRouter);
app.use('/app', appRouter);
app.use('/essayTools', essayToolsRouter);
app.use('/credit', creditRouter);
app.use('/payment', paymentsRouter);
app.use('/world', worldRouter);
app.use('/store', storeRouter);
app.use('/membership', membershipRouter);
app.use('/redstone', redstoneRouter);
app.use('/avatar-frames', avatarFramesRouter);
app.use('/popularity', popularityRouter);

let server = app.listen(9000, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log('服务器已在' + host + ':' + port + '上启动。');
});

// 进程内定时任务（原 SCF 定时云函数移植），cron 运行周期统一在 timers/config.js 配置
require('./timers').start();
