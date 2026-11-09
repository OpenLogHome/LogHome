package top.codesocean.loghome.android.audio

import org.junit.Assert.*
import org.junit.Test

class TtsVoiceCatalogTest {
    @Test fun onlyTheFourFreeVoicesAreExposed() {
        assertEquals(listOf("温润君子", "阳光少年", "青春女神", "软糯萝莉"), TtsVoiceCatalog.voices.values.toList())
        assertTrue(TtsVoiceCatalog.contains(DEFAULT_TTS_VOICE_ID))
        assertFalse(TtsVoiceCatalog.contains("system-default"))
        assertFalse(TtsVoiceCatalog.contains("zh-CN-XiaoxiaoNeural"))
    }

    @Test fun longParagraphsPreserveAllCharactersAndUnicodeBoundaries() {
        val text = "原木听书😀".repeat(450)
        val chunks = splitTtsText(text)
        assertTrue(chunks.size > 1)
        assertEquals(text, chunks.joinToString(""))
        assertTrue(chunks.all { it.length <= 900 && !it.last().isHighSurrogate() && !it.first().isLowSurrogate() })
    }

    @Test fun sentenceBoundariesArePreferredWithoutDroppingPunctuation() {
        val first = "木".repeat(650) + "。"
        val text = first + "家".repeat(650)
        val chunks = splitTtsText(text)
        assertEquals(first, chunks.first())
        assertEquals(text, chunks.joinToString(""))
        assertTrue(splitTtsText(" \n ").isEmpty())
    }
}
