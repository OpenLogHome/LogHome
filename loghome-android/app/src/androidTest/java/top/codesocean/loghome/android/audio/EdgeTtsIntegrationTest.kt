package top.codesocean.loghome.android.audio

import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

@LargeTest
@RunWith(AndroidJUnit4::class)
class EdgeTtsIntegrationTest {
    @Test
    fun synthesizesChineseAndEnglishToMp3() {
        val context = ApplicationProvider.getApplicationContext<android.content.Context>()
        val output = File(context.cacheDir, "edge-tts-integration.mp3")
        try {
            EdgeOnlineTtsEngine().synthesizeToFile(
                text = "欢迎使用原木社区在线听书。This is an online speech test.",
                requestedVoiceId = "edge:zh-CN-XiaoxiaoNeural",
                outputFile = output,
            )
            assertTrue(output.isFile)
            assertTrue(output.length() > 512L)
            val header = output.inputStream().use { input -> ByteArray(3).also(input::read) }
            val hasId3Header = String(header, Charsets.US_ASCII) == "ID3"
            val hasMp3FrameHeader = header[0].toInt() and 0xff == 0xff &&
                header[1].toInt() and 0xe0 == 0xe0
            assertTrue(hasId3Header || hasMp3FrameHeader)
        } finally {
            output.delete()
        }
    }
}
