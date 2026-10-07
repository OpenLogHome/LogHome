package top.codesocean.loghome.android.audio

import androidx.test.core.app.ActivityScenario
import top.codesocean.loghome.android.WebViewActivity
import android.graphics.Bitmap
import java.io.File
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
        assertEquals("暂停", view.findViewById<MaterialButton>(R.id.playPauseButton).contentDescription.toString())
        assertEquals("语速 1.5×", view.findViewById<MaterialButton>(R.id.speedButton).text.toString())
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
    @Test
    fun shortcutSeekingClampsAndReadingCollapsesWithoutStoppingPlayback() {
        val seeks = mutableListOf<Long>()
        var collapses = 0
        InstrumentationRegistry.getInstrumentation().runOnMainSync {
            val application = ApplicationProvider.getApplicationContext<android.content.Context>()
            val view = NativeAudiobookPlayerView(ContextThemeWrapper(application, R.style.Theme_LogHome))
            view.setListener(object : NativeAudiobookPlayerView.Listener {
                override fun onPlayPause() {}
                override fun onPrevious() {}
                override fun onNext() {}
                override fun onSeekTo(positionMs: Long) { seeks += positionMs }
                override fun onChooseVoice() {}
                override fun onChooseSpeed() {}
                override fun onChooseSleepTimer() {}
                override fun onCollapse() { collapses++ }
            })
            view.render(AudiobookPlaybackState(positionMs = 5_000L, durationMs = 60_000L))
            view.findViewById<View>(R.id.rewindButton).performClick()
            view.findViewById<View>(R.id.forwardButton).performClick()
            view.render(AudiobookPlaybackState(positionMs = 55_000L, durationMs = 60_000L))
            view.findViewById<View>(R.id.forwardButton).performClick()
            view.findViewById<View>(R.id.readButton).performClick()
            view.render(AudiobookPlaybackState(durationMs = 0L))
            assertFalse(view.findViewById<View>(R.id.rewindButton).isEnabled)
            assertFalse(view.findViewById<View>(R.id.forwardButton).isEnabled)
        }
        assertEquals(listOf(0L, 20_000L, 60_000L), seeks)
        assertEquals(1, collapses)
    }

    @Test
    fun capturesAttachedPlayerPreview() {
        ActivityScenario.launch(WebViewActivity::class.java).use { scenario ->
            scenario.onActivity { activity ->
                val view = NativeAudiobookPlayerView(activity)
                activity.setContentView(view)
                view.setBookTitle("原木听书")
                view.render(AudiobookPlaybackState(chapterTitle = "第一章 · 开始", paragraphText = "夜幕降临，星光点点，故事从这里开始。", positionMs = 15_000L, durationMs = 60_000L, isPlaying = true, canSkipPrevious = true, canSkipNext = true), "超文（离线）")
            }
            InstrumentationRegistry.getInstrumentation().waitForIdleSync()
            Thread.sleep(500)
            val image = InstrumentationRegistry.getInstrumentation().uiAutomation.takeScreenshot()
            val context = ApplicationProvider.getApplicationContext<android.content.Context>()
            File(context.cacheDir, "audiobook-player-preview.png").outputStream().use { image.compress(Bitmap.CompressFormat.PNG, 100, it) }
            image.recycle()
        }
    }

    @Test
    fun playerSlidesInOutAndReopeningCancelsPendingDismissal() {
        ActivityScenario.launch(WebViewActivity::class.java).use { scenario ->
            lateinit var view: NativeAudiobookPlayerView
            scenario.onActivity { activity ->
                view = NativeAudiobookPlayerView(activity)
                view.visibility = View.GONE
                activity.setContentView(view)
                view.showPlayer()
            }
            Thread.sleep(450)
            scenario.onActivity {
                assertEquals(View.VISIBLE, view.visibility)
                assertEquals(0f, view.translationY, 0.1f)
                view.hidePlayer()
                assertEquals(View.VISIBLE, view.visibility)
                view.showPlayer()
            }
            Thread.sleep(450)
            scenario.onActivity {
                assertEquals(View.VISIBLE, view.visibility)
                assertEquals(0f, view.translationY, 0.1f)
                view.hidePlayer()
            }
            Thread.sleep(350)
            scenario.onActivity {
                assertEquals(View.GONE, view.visibility)
                assertEquals(0f, view.translationY, 0.1f)
            }
        }
    }

}
