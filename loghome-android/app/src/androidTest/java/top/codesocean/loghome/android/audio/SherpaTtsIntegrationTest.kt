package top.codesocean.loghome.android.audio

import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import kotlinx.coroutines.runBlocking
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

@LargeTest
@RunWith(AndroidJUnit4::class)
class SherpaTtsIntegrationTest {
    @Test
    fun downloadsModelAndSynthesizesWave() = runBlocking {
        val context = ApplicationProvider.getApplicationContext<android.content.Context>()
        val descriptor = TtsModelCatalog.models.first()
        val modelManager = TtsModelManager(context)
        modelManager.deleteModel(descriptor)
        val progressSamples = mutableListOf<Pair<Long, Long>>()
        val modelDirectory = modelManager.ensureInstalled(descriptor) { downloadedBytes, totalBytes ->
            progressSamples += downloadedBytes to totalBytes
        }

        assertTrue(modelDirectory.isDirectory)
        assertNotNull(modelManager.getInstalledModelDirectory(descriptor))
        assertTrue(progressSamples.isNotEmpty())
        assertTrue(progressSamples.first().first == 0L)
        assertTrue(
            progressSamples.last() ==
                (descriptor.archiveSizeBytes to descriptor.archiveSizeBytes),
        )
        assertTrue(progressSamples.all { it.second == descriptor.archiveSizeBytes })
        assertTrue(progressSamples.zipWithNext().all { (left, right) -> left.first <= right.first })

        val outputFile = File(context.cacheDir, "sherpa-tts-integration-test.wav")
        val engine = SherpaOnnxTtsEngine(modelManager)
        try {
            engine.synthesizeToFile(
                text = "原木社区离线语音合成测试。今天是二零二六年七月十八日。",
                requestedVoiceId = descriptor.voiceId,
                outputFile = outputFile,
            )
            assertTrue(outputFile.isFile)
            assertTrue(outputFile.length() > 44L)
            val header = ByteArray(4)
            val headerBytesRead = outputFile.inputStream().use { input -> input.read(header) }
            assertTrue(headerBytesRead == header.size)
            assertTrue(String(header, Charsets.US_ASCII) == "RIFF")
        } finally {
            engine.release()
            outputFile.delete()
        }
    }
}
