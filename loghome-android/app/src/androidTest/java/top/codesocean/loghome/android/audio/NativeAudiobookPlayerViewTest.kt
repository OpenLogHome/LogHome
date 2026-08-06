package top.codesocean.loghome.android.audio

import android.view.ContextThemeWrapper
import android.view.View
import android.widget.ProgressBar
import android.widget.SeekBar
import android.widget.TextView
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import com.google.android.material.button.MaterialButton
import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import org.junit.runner.RunWith
import top.codesocean.loghome.android.R

@RunWith(AndroidJUnit4::class)
class NativeAudiobookPlayerViewTest {
    @Test
    fun rendersNativePlaybackControlsFromServiceState() {
        lateinit var view: NativeAudiobookPlayerView
        InstrumentationRegistry.getInstrumentation().runOnMainSync {
            val application = ApplicationProvider.getApplicationContext<android.content.Context>()
            val themedContext = ContextThemeWrapper(application, R.style.Theme_LogHome)
            view = NativeAudiobookPlayerView(themedContext)
            view.setBookTitle("测试小说")
            view.render(
                AudiobookPlaybackState(
                    articleId = "101",
                    paragraphId = "7",
                    chapterTitle = "第一章",
                    paragraphText = "这是由原生播放器显示的当前段落。",
                    positionMs = 15_000L,
                    durationMs = 60_000L,
                    isPlaying = true,
                    isBuffering = true,
                    currentParagraphIndex = 2,
                    paragraphCount = 8,
                    canSkipPrevious = true,
                    canSkipNext = true,
                    playbackSpeed = 1.5f,
                    sleepTimerRemainingMs = 30L * 60_000L,
                ),
                voiceName = "超文（离线）",
            )
            view.showModelDownloadProgress(
                downloadedBytes = 7_005_649L,
                totalBytes = 14_011_298L,
            )
        }

        assertEquals("测试小说", view.findViewById<TextView>(R.id.bookTitle).text.toString())
        assertEquals("第一章", view.findViewById<TextView>(R.id.chapterTitle).text.toString())
        assertEquals("暂停", view.findViewById<MaterialButton>(R.id.playPauseButton).text.toString())
        assertEquals("1.5×", view.findViewById<MaterialButton>(R.id.speedButton).text.toString())
        assertEquals("超文（离线）", view.findViewById<MaterialButton>(R.id.voiceButton).text.toString())
        assertEquals(250, view.findViewById<SeekBar>(R.id.progressSeekBar).progress)
        assertEquals(View.VISIBLE, view.findViewById<ProgressBar>(R.id.bufferingIndicator).visibility)
        assertTrue(view.findViewById<MaterialButton>(R.id.previousButton).isEnabled)
        assertTrue(view.findViewById<MaterialButton>(R.id.nextButton).isEnabled)
        assertFalse(view.findViewById<MaterialButton>(R.id.sleepTimerButton).text.isBlank())
        assertEquals(View.VISIBLE, view.findViewById<View>(R.id.modelDownloadContainer).visibility)
        assertEquals(500, view.findViewById<ProgressBar>(R.id.modelDownloadProgressBar).progress)
        assertTrue(view.findViewById<TextView>(R.id.modelDownloadProgressText).text.contains("50%"))
        assertFalse(view.findViewById<MaterialButton>(R.id.voiceButton).isEnabled)
    }
}
