package top.codesocean.loghome.android.audio

import android.content.Context

internal class AudiobookPreferences(context: Context) {
    private val storage = context.applicationContext.getSharedPreferences("native_audiobook", Context.MODE_PRIVATE)

    var voiceId: String
        get() = storage.getString("voice_id", null)?.takeIf(TtsVoiceCatalog::contains) ?: DEFAULT_TTS_VOICE_ID
        set(value) {
            require(TtsVoiceCatalog.contains(value))
            storage.edit().putString("voice_id", value).apply()
        }
}
