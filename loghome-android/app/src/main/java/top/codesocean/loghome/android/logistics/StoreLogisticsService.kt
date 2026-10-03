package top.codesocean.loghome.android.logistics

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest
import java.time.Instant
import java.util.concurrent.TimeUnit

/** Native networking for the store's fixed tracking provider, shared across WebViews. */
object StoreLogisticsService {
    const val QUERY_INTERVAL = 30 * 60 * 1000L
    private const val MAX_BODY = 1024 * 1024L
    private const val MAX_CACHE_ENTRIES = 100
    private val lock = Mutex()
    private val client = OkHttpClient.Builder()
        .connectTimeout(8, TimeUnit.SECONDS)
        .readTimeout(8, TimeUnit.SECONDS)
        .callTimeout(10, TimeUnit.SECONDS)
        .followRedirects(false)
        .followSslRedirects(false)
        .build()
    private val carriers = setOf(
        "shunfeng", "zhongtong", "yuantong", "yunda", "shentong", "jtexpress", "jd",
        "ems", "youzhengguonei", "debangkuaidi", "debangwuliu", "huitongkuaidi",
        "danniao", "kuayue", "annengwuliu",
    )

    fun queryUrl(number: String, carrier: String): String {
        require(Regex("^[A-Za-z0-9-]{5,100}$").matches(number)) { "Invalid tracking number" }
        require(carrier in carriers) { "Unsupported carrier" }
        // No caller-supplied URL, cookies, authorization, or receiver phone is accepted.
        return "https://www.kuaidi.com/index-ajaxselectcourierinfo-$number-$carrier.html"
    }

    private fun base(status: String, message: String = "") = JSONObject()
        .put("status", status).put("message", message).put("provider", "kuaidiwang")
        .put("public_url", "https://www.kuaidi.com/").put("events", JSONArray())
        .put("state", JSONObject.NULL).put("state_text", "等待物流更新")
        .put("checked_at", JSONObject.NULL).put("next_query_at", JSONObject.NULL)
        .put("cached", false).put("stale", false)

    fun normalizeResponse(data: JSONObject, number: String, carrier: String): JSONObject {
        if ((data.has("nu") && data.optString("nu").isNotEmpty() && !data.optString("nu").equals(number, true)) ||
            (data.has("exname") && data.optString("exname").isNotEmpty() && data.optString("exname") != carrier)) {
            return base("unavailable", "物流服务返回的运单不匹配，请使用官方查件入口")
        }
        if (data.opt("success") != true) {
            val reason = data.optString("reason")
            return when {
                Regex("验证码|手机|核验|验证").containsMatchIn(reason) -> base("verification_required", "服务方要求核验，请通过快递公司官方入口查询")
                Regex("频繁|限制|次数|稍后|繁忙").containsMatchIn(reason) -> base("unavailable", "物流服务暂时受限，请稍后重试")
                Regex("暂无|没有|无记录|无物流|不存在|未查|查无|未找到|单号.*无").containsMatchIn(reason) -> base("no_records", "服务方暂未查到物流记录，请稍后查看")
                else -> base("unavailable", "物流服务暂时无法返回记录，请使用官方查件入口")
            }
        }
        val rows = data.optJSONArray("data") ?: return base("unavailable", "物流服务返回异常，请稍后重试")
        if (data.optString("status") == "2") return base("unavailable", "物流服务暂时出现异常，请稍后重试")
        val events = (0 until minOf(rows.length(), 200)).mapNotNull { index ->
            val row = rows.optJSONObject(index) ?: return@mapNotNull null
            val context = row.opt("context") as? String ?: return@mapNotNull null
            if (context.isBlank()) return@mapNotNull null
            JSONObject().put("time", row.optString("time").take(40))
                .put("context", context.take(2000)).put("location", row.optString("location").take(200))
        }.sortedByDescending { it.optString("time") }
        val providerState = data.optString("status")
        val (state, label) = when (providerState) {
            "0" -> null to "等待物流更新"
            "3" -> "0" to "运输中"
            "4" -> "1" to "已揽收"
            "5" -> "2" to "物流异常"
            "6" -> "3" to "已签收"
            "7" -> "4" to "退签"
            "8" -> "5" to "派送中"
            "9" -> "6" to "已退回"
            else -> null to "物流更新"
        }
        return base(if (events.isEmpty()) "no_records" else "ok", if (events.isEmpty()) "服务方暂未查到物流记录，请稍后查看" else "")
            .put("events", JSONArray(events)).put("state", state ?: JSONObject.NULL)
            .put("state_text", label).put("provider_state", providerState)
    }

    suspend fun query(context: Context, payload: JSONObject): JSONObject = withContext(Dispatchers.IO) {
        val number = payload.optString("tracking_number").trim()
        val carrier = payload.optString("shipping_company_code")
        val url = queryUrl(number, carrier)
        lock.withLock {
            val prefs = context.applicationContext.getSharedPreferences("store_logistics_v1", Context.MODE_PRIVATE)
            val key = MessageDigest.getInstance("SHA-256").digest("$carrier:$number".toByteArray())
                .joinToString("") { "%02x".format(it) }
            val now = System.currentTimeMillis()
            val previous = runCatching { JSONObject(prefs.getString(key, "") ?: "") }.getOrNull()
            if (previous != null && runCatching { Instant.parse(previous.optString("next_query_at")).toEpochMilli() }.getOrDefault(0) > now) {
                return@withLock previous.put("cached", true)
            }
            var result = try {
                client.newCall(Request.Builder().url(url).header("Accept", "application/json").build()).execute().use { response ->
                    check(response.isSuccessful) { "Tracking request failed" }
                    val body = response.body ?: error("Empty tracking response")
                    check(body.contentLength() <= MAX_BODY) { "Tracking response too large" }
                    val source = body.source()
                    source.request(MAX_BODY + 1)
                    check(source.buffer.size <= MAX_BODY) { "Tracking response too large" }
                    val bytes = source.buffer.readByteArray()
                    normalizeResponse(JSONObject(String(bytes, Charsets.UTF_8)), number, carrier)
                }
            } catch (_: Exception) {
                base("unavailable", "物流查询暂时不可用，请稍后重试或使用官方查件入口")
            }
            if (result.optString("status") in setOf("unavailable", "verification_required") && previous != null &&
                (previous.optJSONArray("events")?.length() ?: 0) > 0) {
                val failureStatus = result.optString("status")
                result = JSONObject(previous.toString()).put("cached", false).put("stale", true)
                    .put("refresh_status", failureStatus)
                    .put("last_success_at", previous.optString("last_success_at", previous.optString("checked_at")))
                    .put("message", "本次更新未成功，以下为上次取得的物流记录；可通过官方入口核验")
            }
            result.put("checked_at", Instant.ofEpochMilli(now).toString())
                .put("next_query_at", Instant.ofEpochMilli(now + QUERY_INTERVAL).toString())
            val editor = prefs.edit()
            if (!prefs.contains(key) && prefs.all.size >= MAX_CACHE_ENTRIES) {
                val oldest = prefs.all.entries.minByOrNull { entry ->
                    runCatching { JSONObject(entry.value.toString()).optString("checked_at") }.getOrDefault("")
                }
                oldest?.let { editor.remove(it.key) }
            }
            editor.putString(key, result.toString()).apply()
            result
        }
    }
}
