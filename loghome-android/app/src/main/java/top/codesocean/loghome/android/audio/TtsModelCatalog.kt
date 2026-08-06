package top.codesocean.loghome.android.audio

import top.codesocean.loghome.android.BuildConfig

data class TtsModelDescriptor(
    val voiceId: String,
    val modelId: String,
    val version: String,
    val displayName: String,
    val description: String,
    val archiveUrl: String,
    val archiveSizeBytes: Long,
    val archiveSha256: String,
    val archiveRootDirectory: String,
    val modelFile: String,
    val lexiconFile: String,
    val tokensFile: String,
    val ruleFstFiles: List<String>,
    val bundledModelArchiveEntry: String? = null,
    val bundledModelArchiveSizeBytes: Long? = null,
    val bundledModelArchiveSha256: String? = null,
    val speakerId: Int = 0,
    val speed: Float = 1.0f,
    val punctuationPauses: Boolean = false,
    val maxExtractedSizeBytes: Long = 128L * 1024L * 1024L,
) {
    val installationDirectoryName: String
        get() = "$modelId-$version"

    val lexiconFiles: List<String>
        get() = listOf(lexiconFile)

    val requiredFiles: List<String>
        get() = listOf(modelFile, tokensFile) + lexiconFiles + ruleFstFiles

    val requiredDirectories: List<String>
        get() = emptyList()

    val modelContentSha256: String
        get() = bundledModelArchiveSha256 ?: archiveSha256

    val modelKey: String
        get() = "$installationDirectoryName:$modelContentSha256"
}

object TtsModelCatalog {
    const val SHERPA_VOICE_PREFIX = "sherpa:"

    private val chaowen = TtsModelDescriptor(
        voiceId = "sherpa:chaowen-int8@1",
        modelId = "vits-piper-zh_CN-chaowen-medium-int8",
        version = "1",
        displayName = "离线男声·超文",
        description = "极速音色包 · 约 14 MB",
        archiveUrl = BuildConfig.TTS_CHAOWEN_MODEL_URL,
        archiveSizeBytes = 14_002_560L,
        archiveSha256 = "c3a538c8a22492397adb6630c9b92b23323e1e332dcdb743346e7a428fb8b776",
        archiveRootDirectory = "vits-piper-zh_CN-chaowen-medium-int8",
        modelFile = "zh_CN-chaowen-medium.onnx",
        lexiconFile = "lexicon.txt",
        tokensFile = "tokens.txt",
        ruleFstFiles = listOf("phone.fst", "date.fst", "number.fst"),
        bundledModelArchiveEntry = "vits-piper-zh_CN-chaowen-medium-int8.tar.bz2",
        bundledModelArchiveSizeBytes = 14_011_298L,
        bundledModelArchiveSha256 = "f5f7c8628427fbb259ea4b7ec1a9a822a0c04e3f267071f0abfa0610371d9e0c",
    )

    private val aishell3Base = TtsModelDescriptor(
        voiceId = "sherpa:aishell3@1:sid0",
        modelId = "vits-icefall-zh-aishell3",
        version = "1",
        displayName = "轻量音色",
        description = "共享轻量包 · 约 32 MB",
        archiveUrl = BuildConfig.TTS_AISHELL3_MODEL_URL,
        archiveSizeBytes = 31_559_701L,
        archiveSha256 = "ab468db3a3308cdd861495e0db2f25d79418a0c00639f74944c7cdf5dd8c6ec1",
        archiveRootDirectory = "vits-icefall-zh-aishell3",
        modelFile = "model.onnx",
        lexiconFile = "lexicon.txt",
        tokensFile = "tokens.txt",
        ruleFstFiles = listOf("phone.fst", "date.fst", "number.fst"),
        punctuationPauses = true,
        maxExtractedSizeBytes = 256L * 1024L * 1024L,
    )

    val models = listOf(chaowen) +
        listOf(
            Triple(10, "轻量男声·远山", "青年男声"),
            Triple(33, "轻量女声·清禾", "青年女声"),
            Triple(66, "轻量女声·知夏", "青年女声"),
            Triple(99, "轻量女声·南星", "青年女声"),
            Triple(103, "轻量女声·晚晴", "青年女声"),
            Triple(141, "轻量成熟女声·静秋", "成熟女声"),
        ).map { (speakerId, displayName, voiceProfile) ->
            aishell3Base.copy(
                voiceId = "sherpa:aishell3@1:sid$speakerId",
                displayName = displayName,
                description = "${aishell3Base.description} · $voiceProfile",
                speakerId = speakerId,
            )
        }

    fun findByVoiceId(voiceId: String): TtsModelDescriptor? =
        models.firstOrNull { it.voiceId == voiceId }

    fun isSherpaVoice(voiceId: String): Boolean = voiceId.startsWith(SHERPA_VOICE_PREFIX)
}
