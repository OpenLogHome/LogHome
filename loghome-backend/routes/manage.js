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
let membershipRouter = require('./manage/membership');
let redstoneRouter = require('./manage/redstone');
let appUpdateRouter = require('./manage/appUpdate');
let libraryIndexTagsRouter = require('./manage/libraryIndexTags');
let siteSettingsRouter = require('./manage/siteSettings');
let libraryRecommendsRouter = require('./manage/libraryRecommends');
let tagsRouter = require('./manage/tags');
let treeConfigRouter = require('./manage/treeConfig');
let invitesRouter = require('./manage/invites');
let greatUsersRouter = require('./manage/greatUsers');
let stickersRouter = require('./manage/stickers');
let novelCommentsRouter = require('./manage/novelComments');
let avatarFramesRouter = require('./manage/avatarFrames');
let tippingRouter = require('./manage/tipping');
let worldsRouter = require('./manage/worlds');
let articleFeedbacksRouter = require('./manage/articleFeedbacks');
let writingActivitiesRouter = require('./manage/writingActivities');
let userContentsRouter = require('./manage/userContents');

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
router.use('/membership', membershipRouter);
router.use('/redstone', redstoneRouter);
router.use('/app-updates', appUpdateRouter);
router.use('/library-index-tags', libraryIndexTagsRouter);
router.use('/site-settings', siteSettingsRouter);
router.use('/library-recommends', libraryRecommendsRouter);
router.use('/tags', tagsRouter);
router.use('/tree-config', treeConfigRouter);
router.use('/invites', invitesRouter);
router.use('/great-users', greatUsersRouter);
router.use('/stickers', stickersRouter);
router.use('/novel-comments', novelCommentsRouter);
router.use('/avatar-frames', avatarFramesRouter);
router.use('/tipping', tippingRouter);
router.use('/worlds', worldsRouter);
router.use('/article-feedbacks', articleFeedbacksRouter);
router.use('/writing-activities', writingActivitiesRouter);
router.use('/user-contents', userContentsRouter);

module.exports = router;
