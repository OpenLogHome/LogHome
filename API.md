# GPT-SoVITS TTS API 接口文档

版本 1.0.0 · 更新日期 2026-10-27

## 概述

基于 GPT-SoVITS 的多模型低显存 TTS 服务，内置 969 个音色（含音色库）、零样本克隆与 SenseVoice 语音识别，支持流式输出与本地结果缓存（6 个月）。

- **本地地址**：`http://127.0.0.1:9880`
- **公网地址**：`https://tts.codesocean.top`（经 FRP 隧道，延迟高于本地）
- **交互式文档**：`GET /docs`（Swagger UI）
- **演示页面**：`GET /demo`

### 认证

所有业务接口需要 API Key，两种方式任选：

```
Authorization: Bearer sk-tts-xxxx
X-API-Key: sk-tts-xxxx
```

管理接口需要 Admin Key：`X-Admin-Key: <admin_key>`。

Key 创建后仅返回一次完整值，服务端只存 SHA-256 哈希。

### 全局限制

| 项目 | 限制 |
|---|---|
| 文本长度 | ≤ 1000 字符 |
| 语速 speed | 0.5 – 2.0 |
| 参考音频（克隆） | 3 – 10 秒，≤ 15MB，超 10s 自动裁剪到 9.8s |
| 并发队列 | 最多 8 个排队请求，超出返回 429 |
| 支持格式 | wav / mp3 / opus / flac / aac |
| 采样率 | 各模型原生（v2Pro/v2ProPlus 32kHz，v5turbo/v5dev 48kHz），单声道 |

### 模型

| ID | 版本 | 采样率 | 特点 |
|---|---|---|---|
| `v2ProPlus` | v2ProPlus | 32000 | **默认**，质量/速度/显存均衡 |
| `v2Pro` | v2Pro | 32000 | 轻量 |
| `v5turbo` | v5turbo | 48000 | 低延迟（4 步蒸馏，CFG 0） |
| `v5dev` | v5dev | 48000 | 高质量（32 步，CFG 1.3），较慢 |

模型参数（`model` 字段）支持别名：`gpt-sovits-<id>`、`v2-pro-plus` 等连字符形式。未安装的模型返回 400。四个模型共享单实例懒加载缓存，切换时旧模型卸载并释放显存（首次请求该模型会有数秒加载延迟，之后常驻）。

### 缓存

`/v1/audio/speech`、`/tts`、`/tts/stream` 默认启用本地结果缓存：

- 缓存键 = 模型 + 音色 + 文本 + 文本语言 + 语速 + 格式 + seed 的 SHA-256；
- 命中直接返回上次编码结果（字节一致），响应头 `X-Cache: hit`，未命中为 `miss`；
- 保存周期 **180 天**，服务启动时与命中时惰性清理过期项；
- 传 `"cache": false` 可跳过缓存（旁路读、不写入）；
- **注意**：`seed=-1`（默认）时相同请求会返回与首次完全相同的声音；需要随机变化请传 `cache: false` 或指定不同 seed；
- 零样本克隆（`/v1/audio/clone`）不缓存。

### 通用响应头

| 头 | 说明 |
|---|---|
| `X-Request-Id` | 请求 ID（可由调用方通过 `X-Request-Id` 指定） |
| `X-Model` | 实际使用的模型 |
| `X-Voice` | 音色 ID |
| `X-Audio-Seconds` | 音频时长（秒） |
| `X-RTF` | 合成实时率（仅未命中缓存时） |
| `X-Cache` | `hit` / `miss` |

---

## 业务接口

### GET /health

健康检查（**无需认证**）。

```json
{
  "status": "ok",
  "model": "v2ProPlus",
  "default_model": "v2ProPlus",
  "models": ["v5turbo", "v5dev", "v2Pro", "v2ProPlus"],
  "sample_rate": 32000,
  "model_load_seconds": 25.92,
  "device": "cuda:0",
  "voice_count": 969,
  "default_voice": "default",
  "queue": 0,
  "cache": {"enabled": true, "ttl_days": 180.0, "entries": 2, "bytes": 502938},
  "gpu": {"allocated_mb": 1382.0, "reserved_mb": 1452.0, "peak_allocated_mb": 1382.0, "peak_reserved_mb": 1452.0},
  "asr": {"enabled": true, "ready": true, "model": "SenseVoiceSmall int8", "device": "cpu", "threads": 4, "load_seconds": 1.43, "last_latency_ms": 54, "error": null},
  "uptime_sec": 129.3
}
```

### GET /

服务信息（无需认证）：服务名、默认模型、已安装模型、各端点路径。

### GET /v1/models

列出已安装模型：`id`、`version`、`sample_steps`、`cfg_rate`、`default`、`loaded`、`sample_rate`（仅当前加载的模型有值）。

### GET /v1/voices

列出全部音色（含 968 个音色库音色 + 系统 `default`）：

```json
{
  "object": "list",
  "data": [
    {
      "id": "baokuan-1a2b3c4d",
      "name": "音色名",
      "description": "",
      "language": "zh",
      "category": "爆款",
      "category_id": "baokuan",
      "tags": ["女声", "激情"],
      "duration": 8.5,
      "preview_url": "/v1/voices/baokuan-1a2b3c4d/preview"
    }
  ]
}
```

### GET /v1/voices/{voice_id}/preview

返回该音色参考音频（WAV，需认证），供试听。客户端可缓存 1 小时（`Cache-Control: private, max-age=3600`）。

### POST /v1/audio/speech

OpenAI 风格语音合成，返回音频二进制。

| 字段 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `input` | string | 必填 | 待合成文本（≤1000 字符） |
| `voice` | string | `default` | 音色 ID，见 `/v1/voices` |
| `model` | string | `v2ProPlus` | 模型 ID |
| `language` | string | `zh` | 文本语言：`zh`/`en`/`ja`/`yue`/`auto`/`auto_yue`/`all_zh`/`all_ja`/`all_yue` |
| `response_format` | string | `mp3` | wav/mp3/opus/flac/aac |
| `speed` | float | 1.0 | 0.5–2.0 |
| `seed` | int | -1 | 随机种子，-1 表示随机 |
| `cache` | bool | true | 是否读写本地缓存 |

```bash
curl -X POST https://tts.codesocean.top/v1/audio/speech \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"input": "你好，这是测试。", "voice": "default", "response_format": "mp3"}' \
  -o speech.mp3
```

### POST /tts

原生合成接口，参数与 `/v1/audio/speech` 等价，但字段名不同：`text`、`text_lang`、`speed_factor`，默认格式为 `wav`。同样支持 `model`、`voice`、`response_format`、`seed`、`cache`。

### POST /tts/stream

流式合成。按句子逐段生成（质量与整段合成一致），边生成边通过 chunked 传输输出编码后的音频，可用普通 HTTP 客户端或媒体播放器直接消费。

| 字段 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `text` | string | 必填 | 待合成文本（≤1000 字符） |
| `voice` | string | `default` | 音色 ID |
| `model` | string | `v2ProPlus` | 模型 ID |
| `text_lang` | string | `zh` | 文本语言 |
| `response_format` | string | `mp3` | wav/mp3/opus/flac/aac |
| `speed` | float | 1.0 | 0.5–2.0 |
| `seed` | int | -1 | 随机种子 |
| `cache` | bool | true | 命中缓存时直接返回完整文件 |

行为说明：

- 未命中缓存：`X-Cache: miss`，分块流式返回；首个分块在合成出第一句后到达（本地实测约 1.7s，含模型加载则更长）；若客户端提前断开，服务端停止合成并不写缓存。
- 命中缓存：`X-Cache: hit`，直接返回完整音频文件（支持 Range 请求）。
- 首块超时（默认 120 秒）返回 504。

```bash
curl -N -X POST https://tts.codesocean.top/tts/stream \
  -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" \
  -d '{"text": "第一段较长的文本……", "voice": "default", "response_format": "mp3"}' \
  -o stream.mp3
```

### POST /v1/audio/clone

零样本克隆：上传 3–10 秒参考音频，合成相同音色的语音。`multipart/form-data`。

| 字段 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `reference_audio` | file | 必填 | 参考音频，3–10s，≤15MB |
| `text` | string | 必填 | 待合成文本 |
| `prompt_text` | string | `""` | 参考音频对应的文字稿；缺省时自动 ASR 识别 |
| `text_lang` | string | `zh` | 合成文本语言 |
| `prompt_lang` | string | `zh` | 参考音频语言（zh/en/ja/yue） |
| `response_format` | string | `mp3` | 输出格式 |
| `speed` | float | 1.0 | 0.5–2.0 |
| `seed` | int | -1 | 随机种子 |
| `model` | string | `v2ProPlus` | 模型 ID |
| `auto_trim` | bool | true | 参考 >10s 时自动裁剪到前 9.8s；false 且超长则 400 |
| `auto_transcribe` | bool | true | 自动识别参考文字稿（SenseVoice，CPU）；false 且未提供 prompt_text 则 400 |

额外响应头：`X-Ref-Trimmed`（是否裁剪）、`X-Ref-Seconds` / `X-Ref-Original-Seconds`（裁剪后/原始时长）、`X-Transcript-Source`（`asr`=自动识别 / `user`=调用方提供）。该接口不使用缓存。

```bash
curl -X POST https://tts.codesocean.top/v1/audio/clone \
  -H "Authorization: Bearer $KEY" \
  -F reference_audio=@ref.wav -F text="要合成的文本" \
  -F response_format=mp3 -o clone.mp3
```

### POST /v1/audio/transcribe

SenseVoice 语音识别（CPU，int8，`language=auto`）。`multipart/form-data`，字段 `audio`（音频文件，≤15MB；超 10s 自动截取前 9.8s）。

```json
{
  "text": "识别出的文本",
  "language": "zh",
  "duration": 9.8,
  "original_duration": 12.0,
  "trimmed": true,
  "model": "SenseVoiceSmall int8",
  "latency_ms": 358
}
```

---

## 管理接口（需 X-Admin-Key）

### POST /admin/keys

创建 API Key。Body：`{"name": "名称(≤64字符,必填)", "note": "备注(≤200字符)"}`。
响应 201：`{"id", "name", "note", "key", "key_prefix", "created_at"}` —— **`key` 为完整密钥，仅此一次返回**。

### GET /admin/keys

列出所有 Key（仅 `key_prefix` 前缀，不含完整密钥），含创建时间、是否吊销、最后使用时间、用量计数。

### POST /admin/keys/{key_id}/revoke

吊销 Key。响应 `{"id": 3, "revoked": true}`；不存在或已吊销返回 404。

### GET /admin/usage?key_id=&limit=100&offset=0

用量明细。响应 `{"total", "items": [...]}`，每条含 `request_id, key_id, key_name, endpoint, model, voice, text_chars, audio_seconds, latency_ms, status, error, client_ip, user_agent, text_sha256, created_at`（**不存原文，仅存文本哈希**）。

### GET /admin/usage/summary?days=30

用量汇总，响应含 `since` 与三组统计：`by_key`（按 Key）、`by_day`（按日）、`by_model`（按模型），字段含请求数、字符数、音频秒数、平均延迟、错误数。

---

## 错误码

| 状态码 | 场景 |
|---|---|
| 400 | 参数错误：未知模型/音色、不支持的语言或格式、语速越界、参考音频时长不合规、未知缓存请求等 |
| 401 | 缺失或无效的 API Key / Admin Key |
| 404 | 音色、Key 或预览音频不存在 |
| 413 | 文本超 1000 字符，或上传音频超 15MB |
| 429 | 排队请求数超上限（8） |
| 500 | 合成/编码失败（响应含 request id，可查服务日志） |
| 503 | ASR 不可用（自动识别参考文字稿失败） |
| 504 | 流式接口首块超时 |

所有响应带 `X-Request-Id`；错误体形如 `{"detail": "..."}`。
