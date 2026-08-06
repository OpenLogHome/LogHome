package top.codesocean.loghome.android.audio

import android.os.Build
import android.util.Log
import com.k2fsa.sherpa.onnx.GenerationConfig
import com.k2fsa.sherpa.onnx.GeneratedAudio
import com.k2fsa.sherpa.onnx.OfflineTts
import com.k2fsa.sherpa.onnx.OfflineTtsConfig
import com.k2fsa.sherpa.onnx.OfflineTtsModelConfig
import com.k2fsa.sherpa.onnx.OfflineTtsVitsModelConfig
import java.io.File
import java.io.IOException

private const val SHERPA_TAG = "LogHomeSherpaTts"

class SherpaOnnxTtsEngine(
    private val modelManager: TtsModelManager,
) {
    private val synthesisLock = Any()

    @Volatile
    private var loadedModelKey: String? = null

    private var offlineTts: OfflineTts? = null

    fun isRuntimeSupported(): Boolean =
        Build.SUPPORTED_ABIS.any { it == "arm64-v8a" }

    suspend fun prepareVoice(
        voiceId: String,
        onProgress: (downloadedBytes: Long, totalBytes: Long) -> Unit = { _, _ -> },
    ): File {
        if (!isRuntimeSupported()) {
            throw IOException("The embedded TTS engine requires an arm64-v8a device")
        }
        val descriptor = TtsModelCatalog.findByVoiceId(voiceId)
            ?: throw IOException("Unknown embedded TTS voice: $voiceId")
        return modelManager.ensureInstalled(descriptor, onProgress)
    }

    @Throws(IOException::class)
    fun synthesizeToFile(
        text: String,
        requestedVoiceId: String,
        outputFile: File,
    ) {
        val descriptor = TtsModelCatalog.findByVoiceId(requestedVoiceId)
            ?: throw IOException("Unknown embedded TTS voice: $requestedVoiceId")
        val modelDirectory = modelManager.getInstalledModelDirectory(descriptor)
            ?: throw IOException("Embedded TTS voice is not downloaded: $requestedVoiceId")

        synchronized(synthesisLock) {
            val tts = getOrCreateEngine(descriptor, modelDirectory)
            outputFile.parentFile?.mkdirs()
            val temporaryFile = File(outputFile.parentFile, "${outputFile.name}.partial")
            temporaryFile.delete()
            outputFile.delete()

            try {
                val synthesisText = text.ifBlank { "测试文本" }
                val segments = if (descriptor.punctuationPauses) {
                    segmentTextWithPunctuationPauses(synthesisText)
                        .ifEmpty { listOf(TtsTextSegment("测试文本", 0)) }
                } else {
                    listOf(TtsTextSegment(synthesisText, 0))
                }
                val audio = synthesizeSegments(tts, descriptor, segments)
                if (audio.samples.isEmpty() || !audio.save(temporaryFile.absolutePath)) {
                    throw IOException("sherpa-onnx produced empty audio")
                }
                if (!temporaryFile.renameTo(outputFile)) {
                    throw IOException("Unable to activate synthesized audio")
                }
                Log.d(
                    SHERPA_TAG,
                    "Synthesis completed: voice=$requestedVoiceId, size=${outputFile.length()}",
                )
            } catch (error: Throwable) {
                temporaryFile.delete()
                outputFile.delete()
                throw IOException("sherpa-onnx synthesis failed", error)
            }
        }
    }

    private fun synthesizeSegments(
        tts: OfflineTts,
        descriptor: TtsModelDescriptor,
        segments: List<TtsTextSegment>,
    ): GeneratedAudio {
        val generated = segments.map { segment ->
            segment to tts.generateWithConfig(
                text = segment.text,
                config = GenerationConfig(
                    sid = descriptor.speakerId,
                    speed = descriptor.speed,
                    silenceScale = 0.2f,
                ),
            ).also { audio ->
                if (audio.samples.isEmpty()) {
                    throw IOException("sherpa-onnx produced empty audio for a text segment")
                }
            }
        }
        val sampleRate = generated.first().second.sampleRate
        if (generated.any { it.second.sampleRate != sampleRate }) {
            throw IOException("sherpa-onnx produced inconsistent sample rates")
        }

        val totalSamples = generated.sumOf { (segment, audio) ->
            audio.samples.size.toLong() + pauseSampleCount(segment.pauseAfterMillis, sampleRate)
        }
        if (totalSamples > Int.MAX_VALUE) {
            throw IOException("Synthesized audio is too long")
        }

        val combined = FloatArray(totalSamples.toInt())
        var offset = 0
        generated.forEach { (segment, audio) ->
            audio.samples.copyInto(combined, destinationOffset = offset)
            offset += audio.samples.size
            offset += pauseSampleCount(segment.pauseAfterMillis, sampleRate).toInt()
        }
        return GeneratedAudio(samples = combined, sampleRate = sampleRate)
    }

    private fun pauseSampleCount(pauseMillis: Int, sampleRate: Int): Long =
        pauseMillis.toLong() * sampleRate / 1_000L

    fun release() {
        synchronized(synthesisLock) {
            offlineTts?.release()
            offlineTts = null
            loadedModelKey = null
        }
    }

    private fun getOrCreateEngine(
        descriptor: TtsModelDescriptor,
        modelDirectory: File,
    ): OfflineTts {
        if (loadedModelKey == descriptor.modelKey) {
            offlineTts?.let { return it }
        }

        offlineTts?.release()
        val absoluteRuleFsts = descriptor.ruleFstFiles
            .joinToString(",") { File(modelDirectory, it).absolutePath }
        val modelConfig = OfflineTtsModelConfig(
            vits = OfflineTtsVitsModelConfig(
                model = File(modelDirectory, descriptor.modelFile).absolutePath,
                lexicon = descriptor.lexiconFiles
                    .joinToString(",") { File(modelDirectory, it).absolutePath },
                tokens = File(modelDirectory, descriptor.tokensFile).absolutePath,
            ),
            numThreads = 2,
            debug = false,
            provider = "cpu",
        )
        val config = OfflineTtsConfig(
            model = modelConfig,
            ruleFsts = absoluteRuleFsts,
            maxNumSentences = 1,
            silenceScale = 0.2f,
        )
        return try {
            OfflineTts(config = config).also {
                offlineTts = it
                loadedModelKey = descriptor.modelKey
                Log.i(SHERPA_TAG, "Loaded embedded TTS model ${descriptor.modelId}")
            }
        } catch (error: Throwable) {
            throw IOException("Unable to initialize sherpa-onnx", error)
        }
    }
}
