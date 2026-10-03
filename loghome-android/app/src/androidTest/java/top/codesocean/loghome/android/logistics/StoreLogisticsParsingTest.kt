package top.codesocean.loghome.android.logistics

import androidx.test.ext.junit.runners.AndroidJUnit4
import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.assertEquals
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class StoreLogisticsParsingTest {
    private fun parse(data: JSONObject) = StoreLogisticsService.normalizeResponse(data, "JT5529580581737", "jtexpress")
    @Test fun normalizesProviderStateAndNewestFirst() {
        val data = JSONObject().put("success", true).put("status", 6)
            .put("nu", "JT5529580581737").put("exname", "jtexpress")
            .put("data", JSONArray().put(JSONObject().put("time", "2026-09-29 08:00:00").put("context", "派送中"))
                .put(JSONObject().put("time", "2026-09-29 12:00:00").put("context", "已签收")))
        val result = parse(data)
        assertEquals("ok", result.getString("status"))
        assertEquals("已签收", result.getString("state_text"))
        assertEquals("已签收", result.getJSONArray("events").getJSONObject(0).getString("context"))
    }
    @Test fun distinguishesLimitsVerificationAndEmptyResults() {
        assertEquals("unavailable", parse(JSONObject().put("success", false).put("reason", "次数限制")).getString("status"))
        assertEquals("verification_required", parse(JSONObject().put("success", false).put("reason", "验证手机号")).getString("status"))
        assertEquals("no_records", parse(JSONObject().put("success", true).put("data", JSONArray())).getString("status"))
        assertEquals("unavailable", parse(JSONObject().put("success", true).put("nu", "OTHER123").put("data", JSONArray())).getString("status"))
    }
}
