package top.codesocean.loghome.android.audio

import android.content.Context
import android.content.ContextWrapper
import android.net.Uri
import androidx.media3.exoplayer.DefaultLoadControl
import androidx.media3.exoplayer.ExoPlayer
import androidx.media3.exoplayer.source.DefaultMediaSourceFactory
import androidx.test.core.app.ApplicationProvider
import androidx.test.ext.junit.runners.AndroidJUnit4
import androidx.test.platform.app.InstrumentationRegistry
import java.io.File
import java.nio.ByteBuffer
import java.nio.ByteOrder
import java.util.UUID
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.withContext
import org.junit.Assert.*
import org.junit.Test
import org.junit.runner.RunWith

@RunWith(AndroidJUnit4::class)
class AudioEngineExperienceTest {
    private fun onMain(block: suspend () -> Unit) = runBlocking { withContext(Dispatchers.Main) { block() } }
    private fun await(message: String, condition: () -> Boolean) {
        val deadline = System.currentTimeMillis() + 8_000
        while (!condition() && System.currentTimeMillis() < deadline) Thread.sleep(20)
        assertTrue(message, condition())
    }

    private class Fixture : AutoCloseable {
        val app = ApplicationProvider.getApplicationContext<Context>()
        val storage = app.getSharedPreferences("native_audiobook", Context.MODE_PRIVATE)
        val previousVoice = storage.getString("voice_id", null)
        val directory = File(app.cacheDir, "audiobook-tests/${UUID.randomUUID()}").apply { mkdirs() }
        val context = object : ContextWrapper(app) { override fun getCacheDir(): File = directory }
        val scope = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate)
        val completed = ConcurrentHashMap.newKeySet<String>()
        val blocked = CountDownLatch(1)
        val unblock = CountDownLatch(1)
        var blockText: String? = null
        val registry = TtsRequestRegistry()
        val synthesis = object : TtsSynthesizer {
            override fun cacheIdentity(voice: String) = "test-${directory.name}-$voice"
            override fun synthesizeToFile(text: String, requestedVoiceId: String, outputFile: File) {
                if (text == blockText) {
                    blocked.countDown()
                    check(unblock.await(8, TimeUnit.SECONDS))
                }
                val samples = ByteArray(8000 * 4 * 2)
                val wave = ByteBuffer.allocate(44 + samples.size).order(ByteOrder.LITTLE_ENDIAN)
                wave.put("RIFF".toByteArray()).putInt(36 + samples.size).put("WAVEfmt ".toByteArray())
                wave.putInt(16).putShort(1).putShort(1).putInt(8000).putInt(16000)
                wave.putShort(2).putShort(16).put("data".toByteArray()).putInt(samples.size).put(samples)
                outputFile.writeBytes(wave.array())
                completed += text
            }
        }
        lateinit var player: ExoPlayer
        lateinit var engine: AudioEngine
        fun create() {
            storage.edit().putString("voice_id", "sunny-boy").commit()
            player = ExoPlayer.Builder(context)
                .setLoadControl(DefaultLoadControl.Builder().setBufferDurationsMs(500, 1000, 100, 100).build())
                .setMediaSourceFactory(DefaultMediaSourceFactory(TtsDataSourceFactory(registry, synthesis))).build()
            engine = AudioEngine(context, player, scope, registry, synthesis) {}
        }
        suspend fun load() {
            val article = Article("test-chapter", "测试章节", (0..9).map { "paragraph-$it" }, (0..9).map(Int::toString))
            engine.replacePlaylist(listOf(article.id), article.id, listOf(article))
        }
        override fun close() {
            unblock.countDown()
            runBlocking { withContext(Dispatchers.Main) {
                engine.release()
                player.release()
                scope.cancel()
            } }
            if (previousVoice == null) storage.edit().remove("voice_id").commit()
            else storage.edit().putString("voice_id", previousVoice).commit()
        }
    }

    @Test fun restoresVoicePersistsChangesAndProvidesBookArtwork() {
        val fixture = Fixture()
        try {
            onMain {
                fixture.create()
                assertEquals("sunny-boy", fixture.engine.getPlaybackState().voiceId)
                fixture.engine.setVoice("soft-girl")
                fixture.engine.resetPlaylist()
                assertEquals("soft-girl", fixture.engine.getPlaybackState().voiceId)
                assertEquals("soft-girl", AudiobookPreferences(fixture.app).voiceId)
                fixture.engine.setBookMetadata("书籍名称", "https://example.invalid/cover.jpg")
                fixture.load()
                assertEquals("书籍名称", fixture.player.currentMediaItem!!.mediaMetadata.albumTitle)
                assertEquals(Uri.parse("https://example.invalid/cover.jpg"), fixture.player.currentMediaItem!!.mediaMetadata.artworkUri)
                fixture.engine.play()
                assertTrue(fixture.player.playWhenReady)
                fixture.engine.pause()
            }
        } finally { fixture.close() }
    }

    @Test fun prefetchesNextThreeAndRefillsAfterSeekingDuringDownload() {
        val fixture = Fixture()
        try {
            fixture.blockText = "paragraph-1"
            onMain { fixture.create(); fixture.load() }
            assertTrue("background prefetch starts automatically", fixture.blocked.await(8, TimeUnit.SECONDS))
            onMain {
                fixture.engine.jumpToArticleParagraph("test-chapter", "5", playWhenReady = false)
            }
            fixture.unblock.countDown()
            await("new current paragraph and next three are cached") { (5..8).all { "paragraph-$it" in fixture.completed } }
            assertFalse("does not continue a stale prefetch snapshot", "paragraph-2" in fixture.completed)
            assertFalse("does not continue a stale prefetch snapshot", "paragraph-3" in fixture.completed)
            assertFalse("does not continue a stale prefetch snapshot", "paragraph-4" in fixture.completed)
        } finally { fixture.close() }
    }

    @Test fun reopeningKeepsParagraphAndPositionWhileExplicitSeekAndBookSwitchStillWork() {
        val fixture = Fixture()
        try {
            onMain {
                fixture.create()
                val article = Article("reopen-chapter", "章节", (0..9).map { "paragraph-$it" }, (0..9).map(Int::toString))
                val ids = listOf(article.id)
                fixture.engine.openPlaylist(ids, article.id, listOf(article), startParagraphId = "0")
                fixture.engine.jumpToArticleParagraph(article.id, "5", playWhenReady = false)
                fixture.engine.seekTo(1500)
                fixture.engine.play()
                repeat(3) {
                    fixture.engine.openPlaylist(ids, article.id, listOf(article), startParagraphId = "0")
                    assertEquals("5", fixture.engine.getPlaybackState().paragraphId)
                    assertEquals(1500L, fixture.player.currentPosition)
                    assertTrue(fixture.player.playWhenReady)
                }
                fixture.engine.pause()
                fixture.engine.openPlaylist(ids, article.id, listOf(article), startParagraphId = "0")
                assertEquals("5", fixture.engine.getPlaybackState().paragraphId)
                assertEquals(1500L, fixture.player.currentPosition)
                assertTrue(fixture.player.playWhenReady)
                fixture.engine.openPlaylist(ids, article.id, listOf(article), startParagraphId = "2", forceSeek = true)
                assertEquals("2", fixture.engine.getPlaybackState().paragraphId)
                assertEquals(0L, fixture.player.currentPosition)
                val other = article.copy(id = "another-book-chapter")
                fixture.engine.openPlaylist(listOf(other.id), other.id, listOf(other), startParagraphId = "4")
                assertEquals(other.id, fixture.engine.getPlaybackState().articleId)
                assertEquals("4", fixture.engine.getPlaybackState().paragraphId)
                fixture.engine.openPlaylist(listOf(other.id), other.id, listOf(other), "preview:new-version", "1")
                assertEquals("1", fixture.engine.getPlaybackState().paragraphId)
            }
        } finally { fixture.close() }
    }
}
