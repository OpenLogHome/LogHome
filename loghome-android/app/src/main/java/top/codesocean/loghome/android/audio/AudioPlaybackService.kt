package top.codesocean.loghome.android.audio

import android.app.PendingIntent
import android.content.Intent
import android.os.Binder
import android.os.IBinder
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.media3.session.MediaSession
import androidx.media3.session.MediaSessionService
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import org.json.JSONArray
import top.codesocean.loghome.android.SplashActivity

class AudioPlaybackService : MediaSessionService() {
    inner class LocalBinder : Binder() {
        fun getService(): AudioPlaybackService = this@AudioPlaybackService
    }

    private val binder = LocalBinder()
    private val serviceScope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
    private val requestRegistry = TtsRequestRegistry()

    private lateinit var player: ExoPlayer
    private lateinit var mediaSession: MediaSession
    private lateinit var audioEngine: AudioEngine
    private lateinit var systemTtsEngine: SystemTtsEngine

    override fun onCreate() {
        super.onCreate()

        systemTtsEngine = SystemTtsEngine(this)
        player = ExoPlayer.Builder(this)
            .setMediaSourceFactory(
                DefaultMediaSourceFactory(
                    TtsDataSourceFactory(
                        registry = requestRegistry,
                        systemTtsEngine = systemTtsEngine,
                    ),
                ),
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
            onStopService = { stopSelf() },
        )
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

    suspend fun replacePlaylist(articleIds: List<String>, startArticleId: String?) {
        audioEngine.replacePlaylist(articleIds, startArticleId)
    }

    fun play() {
        audioEngine.play()
    }

    fun pause() {
        audioEngine.pause()
    }

    fun getProgressJson(): String? {
        return audioEngine.getProgressJson()
    }

    fun getAvailableVoicesJson(): JSONArray {
        return systemTtsEngine.getAvailableVoicesJson()
    }

    suspend fun setVoice(voice: String) {
        audioEngine.setVoice(voice)
    }

    suspend fun jumpToArticleParagraph(articleId: String, paragraphId: String): Boolean {
        return audioEngine.jumpToArticleParagraph(articleId, paragraphId)
    }

    override fun onDestroy() {
        audioEngine.release()
        systemTtsEngine.release()
        mediaSession.release()
        player.release()
        serviceScope.cancel()
        super.onDestroy()
    }
}
