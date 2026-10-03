# 红石接口

红石用于原木社区内的 AI 阅读、AI 创作和其他智能功能。基础路径：`/redstone`，所有接口均需要 `Authorization: Bearer <token>`。

## 查询账户

`GET /redstone/account`

返回红石余额、原木余额、兑换比例以及会员赠送标准。固定兑换比例为 `10 原木 = 1 红石`。同时返回：

- `permanent_balance`：永不过期的兑换红石余额。
- `expiring_balance`：有期限的赠送红石余额。
- `next_expiration_at`：最近一个未用完批次的到期时间。
- `gift_validity_months`：赠送红石有效期，目前为 3 个月。

## 查询流水

`GET /redstone/transactions?page=1&pageSize=20`

返回原木兑换、通行证赠送、普通用户月赠、到期扣减和 AI 功能消费等账单，`pageSize` 最大为 50。发放流水同时返回该批次的 `remaining_amount` 与 `expires_at`。

## 使用原木兑换

`POST /redstone/exchange`

```json
{
  "redstone_amount": 100,
  "client_request_id": "redstone-unique-request-id"
}
```

- `redstone_amount` 必须是 1～100000 的整数。
- 后端固定按 10:1 计算原木成本，客户端不能指定价格。
- `client_request_id` 为用户维度幂等键，重复提交不会重复扣除原木。
- 原木扣除、红石入账和流水写入在同一数据库事务中完成。
- 使用原木兑换的红石永久有效。

## 通行证赠送规则

- 原木通行证：每个发放周期赠送 100 红石。
- 超级原木通行证：每个发放周期赠送 200 红石。
- 月付在购买及每次自动续费成功时发放。
- 年付在购买时先发放一次，之后由 `timer_loghome_membership` 每月发放。
- 标准版升级超级版时，当月补发 100 红石，后续按超级版标准发放。
- 未开通有效通行证的普通用户，每个自然月首次访问红石或 AI 功能时赠送 6 红石。
- 通行证赠送、升级补赠以及普通用户每月赠送的红石，自到账之日起有效期为 3 个月。
- 消费红石时优先扣除到期时间最近的赠送批次，所有赠送批次用完后再扣除永久有效的兑换红石。
- 未使用完的到期批次会自动扣减，并写入 `expiration` 类型的红石流水。
- 每次发放均写入带唯一业务键的流水，定时函数重试不会重复到账。

## AI 功能消耗

- 问问原木娘：普通问答 1 红石，深度思考 2 红石。
- 笔泡 AI 助手：普通问答 1 红石，深度思考 2 红石，图像生成 5 红石。
- 文本纠错：普通纠错免费，智能纠错原木通行证/超级原木通行证免费，普通用户 2 红石。
- AI 请求以任务或请求标识作为幂等键；断线重连、相同任务重试不会重复扣费。
- 每次扣费写入 `redstone_transactions` 的 `ai_usage` 流水，可通过 `GET /redstone/transactions` 查询。
