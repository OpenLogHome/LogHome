package top.codesocean.loghome.android.audio

import android.content.Context
import android.graphics.Bitmap
import android.util.AttributeSet
import android.view.LayoutInflater
import android.widget.SeekBar
import androidx.core.view.isVisible
import com.google.android.material.card.MaterialCardView
import top.codesocean.loghome.android.R
import top.codesocean.loghome.android.databinding.ViewNativeAudiobookPlayerBinding
import java.util.Locale
import kotlin.math.roundToInt

class NativeAudiobookPlayerView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = com.google.android.material.R.attr.materialCardViewStyle,
) : MaterialCardView(context, attrs, defStyleAttr) {
    interface Listener {
        fun onPlayPause()
        fun onPrevious()
        fun onNext()
        fun onSeekTo(positionMs: Long)
        fun onChooseVoice()
        fun onChooseSpeed()
        fun onChooseSleepTimer()
        fun onCollapse()
    }

    private val binding = ViewNativeAudiobookPlayerBinding.inflate(
        LayoutInflater.from(context),
        this,
        true,
    )

    private var listener: Listener? = null
    private var currentDurationMs = 0L
    private var userSeeking = false

    init {
        radius = resources.displayMetrics.density * 24f
        cardElevation = resources.displayMetrics.density * 10f
        setCardBackgroundColor(0xFFFDFDFD.toInt())

        binding.playPauseButton.setOnClickListener { listener?.onPlayPause() }
        binding.previousButton.setOnClickListener { listener?.onPrevious() }
        binding.nextButton.setOnClickListener { listener?.onNext() }
        binding.voiceButton.setOnClickListener { listener?.onChooseVoice() }
        binding.speedButton.setOnClickListener { listener?.onChooseSpeed() }
        binding.sleepTimerButton.setOnClickListener { listener?.onChooseSleepTimer() }
        binding.collapseButton.setOnClickListener { listener?.onCollapse() }
        binding.progressSeekBar.setOnSeekBarChangeListener(
            object : SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(seekBar: SeekBar?, progress: Int, fromUser: Boolean) {
                    if (fromUser) {
                        binding.elapsedTime.text = formatTime(progressToPosition(progress))
                    }
                }

                override fun onStartTrackingTouch(seekBar: SeekBar?) {
                    userSeeking = true
                }

                override fun onStopTrackingTouch(seekBar: SeekBar?) {
                    userSeeking = false
                    listener?.onSeekTo(progressToPosition(seekBar?.progress ?: 0))
                }
            },
        )
    }

    fun setListener(listener: Listener?) {
        this.listener = listener
    }

    fun setBookTitle(title: String) {
        binding.bookTitle.text = title.ifBlank { "原木听书" }
    }

    fun setCoverBitmap(bitmap: Bitmap?) {
        if (bitmap == null) {
            binding.coverImage.setImageResource(R.mipmap.ic_launcher)
        } else {
            binding.coverImage.setImageBitmap(bitmap)
        }
    }

    fun showModelDownloadProgress(downloadedBytes: Long, totalBytes: Long) {
        val safeTotal = totalBytes.coerceAtLeast(1L)
        val safeDownloaded = downloadedBytes.coerceIn(0L, safeTotal)
        val progress = (safeDownloaded * 1000L / safeTotal).toInt()
        val percent = (safeDownloaded * 100L / safeTotal).toInt()
        binding.modelDownloadContainer.isVisible = true
        binding.modelDownloadProgressBar.progress = progress
        binding.modelDownloadStatus.text = if (safeDownloaded >= safeTotal) {
            "正在校验并安装语音模型…"
        } else {
            "正在下载离线语音…"
        }
        binding.modelDownloadProgressText.text = String.format(
            Locale.getDefault(),
            "%d%% · %.1f/%.1f MB",
            percent,
            safeDownloaded / 1024f / 1024f,
            safeTotal / 1024f / 1024f,
        )
        binding.voiceButton.isEnabled = false
    }

    fun hideModelDownloadProgress() {
        binding.modelDownloadContainer.isVisible = false
        binding.voiceButton.isEnabled = true
    }

    fun render(
        state: AudiobookPlaybackState,
        voiceName: String? = null,
    ) {
        currentDurationMs = state.durationMs
        binding.chapterTitle.text = state.chapterTitle.ifBlank {
            if (state.isBuffering) "正在生成语音…" else "正在准备章节…"
        }
        binding.paragraphText.text = state.paragraphText.ifBlank { "听书内容加载后将在这里显示" }
        binding.playPauseButton.text = if (state.isPlaying) "暂停" else "播放"
        binding.bufferingIndicator.isVisible = state.isBuffering
        binding.previousButton.isEnabled = state.canSkipPrevious
        binding.nextButton.isEnabled = state.canSkipNext
        binding.progressSeekBar.isEnabled = state.durationMs > 0L
        binding.durationTime.text = formatTime(state.durationMs)
        if (!userSeeking) {
            binding.elapsedTime.text = formatTime(state.positionMs)
            binding.progressSeekBar.progress = positionToProgress(state.positionMs)
        }
        binding.speedButton.text = formatSpeed(state.playbackSpeed)
        binding.voiceButton.text = voiceName?.takeIf { it.isNotBlank() } ?: "音色"
        binding.sleepTimerButton.text = if (state.sleepTimerRemainingMs > 0L) {
            "定时 ${formatRemainingMinutes(state.sleepTimerRemainingMs)}"
        } else {
            "定时"
        }
    }

    private fun progressToPosition(progress: Int): Long {
        if (currentDurationMs <= 0L) return 0L
        return currentDurationMs * progress.coerceIn(0, 1000) / 1000L
    }

    private fun positionToProgress(positionMs: Long): Int {
        if (currentDurationMs <= 0L) return 0
        return (positionMs.coerceIn(0L, currentDurationMs) * 1000L / currentDurationMs).toInt()
    }

    private fun formatTime(timeMs: Long): String {
        val totalSeconds = (timeMs.coerceAtLeast(0L) / 1000L).toInt()
        return String.format(
            Locale.getDefault(),
            "%d:%02d",
            totalSeconds / 60,
            totalSeconds % 60,
        )
    }

    private fun formatSpeed(speed: Float): String =
        String.format(Locale.US, "%.1f×", speed)

    private fun formatRemainingMinutes(remainingMs: Long): String =
        "${(remainingMs / 60_000f).roundToInt().coerceAtLeast(1)}分"
}
