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

router.use('/library', libraryRouter);
router.use('/users', userRouter);
router.use('/faqs', faqsRouter);
router.use('/audit', auditRouter);
router.use('/posts', postsRouter);
router.use('/community', communityRouter);

module.exports = router;
