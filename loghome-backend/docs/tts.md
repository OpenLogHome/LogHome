# 统一听书服务

Android 和 PC 先用原木登录凭证请求后端，后端按已认证的 `user_id` 领取并保存一个
TTS API Key，随后客户端直接调用 `https://tts.codesocean.top/v1/audio/speech`。
后端不转发文本和音频，管理员 key 始终只用于后端访问管理接口。

## 部署

- 在 `config.js` 配置 `ttsAdminKey`（已有配置）。
- 首次领取时自动创建 `user_tts_tokens` 表；后端数据库账号需有建表权限。
  表以 `user_id` 为主键，行锁确保多个后端进程同时领取时复用同一个 key。
- 完整用户 key 必须保存，才能在 TTS 服务仅返回一次密钥的条件下支持重装和多设备。
  数据库保存 AES-256-GCM 密文，使用用户 ID 作为附加认证数据。
- 可选配置 `ttsTokenEncryptionKey` 作为独立加密密钥；默认从 `ttsAdminKey` 派生。
  已产生数据后须保持加密密钥稳定；轮换管理员 key 前，应先把旧管理员 key
  配为 `ttsTokenEncryptionKey`，再更换 `ttsAdminKey`。
- 将后端与新客户端一并发布。无需预先批量创建用户 key。

## POST /tts/session

认证：`Authorization: Bearer <原木登录 token>`。请求体可为空对象。
用户身份只取认证中间件结果，不接受请求体中的 `user_id`。

响应带 `Cache-Control: no-store`：

```json
{
  "code": 200,
  "data": {
    "user_id": 123,
    "token": "sk-tts-用户专属密钥",
    "base_url": "https://tts.codesocean.top",
    "voices": [
      { "id": "warm-gentleman", "name": "温润君子", "voice_id": "服务端音色ID", "free": true },
      { "id": "sunny-boy", "name": "阳光少年", "voice_id": "服务端音色ID", "free": true },
      { "id": "youthful-goddess", "name": "青春女神", "voice_id": "服务端音色ID", "free": true },
      { "id": "soft-girl", "name": "软糯萝莉", "voice_id": "服务端音色ID", "free": true }
    ]
  }
}
```

`id` 是客户端稳定标识；`voice_id` 按 TTS `/v1/voices` 中的精确名称解析，
避免猜测音色 ID。缺失或重名时返回 503，防止播放错误的音色。

后续领取会验证原 key；仅在 TTS 明确返回 401 时重新创建，网络错误、繁忙和
其他状态不会触发重复创建。客户端收到 TTS 401 后可再次请求此接口并重试一次。
账号切换时须清空旧会话和队列。客户端只在内存保存凭证，缓存按用户和音色隔离。

合成请求携带用户 TTS key，音色使用 `voice_id`，不传 `model`，由服务选用部署的
默认模型。客户端只展示上述四个免费音色，不收取原木或红石。
上游当前的 API Key 协议没有模型或音色权限字段，四个音色是客户端产品入口限制。

PC 浏览器直连要求 TTS 合成接口允许客户端域名跨域访问，预检须允许 `POST`、
`Authorization` 和 `Content-Type`。成功和错误响应均需携带跨域响应头。
PC 实现与验证说明见 `../../loghome-pc-frontend/docs/reader-tts.md`。

## 验证

- `npm run test:tts`：用户隔离、加密、并发、吊销恢复、错误处理和路由鉴权。
- Android：`./gradlew :app:testDebugUnitTest :app:assembleDebug :app:compileDebugAndroidTestKotlin`。
- 实际环境联调：登录后打开听书，检查 TTS 管理端 key 的 name/note 与 user_id
  对应；切换四个音色；验证长段落、缓存、账号切换及吊销后恢复。
