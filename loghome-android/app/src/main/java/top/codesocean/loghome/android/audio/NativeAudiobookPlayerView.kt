package top.codesocean.loghome.android.audio

import android.app.Activity
import android.content.Context
import android.graphics.Bitmap
import android.graphics.Color
import android.graphics.drawable.BitmapDrawable
import android.os.Build
import android.util.AttributeSet
import android.view.LayoutInflater
import android.view.View
import android.view.animation.AccelerateInterpolator
import android.view.animation.DecelerateInterpolator
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import android.widget.SeekBar
import androidx.core.view.isVisible
import androidx.core.view.doOnLayout
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
    private var currentPositionMs = 0L
    private var previousLightStatusBar: Boolean? = null
    private var previousLightNavigationBar: Boolean? = null
    private var previousNavigationBarColor: Int? = null
    private var previousNavigationBarContrast: Boolean? = null
    private var motionVersion = 0L
    private var isClosing = false

    init {
        radius = 0f
        cardElevation = 0f
        strokeWidth = 0
        ViewCompat.setOnApplyWindowInsetsListener(this) { _, insets ->
            val safe = insets.getInsets(WindowInsetsCompat.Type.systemBars() or WindowInsetsCompat.Type.displayCutout())
            val keyboard = insets.getInsets(WindowInsetsCompat.Type.ime())
            val density = resources.displayMetrics.density
            binding.playerContent.setPadding(
                safe.left + (20 * density).toInt(), safe.top + (12 * density).toInt(),
                safe.right + (20 * density).toInt(), maxOf(safe.bottom, keyboard.bottom) + (24 * density).toInt(),
            )
            insets
        }
        setCardBackgroundColor(0xFF191330.toInt())
        // The cover absorbs height changes so all controls fit without scrolling.
        binding.coverArea.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            val size = minOf((resources.displayMetrics.density * 280).toInt(), binding.coverArea.width, binding.coverArea.height).coerceAtLeast(1)
            if (binding.coverCard.layoutParams.width != size) {
                binding.coverCard.layoutParams = binding.coverCard.layoutParams.apply { width = size; height = size }
            }
        }

        binding.playPauseButton.setOnClickListener { listener?.onPlayPause() }
        binding.previousButton.setOnClickListener { listener?.onPrevious() }
        binding.nextButton.setOnClickListener { listener?.onNext() }
        binding.voiceButton.setOnClickListener { listener?.onChooseVoice() }
        binding.speedButton.setOnClickListener { listener?.onChooseSpeed() }
        binding.sleepTimerButton.setOnClickListener { listener?.onChooseSleepTimer() }
        binding.collapseButton.setOnClickListener { listener?.onCollapse() }
        binding.readButton.setOnClickListener { listener?.onCollapse() }
        binding.rewindButton.setOnClickListener { seekRelative(-15_000L) }
        binding.forwardButton.setOnClickListener { seekRelative(15_000L) }
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

    override fun onAttachedToWindow() {
        super.onAttachedToWindow()
        ViewCompat.requestApplyInsets(this)
        updateStatusBarAppearance()
    }

    override fun onVisibilityChanged(changedView: View, visibility: Int) {
        super.onVisibilityChanged(changedView, visibility)
        if (isAttachedToWindow) updateStatusBarAppearance()
    }

    override fun onDetachedFromWindow() {
        motionVersion++
        animate().withEndAction(null).cancel()
        isClosing = false
        restoreStatusBarAppearance()
        super.onDetachedFromWindow()
    }

    private fun updateStatusBarAppearance() {
        val activity = context as? Activity ?: return
        if (!isShown) { restoreStatusBarAppearance(); return }
        val controller = WindowInsetsControllerCompat(activity.window, activity.window.decorView)
        if (previousLightStatusBar == null) {
            previousLightStatusBar = controller.isAppearanceLightStatusBars
            previousLightNavigationBar = controller.isAppearanceLightNavigationBars
            previousNavigationBarColor = activity.window.navigationBarColor
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                previousNavigationBarContrast = activity.window.isNavigationBarContrastEnforced
            }
        }
        controller.isAppearanceLightStatusBars = false
        controller.isAppearanceLightNavigationBars = false
        activity.window.navigationBarColor = Color.TRANSPARENT
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) activity.window.isNavigationBarContrastEnforced = false
    }

    private fun restoreStatusBarAppearance() {
        val previous = previousLightStatusBar ?: return
        val activity = context as? Activity ?: return
        val controller = WindowInsetsControllerCompat(activity.window, activity.window.decorView)
        controller.isAppearanceLightStatusBars = previous
        previousLightNavigationBar?.let { controller.isAppearanceLightNavigationBars = it }
        previousNavigationBarColor?.let { activity.window.navigationBarColor = it }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            previousNavigationBarContrast?.let { activity.window.isNavigationBarContrastEnforced = it }
        }
        previousLightStatusBar = null
        previousLightNavigationBar = null
        previousNavigationBarColor = null
        previousNavigationBarContrast = null
    }

    fun showPlayer() {
        if (isVisible && !isClosing) return
        val resumeClosing = isVisible && isClosing
        val version = ++motionVersion
        animate().withEndAction(null).cancel()
        isClosing = false
        alpha = 1f
        isVisible = true
        doOnLayout {
            if (version != motionVersion) return@doOnLayout
            if (!resumeClosing) translationY = height.toFloat()
            animate()
                .translationY(0f)
                .setDuration(300L)
                .setInterpolator(DecelerateInterpolator())
                .start()
        }
    }

    fun hidePlayer() {
        if (!isVisible || isClosing) return
        val version = ++motionVersion
        animate().withEndAction(null).cancel()
        isClosing = true
        animate()
            .translationY(height.toFloat())
            .setDuration(240L)
            .setInterpolator(AccelerateInterpolator())
            .withEndAction {
                if (version == motionVersion) {
                    isVisible = false
                    translationY = 0f
                    isClosing = false
                }
            }
            .start()
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
            binding.backgroundImage.setImageDrawable(null)
        } else {
            binding.coverImage.setImageBitmap(bitmap)
            // A tiny, filtered thumbnail gives a soft cover-derived backdrop on
            // every supported Android version without a full-size blur buffer.
            val thumbnail = Bitmap.createScaledBitmap(bitmap, 24, 24, true)
            binding.backgroundImage.setImageDrawable(BitmapDrawable(resources, thumbnail).apply {
                isFilterBitmap = true
            })
        }
    }

    fun render(
        state: AudiobookPlaybackState,
        voiceName: String? = null,
    ) {
        updateStatusBarAppearance()
        currentDurationMs = state.durationMs
        currentPositionMs = state.positionMs
        binding.chapterTitle.text = state.chapterTitle.ifBlank {
            if (state.isBuffering) "正在生成语音…" else "正在准备章节…"
        }
        binding.paragraphText.text = state.paragraphText.ifBlank { "听书内容加载后将在这里显示" }
        binding.playPauseButton.setIconResource(if (state.isPlaying) R.drawable.audiobook_pause else R.drawable.audiobook_play)
        binding.playPauseButton.contentDescription = if (state.isPlaying) "暂停" else "播放"
        binding.playPauseButton.iconSize = (resources.displayMetrics.density * 36).toInt()
        binding.rewindButton.isEnabled = state.durationMs > 0L
        binding.forwardButton.isEnabled = state.durationMs > 0L
        binding.bufferingIndicator.isVisible = state.isBuffering
        binding.previousButton.isEnabled = state.canSkipPrevious
        binding.nextButton.isEnabled = state.canSkipNext
        binding.progressSeekBar.isEnabled = state.durationMs > 0L
        binding.durationTime.text = formatTime(state.durationMs)
        if (!userSeeking) {
            binding.elapsedTime.text = formatTime(state.positionMs)
            binding.progressSeekBar.progress = positionToProgress(state.positionMs)
        }
        binding.speedButton.text = "语速 ${formatSpeed(state.playbackSpeed)}"
        binding.voiceButton.text = voiceName?.takeIf { it.isNotBlank() } ?: "音色"
        binding.sleepTimerButton.text = if (state.sleepTimerRemainingMs > 0L) {
            "定时 ${formatRemainingMinutes(state.sleepTimerRemainingMs)}"
        } else {
            "定时"
        }
    }

    private fun seekRelative(offsetMs: Long) {
        if (currentDurationMs <= 0L) return
        listener?.onSeekTo((currentPositionMs + offsetMs).coerceIn(0L, currentDurationMs))
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
