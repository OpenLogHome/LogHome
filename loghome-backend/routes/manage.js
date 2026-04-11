// 引入依赖包
let express = require('express');

// 创建路由对象
let router = express.Router();

let libraryRouter = require('./manage/library');
let userRouter = require('./manage/users');
let faqsRouter = require('./manage/faqs');
let auditRouter = require('./manage/audit');
let postsRouter = require('./manage/posts');
let communityRouter = require('./manage/community');
let bankRouter = require('./manage/bank');
let storeRouter = require('./manage/store');
let achievementsRouter = require('./manage/achievements');
let bannersRouter = require('./manage/banners');
let dashboardRouter = require('./manage/dashboard');
let popupPostersRouter = require('./manage/popupPosters');

router.use('/library', libraryRouter);
router.use('/users', userRouter);
router.use('/faqs', faqsRouter);
router.use('/audit', auditRouter);
router.use('/posts', postsRouter);
router.use('/community', communityRouter);
router.use('/bank', bankRouter);
router.use('/store', storeRouter);
router.use('/achievements', achievementsRouter);
router.use('/banners', bannersRouter);
router.use('/popup-posters', popupPostersRouter);
router.use('/dashboard', dashboardRouter);

module.exports = router;
