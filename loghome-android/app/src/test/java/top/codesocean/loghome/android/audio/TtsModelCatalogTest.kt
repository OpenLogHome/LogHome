package top.codesocean.loghome.android.audio

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class TtsModelCatalogTest {
    @Test
    fun multiSpeakerVoicesShareOneDownloadPerModel() {
        val groupedModels = TtsModelCatalog.models.groupBy { it.modelKey }

        assertEquals(listOf(1, 6), groupedModels.values.map { it.size }.sorted())
        groupedModels.values.forEach { voices ->
            assertEquals(1, voices.map { it.archiveUrl }.distinct().size)
            assertEquals(1, voices.map { it.archiveSha256 }.distinct().size)
            assertEquals(1, voices.map { it.installationDirectoryName }.distinct().size)
        }
    }

    @Test
    fun exposedVoiceIdsAndSpeakerIdsAreUniqueWithinEachModel() {
        assertEquals(
            TtsModelCatalog.models.size,
            TtsModelCatalog.models.map { it.voiceId }.distinct().size,
        )
        TtsModelCatalog.models.groupBy { it.modelKey }.values.forEach { voices ->
            assertEquals(voices.size, voices.map { it.speakerId }.distinct().size)
        }
    }

    @Test
    fun archiveExtractionKeepsOnlyDeclaredModelAssets() {
        val aishell = TtsModelCatalog.models.first { it.modelId == "vits-icefall-zh-aishell3" }
        assertTrue(shouldExtractTtsArchiveEntry("vits-icefall-zh-aishell3/model.onnx", aishell))
        assertTrue(!shouldExtractTtsArchiveEntry("vits-icefall-zh-aishell3/rule.far", aishell))
        assertTrue(!shouldExtractTtsArchiveEntry("../model.onnx", aishell))
    }

    @Test
    fun lightweightVoicesHaveNamedGenderProfiles() {
        val voices = TtsModelCatalog.models.filter { it.modelId == "vits-icefall-zh-aishell3" }

        assertEquals(
            listOf(
                "轻量男声·远山",
                "轻量女声·清禾",
                "轻量女声·知夏",
                "轻量女声·南星",
                "轻量女声·晚晴",
                "轻量成熟女声·静秋",
            ),
            voices.map { it.displayName },
        )
        assertEquals("离线男声·超文", TtsModelCatalog.models.first().displayName)
    }
}
