package top.codesocean.loghome.android.audio

import android.util.Log
import androidx.media3.common.C
import androidx.media3.datasource.BaseDataSource
import androidx.media3.datasource.DataSource
import androidx.media3.datasource.DataSpec
import java.io.File
import java.io.IOException
import java.io.RandomAccessFile
import java.util.concurrent.ConcurrentHashMap
import kotlin.math.min

private const val TTS_TAG = "LogHomeTts"

data class TtsRequest(
    val articleId: String,
    val text: String,
    val voice: String,
    val cacheFile: File,
)

class TtsRequestRegistry {
    private val requests = ConcurrentHashMap<String, TtsRequest>()

    fun put(uri: String, request: TtsRequest) {
        requests[uri] = request
    }

    fun get(uri: android.net.Uri?): TtsRequest? = requests[uri.toString()]

    fun clear() {
        requests.clear()
    }
}

class TtsDataSourceFactory(
    private val registry: TtsRequestRegistry,
    private val ttsEngine: TtsEngineRouter,
) : DataSource.Factory {
    override fun createDataSource(): DataSource {
        return TtsDataSource(registry, ttsEngine)
    }
}

class TtsDataSource(
    private val registry: TtsRequestRegistry,
    private val ttsEngine: TtsEngineRouter,
) : BaseDataSource(true) {
    private var currentUri: android.net.Uri? = null
    private var randomAccessFile: RandomAccessFile? = null
    private var bytesRemaining = 0L
    private var opened = false

    @Throws(IOException::class)
    override fun open(dataSpec: DataSpec): Long {
        transferInitializing(dataSpec)

        currentUri = dataSpec.uri
        val request = registry.get(currentUri)
            ?: throw IOException("Missing TTS request for uri=$currentUri")

        Log.d(
            TTS_TAG,
            "open: uri=$currentUri, articleId=${request.articleId}, cacheFile=${request.cacheFile.name}",
        )
        ensureCachedAudio(request, ttsEngine)

        val file = RandomAccessFile(request.cacheFile, "r")
        val fileLength = file.length()
        val offset = min(dataSpec.position, fileLength)
        file.seek(offset)

        bytesRemaining = if (dataSpec.length == C.LENGTH_UNSET.toLong()) {
            fileLength - offset
        } else {
            min(dataSpec.length, fileLength - offset)
        }

        randomAccessFile = file
        opened = true
        transferStarted(dataSpec)
        return bytesRemaining
    }

    override fun read(buffer: ByteArray, offset: Int, length: Int): Int {
        if (length == 0) {
            return 0
        }
        if (bytesRemaining == 0L) {
            return C.RESULT_END_OF_INPUT
        }

        val bytesToRead = min(length.toLong(), bytesRemaining).toInt()
        val bytesRead = randomAccessFile?.read(buffer, offset, bytesToRead) ?: C.RESULT_END_OF_INPUT
        if (bytesRead <= 0) {
            return C.RESULT_END_OF_INPUT
        }

        bytesRemaining -= bytesRead.toLong()
        bytesTransferred(bytesRead)
        return bytesRead
    }

    override fun getUri(): android.net.Uri? = currentUri

    override fun close() {
        currentUri = null
        randomAccessFile?.close()
        randomAccessFile = null
        bytesRemaining = 0L
        if (opened) {
            opened = false
            transferEnded()
        }
    }

    companion object {
        private val cacheLocks = ConcurrentHashMap<String, Any>()

        @Throws(IOException::class)
        internal fun ensureCachedAudio(request: TtsRequest, ttsEngine: TtsEngineRouter) {
            if (request.cacheFile.exists()) {
                Log.d(
                    TTS_TAG,
                    "cache hit: file=${request.cacheFile.name}, size=${request.cacheFile.length()}",
                )
                return
            }

            val lock = cacheLocks.getOrPut(request.cacheFile.absolutePath) { Any() }
            synchronized(lock) {
                if (request.cacheFile.exists()) {
                    Log.d(
                        TTS_TAG,
                        "cache filled by another request: file=${request.cacheFile.name}, size=${request.cacheFile.length()}",
                    )
                    return
                }

                request.cacheFile.parentFile?.mkdirs()
                Log.d(
                    TTS_TAG,
                    "cache miss: synthesizing articleId=${request.articleId}, voice=${request.voice}, textLength=${request.text.length}",
                )

                try {
                    ttsEngine.synthesizeToFile(
                        text = request.text,
                        requestedVoiceId = request.voice,
                        outputFile = request.cacheFile,
                    )
                    Log.d(
                        TTS_TAG,
                        "TTS audio cached: file=${request.cacheFile.name}, size=${request.cacheFile.length()}",
                    )
                } catch (error: Throwable) {
                    request.cacheFile.delete()
                    Log.e(TTS_TAG, "TTS synthesis failed", error)
                    throw IOException("TTS synthesis failed", error)
                }
            }
        }
    }
}
