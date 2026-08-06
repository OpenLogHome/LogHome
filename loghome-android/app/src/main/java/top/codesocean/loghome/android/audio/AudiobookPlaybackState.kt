package top.codesocean.loghome.android.audio

data class AudiobookPlaybackState(
    val articleId: String? = null,
    val paragraphId: String? = null,
    val chapterTitle: String = "",
    val paragraphText: String = "",
    val positionMs: Long = 0L,
    val durationMs: Long = 0L,
    val isPlaying: Boolean = false,
    val isBuffering: Boolean = false,
    val currentParagraphIndex: Int = -1,
    val paragraphCount: Int = 0,
    val canSkipPrevious: Boolean = false,
    val canSkipNext: Boolean = false,
    val voiceId: String = SYSTEM_DEFAULT_VOICE_ID,
    val playbackSpeed: Float = 1.0f,
    val sleepTimerRemainingMs: Long = 0L,
) {
    val hasContent: Boolean
        get() = articleId != null && paragraphId != null
}
