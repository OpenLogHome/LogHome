# ⚠️ 已废弃：本项目已移植到 loghome-backend

以下 SCF 定时云函数已全部移植至 `loghome-backend/timers/`，由后端进程内 node-schedule 统一调度，cron 运行周期统一配置于 `loghome-backend/timers/config.js`：

| 原 SCF 云函数（本目录） | 移植后模块 |
| --- | --- |
| timer_loghome_scheduled_publish | `loghome-backend/timers/scheduledPublish.js` |
| timer_loghome_treeplant | `loghome-backend/timers/treeplant.js` |
| timer_loghome_membership | `loghome-backend/timers/membershipRenewal.js` |
| timer_loghome_homepage_update | `loghome-backend/timers/homepageUpdate.js` |
| timer_loghome_search_keywords | `loghome-backend/timers/searchKeywords.js` |

**部署新后端后，请在腾讯云 SCF 控制台停用/删除上述定时触发器，避免新旧两套任务同时运行。**

本目录暂时保留作为迁移参照，确认线上新方案稳定运行后可整体删除。
