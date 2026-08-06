package top.codesocean.loghome.android.audio

import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import java.util.UUID

internal const val EDGE_TTS_PROTOCOL_VERSION = "edge-tts-7.2.8"
internal const val EDGE_TTS_CHROMIUM_VERSION = "143.0.3650.75"
internal const val EDGE_TTS_TRUSTED_CLIENT_TOKEN = "6A5AA1D4EAFF4E9FB37E23D68491D6F4"
internal const val EDGE_TTS_MAX_TEXT_BYTES = 4096

private const val WINDOWS_EPOCH_SECONDS = 11_644_473_600L
private const val WINDOWS_TICKS_PER_SECOND = 10_000_000L

internal fun generateEdgeSecMsGec(
    nowMillis: Long = System.currentTimeMillis(),
    clockSkewSeconds: Long = 0L,
): String {
    val unixSeconds = Math.floorDiv(nowMillis, 1_000L) + clockSkewSeconds
    val windowsSeconds = unixSeconds + WINDOWS_EPOCH_SECONDS
    val roundedSeconds = windowsSeconds - Math.floorMod(windowsSeconds, 300L)
    val ticks = Math.multiplyExact(roundedSeconds, WINDOWS_TICKS_PER_SECOND)
    val value = "$ticks$EDGE_TTS_TRUSTED_CLIENT_TOKEN"
    return MessageDigest.getInstance("SHA-256")
        .digest(value.toByteArray(Charsets.US_ASCII))
        .joinToString("") { "%02X".format(Locale.US, it.toInt() and 0xff) }
}

internal fun newEdgeConnectionId(): String = UUID.randomUUID().toString().replace("-", "")

internal fun newEdgeMuid(): String = UUID.randomUUID().toString().replace("-", "").uppercase(Locale.US)

internal fun edgeTimestamp(nowMillis: Long = System.currentTimeMillis()): String =
    SimpleDateFormat(
        "EEE MMM dd yyyy HH:mm:ss 'GMT+0000 (Coordinated Universal Time)'",
        Locale.US,
    ).apply {
        timeZone = TimeZone.getTimeZone("UTC")
    }.format(Date(nowMillis))

internal fun sanitizeEdgeText(text: String): String = buildString(text.length) {
    text.forEach { char ->
        append(if (char.code in 0..8 || char.code in 11..12 || char.code in 14..31) ' ' else char)
    }
}

internal fun escapeEdgeXml(text: String): String = text
    .replace("&", "&amp;")
    .replace("<", "&lt;")
    .replace(">", "&gt;")

internal fun splitEdgeText(
    text: String,
    maxBytes: Int = EDGE_TTS_MAX_TEXT_BYTES,
): List<String> {
    require(maxBytes > 0) { "maxBytes must be positive" }
    var remaining = text.toByteArray(Charsets.UTF_8)
    val result = mutableListOf<String>()

    while (remaining.size > maxBytes) {
        var splitAt = lastIndexOf(remaining, '\n'.code.toByte(), maxBytes)
        if (splitAt < 0) {
            splitAt = lastIndexOf(remaining, ' '.code.toByte(), maxBytes)
        }
        if (splitAt < 0) {
            splitAt = maxBytes
            while (splitAt > 0 && isUtf8ContinuationByte(remaining[splitAt])) {
                splitAt -= 1
            }
        }

        splitAt = adjustForXmlEntity(remaining, splitAt)
        if (splitAt <= 0) {
            throw IllegalArgumentException("Unable to split Edge TTS text safely")
        }
        remaining.copyOfRange(0, splitAt)
            .toString(Charsets.UTF_8)
            .trim()
            .takeIf(String::isNotEmpty)
            ?.let(result::add)
        remaining = remaining.copyOfRange(splitAt, remaining.size)
        var leadingWhitespaceBytes = 0
        while (
            leadingWhitespaceBytes < remaining.size &&
            remaining[leadingWhitespaceBytes] in byteArrayOf(' '.code.toByte(), '\n'.code.toByte(), '\r'.code.toByte(), '\t'.code.toByte())
        ) {
            leadingWhitespaceBytes += 1
        }
        if (leadingWhitespaceBytes > 0) {
            remaining = remaining.copyOfRange(leadingWhitespaceBytes, remaining.size)
        }
    }

    remaining.toString(Charsets.UTF_8)
        .trim()
        .takeIf(String::isNotEmpty)
        ?.let(result::add)
    return result
}

internal fun edgeVoiceName(shortName: String): String {
    val match = Regex("^([a-z]{2,})-([A-Z]{2,})-(.+Neural)$").matchEntire(shortName)
        ?: throw IllegalArgumentException("Unsupported Edge voice name: $shortName")
    val language = match.groupValues[1]
    var region = match.groupValues[2]
    var name = match.groupValues[3]
    val variantSeparator = name.indexOf('-')
    if (variantSeparator >= 0) {
        region += "-${name.substring(0, variantSeparator)}"
        name = name.substring(variantSeparator + 1)
    }
    return "Microsoft Server Speech Text to Speech Voice ($language-$region, $name)"
}

internal fun edgeSpeechConfig(timestamp: String = edgeTimestamp()): String =
    "X-Timestamp:$timestamp\r\n" +
        "Content-Type:application/json; charset=utf-8\r\n" +
        "Path:speech.config\r\n\r\n" +
        "{\"context\":{\"synthesis\":{\"audio\":{\"metadataoptions\":" +
        "{\"sentenceBoundaryEnabled\":\"true\",\"wordBoundaryEnabled\":\"false\"}," +
        "\"outputFormat\":\"audio-24khz-48kbitrate-mono-mp3\"}}}}\r\n"

internal fun edgeSsmlRequest(
    escapedText: String,
    shortVoiceName: String,
    requestId: String = newEdgeConnectionId(),
    timestamp: String = edgeTimestamp(),
): String {
    val ssml = "<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' " +
        "xml:lang='en-US'><voice name='${edgeVoiceName(shortVoiceName)}'>" +
        "<prosody pitch='+0Hz' rate='+0%' volume='+0%'>$escapedText</prosody>" +
        "</voice></speak>"
    return "X-RequestId:$requestId\r\n" +
        "Content-Type:application/ssml+xml\r\n" +
        "X-Timestamp:${timestamp}Z\r\n" +
        "Path:ssml\r\n\r\n$ssml"
}

internal fun parseEdgeHeaders(value: String): Map<String, String> = value
    .split("\r\n")
    .mapNotNull { line ->
        val separator = line.indexOf(':')
        if (separator <= 0) null else {
            line.substring(0, separator).lowercase(Locale.US) to line.substring(separator + 1)
        }
    }
    .toMap()

private fun lastIndexOf(bytes: ByteArray, target: Byte, endExclusive: Int): Int {
    for (index in minOf(endExclusive, bytes.size) - 1 downTo 0) {
        if (bytes[index] == target) return index
    }
    return -1
}

private fun isUtf8ContinuationByte(value: Byte): Boolean = value.toInt() and 0xC0 == 0x80

private fun adjustForXmlEntity(bytes: ByteArray, proposedSplit: Int): Int {
    var splitAt = proposedSplit
    while (splitAt > 0) {
        val ampersand = lastIndexOf(bytes, '&'.code.toByte(), splitAt)
        if (ampersand < 0) break
        val semicolon = bytes.indexOf(';'.code.toByte(), startIndex = ampersand)
        if (semicolon in ampersand until splitAt) break
        splitAt = ampersand
    }
    return splitAt
}

private fun ByteArray.indexOf(target: Byte, startIndex: Int): Int {
    for (index in startIndex until size) {
        if (this[index] == target) return index
    }
    return -1
}
