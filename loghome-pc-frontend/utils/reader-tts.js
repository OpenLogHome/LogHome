import { readingRequest, readingToken } from '~/plugins/api/reading'

export const TTS_ENDPOINT = 'https://tts.codesocean.top'
export const DEFAULT_TTS_VOICE = 'warm-gentleman'
export const TTS_VOICES = [
  { voiceURI: 'warm-gentleman', name: '温润君子', lang: 'zh-CN', free: true },
  { voiceURI: 'sunny-boy', name: '阳光少年', lang: 'zh-CN', free: true },
  { voiceURI: 'youthful-goddess', name: '青春女神', lang: 'zh-CN', free: true },
  { voiceURI: 'soft-girl', name: '软糯萝莉', lang: 'zh-CN', free: true }
]

export async function requestTtsSpeech({ input, voice, token, signal }, fetcher = window.fetch.bind(window)) {
  const controller = new AbortController()
  let timedOut = false
  const abort = () => controller.abort()
  if (signal) { if (signal.aborted) abort(); else signal.addEventListener('abort', abort, { once: true }) }
  const timer = setTimeout(() => { timedOut = true; abort() }, 240000)
  try {
    const response = await fetcher(`${TTS_ENDPOINT}/v1/audio/speech`, {
      method: 'POST', credentials: 'omit', signal: controller.signal,
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      // Follow the deployed default model. Playback speed is handled locally.
      body: JSON.stringify({ input, voice, language: 'zh', response_format: 'mp3' })
    })
    if (!response.ok) {
      const error = new Error(response.status === 429 ? '听书服务繁忙，请稍后重试。' : `听书合成失败（${response.status}），请重试。`)
      error.status = response.status
      throw error
    }
    const blob = await response.blob()
    if (!blob.size || (!/^audio\//i.test(blob.type) && blob.type !== 'application/octet-stream')) throw Error('听书服务返回了无效音频。')
    return blob
  } catch (error) {
    if (timedOut) throw Error('语音生成超时，请稍后重试。')
    if (error.name === 'TypeError') throw Error('无法连接听书服务，请检查网络及站点跨域配置。')
    throw error
  } finally {
    clearTimeout(timer)
    if (signal) signal.removeEventListener('abort', abort)
  }
}

export function createReaderAudioEnvironment(app, extra = {}) {
  return {
    createAudio: typeof window.Audio === 'function' && typeof window.fetch === 'function' ? () => new window.Audio() : null,
    session: async token => {
      if (!token) throw Error('请先登录后使用听书。')
      const result = await readingRequest('/tts/session', {}, {
        method: 'POST', timeout: 60000, headers: { Authorization: `Bearer ${token}` }, body: {}
      })
      return result.data
    },
    speech: requestTtsSpeech,
    createObjectURL: blob => window.URL.createObjectURL(blob),
    revokeObjectURL: url => window.URL.revokeObjectURL(url),
    article: id => app.$api.reader.article(id), token: readingToken, now: Date.now,
    setTimeout: (fn, ms) => window.setTimeout(fn, ms), clearTimeout: id => window.clearTimeout(id),
    ...extra
  }
}
