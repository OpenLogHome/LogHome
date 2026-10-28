package top.codesocean.loghome.android.audio

import java.io.File

interface TtsSynthesizer {
    fun cacheIdentity(voice: String): String
    fun synthesizeToFile(text: String, requestedVoiceId: String, outputFile: File)
}
