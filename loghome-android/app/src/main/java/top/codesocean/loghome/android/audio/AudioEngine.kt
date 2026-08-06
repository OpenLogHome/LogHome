package top.codesocean.loghome.android.audio

import android.content.Context
import android.net.Uri
import android.util.Log
import androidx.core.os.bundleOf
import androidx.media3.common.C
import androidx.media3.common.MediaItem
import androidx.media3.common.MediaMetadata
import androidx.media3.common.Player
import androidx.media3.exoplayer.ExoPlayer
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.json.JSONArray
import org.json.JSONObject
import org.json.JSONTokener
import java.util.UUID

private const val EXTRA_ARTICLE_ID = "articleId"
private const val EXTRA_PARAGRAPH_ID = "paragraphId"
private const val EXTRA_PARAGRAPH_INDEX = "paragraphIndex"
private const val AUDIO_TAG = "LogHomeAudio"

data class Article(
    val id: String,
    val title: String,
    val paragraphs: List<String>,
    val paragraphIds: List<String>,
) {
    companion object {
        fun fromJson(json: JSONObject): Article {
            val id = json.opt("article_id")?.toString().orEmpty()
            val title = json.optString("title", "Untitled")
            val paragraphs = mutableListOf<String>()
            val paragraphIds = mutableListOf<String>()

            when (json.optString("article_type")) {
                "richtext", "worldOutline" -> {
                    val parsedContent = parseContent(json.opt("content"))
                    paragraphs += "章节 $title"
                    paragraphIds += "-1"

                    when (parsedContent) {
                        is JSONArray -> {
                            for (index in 0 until parsedContent.length()) {
                                val item = parsedContent.optJSONObject(index) ?: continue
                                if (item.optString("type") != "text") {
                                    continue
                                }
                                val value = item.optString("value")
                                if (value.isBlank()) {
                                    continue
                                }
                                paragraphs += value
                                paragraphIds += item.opt("id")?.toString() ?: index.toString()
                            }
                        }

                        is String -> {
                            if (parsedContent.isNotBlank()) {
                                paragraphs += parsedContent
                                paragraphIds += "0"
                            }
                        }
                    }
                }

                "spliter" -> {
                    paragraphs += "分卷 $title"
                    paragraphIds += "-1"
                }
            }

            return Article(
                id = id,
                title = title,
                paragraphs = paragraphs,
                paragraphIds = paragraphIds,
            )
        }

        private fun parseContent(content: Any?): Any? {
            return when (content) {
                is JSONArray -> content
                is String -> runCatching { JSONTokener(content).nextValue() }.getOrElse { content }
                else -> null
            }
        }
    }
}

private data class QueueEntry(
    val articleId: String,
    val paragraphId: String,
    val mediaItem: MediaItem,
    val ttsRequest: TtsRequest,
)

class AudioEngine(
    private val context: Context,
    private val player: ExoPlayer,
    private val serviceScope: CoroutineScope,
    private val requestRegistry: TtsRequestRegistry,
    private val ttsEngine: TtsEngineRouter,
    private val onStopService: () -> Unit,
) {
    private val httpClient = OkHttpClient()
    private val queueEntries = mutableListOf<QueueEntry>()

    private var voice = SYSTEM_DEFAULT_VOICE_ID
    private var activePlaylistArticleIds = emptyList<String>()
    private var activePlaylistKey = ""
    private var inlineArticles = emptyMap<String, Article>()
    private var pendingArticleIds = mutableListOf<String>()
    private var isLoadingArticle = false
    private var currentArticleIndex = 0
    private var dismissJob: Job? = null
    private var onlinePrefetchJob: Job? = null

    private val playerListener = object : Player.Listener {
        override fun onIsPlayingChanged(isPlaying: Boolean) {
            Log.d(AUDIO_TAG, "onIsPlayingChanged: $isPlaying")
            if (isPlaying) {
                cancelDismissTimer()
            } else {
                scheduleDismissTimer()
            }
        }

        override fun onPlaybackStateChanged(playbackState: Int) {
            Log.d(AUDIO_TAG, "onPlaybackStateChanged: state=$playbackState")
            when (playbackState) {
                Player.STATE_READY -> maybeLoadMoreArticles()
                Player.STATE_ENDED -> {
                    if (currentArticleIndex < pendingArticleIds.size) {
                        serviceScope.launch {
                            loadNextArticle(resumeIfNeeded = true)
                        }
                    } else {
                        scheduleDismissTimer()
                    }
                }
            }
        }

        override fun onMediaItemTransition(mediaItem: MediaItem?, reason: Int) {
            Log.d(
                AUDIO_TAG,
                "onMediaItemTransition: reason=$reason, mediaId=${mediaItem?.mediaId}, title=${mediaItem?.mediaMetadata?.title}",
            )
            maybeLoadMoreArticles()
            prefetchUpcomingOnlineAudio()
        }

        override fun onPlayerError(error: androidx.media3.common.PlaybackException) {
            Log.e(AUDIO_TAG, "onPlayerError: ${error.errorCodeName}", error)
        }
    }

    init {
        player.addListener(playerListener)
    }

    suspend fun replacePlaylist(
        articleIds: List<String>,
        startArticleId: String?,
        inlineArticleList: List<Article> = emptyList(),
        playlistKey: String = "",
    ) {
        if (articleIds.isEmpty()) {
            Log.w(AUDIO_TAG, "replacePlaylist ignored because articleIds is empty")
            return
        }

        Log.d(
            AUDIO_TAG,
            "replacePlaylist: articleIds=$articleIds, startArticleId=$startArticleId",
        )
        player.stop()
        player.clearMediaItems()
        requestRegistry.clear()
        queueEntries.clear()

        activePlaylistArticleIds = articleIds.toList()
        activePlaylistKey = playlistKey
        inlineArticles = inlineArticleList
            .filter { it.id.isNotBlank() }
            .associateBy { it.id }
        pendingArticleIds = articleIds.toMutableList()
        currentArticleIndex = 0
        isLoadingArticle = false

        if (!startArticleId.isNullOrBlank()) {
            val index = pendingArticleIds.indexOf(startArticleId)
            if (index > 0) {
                pendingArticleIds = pendingArticleIds.drop(index).toMutableList()
            }
        }

        loadNextArticle()
    }

    fun isCurrentPlaylist(articleIds: List<String>, playlistKey: String = ""): Boolean =
        activePlaylistArticleIds == articleIds && activePlaylistKey == playlistKey

    fun play() {
        Log.d(AUDIO_TAG, "play")
        cancelDismissTimer()
        player.play()
    }

    fun pause() {
        Log.d(AUDIO_TAG, "pause")
        player.pause()
        scheduleDismissTimer()
    }

    fun skipToPreviousParagraph() {
        if (player.currentPosition > 5_000L) {
            player.seekTo(0L)
            return
        }
        if (player.hasPreviousMediaItem()) {
            player.seekToPreviousMediaItem()
            player.play()
        } else {
            player.seekTo(0L)
        }
    }

    fun skipToNextParagraph() {
        if (player.hasNextMediaItem()) {
            player.seekToNextMediaItem()
            player.play()
            return
        }

        val previousItemCount = player.mediaItemCount
        serviceScope.launch {
            loadNextArticle()
            if (player.mediaItemCount > previousItemCount) {
                player.seekToDefaultPosition(previousItemCount)
                player.play()
            }
        }
    }

    fun seekTo(positionMs: Long) {
        val duration = player.duration.takeIf { it != C.TIME_UNSET && it > 0L }
        player.seekTo(positionMs.coerceIn(0L, duration ?: positionMs.coerceAtLeast(0L)))
    }

    fun setPlaybackSpeed(speed: Float) {
        player.setPlaybackSpeed(speed.coerceIn(0.5f, 2.0f))
    }

    fun getPlaybackState(
        sleepTimerRemainingMs: Long = 0L,
    ): AudiobookPlaybackState {
        val currentMediaItem = player.currentMediaItem
        val metadata = currentMediaItem?.mediaMetadata
        val extras = metadata?.extras
        val currentIndex = player.currentMediaItemIndex
        val duration = player.duration.takeIf { it != C.TIME_UNSET && it > 0L } ?: 0L

        return AudiobookPlaybackState(
            articleId = extras?.getString(EXTRA_ARTICLE_ID),
            paragraphId = extras?.getString(EXTRA_PARAGRAPH_ID),
            chapterTitle = metadata?.title?.toString().orEmpty(),
            paragraphText = metadata?.artist?.toString().orEmpty(),
            positionMs = player.currentPosition.coerceAtLeast(0L),
            durationMs = duration,
            isPlaying = player.isPlaying,
            isBuffering = player.playbackState == Player.STATE_BUFFERING,
            currentParagraphIndex = currentIndex,
            paragraphCount = player.mediaItemCount,
            canSkipPrevious = currentIndex > 0 || player.currentPosition > 0L,
            canSkipNext = currentIndex >= 0 &&
                (currentIndex < player.mediaItemCount - 1 || currentArticleIndex < pendingArticleIds.size),
            voiceId = voice,
            playbackSpeed = player.playbackParameters.speed,
            sleepTimerRemainingMs = sleepTimerRemainingMs,
        )
    }

    fun getProgressJson(): String? {
        val currentMediaItem = player.currentMediaItem ?: return null
        val extras = currentMediaItem.mediaMetadata.extras ?: return null

        return JSONObject()
            .put(EXTRA_ARTICLE_ID, extras.getString(EXTRA_ARTICLE_ID))
            .put(EXTRA_PARAGRAPH_ID, extras.getString(EXTRA_PARAGRAPH_ID))
            .put("position", player.currentPosition)
            .put(
                "duration",
                if (player.duration == C.TIME_UNSET) JSONObject.NULL else player.duration,
            )
            .put("isPlaying", player.isPlaying)
            .toString()
    }

    suspend fun setVoice(newVoice: String) {
        if (voice == newVoice) {
            Log.d(AUDIO_TAG, "setVoice ignored because voice is unchanged: $newVoice")
            return
        }

        Log.d(AUDIO_TAG, "setVoice: $voice -> $newVoice")
        onlinePrefetchJob?.cancel()
        onlinePrefetchJob = null
        val oldVoice = voice
        voice = newVoice
        AudioCacheUtils.clearVoiceCache(context, oldVoice)

        val currentMediaItem = player.currentMediaItem ?: return
        val extras = currentMediaItem.mediaMetadata.extras ?: return
        val articleId = extras.getString(EXTRA_ARTICLE_ID) ?: return
        val paragraphId = extras.getString(EXTRA_PARAGRAPH_ID) ?: return
        val wasPlaying = player.isPlaying
        val position = player.currentPosition

        player.pause()
        player.stop()
        player.clearMediaItems()
        requestRegistry.clear()
        queueEntries.clear()

        val articleIndex = activePlaylistArticleIds.indexOf(articleId)
        pendingArticleIds = if (articleIndex >= 0) {
            activePlaylistArticleIds.drop(articleIndex).toMutableList()
        } else {
            mutableListOf(articleId)
        }
        currentArticleIndex = 0
        isLoadingArticle = false

        loadNextArticle()
        val jumped = jumpToArticleParagraph(articleId, paragraphId)
        if (jumped && position > 0) {
            player.seekTo(position)
        }
        if (wasPlaying) {
            player.play()
        }
    }

    suspend fun jumpToArticleParagraph(
        articleId: String,
        paragraphId: String,
        attempt: Int = 0,
    ): Boolean {
        Log.d(
            AUDIO_TAG,
            "jumpToArticleParagraph: articleId=$articleId, paragraphId=$paragraphId, attempt=$attempt",
        )
        if (attempt > 12) {
            Log.w(
                AUDIO_TAG,
                "jumpToArticleParagraph gave up after too many attempts: articleId=$articleId, paragraphId=$paragraphId",
            )
            return false
        }

        val targetIndex = queueEntries.indexOfFirst {
            it.articleId == articleId && it.paragraphId == paragraphId
        }
        if (targetIndex >= 0) {
            Log.d(AUDIO_TAG, "jumpToArticleParagraph found queue index=$targetIndex")
            player.seekTo(targetIndex, 0)
            if (!player.isPlaying) {
                player.play()
            }
            return true
        }

        if (!pendingArticleIds.contains(articleId)) {
            if (pendingArticleIds.isEmpty()) {
                pendingArticleIds += articleId
            } else {
                pendingArticleIds.add(currentArticleIndex.coerceAtMost(pendingArticleIds.size), articleId)
            }
        }

        if (!isLoadingArticle) {
            if (queueEntries.isEmpty() && pendingArticleIds.size == 1) {
                currentArticleIndex = 0
            }
            loadNextArticle()
        } else {
            delay(500)
        }

        return jumpToArticleParagraph(articleId, paragraphId, attempt + 1)
    }

    fun release() {
        cancelDismissTimer()
        onlinePrefetchJob?.cancel()
        player.removeListener(playerListener)
    }

    private suspend fun loadNextArticle(resumeIfNeeded: Boolean = false) {
        if (isLoadingArticle || currentArticleIndex >= pendingArticleIds.size) {
            return
        }

        isLoadingArticle = true
        try {
            val articleId = pendingArticleIds[currentArticleIndex]
            Log.d(
                AUDIO_TAG,
                "loadNextArticle: articleId=$articleId, currentArticleIndex=$currentArticleIndex, pending=${pendingArticleIds.size}",
            )
            val article = fetchArticle(articleId)
            if (article != null) {
                addArticleToPlaylist(article, resumeIfNeeded)
            } else {
                Log.w(AUDIO_TAG, "loadNextArticle failed to fetch articleId=$articleId")
            }
            currentArticleIndex += 1
            if (queueEntries.isEmpty() && currentArticleIndex < pendingArticleIds.size) {
                loadNextArticle(resumeIfNeeded)
            }
        } finally {
            isLoadingArticle = false
        }
    }

    private suspend fun addArticleToPlaylist(article: Article, resumeIfNeeded: Boolean) {
        val mediaItems = mutableListOf<MediaItem>()
        val wasEnded = player.playbackState == Player.STATE_ENDED
        val oldItemCount = player.mediaItemCount
        val isFirstArticle = queueEntries.isEmpty()

        Log.d(
            AUDIO_TAG,
            "addArticleToPlaylist: articleId=${article.id}, title=${article.title}, paragraphs=${article.paragraphs.size}, isFirstArticle=$isFirstArticle",
        )

        article.paragraphs.forEachIndexed { index, paragraph ->
            if (paragraph.isBlank()) {
                return@forEachIndexed
            }

            val paragraphId = article.paragraphIds.getOrElse(index) { index.toString() }
            val cacheFile = AudioCacheUtils.getCachedFile(context, article.id, paragraph, voice)
            val itemUri = Uri.parse(
                "loghome-tts://${Uri.encode(article.id)}/${Uri.encode(paragraphId)}?voice=${Uri.encode(voice)}&token=${UUID.randomUUID()}",
            )
            val ttsRequest = TtsRequest(
                articleId = article.id,
                text = paragraph,
                voice = voice,
                cacheFile = cacheFile,
            )
            requestRegistry.put(itemUri.toString(), ttsRequest)

            val metadata = MediaMetadata.Builder()
                .setAlbumTitle("原木社区")
                .setTitle(article.title)
                .setArtist(paragraph)
                .setExtras(
                    bundleOf(
                        EXTRA_ARTICLE_ID to article.id,
                        EXTRA_PARAGRAPH_ID to paragraphId,
                        EXTRA_PARAGRAPH_INDEX to index,
                    ),
                )
                .build()

            val mediaItem = MediaItem.Builder()
                .setMediaId("${paragraph}_$voice")
                .setUri(itemUri)
                .setMediaMetadata(metadata)
                .build()

            mediaItems += mediaItem
            queueEntries += QueueEntry(article.id, paragraphId, mediaItem, ttsRequest)
        }

        if (mediaItems.isEmpty()) {
            Log.w(AUDIO_TAG, "addArticleToPlaylist produced no playable items for articleId=${article.id}")
            return
        }

        if (isFirstArticle) {
            player.setMediaItems(mediaItems, true)
            player.prepare()
        } else {
            player.addMediaItems(mediaItems)
        }
        prefetchUpcomingOnlineAudio()

        if ((resumeIfNeeded || wasEnded) && oldItemCount < player.mediaItemCount) {
            player.seekToDefaultPosition(if (isFirstArticle) 0 else oldItemCount)
            player.prepare()
            player.play()
        }

        Log.d(
            AUDIO_TAG,
            "addArticleToPlaylist completed: added=${mediaItems.size}, queueSize=${queueEntries.size}, playerMediaItemCount=${player.mediaItemCount}",
        )
    }

    private fun maybeLoadMoreArticles() {
        if (isLoadingArticle || currentArticleIndex >= pendingArticleIds.size) {
            return
        }

        val currentIndex = player.currentMediaItemIndex
        if (currentIndex == C.INDEX_UNSET || player.mediaItemCount == 0) {
            return
        }

        if (currentIndex >= player.mediaItemCount - 3) {
            serviceScope.launch {
                loadNextArticle()
            }
        }
    }

    private fun prefetchUpcomingOnlineAudio() {
        if (!EdgeTtsVoiceCatalog.isEdgeVoice(voice) || onlinePrefetchJob?.isActive == true) {
            return
        }
        val startIndex = player.currentMediaItemIndex.takeIf { it != C.INDEX_UNSET } ?: 0
        val requests = queueEntries
            .drop(startIndex.coerceAtLeast(0))
            .asSequence()
            .map(QueueEntry::ttsRequest)
            .filter { !it.cacheFile.exists() && EdgeTtsVoiceCatalog.isEdgeVoice(it.voice) }
            .take(3)
            .toList()
        if (requests.isEmpty()) return

        onlinePrefetchJob = serviceScope.launch(Dispatchers.IO) {
            requests.forEach { request ->
                runCatching { TtsDataSource.ensureCachedAudio(request, ttsEngine) }
                    .onFailure { Log.w(AUDIO_TAG, "Online TTS prefetch failed", it) }
            }
        }
    }

    private suspend fun fetchArticle(id: String): Article? {
        inlineArticles[id]?.let { article ->
            Log.d(AUDIO_TAG, "fetchArticle: using inline content for id=$id")
            return article
        }
        return withContext(Dispatchers.IO) {
            runCatching {
                Log.d(AUDIO_TAG, "fetchArticle: id=$id")
                val request = Request.Builder()
                    .url("https://loghomeservice.codesocean.top/articles/get_article?id=$id")
                    .build()

                httpClient.newCall(request).execute().use { response ->
                    if (!response.isSuccessful) {
                        Log.w(AUDIO_TAG, "fetchArticle failed: id=$id, code=${response.code}")
                        return@use null
                    }

                    val body = response.body?.string().orEmpty()
                    val data = JSONTokener(body).nextValue()
                    val firstObject = when (data) {
                        is JSONArray -> data.optJSONObject(0)
                        is JSONObject -> data
                        else -> null
                    }
                    firstObject?.let { Article.fromJson(it) }
                }
            }.onFailure { error ->
                Log.e(AUDIO_TAG, "fetchArticle exception: id=$id", error)
            }.getOrNull()
        }
    }

    private fun scheduleDismissTimer() {
        cancelDismissTimer()
        dismissJob = serviceScope.launch {
            delay(30_000)
            if (!player.isPlaying) {
                player.stop()
                onStopService()
            }
        }
    }

    private fun cancelDismissTimer() {
        dismissJob?.cancel()
        dismissJob = null
    }
}
