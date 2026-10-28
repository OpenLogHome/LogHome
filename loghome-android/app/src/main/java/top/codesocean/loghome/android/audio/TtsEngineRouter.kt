package top.codesocean.loghome.android.audio

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONArray
import org.json.JSONObject
import top.codesocean.loghome.android.BuildConfig
import java.io.File
import java.io.IOException
import java.util.concurrent.TimeUnit

private const val TTS_BASE_URL = "https://tts.codesocean.top"

private fun createTtsHttpClient() = OkHttpClient.Builder()
    .connectTimeout(20, TimeUnit.SECONDS)
    .readTimeout(180, TimeUnit.SECONDS)
    .callTimeout(240, TimeUnit.SECONDS)
    .followRedirects(false)
    .build()

/** All synthesis goes directly to the deployed TTS service using a per-user key. */
class TtsEngineRouter(private val http: OkHttpClient = createTtsHttpClient()) : TtsSynthesizer {
    private data class Session(val loginToken: String, val userId: Long, val token: String, val voices: Map<String, String>)
    private val sessionLock = Any()
    @Volatile private var session: Session? = null

    fun matchesLoginToken(token: String): Boolean = session?.loginToken == token

    suspend fun configure(loginToken: String): Boolean = withContext(Dispatchers.IO) {
        synchronized(sessionLock) {
            val previousUser = session?.userId
            try {
                // A refreshed login token can still represent the same user.
                // Only the backend-authenticated user ID determines a switch.
                val next = fetchSession(loginToken)
                session = next
                previousUser != next.userId
            } catch (error: Exception) {
                session = null
                throw error
            }
        }
    }

    private fun fetchSession(loginToken: String): Session {
        if (loginToken.isBlank()) throw IOException("请先登录后使用听书")
        val request = Request.Builder().url("${BuildConfig.BACKEND_ENDPOINT}/tts/session")
            .header("Authorization", "Bearer $loginToken")
            .post("{}".toRequestBody("application/json".toMediaType())).build()
        return http.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException(if (response.code == 401) "登录已失效，请重新登录" else "听书服务暂时不可用（${response.code}）")
            val data = JSONObject(response.body?.string().orEmpty()).getJSONObject("data")
            val voices = data.getJSONArray("voices")
            val resolved = mutableMapOf<String, String>()
            for (index in 0 until voices.length()) {
                val voice = voices.getJSONObject(index)
                if (TtsVoiceCatalog.contains(voice.getString("id"))) {
                    resolved[voice.getString("id")] = voice.getString("voice_id")
                }
            }
            if (resolved.keys != TtsVoiceCatalog.voices.keys) throw IOException("听书音色暂时不可用")
            Session(loginToken, data.getLong("user_id"), data.getString("token"), resolved)
        }
    }

    suspend fun prepareVoice(voiceId: String) {
        if (!TtsVoiceCatalog.contains(voiceId)) throw IOException("不支持的听书音色")
        if (session == null) throw IOException("请先登录后使用听书")
    }

    override fun cacheIdentity(voice: String): String {
        val active = session ?: throw IOException("请先登录后使用听书")
        return "gpt-sovits-v1|${active.userId}|${active.voices[voice]}"
    }

    @Throws(IOException::class)
    override fun synthesizeToFile(text: String, requestedVoiceId: String, outputFile: File) {
        if (!TtsVoiceCatalog.contains(requestedVoiceId)) throw IOException("不支持的听书音色")
        val chunks = splitTtsText(text)
        if (chunks.isEmpty()) throw IOException("听书文本不能为空")
        val original = session ?: throw IOException("请先登录后使用听书")
        val temporary = File(outputFile.path + ".part")
        try {
            TtsWaveWriter(temporary).use { output ->
                for (chunk in chunks) {
                    var active = session ?: throw IOException("听书会话已结束")
                    if (active.userId != original.userId) throw IOException("听书账号已变更")
                    var completed = false
                    for (attempt in 0..2) {
                        val body = JSONObject().put("input", chunk)
                            .put("voice", active.voices.getValue(requestedVoiceId))
                            .put("language", "zh").put("response_format", "wav")
                        // Omit model so the service selects its deployed default.
                        val request = Request.Builder().url("$TTS_BASE_URL/v1/audio/speech")
                            .header("Authorization", "Bearer ${active.token}")
                            .post(body.toString().toRequestBody("application/json".toMediaType())).build()
                        http.newCall(request).execute().use { response ->
                            if (response.code == 401 && attempt == 0) {
                                active = synchronized(sessionLock) {
                                    val current = session ?: throw IOException("听书会话已结束")
                                    if (current.userId != original.userId) throw IOException("听书账号已变更")
                                    if (current.token == active.token) {
                                        fetchSession(current.loginToken).also { session = it }
                                    } else current
                                }
                            } else if (response.code == 429 && attempt < 2) {
                                Thread.sleep((attempt + 1) * 1500L)
                            } else {
                                if (!response.isSuccessful) throw IOException("听书合成失败（${response.code}），请稍后重试")
                                val audio = response.body ?: throw IOException("听书服务返回空音频")
                                output.append(audio.bytes())
                                completed = true
                            }
                        }
                        if (completed) break
                    }
                    if (!completed) throw IOException("听书服务繁忙，请稍后重试")
                }
            }
            if (session?.userId != original.userId) throw IOException("听书账号已变更")
            if (!temporary.renameTo(outputFile)) throw IOException("无法保存听书音频")
        } finally {
            temporary.delete()
        }
    }

    fun getAvailableVoicesJson(): JSONArray = JSONArray().apply {
        TtsVoiceCatalog.voices.forEach { (id, name) ->
            put(JSONObject().put("id", id).put("name", name).put("description", "免费 · 在线音色")
                .put("engine", "gpt-sovits").put("free", true).put("online", true)
                .put("installed", true).put("requiresDownload", false))
        }
    }

    fun release() {
        session = null
        http.dispatcher.cancelAll()
    }
}
