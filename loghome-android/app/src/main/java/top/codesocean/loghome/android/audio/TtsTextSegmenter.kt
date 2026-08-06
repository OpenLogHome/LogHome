package top.codesocean.loghome.android.audio

internal data class TtsTextSegment(
    val text: String,
    val pauseAfterMillis: Int,
)

private const val SHORT_PAUSE_MILLIS = 180
private const val MEDIUM_PAUSE_MILLIS = 280
private const val LONG_PAUSE_MILLIS = 420
private const val ELLIPSIS_PAUSE_MILLIS = 500

private val closingQuotes = setOf('’', '”', '》', '〉', '】', '〕', '）', ')', ']', '}')

/**
 * Splits text for phoneme-only VITS models that discard punctuation.
 *
 * Punctuation is converted into explicit PCM silence after synthesis. ASCII punctuation inside
 * numbers (for example 3.14, 1,000 and 12:30) is preserved for the model's text normalizer.
 */
internal fun segmentTextWithPunctuationPauses(text: String): List<TtsTextSegment> {
    val segments = mutableListOf<TtsTextSegment>()
    val buffer = StringBuilder()
    var justFlushedAtBoundary = false

    fun flush(pauseAfterMillis: Int) {
        val value = buffer.toString().trim()
        buffer.clear()
        if (value.isNotEmpty()) {
            segments += TtsTextSegment(value, pauseAfterMillis)
        } else if (pauseAfterMillis > 0 && segments.isNotEmpty()) {
            val last = segments.last()
            if (pauseAfterMillis > last.pauseAfterMillis) {
                segments[segments.lastIndex] = last.copy(pauseAfterMillis = pauseAfterMillis)
            }
        }
        justFlushedAtBoundary = pauseAfterMillis > 0
    }

    text.forEachIndexed { index, char ->
        val numericPunctuation = char in setOf('.', ',', ':') &&
            text.getOrNull(index - 1)?.isDigit() == true &&
            text.getOrNull(index + 1)?.isDigit() == true
        val pause = when {
            numericPunctuation -> null
            char == '\n' || char == '\r' -> LONG_PAUSE_MILLIS
            char == '…' -> ELLIPSIS_PAUSE_MILLIS
            char in setOf('。', '.', '！', '!', '？', '?') -> LONG_PAUSE_MILLIS
            char in setOf('；', ';', '：', ':', '—') -> MEDIUM_PAUSE_MILLIS
            char in setOf('，', ',', '、') -> SHORT_PAUSE_MILLIS
            else -> null
        }

        when {
            pause != null -> flush(pause)
            justFlushedAtBoundary && (char.isWhitespace() || char in closingQuotes) -> Unit
            char.isWhitespace() -> {
                if (buffer.isNotEmpty() && buffer.last() != ' ') {
                    buffer.append(' ')
                }
                justFlushedAtBoundary = false
            }
            else -> {
                buffer.append(char)
                justFlushedAtBoundary = false
            }
        }
    }
    flush(0)
    return segments
}
