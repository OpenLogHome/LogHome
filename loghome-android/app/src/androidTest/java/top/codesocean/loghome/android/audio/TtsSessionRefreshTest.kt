package top.codesocean.loghome.android.audio

import androidx.test.ext.junit.runners.AndroidJUnit4
import java.io.IOException
import kotlinx.coroutines.runBlocking
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Protocol
import okhttp3.Response
import okhttp3.ResponseBody.Companion.toResponseBody
import org.json.JSONArray
import org.json.JSONObject
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class TtsSessionRefreshTest {
    @Test fun refreshedJwtRetainsIdentityButAccountSwitchAndRejectedLoginInvalidateIt() = runBlocking {
        val client = OkHttpClient.Builder().addInterceptor { chain ->
            val authorization = chain.request().header("Authorization")
            val userId = when (authorization) {
                "Bearer first-101", "Bearer refreshed-101" -> 101
                "Bearer another-202" -> 202
                else -> null
            }
            val data = JSONObject().put("user_id", userId).put("token", "sk-tts-test-$userId")
                .put("voices", JSONArray().apply {
                    TtsVoiceCatalog.voices.keys.forEach { id -> put(JSONObject().put("id", id).put("voice_id", "voice-$id")) }
                })
            Response.Builder().request(chain.request()).protocol(Protocol.HTTP_1_1)
                .code(if (userId == null) 401 else 200).message("fixture")
                .body(JSONObject().put("data", data).toString().toResponseBody("application/json".toMediaType())).build()
        }.build()
        val router = TtsEngineRouter(client)
        try {
            assertTrue(router.configure("first-101"))
            val identity = router.cacheIdentity("sunny-boy")
            assertFalse("JWT rotation is not an account switch", router.configure("refreshed-101"))
            assertEquals(identity, router.cacheIdentity("sunny-boy"))
            assertTrue(router.matchesLoginToken("refreshed-101"))
            assertTrue(router.configure("another-202"))
            assertNotEquals(identity, router.cacheIdentity("sunny-boy"))
            try { router.configure("rejected"); fail("Rejected login must fail") } catch (_: IOException) {}
            assertFalse(router.matchesLoginToken("another-202"))
            assertThrows(IOException::class.java) { router.cacheIdentity("sunny-boy") }
        } finally { router.release() }
        Unit
    }
}
