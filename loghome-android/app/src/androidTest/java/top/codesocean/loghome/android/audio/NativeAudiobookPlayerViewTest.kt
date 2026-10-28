package top.codesocean.loghome.android.audio

import androidx.test.core.app.ActivityScenario
import top.codesocean.loghome.android.WebViewActivity
import android.graphics.Bitmap
import android.graphics.Rect
import android.graphics.drawable.BitmapDrawable
import android.media.AudioManager
import java.io.File
import android.view.ContextThemeWrapper
import android.view.View
import android.view.KeyEvent
import android.widget.FrameLayout
import android.widget.ImageView
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
import org.junit.Assert.assertSame
import org.junit.Test
import org.junit.runner.RunWith
import top.codesocean.loghome.android.R

@RunWith(AndroidJUnit4::class)
class NativeAudiobookPlayerViewTest {
    @Test
    fun compactPlayerFitsWithoutScrollingAndUsesCoverBackdrop() {
        InstrumentationRegistry.getInstrumentation().runOnMainSync {
            val application = ApplicationProvider.getApplicationContext<android.content.Context>()
            val view = NativeAudiobookPlayerView(ContextThemeWrapper(application, R.style.Theme_LogHome))
            val cover = Bitmap.createBitmap(120, 180, Bitmap.Config.ARGB_8888).apply { eraseColor(0xFFC56936.toInt()) }
            view.setCoverBitmap(cover)
            val density = application.resources.displayMetrics.density
            val width = (360 * density).toInt()
            val height = (640 * density).toInt()
            repeat(2) {
                view.measure(View.MeasureSpec.makeMeasureSpec(width, View.MeasureSpec.EXACTLY), View.MeasureSpec.makeMeasureSpec(height, View.MeasureSpec.EXACTLY))
                view.layout(0, 0, width, height)
            }
            assertTrue(view.findViewById<View>(R.id.playerContent).parent is FrameLayout)
            assertFalse(view.canScrollVertically(1))
            assertFalse(view.canScrollVertically(-1))
            val button = view.findViewById<View>(R.id.readButton)
            val rect = Rect()
            button.getDrawingRect(rect)
            view.offsetDescendantRectToMyCoords(button, rect)
            assertTrue("bottom controls fit in compact screen", rect.bottom <= height && rect.top >= 0)
            val image = view.findViewById<ImageView>(R.id.coverImage).drawable as BitmapDrawable
            val background = view.findViewById<ImageView>(R.id.backgroundImage).drawable as BitmapDrawable
            assertSame(cover, image.bitmap)
            assertEquals(0xFFC56936.toInt(), background.bitmap.getPixel(0, 0))
            view.setCoverBitmap(null)
            assertEquals(null, view.findViewById<ImageView>(R.id.backgroundImage).drawable)
        }
    }

    @Test
    fun volumeKeysUseMusicStreamEvenWhenReaderCapturesVolumeKeys() {
        ActivityScenario.launch(WebViewActivity::class.java).use { scenario ->
            scenario.onActivity { activity ->
                val field = WebViewActivity::class.java.getDeclaredField("volumeKeyEnabled").apply { isAccessible = true }
                field.setBoolean(activity, true)
                activity.findViewById<NativeAudiobookPlayerView>(R.id.nativeAudiobookPlayer).showPlayer()
                activity.dispatchKeyEvent(KeyEvent(KeyEvent.ACTION_DOWN, KeyEvent.KEYCODE_VOLUME_UP))
                activity.dispatchKeyEvent(KeyEvent(KeyEvent.ACTION_UP, KeyEvent.KEYCODE_VOLUME_UP))
                assertEquals(AudioManager.STREAM_MUSIC, activity.volumeControlStream)
            }
        }
    }
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
                voiceName = "温润君子",
            )

        }

        assertEquals("测试小说", view.findViewById<TextView>(R.id.bookTitle).text.toString())
        assertEquals("第一章", view.findViewById<TextView>(R.id.chapterTitle).text.toString())
        assertEquals("暂停", view.findViewById<MaterialButton>(R.id.playPauseButton).contentDescription.toString())
        assertEquals("语速 1.5×", view.findViewById<MaterialButton>(R.id.speedButton).text.toString())
        assertEquals("温润君子", view.findViewById<MaterialButton>(R.id.voiceButton).text.toString())
        assertEquals(250, view.findViewById<SeekBar>(R.id.progressSeekBar).progress)
        assertEquals(View.VISIBLE, view.findViewById<ProgressBar>(R.id.bufferingIndicator).visibility)
        assertTrue(view.findViewById<MaterialButton>(R.id.previousButton).isEnabled)
        assertTrue(view.findViewById<MaterialButton>(R.id.nextButton).isEnabled)
        assertFalse(view.findViewById<MaterialButton>(R.id.sleepTimerButton).text.isBlank())
        assertTrue(view.findViewById<MaterialButton>(R.id.voiceButton).isEnabled)
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
                view.setCoverBitmap(Bitmap.createBitmap(300, 400, Bitmap.Config.ARGB_8888).apply {
                    eraseColor(0xFFC56936.toInt())
                })
                view.render(AudiobookPlaybackState(chapterTitle = "第一章 · 开始", paragraphText = "夜幕降临，星光点点，故事从这里开始。", positionMs = 15_000L, durationMs = 60_000L, isPlaying = true, canSkipPrevious = true, canSkipNext = true), "温润君子")
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
