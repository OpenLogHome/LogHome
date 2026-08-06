package top.codesocean.loghome.android.audio

import android.util.Log
import okio.ByteString
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import java.io.BufferedOutputStream
import java.io.ByteArrayOutputStream
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone
import java.util.concurrent.CountDownLatch
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

private const val EDGE_TTS_TAG = "LogHomeEdgeTts"
private const val EDGE_TTS_HOST = "speech.platform.bing.com/consumer/speech/synthesize/readaloud"
private const val EDGE_TTS_TIMEOUT_SECONDS = 70L

class EdgeOnlineTtsEngine(
    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(10, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .pingInterval(20, TimeUnit.SECONDS)
        .build(),
) {
    @Volatile
    private var clockSkewSeconds = 0L

    @Throws(IOException::class)
    fun synthesizeToFile(
        text: String,
        requestedVoiceId: String,
        outputFile: File,
    ) {
        val descriptor = EdgeTtsVoiceCatalog.findByVoiceId(requestedVoiceId)
            ?: throw IOException("Unknown Edge TTS voice: $requestedVoiceId")
        val chunks = splitEdgeText(escapeEdgeXml(sanitizeEdgeText(text.ifBlank { "测试文本" })))
        if (chunks.isEmpty()) throw IOException("Edge TTS text is empty")

        outputFile.parentFile?.mkdirs()
        val temporaryFile = File(outputFile.parentFile, "${outputFile.name}.partial")
        temporaryFile.delete()
        outputFile.delete()

        try {
            BufferedOutputStream(FileOutputStream(temporaryFile)).use { output ->
                chunks.forEach { chunk ->
                    output.write(synthesizeChunkWithClockRetry(chunk, descriptor.shortName))
                }
            }
            if (temporaryFile.length() < 128L) {
                throw IOException("Edge TTS produced empty audio")
            }
            if (!temporaryFile.renameTo(outputFile)) {
                throw IOException("Unable to activate Edge TTS audio")
            }
            Log.d(
                EDGE_TTS_TAG,
                "Synthesis completed: voice=$requestedVoiceId, chunks=${chunks.size}, size=${outputFile.length()}",
            )
        } catch (error: Throwable) {
            temporaryFile.delete()
            outputFile.delete()
            throw if (error is IOException) error else IOException("Edge TTS synthesis failed", error)
        }
    }

    private fun synthesizeChunkWithClockRetry(text: String, shortVoiceName: String): ByteArray {
        var result = synthesizeChunk(text, shortVoiceName)
        val serverDate = result.serverDate
        if (result.httpCode == 403 && serverDate != null && adjustClock(serverDate)) {
            result = synthesizeChunk(text, shortVoiceName)
        }
        result.error?.let { throw IOException("Edge TTS WebSocket failed", it) }
        return result.audio ?: throw IOException("Edge TTS returned no audio")
    }

    private fun synthesizeChunk(text: String, shortVoiceName: String): EdgeChunkResult {
        val latch = CountDownLatch(1)
        val completed = AtomicBoolean(false)
        val audio = ByteArrayOutputStream()
        var result = EdgeChunkResult()

        fun finish(value: EdgeChunkResult) {
            if (completed.compareAndSet(false, true)) {
                result = value
                latch.countDown()
            }
        }

        val connectionId = newEdgeConnectionId()
        val request = Request.Builder()
            .url(
                "wss://$EDGE_TTS_HOST/edge/v1" +
                    "?TrustedClientToken=$EDGE_TTS_TRUSTED_CLIENT_TOKEN" +
                    "&ConnectionId=$connectionId" +
                    "&Sec-MS-GEC=${generateEdgeSecMsGec(clockSkewSeconds = clockSkewSeconds)}" +
                    "&Sec-MS-GEC-Version=1-$EDGE_TTS_CHROMIUM_VERSION",
            )
            .header("Pragma", "no-cache")
            .header("Cache-Control", "no-cache")
            .header("Origin", "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold")
            .header("User-Agent", edgeUserAgent())
            .header("Accept-Language", "en-US,en;q=0.9")
            .header("Cookie", "muid=${newEdgeMuid()};")
            .build()

        val webSocket = httpClient.newWebSocket(
            request,
            object : WebSocketListener() {
                override fun onOpen(webSocket: WebSocket, response: Response) {
                    webSocket.send(edgeSpeechConfig())
                    webSocket.send(edgeSsmlRequest(text, shortVoiceName))
                }

                override fun onMessage(webSocket: WebSocket, text: String) {
                    val separator = text.indexOf("\r\n\r\n")
                    if (separator < 0) return
                    when (parseEdgeHeaders(text.substring(0, separator))["path"]?.lowercase(Locale.US)) {
                        "turn.end" -> {
                            if (audio.size() == 0) {
                                finish(EdgeChunkResult(error = IOException("Edge TTS returned no audio")))
                            } else {
                                finish(EdgeChunkResult(audio = audio.toByteArray()))
                            }
                            webSocket.close(1000, null)
                        }
                        "response", "turn.start", "audio.metadata" -> Unit
                    }
                }

                override fun onMessage(webSocket: WebSocket, bytes: ByteString) {
                    runCatching { appendAudioFrame(bytes, audio) }
                        .onFailure {
                            finish(EdgeChunkResult(error = it))
                            webSocket.cancel()
                        }
                }

                override fun onFailure(webSocket: WebSocket, t: Throwable, response: Response?) {
                    finish(
                        EdgeChunkResult(
                            error = t,
                            httpCode = response?.code,
                            serverDate = response?.header("Date"),
                        ),
                    )
                }

                override fun onClosed(webSocket: WebSocket, code: Int, reason: String) {
                    if (!completed.get()) {
                        finish(EdgeChunkResult(error = IOException("Edge TTS closed before turn.end: $code $reason")))
                    }
                }
            },
        )

        if (!latch.await(EDGE_TTS_TIMEOUT_SECONDS, TimeUnit.SECONDS)) {
            webSocket.cancel()
            throw IOException("Edge TTS timed out")
        }
        return result
    }

    private fun adjustClock(serverDate: String): Boolean {
        val parsed = runCatching {
            SimpleDateFormat("EEE, dd MMM yyyy HH:mm:ss zzz", Locale.US).apply {
                timeZone = TimeZone.getTimeZone("GMT")
            }.parse(serverDate)?.time
        }.getOrNull() ?: return false
        clockSkewSeconds = Math.floorDiv(parsed - System.currentTimeMillis(), 1_000L)
        Log.w(EDGE_TTS_TAG, "Adjusted Edge TTS clock skew to $clockSkewSeconds seconds")
        return true
    }

    private fun appendAudioFrame(frame: ByteString, output: ByteArrayOutputStream) {
        val bytes = frame.toByteArray()
        if (bytes.size < 2) throw IOException("Edge TTS binary frame is missing its header length")
        val headerLength = ((bytes[0].toInt() and 0xff) shl 8) or (bytes[1].toInt() and 0xff)
        val dataStart = 2 + headerLength
        if (dataStart > bytes.size) throw IOException("Invalid Edge TTS binary header length")
        val headers = parseEdgeHeaders(bytes.copyOfRange(2, dataStart).toString(Charsets.UTF_8))
        if (!headers["path"].equals("audio", ignoreCase = true)) {
            throw IOException("Unexpected Edge TTS binary frame path")
        }
        val contentType = headers["content-type"]
        if (contentType == null && dataStart == bytes.size) return
        if (!contentType.equals("audio/mpeg", ignoreCase = true)) {
            throw IOException("Unexpected Edge TTS audio content type: $contentType")
        }
        if (dataStart == bytes.size) throw IOException("Edge TTS audio frame is empty")
        output.write(bytes, dataStart, bytes.size - dataStart)
    }

    private fun edgeUserAgent(): String {
        val major = EDGE_TTS_CHROMIUM_VERSION.substringBefore('.')
        return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
            "(KHTML, like Gecko) Chrome/$major.0.0.0 Safari/537.36 Edg/$major.0.0.0"
    }

    private data class EdgeChunkResult(
        val audio: ByteArray? = null,
        val error: Throwable? = null,
        val httpCode: Int? = null,
        val serverDate: String? = null,
    )
}
