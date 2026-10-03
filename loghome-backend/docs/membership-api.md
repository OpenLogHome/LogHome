# 会员订阅接口

基础路径：`/membership`

除方案查询外，所有接口都需要 `Authorization: Bearer <token>`。

## 查询方案

`GET /membership/plans`

返回后端生效中的通行证价格。前端应以此接口为准，不自行决定扣款金额。

## 查询当前订阅

`GET /membership/subscription`

返回当前生效订阅、用户原木余额；当前为原木通行证时还会返回 `upgrade_quote`：

```json
{
  "upgrade_quote": {
    "membership_type": "super",
    "billing_cycle": "monthly",
    "remaining_days": 18,
    "expires_at": "2026-08-02T12:00:00.000Z",
    "cost_log": 132,
    "cycle_difference_log": 220,
    "renewal_cost_log": 880,
    "auto_renew": true
  }
}
```

`cost_log` 是当前时刻的升级补差报价，最终金额由购买事务再次计算。

## 查询订阅记录

`GET /membership/history?page=1&pageSize=20`

`pageSize` 最大为 50。

## 购买或续期

`POST /membership/subscribe`

```json
{
  "membership_type": "standard",
  "billing_cycle": "monthly",
  "auto_renew": true,
  "client_request_id": "subscribe-unique-request-id"
}
```

- `membership_type`：`standard` 或 `super`。
- `billing_cycle`：`monthly` 或 `yearly`。
- `client_request_id`：8～72 个字符；同一用户重复提交相同值不会重复扣款。
- 同档购买会续期，标准通行证可以升级为超级通行证。
- 从标准通行证升级到超级通行证时，仅按剩余有效时间收取档位差价，保留原到期日和自动续费状态。
- 月订阅使用 30 天、年订阅使用 365 天折算，结果向上取整到整数原木。
- 原木通行证每周期赠送 100 红石，超级原木通行证每周期赠送 200 红石；月付购买/续费时到账，年付按月到账。赠送红石自到账之日起 3 个月内有效，消费时优先使用临近到期的批次。
- 标准版升级超级版时当月补赠 100 红石。
- 超级通行证有效期内不允许降级为标准通行证。

## 赠送好友

`GET /membership/gift-friends`

返回当前用户关注的人与粉丝的去重合集，并提供 `is_following`、`is_follower` 和 `relation` 关系字段。赠送接口只接受该合集中的用户。

`POST /membership/gift`

```json
{
  "beneficiary_user_id": 123,
  "membership_type": "super",
  "billing_cycle": "yearly",
  "message": "送给你一年的超级通行证",
  "client_request_id": "gift-unique-request-id"
}
```

原木从当前登录用户账户扣除，会员权益发放给 `beneficiary_user_id`。赠送不会为接收者自动开启续费。成功后，接收者会在活动消息中收到一张会员礼品卡及赠言。

## 兑换会员

`POST /membership/redeem`

```json
{
  "code": "LOGPASS-XXXXXX-XXXXXX-XXXXXX"
}
```

兑换码忽略大小写及分隔符。核销、订阅变更和使用次数更新在同一事务内完成，同一用户重复提交已成功使用的兑换码会返回原结果，不会重复增加有效期。

`GET /membership/redeem-history?page=1&pageSize=20`

返回当前用户的兑换记录。兑换码在数据库中只保存 SHA-256 摘要和脱敏提示，不保存可直接使用的明文。

创建兑换码前先执行 `npm run migrate:membership-subscriptions`，然后使用：

```bash
npm run membership:create-codes -- standard 30 10 null "活动兑换码"
npm run membership:create-codes -- super 365 1 "2027-01-01 00:00:00" "年卡兑换码"
```

## 管理自动续费

`PATCH /membership/auto-renew`

```json
{
  "enabled": false
}
```

关闭自动续费不会提前终止当前权益。

## 自动续费

由 `loghome-scf-timers/timer_loghome_membership` 处理。定时函数使用订阅记录中的 `renewal_cost_log` 续费价格快照，事务扣款后创建新的订阅记录，并通过唯一的 `renewal_parent_id` 防止重复续费。`cost_log` 仅表示该条记录实际扣款，升级记录不会因此以补差金额续订。该函数同时处理年付会员每月 100/200 红石的发放。普通开通、兑换成功和自动续费成功/失败都会发送系统通知。
