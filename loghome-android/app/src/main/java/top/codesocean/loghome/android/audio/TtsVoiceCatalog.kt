package top.codesocean.loghome.android.audio

internal const val DEFAULT_TTS_VOICE_ID = "warm-gentleman"

object TtsVoiceCatalog {
    val voices = linkedMapOf(
        DEFAULT_TTS_VOICE_ID to "温润君子",
        "sunny-boy" to "阳光少年",
        "youthful-goddess" to "青春女神",
        "soft-girl" to "软糯萝莉",
    )

    fun contains(id: String): Boolean = voices.containsKey(id)
}

// Limit UTF-16 units to 900, below the API's 1000-character limit even for emoji.
internal fun splitTtsText(text: String): List<String> {
    val chunks = mutableListOf<String>()
    var remaining = text.trim()
    while (remaining.isNotEmpty()) {
        var end = minOf(900, remaining.length)
        if (end < remaining.length) {
            if (remaining[end - 1].isHighSurrogate()) end--
            val boundary = remaining.substring(0, end).indexOfLast { it in "。！？；\n.!?;" }
            if (boundary >= end / 2) end = boundary + 1
        }
        remaining.substring(0, end).trim().takeIf { it.isNotEmpty() }?.let(chunks::add)
        remaining = remaining.substring(end).trimStart()
    }
    return chunks
}
