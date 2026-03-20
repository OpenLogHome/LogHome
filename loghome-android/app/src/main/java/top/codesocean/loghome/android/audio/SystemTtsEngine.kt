package top.codesocean.loghome.android.audio

import android.content.Context
import android.os.Handler
import android.os.Looper
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import android.speech.tts.Voice
import android.util.Log
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.IOException
import java.util.Locale
import java.util.UUID
import java.util.concurrent.CompletableFuture
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit

const val SYSTEM_DEFAULT_VOICE_ID = "system-default"

private const val SYSTEM_TTS_TAG = "LogHomeSystemTts"
private const val INIT_TIMEOUT_MS = 15_000L
private const val INVOKE_TIMEOUT_MS = 10_000L
private const val SYNTHESIS_TIMEOUT_SECONDS = 120L

class SystemTtsEngine(
    context: Context,
) {
    private val appContext = context.applicationContext
    private val mainHandler = Handler(Looper.getMainLooper())
    private val initLock = Object()
    private val synthesisLock = Any()
    private val pendingSyntheses = ConcurrentHashMap<String, CompletableFuture<Unit>>()

    @Volatile
    private var initialized = false

    @Volatile
    private var initStatus = TextToSpeech.ERROR

    @Volatile
    private var textToSpeech: TextToSpeech? = null

    private val progressListener = object : UtteranceProgressListener() {
        override fun onStart(utteranceId: String?) {
            Log.d(SYSTEM_TTS_TAG, "onStart: utteranceId=$utteranceId")
        }

        override fun onDone(utteranceId: String?) {
            utteranceId ?: return
            pendingSyntheses.remove(utteranceId)?.complete(Unit)
        }

        override fun onError(utteranceId: String?) {
            utteranceId ?: return
            pendingSyntheses.remove(utteranceId)
                ?.completeExceptionally(IOException("Android TTS synthesis failed"))
        }

        override fun onError(utteranceId: String?, errorCode: Int) {
            utteranceId ?: return
            pendingSyntheses.remove(utteranceId)
                ?.completeExceptionally(IOException("Android TTS synthesis failed: code=$errorCode"))
        }
    }

    init {
        mainHandler.post {
            textToSpeech = TextToSpeech(appContext) { status ->
                initStatus = status
                if (status == TextToSpeech.SUCCESS) {
                    textToSpeech?.setOnUtteranceProgressListener(progressListener)
                    Log.d(SYSTEM_TTS_TAG, "Android TTS initialized successfully")
                } else {
                    Log.e(SYSTEM_TTS_TAG, "Android TTS initialization failed: status=$status")
                }
                synchronized(initLock) {
                    initialized = true
                    initLock.notifyAll()
                }
            }
        }
    }

    @Throws(IOException::class)
    fun synthesizeToFile(
        text: String,
        requestedVoiceId: String,
        outputFile: File,
    ) {
        synchronized(synthesisLock) {
            val engine = awaitReady()
            val utteranceId = UUID.randomUUID().toString()
            val completion = CompletableFuture<Unit>()
            val invokeLatch = CountDownLatch(1)
            var invokeStatus = TextToSpeech.ERROR

            pendingSyntheses[utteranceId] = completion
            outputFile.parentFile?.mkdirs()
            if (outputFile.exists()) {
                outputFile.delete()
            }

            mainHandler.post {
                try {
                    if (!configureVoice(engine, requestedVoiceId)) {
                        pendingSyntheses.remove(utteranceId)
                            ?.completeExceptionally(IOException("No supported offline TTS voice found"))
                        invokeLatch.countDown()
                        return@post
                    }

                    invokeStatus = engine.synthesizeToFile(
                        text.ifBlank { "测试文本" },
                        null,
                        outputFile,
                        utteranceId,
                    )
                } catch (error: Throwable) {
                    pendingSyntheses.remove(utteranceId)?.completeExceptionally(error)
                } finally {
                    invokeLatch.countDown()
                }
            }

            if (!invokeLatch.await(INVOKE_TIMEOUT_MS, TimeUnit.MILLISECONDS)) {
                pendingSyntheses.remove(utteranceId)
                throw IOException("Timed out invoking Android TTS")
            }

            if (invokeStatus == TextToSpeech.ERROR) {
                val pendingError = runCatching { completion.getNow(null) }.exceptionOrNull()
                pendingSyntheses.remove(utteranceId)
                outputFile.delete()
                if (pendingError != null) {
                    throw IOException("Android TTS invocation failed", pendingError)
                }
                throw IOException("Android TTS synthesizeToFile returned ERROR")
            }

            try {
                completion.get(SYNTHESIS_TIMEOUT_SECONDS, TimeUnit.SECONDS)
            } catch (error: Throwable) {
                pendingSyntheses.remove(utteranceId)
                outputFile.delete()
                throw IOException("Timed out waiting for Android TTS synthesis", error)
            }

            if (!outputFile.exists() || outputFile.length() <= 0L) {
                throw IOException("Android TTS produced empty audio")
            }

            Log.d(
                SYSTEM_TTS_TAG,
                "synthesizeToFile completed: voice=$requestedVoiceId, file=${outputFile.name}, size=${outputFile.length()}",
            )
        }
    }

    fun getAvailableVoicesJson(): JSONArray {
        val result = JSONArray()
        result.put(
            JSONObject()
                .put("id", SYSTEM_DEFAULT_VOICE_ID)
                .put("name", "系统默认")
                .put("description", "优先使用设备可用的中文离线语音"),
        )

        val engine = runCatching { awaitReady() }.getOrNull() ?: return result
        val seenNames = LinkedHashSet<String>()
        getCandidateVoices(engine).forEach { voice ->
            if (!seenNames.add(voice.name)) {
                return@forEach
            }
            result.put(
                JSONObject()
                    .put("id", voice.name)
                    .put("name", voice.name)
                    .put(
                        "description",
                        "${voice.locale?.toLanguageTag().orEmpty()} · ${if (voice.isNetworkConnectionRequired) "联网" else "离线"}",
                    ),
            )
        }
        return result
    }

    fun release() {
        val latch = CountDownLatch(1)
        mainHandler.post {
            try {
                textToSpeech?.stop()
                textToSpeech?.shutdown()
                textToSpeech = null
            } finally {
                latch.countDown()
            }
        }
        latch.await(3, TimeUnit.SECONDS)
    }

    @Throws(IOException::class)
    private fun awaitReady(): TextToSpeech {
        if (!initialized) {
            synchronized(initLock) {
                if (!initialized) {
                    initLock.wait(INIT_TIMEOUT_MS)
                }
            }
        }

        if (!initialized) {
            throw IOException("Android TTS initialization timed out")
        }
        if (initStatus != TextToSpeech.SUCCESS) {
            throw IOException("Android TTS initialization failed: status=$initStatus")
        }

        return textToSpeech ?: throw IOException("Android TTS is unavailable")
    }

    private fun configureVoice(
        engine: TextToSpeech,
        requestedVoiceId: String,
    ): Boolean {
        val selectedVoice = resolveVoice(engine, requestedVoiceId)
        val targetLocale = selectedVoice?.locale ?: Locale.SIMPLIFIED_CHINESE
        val languageStatus = engine.setLanguage(targetLocale)
        if (
            languageStatus == TextToSpeech.LANG_MISSING_DATA ||
            languageStatus == TextToSpeech.LANG_NOT_SUPPORTED
        ) {
            Log.w(SYSTEM_TTS_TAG, "setLanguage failed for locale=$targetLocale status=$languageStatus")
            return false
        }

        if (selectedVoice != null) {
            val voiceStatus = engine.setVoice(selectedVoice)
            if (voiceStatus == TextToSpeech.ERROR) {
                Log.w(SYSTEM_TTS_TAG, "setVoice failed for voice=${selectedVoice.name}")
                return false
            }
        }

        Log.d(
            SYSTEM_TTS_TAG,
            "configureVoice: requestedVoiceId=$requestedVoiceId, selectedVoice=${selectedVoice?.name}, locale=$targetLocale",
        )
        return true
    }

    private fun resolveVoice(
        engine: TextToSpeech,
        requestedVoiceId: String,
    ): Voice? {
        val voices = getCandidateVoices(engine)
        if (voices.isEmpty()) {
            return engine.defaultVoice
        }

        if (requestedVoiceId.isNotBlank() && requestedVoiceId != SYSTEM_DEFAULT_VOICE_ID) {
            voices.firstOrNull { it.name == requestedVoiceId }?.let { return it }
        }

        return voices.firstOrNull() ?: engine.defaultVoice
    }

    private fun getCandidateVoices(engine: TextToSpeech): List<Voice> {
        val voices = engine.voices.orEmpty()
        val offlineChinese = voices.filter { voice ->
            val locale = voice.locale
            locale != null &&
                locale.language == Locale.CHINESE.language &&
                !voice.isNetworkConnectionRequired
        }
        if (offlineChinese.isNotEmpty()) {
            return offlineChinese.sortedBy { it.name }
        }

        val anyChinese = voices.filter { voice ->
            val locale = voice.locale
            locale != null && locale.language == Locale.CHINESE.language
        }
        if (anyChinese.isNotEmpty()) {
            return anyChinese.sortedBy { it.name }
        }

        return voices
            .filter { !it.isNetworkConnectionRequired }
            .sortedBy { it.name }
    }
}
