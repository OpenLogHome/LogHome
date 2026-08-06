package top.codesocean.loghome.android.audio

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.security.MessageDigest

object AudioCacheUtils {
    suspend fun getCachedFile(
        context: Context,
        articleId: String,
        text: String,
        voice: String,
    ): File = withContext(Dispatchers.IO) {
        val cacheDir = File(context.cacheDir, "audio_cache").apply { mkdirs() }
        File(cacheDir, "$articleId-${md5(text)}-${md5(cacheIdentity(voice))}.wav")
    }

    suspend fun clearVoiceCache(context: Context, voice: String) = withContext(Dispatchers.IO) {
        val cacheDir = File(context.cacheDir, "audio_cache")
        if (!cacheDir.exists()) {
            return@withContext
        }

        val legacySuffix = "-$voice.mp3"
        val currentSuffixes = setOf(
            "-${md5(voice)}.wav",
            "-${md5(cacheIdentity(voice))}.wav",
        )
        cacheDir.listFiles()
            ?.filter {
                it.isFile && (
                    it.name.endsWith(legacySuffix) ||
                        currentSuffixes.any(it.name::endsWith)
                    )
            }
            ?.forEach { file -> file.delete() }
    }

    private fun cacheIdentity(voice: String): String = when {
        voice.startsWith("sherpa:aishell3@") -> "$voice|punctuation-pauses-v1"
        EdgeTtsVoiceCatalog.isEdgeVoice(voice) -> "$voice|$EDGE_TTS_PROTOCOL_VERSION"
        else -> voice
    }

    private fun md5(input: String): String {
        val digest = MessageDigest.getInstance("MD5").digest(input.toByteArray(Charsets.UTF_8))
        return buildString(digest.size * 2) {
            digest.forEach { byte ->
                append("%02x".format(byte))
            }
        }
    }
}
