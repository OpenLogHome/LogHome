package top.codesocean.loghome.android.audio

import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.IOException

private const val ROUTER_TAG = "LogHomeTtsRouter"

class TtsEngineRouter(
    private val systemTtsEngine: SystemTtsEngine,
    private val sherpaTtsEngine: SherpaOnnxTtsEngine,
    private val edgeTtsEngine: EdgeOnlineTtsEngine,
    private val modelManager: TtsModelManager,
) {
    suspend fun prepareVoice(
        voiceId: String,
        onProgress: (downloadedBytes: Long, totalBytes: Long) -> Unit = { _, _ -> },
    ) {
        if (TtsModelCatalog.isSherpaVoice(voiceId)) {
            sherpaTtsEngine.prepareVoice(voiceId, onProgress)
        }
    }

    @Throws(IOException::class)
    fun synthesizeToFile(
        text: String,
        requestedVoiceId: String,
        outputFile: File,
    ) {
        if (EdgeTtsVoiceCatalog.isEdgeVoice(requestedVoiceId)) {
            synthesizeWithEdgeFallback(text, requestedVoiceId, outputFile)
            return
        }
        if (!TtsModelCatalog.isSherpaVoice(requestedVoiceId)) {
            systemTtsEngine.synthesizeToFile(text, requestedVoiceId, outputFile)
            return
        }

        try {
            sherpaTtsEngine.synthesizeToFile(text, requestedVoiceId, outputFile)
        } catch (error: Throwable) {
            Log.e(ROUTER_TAG, "Embedded TTS failed; using Android TTS fallback", error)
            systemTtsEngine.synthesizeToFile(text, SYSTEM_DEFAULT_VOICE_ID, outputFile)
        }
    }

    private fun synthesizeWithEdgeFallback(
        text: String,
        requestedVoiceId: String,
        outputFile: File,
    ) {
        try {
            edgeTtsEngine.synthesizeToFile(text, requestedVoiceId, outputFile)
        } catch (error: Throwable) {
            Log.e(ROUTER_TAG, "Online Edge TTS failed; using offline fallback", error)
            val offlineFallback = TtsModelCatalog.models.firstOrNull { descriptor ->
                descriptor.modelId == "vits-icefall-zh-aishell3" && modelManager.isInstalled(descriptor)
            }
            if (offlineFallback != null) {
                runCatching {
                    sherpaTtsEngine.synthesizeToFile(text, offlineFallback.voiceId, outputFile)
                }.onSuccess { return }
                    .onFailure { Log.e(ROUTER_TAG, "AISHELL-3 fallback failed", it) }
            }
            systemTtsEngine.synthesizeToFile(text, SYSTEM_DEFAULT_VOICE_ID, outputFile)
        }
    }

    fun getAvailableVoicesJson(): JSONArray {
        val result = JSONArray()
        EdgeTtsVoiceCatalog.voices.forEach { descriptor ->
            result.put(
                JSONObject()
                    .put("id", descriptor.voiceId)
                    .put("name", descriptor.displayName)
                    .put("description", descriptor.description)
                    .put("engine", "edge-online")
                    .put("installed", true)
                    .put("online", true)
                    .put("requiresDownload", false)
                    .put("downloadSizeBytes", 0L),
            )
        }

        if (sherpaTtsEngine.isRuntimeSupported()) {
            TtsModelCatalog.models.forEach { descriptor ->
                val installed = modelManager.isInstalled(descriptor)
                result.put(
                    JSONObject()
                        .put("id", descriptor.voiceId)
                        .put("name", descriptor.displayName)
                        .put(
                            "description",
                            if (installed) {
                                "${descriptor.description} · 已下载"
                            } else {
                                descriptor.description
                            },
                        )
                        .put("engine", "sherpa-onnx")
                        .put("installed", installed)
                        .put("requiresDownload", !installed)
                        .put("downloadSizeBytes", descriptor.archiveSizeBytes),
                )
            }
        }

        val systemVoices = systemTtsEngine.getAvailableVoicesJson()
        for (index in 0 until systemVoices.length()) {
            val voice = systemVoices.optJSONObject(index) ?: continue
            voice.put("engine", "android")
            voice.put("installed", true)
            voice.put("requiresDownload", false)
            result.put(voice)
        }
        return result
    }

    fun release() {
        sherpaTtsEngine.release()
        systemTtsEngine.release()
    }
}
