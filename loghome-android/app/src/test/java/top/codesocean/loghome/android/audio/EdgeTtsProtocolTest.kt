package top.codesocean.loghome.android.audio

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class EdgeTtsProtocolTest {
    @Test
    fun secMsGecMatchesEdgeTtsReferenceImplementation() {
        assertEquals(
            "A6CFC1AF9A99472278900CE80039364190CBF26069E54E9D611B3338A63196FE",
            generateEdgeSecMsGec(nowMillis = 1_722_470_400_000L),
        )
    }

    @Test
    fun textSplittingPreservesUtf8AndXmlEntities() {
        val escaped = escapeEdgeXml("开头<&>" + "中文内容".repeat(1_500))
        val chunks = splitEdgeText(escaped)

        assertTrue(chunks.size > 1)
        assertTrue(chunks.all { it.toByteArray(Charsets.UTF_8).size <= EDGE_TTS_MAX_TEXT_BYTES })
        assertEquals(escaped, chunks.joinToString(""))
        assertTrue(chunks.none { it.endsWith("&") || it.matches(Regex(".*&[a-z]*$")) })
    }

    @Test
    fun textSplittingHandlesOneEarlyWhitespaceBoundary() {
        val chunks = splitEdgeText("标题 " + "正文".repeat(3_000))

        assertTrue(chunks.size > 1)
        assertEquals("标题", chunks.first())
        assertTrue(chunks.all { it.toByteArray(Charsets.UTF_8).size <= EDGE_TTS_MAX_TEXT_BYTES })
    }

    @Test
    fun voiceNamesSupportRegionalVariants() {
        assertEquals(
            "Microsoft Server Speech Text to Speech Voice (zh-CN, XiaoxiaoNeural)",
            edgeVoiceName("zh-CN-XiaoxiaoNeural"),
        )
        assertEquals(
            "Microsoft Server Speech Text to Speech Voice (zh-CN-liaoning, XiaobeiNeural)",
            edgeVoiceName("zh-CN-liaoning-XiaobeiNeural"),
        )
    }

    @Test
    fun voiceCatalogExposesUniqueSupportedIds() {
        assertEquals(8, EdgeTtsVoiceCatalog.voices.size)
        assertEquals(
            EdgeTtsVoiceCatalog.voices.size,
            EdgeTtsVoiceCatalog.voices.map { it.voiceId }.distinct().size,
        )
        assertTrue(EdgeTtsVoiceCatalog.voices.all { EdgeTtsVoiceCatalog.isEdgeVoice(it.voiceId) })
    }
}
