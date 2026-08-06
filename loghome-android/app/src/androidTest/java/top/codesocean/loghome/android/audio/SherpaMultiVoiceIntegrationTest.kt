package top.codesocean.loghome.android.audio

import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.filters.LargeTest
import kotlinx.coroutines.runBlocking
import org.junit.Assume.assumeTrue
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import java.io.File

@LargeTest
@RunWith(AndroidJUnit4::class)
class SherpaMultiVoiceIntegrationTest {
    @Test
    fun aishellSpeakersShareInstallAndProduceDifferentAudio() = runBlocking {
        verifySharedModelVoices(
            descriptors = TtsModelCatalog.models
                .filter { it.modelId == "vits-icefall-zh-aishell3" }
                .take(2),
            forbiddenInstalledFile = "rule.far",
        )
    }

    private suspend fun verifySharedModelVoices(
        descriptors: List<TtsModelDescriptor>,
        forbiddenInstalledFile: String? = null,
    ) {
        assertEquals(2, descriptors.size)
        assumeTrue(
            "Run with the local model-server Gradle properties documented in tts-server-assets/README.md",
            descriptors.first().archiveUrl.startsWith("http://10.0.2.2:"),
        )
        val context = ApplicationProvider.getApplicationContext<android.content.Context>()
        val modelManager = TtsModelManager(context)
        modelManager.deleteModel(descriptors.first())

        val firstDirectory = modelManager.ensureInstalled(descriptors.first())
        val secondDirectory = modelManager.ensureInstalled(descriptors.last())
        assertEquals(firstDirectory.canonicalPath, secondDirectory.canonicalPath)
        forbiddenInstalledFile?.let { assertFalse(File(firstDirectory, it).exists()) }

        val engine = SherpaOnnxTtsEngine(modelManager)
        val firstOutput = File(context.cacheDir, "${descriptors.first().modelId}-first.wav")
        val secondOutput = File(context.cacheDir, "${descriptors.first().modelId}-second.wav")
        try {
            engine.synthesizeToFile(
                text = "夜幕降临，星光点点，这是离线听书多音色测试。",
                requestedVoiceId = descriptors.first().voiceId,
                outputFile = firstOutput,
            )
            engine.synthesizeToFile(
                text = "夜幕降临，星光点点，这是离线听书多音色测试。",
                requestedVoiceId = descriptors.last().voiceId,
                outputFile = secondOutput,
            )
            assertTrue(firstOutput.length() > 44L)
            assertTrue(secondOutput.length() > 44L)
            assertFalse(firstOutput.readBytes().contentEquals(secondOutput.readBytes()))
        } finally {
            engine.release()
            firstOutput.delete()
            secondOutput.delete()
        }
    }
}
