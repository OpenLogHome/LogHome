let express = require('express');
let schedule = require('node-schedule');
require('./bin/objectFilter');

let app = express();

app.use('/public', express.static('public'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: false, limit: '5mb' }));
const pino = require('pino');
const expressPino = require('express-pino-logger');
const logger = pino({
	level: process.env.LOG_LEVEL || 'info',
	transport: {
		target: 'pino-pretty',
	},
	prettyPrint: true,
});
const expressLogger = expressPino({ logger });
const svgCaptcha = require('svg-captcha');

// app.use(expressLogger);

//设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	res.header('Access-Control-Allow-Methods', '*');
	res.header('Content-Type', 'application/json;charset=utf-8');
	next();
});

//活跃用户与QPS统计中间件
let QpsStatistic = new Array();
let SuspiciousUsers = new Array();
app.use(async (req, res, next) => {
	// 获取客户端IP
	next();
	QpsStatistic[req.ip] =
		QpsStatistic[req.ip] == undefined ? 0 : QpsStatistic[req.ip] + 1;
	// if(SuspiciousUsers.includes(req.ip)){
	//     res.end(JSON.stringify({msg:"QPS too High."}))
	// } else {
	//     next();
	// }
});

setInterval(function () {
	// if(QpsStatistic){
	//     for(let item in QpsStatistic){
	//         if(QpsStatistic[item] >= 15){
	//             generateVerifCode(item);
	//         }
	//     }
	// }
	// console.log(QpsStatistic)
	QpsStatistic = new Array();
}, 30000);

// async function generateVerifCode(ip) {
//     const codeConfig = {
//       size: 4, // 验证码长度
//       ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
//       noise: 2, // 干扰线条的数量
//       width: 160,
//       height: 50,
//       fontSize: 50,
//       color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
//       background: '#eee',
//     };
//     const captcha = svgCaptcha.create(codeConfig);
//     SuspiciousUsers[ip]={
//         text:captcha.text.toLowerCase(),
//         img:captcha.data
//     }
// }

app.get('/get_online_amount', async function (req, res) {
	try {
		let result = QpsStatistic;
		res.end(String(Object.keys(result).length));
	} catch (e) {
		logger.error(e);
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
const uniImRouter = require('./routes/uni-im')

app.use('/library', libraryRouter);
app.use('/users', usersRouter);
app.use('/bookcase', bookcaseRouter);
app.use('/articles', articlesRouter);
app.use('/essays', essaysRouter);
app.use('/community', communityRouter);
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
app.use('/uni', uniImRouter);

let server = app.listen(8081, function () {
	let host = server.address().address;
	let port = server.address().port;
	console.log('服务器已在' + host + ':' + port + '上启动。');
});
