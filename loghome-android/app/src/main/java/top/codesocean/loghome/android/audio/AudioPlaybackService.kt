package top.codesocean.loghome.android.audio

import android.app.PendingIntent
import android.content.Intent
import android.os.Binder
import android.os.IBinder
import android.os.SystemClock
import androidx.media3.common.AudioAttributes
import androidx.media3.common.C
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import org.json.JSONArray
import top.codesocean.loghome.android.SplashActivity
import java.io.File
import java.util.concurrent.CopyOnWriteArraySet

class AudioPlaybackService : MediaSessionService() {
    inner class LocalBinder : Binder() {
        fun getService(): AudioPlaybackService = this@AudioPlaybackService
    }

    private val binder = LocalBinder()
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val requestRegistry = TtsRequestRegistry()
    private val playbackStateListeners =
        CopyOnWriteArraySet<(AudiobookPlaybackState) -> Unit>()

    private var sleepTimerDeadlineElapsedMs = 0L

    private lateinit var player: ExoPlayer
    private lateinit var mediaSession: MediaSession
    private lateinit var audioEngine: AudioEngine
    private lateinit var ttsEngine: TtsEngineRouter

    override fun onCreate() {
        super.onCreate()

        ttsEngine = TtsEngineRouter()
        serviceScope.launch(Dispatchers.IO) {
            File(filesDir, "tts_models").deleteRecursively()
            File(cacheDir, "audio_cache").deleteRecursively()
        }
        player = ExoPlayer.Builder(this)
            .setMediaSourceFactory(
                DefaultMediaSourceFactory(
                    TtsDataSourceFactory(
                        registry = requestRegistry,
                        ttsEngine = ttsEngine,
                    ),
                ),
            )
            .setAudioAttributes(
                AudioAttributes.Builder().setUsage(C.USAGE_MEDIA).setContentType(C.AUDIO_CONTENT_TYPE_SPEECH).build(),
                true,
            )
            .setHandleAudioBecomingNoisy(true)
            .build()

        val sessionIntent = Intent(this, SplashActivity::class.java).apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
        }
        val sessionActivity = PendingIntent.getActivity(
            this,
            0,
            sessionIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE,
        )

        mediaSession = MediaSession.Builder(this, player)
            .setSessionActivity(sessionActivity)
            .build()

        audioEngine = AudioEngine(
            context = applicationContext,
            player = player,
            serviceScope = serviceScope,
            requestRegistry = requestRegistry,
            ttsEngine = ttsEngine,
            onStopService = { stopSelf() },
        )

        serviceScope.launch {
            while (isActive) {
                if (playbackStateListeners.isNotEmpty()) {
                    publishPlaybackState()
                }
                delay(350L)
            }
        }
    }

    override fun onGetSession(controllerInfo: MediaSession.ControllerInfo): MediaSession {
        return mediaSession
    }

    override fun onBind(intent: Intent?): IBinder? {
        return if (intent?.action == SERVICE_INTERFACE) {
            super.onBind(intent)
        } else {
            binder
        }
    }

    suspend fun replacePlaylist(
        articleIds: List<String>,
        startArticleId: String?,
        inlineArticles: List<Article> = emptyList(),
        playlistKey: String = "",
    ) {
        audioEngine.replacePlaylist(articleIds, startArticleId, inlineArticles, playlistKey)
    }

    fun isCurrentPlaylist(articleIds: List<String>, playlistKey: String = ""): Boolean =
        audioEngine.isCurrentPlaylist(articleIds, playlistKey)

    suspend fun openPlaylist(
        articleIds: List<String>,
        startArticleId: String?,
        inlineArticles: List<Article> = emptyList(),
        playlistKey: String = "",
        startParagraphId: String? = null,
        forceSeek: Boolean = false,
    ) {
        audioEngine.openPlaylist(articleIds, startArticleId, inlineArticles, playlistKey, startParagraphId, forceSeek)
        publishPlaybackState()
    }

    fun setBookMetadata(title: String, coverUrl: String) {
        audioEngine.setBookMetadata(title, coverUrl)
    }

    fun play() {
        audioEngine.play()
    }

    fun pause() {
        audioEngine.pause()
    }

    fun skipToPreviousParagraph() {
        audioEngine.skipToPreviousParagraph()
        publishPlaybackState()
    }

    fun skipToNextParagraph() {
        audioEngine.skipToNextParagraph()
        publishPlaybackState()
    }

    fun seekTo(positionMs: Long) {
        audioEngine.seekTo(positionMs)
        publishPlaybackState()
    }

    fun setPlaybackSpeed(speed: Float) {
        audioEngine.setPlaybackSpeed(speed)
        publishPlaybackState()
    }

    fun setSleepTimer(minutes: Int?) {
        sleepTimerDeadlineElapsedMs = if (minutes == null || minutes <= 0) {
            0L
        } else {
            SystemClock.elapsedRealtime() + minutes * 60_000L
        }
        publishPlaybackState()
        if (sleepTimerDeadlineElapsedMs == 0L) {
            return
        }

        val expectedDeadline = sleepTimerDeadlineElapsedMs
        serviceScope.launch {
            val remaining = expectedDeadline - SystemClock.elapsedRealtime()
            if (remaining > 0L) {
                delay(remaining)
            }
            if (sleepTimerDeadlineElapsedMs == expectedDeadline) {
                sleepTimerDeadlineElapsedMs = 0L
                audioEngine.pause()
                publishPlaybackState()
            }
        }
    }

    fun getPlaybackState(): AudiobookPlaybackState =
        audioEngine.getPlaybackState(getSleepTimerRemainingMs())

    fun addPlaybackStateListener(listener: (AudiobookPlaybackState) -> Unit) {
        playbackStateListeners += listener
        listener(getPlaybackState())
    }

    fun removePlaybackStateListener(listener: (AudiobookPlaybackState) -> Unit) {
        playbackStateListeners -= listener
    }

    fun getProgressJson(): String? {
        return audioEngine.getProgressJson()
    }

    fun getAvailableVoicesJson(): JSONArray {
        return ttsEngine.getAvailableVoicesJson()
    }

    suspend fun configureTts(loginToken: String): Boolean {
        if (ttsEngine.matchesLoginToken(loginToken)) return false
        val resumePlayback = player.playWhenReady
        audioEngine.pause()
        return try {
            val identityChanged = ttsEngine.configure(loginToken)
            if (identityChanged) audioEngine.resetPlaylist()
            else if (resumePlayback) audioEngine.play()
            identityChanged
        } catch (error: Exception) {
            audioEngine.resetPlaylist()
            throw error
        }
    }

    suspend fun setVoice(
        voice: String,
    ) {
        ttsEngine.prepareVoice(voice)
        audioEngine.setVoice(voice)
        publishPlaybackState()
    }

    suspend fun jumpToArticleParagraph(articleId: String, paragraphId: String): Boolean {
        return audioEngine.jumpToArticleParagraph(articleId, paragraphId)
    }

    override fun onDestroy() {
        audioEngine.release()
        ttsEngine.release()
        mediaSession.release()
        player.release()
        serviceScope.cancel()
        super.onDestroy()
    }

    private fun getSleepTimerRemainingMs(): Long {
        if (sleepTimerDeadlineElapsedMs <= 0L) {
            return 0L
        }
        return (sleepTimerDeadlineElapsedMs - SystemClock.elapsedRealtime()).coerceAtLeast(0L)
    }

    private fun publishPlaybackState() {
        if (playbackStateListeners.isEmpty()) {
            return
        }
        val state = getPlaybackState()
        playbackStateListeners.forEach { listener ->
            runCatching { listener(state) }
        }
    }
}
