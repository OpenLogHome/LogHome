# 账户隐私设置

App 入口：设置 → 隐私设置。PC 入口：账号设置 → 隐私设置。

- 列表选项：`public` 全部公开、`following_only` 仅公开关注、`fans_only` 仅公开粉丝、`private` 全部私密。
- 私信选项：`default` 保持允许所有已登录用户、`following` 收件人关注发件人、`mutual` 双向关注、`none` 拒绝私信。
- 本人始终可查看自己的列表。数量仍公开。历史消息可继续查看，已有会话不会豁免新消息权限检查。系统通知不受影响。
- `GET /users/privacy_settings` 读取当前账户设置，`POST` 提交上述两个字段。身份来自认证账户，不能指定其他用户。
- 列表不可见返回 `403 / PRIVATE_LIST`；发送被拒绝返回 `403 / PRIVATE_MESSAGE_FORBIDDEN`。旧站内信同样受限，旧合并好友接口仅供本人使用。第三方不能通过关注状态接口枚举隐藏的关注关系。

数据存于 `user_privacy_settings`。没有记录的旧用户使用公开/默认选项。服务首次访问时检查表；缺表则按 `loghome-backend/sql/user_privacy_settings.sql` 并发安全地建表，不修改 users 表。如部署账户没有建表权限，应由数据库管理员预先执行该 SQL。数据库异常时请求失败，不降级为公开或允许私信。

验证：`cd loghome-backend && node --test test/user_privacy_test.js`。测试使用内存 SQL 替身和真实 Express 路由，不连接业务数据库。
