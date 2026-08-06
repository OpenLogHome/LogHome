package top.codesocean.loghome.android.audio

import android.content.Context
import android.os.SystemClock
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.currentCoroutineContext
import kotlinx.coroutines.ensureActive
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import org.apache.commons.compress.archivers.tar.TarArchiveEntry
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream
import org.apache.commons.compress.compressors.bzip2.BZip2CompressorInputStream
import java.io.BufferedInputStream
import java.io.BufferedOutputStream
import java.io.File
import java.io.FileInputStream
import java.io.FileOutputStream
import java.io.IOException
import java.io.RandomAccessFile
import java.security.MessageDigest
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.TimeUnit
import java.util.zip.ZipFile

private const val MODEL_TAG = "LogHomeTtsModel"
private const val READY_MARKER = ".ready"
private const val PROGRESS_UPDATE_INTERVAL_MS = 100L

internal fun shouldExtractTtsArchiveEntry(
    entryName: String,
    descriptor: TtsModelDescriptor,
): Boolean {
    val root = descriptor.archiveRootDirectory.trimEnd('/')
    val normalizedEntryName = entryName.trimStart('/').trimEnd('/')
    if (normalizedEntryName == root) {
        return true
    }
    val rootPrefix = "$root/"
    if (!normalizedEntryName.startsWith(rootPrefix)) {
        return false
    }
    val relativePath = normalizedEntryName.removePrefix(rootPrefix)
    if (relativePath.split('/').any { it == "." || it == ".." }) {
        return false
    }
    if (relativePath in descriptor.requiredFiles) {
        return true
    }
    return descriptor.requiredDirectories.any { requiredDirectory ->
        val directory = requiredDirectory.trim('/')
        relativePath == directory || relativePath.startsWith("$directory/")
    }
}

class TtsModelManager(
    context: Context,
    private val httpClient: OkHttpClient = OkHttpClient.Builder()
        .connectTimeout(20, TimeUnit.SECONDS)
        .readTimeout(60, TimeUnit.SECONDS)
        .build(),
) {
    private val appContext = context.applicationContext
    private val modelRoot = File(appContext.filesDir, "tts_models")
    private val downloadRoot = File(modelRoot, ".downloads")
    private val modelLocks = ConcurrentHashMap<String, Mutex>()

    fun isInstalled(descriptor: TtsModelDescriptor): Boolean {
        val directory = getInstallationDirectory(descriptor)
        val expectedMarker = markerContents(descriptor)
        val actualMarker = runCatching {
            File(directory, READY_MARKER).takeIf { it.isFile }?.readText()
        }.getOrNull()
        if (actualMarker != expectedMarker) {
            return false
        }
        return descriptor.requiredFiles.all { relativePath ->
            File(directory, relativePath).let { it.isFile && it.length() > 0L }
        } && descriptor.requiredDirectories.all { relativePath ->
            File(directory, relativePath).let { it.isDirectory && it.list()?.isNotEmpty() == true }
        }
    }

    fun getInstalledModelDirectory(descriptor: TtsModelDescriptor): File? =
        getInstallationDirectory(descriptor).takeIf { isInstalled(descriptor) }

    suspend fun ensureInstalled(
        descriptor: TtsModelDescriptor,
        onProgress: (downloadedBytes: Long, totalBytes: Long) -> Unit = { _, _ -> },
    ): File {
        val lock = modelLocks.getOrPut(descriptor.modelKey) { Mutex() }
        return lock.withLock {
            withContext(Dispatchers.IO) {
                getInstalledModelDirectory(descriptor)?.let { return@withContext it }

                modelRoot.mkdirs()
                downloadRoot.mkdirs()
                val archive = downloadArchive(descriptor, onProgress)
                verifySha256(archive, descriptor.archiveSha256)
                installArchive(descriptor, archive)
            }
        }
    }

    suspend fun deleteModel(descriptor: TtsModelDescriptor) = withContext(Dispatchers.IO) {
        getInstallationDirectory(descriptor).deleteRecursively()
        getPartialArchive(descriptor).delete()
    }

    private suspend fun downloadArchive(
        descriptor: TtsModelDescriptor,
        onProgress: (downloadedBytes: Long, totalBytes: Long) -> Unit,
    ): File {
        val partialFile = getPartialArchive(descriptor)
        var lastProgressUpdateElapsedMs = 0L
        fun reportProgress(downloadedBytes: Long, force: Boolean = false) {
            val now = SystemClock.elapsedRealtime()
            if (force || now - lastProgressUpdateElapsedMs >= PROGRESS_UPDATE_INTERVAL_MS) {
                lastProgressUpdateElapsedMs = now
                runCatching {
                    onProgress(
                        downloadedBytes.coerceIn(0L, descriptor.archiveSizeBytes),
                        descriptor.archiveSizeBytes,
                    )
                }
            }
        }

        var existingBytes = partialFile.takeIf { it.isFile }?.length() ?: 0L
        if (existingBytes > descriptor.archiveSizeBytes) {
            partialFile.delete()
            existingBytes = 0L
        }
        reportProgress(existingBytes, force = true)
        if (existingBytes == descriptor.archiveSizeBytes) {
            return partialFile
        }

        val request = Request.Builder()
            .url(descriptor.archiveUrl)
            .apply {
                if (existingBytes > 0L) {
                    header("Range", "bytes=$existingBytes-")
                }
            }
            .build()

        Log.i(MODEL_TAG, "Downloading ${descriptor.modelId} from byte $existingBytes")
        httpClient.newCall(request).execute().use { response ->
            if (!response.isSuccessful) {
                throw IOException("TTS model download failed: HTTP ${response.code}")
            }

            val append = existingBytes > 0L && response.code == 206
            if (!append) {
                existingBytes = 0L
                reportProgress(0L, force = true)
            }
            val body = response.body ?: throw IOException("TTS model download returned an empty body")

            RandomAccessFile(partialFile, "rw").use { output ->
                if (append) {
                    output.seek(existingBytes)
                } else {
                    output.setLength(0L)
                }

                body.byteStream().use { input ->
                    val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                    var downloadedBytes = existingBytes
                    while (true) {
                        currentCoroutineContext().ensureActive()
                        val count = input.read(buffer)
                        if (count < 0) break
                        output.write(buffer, 0, count)
                        downloadedBytes += count
                        reportProgress(downloadedBytes)
                    }
                }
            }
        }

        if (partialFile.length() != descriptor.archiveSizeBytes) {
            throw IOException(
                "TTS model download is incomplete: expected ${descriptor.archiveSizeBytes}, got ${partialFile.length()}",
            )
        }
        reportProgress(partialFile.length(), force = true)
        return partialFile
    }

    private fun verifySha256(
        file: File,
        expectedSha256: String,
        deleteOnMismatch: Boolean = true,
    ) {
        val digest = MessageDigest.getInstance("SHA-256")
        FileInputStream(file).use { input ->
            val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
            while (true) {
                val count = input.read(buffer)
                if (count < 0) break
                digest.update(buffer, 0, count)
            }
        }
        val actual = digest.digest().joinToString("") { "%02x".format(it) }
        if (!actual.equals(expectedSha256, ignoreCase = true)) {
            if (deleteOnMismatch) {
                file.delete()
            }
            throw IOException("TTS model checksum mismatch")
        }
    }

    private suspend fun installArchive(
        descriptor: TtsModelDescriptor,
        archive: File,
    ): File {
        val targetDirectory = getInstallationDirectory(descriptor)
        val stagingDirectory = File(modelRoot, ".${descriptor.installationDirectoryName}.installing")
        stagingDirectory.deleteRecursively()
        stagingDirectory.mkdirs()

        try {
            val modelArchive = extractBundledModelArchive(
                descriptor = descriptor,
                downloadedArchive = archive,
                stagingDirectory = stagingDirectory,
            )
            extractTarBz2(modelArchive, stagingDirectory, descriptor)
            val extractedRoot = File(stagingDirectory, descriptor.archiveRootDirectory)
            descriptor.requiredFiles.forEach { relativePath ->
                val file = File(extractedRoot, relativePath)
                if (!file.isFile || file.length() <= 0L) {
                    throw IOException("TTS model archive is missing $relativePath")
                }
            }
            descriptor.requiredDirectories.forEach { relativePath ->
                val directory = File(extractedRoot, relativePath)
                if (!directory.isDirectory || directory.list()?.isEmpty() != false) {
                    throw IOException("TTS model archive is missing directory $relativePath")
                }
            }
            File(extractedRoot, READY_MARKER).writeText(markerContents(descriptor))

            targetDirectory.deleteRecursively()
            if (!extractedRoot.renameTo(targetDirectory)) {
                throw IOException("Unable to activate downloaded TTS model")
            }
            archive.delete()
            Log.i(MODEL_TAG, "Installed ${descriptor.modelId} at ${targetDirectory.absolutePath}")
            return targetDirectory
        } finally {
            stagingDirectory.deleteRecursively()
        }
    }

    private suspend fun extractBundledModelArchive(
        descriptor: TtsModelDescriptor,
        downloadedArchive: File,
        stagingDirectory: File,
    ): File {
        val entryName = descriptor.bundledModelArchiveEntry ?: return downloadedArchive
        val expectedSize = descriptor.bundledModelArchiveSizeBytes
            ?: throw IOException("Bundled TTS model size is not configured")
        val expectedSha256 = descriptor.bundledModelArchiveSha256
            ?: throw IOException("Bundled TTS model checksum is not configured")
        val extractedArchive = File(stagingDirectory, ".model.tar.bz2")

        ZipFile(downloadedArchive).use { zip ->
            val entry = zip.getEntry(entryName)
                ?: throw IOException("TTS bundle is missing $entryName")
            if (entry.isDirectory || entry.size > expectedSize) {
                throw IOException("TTS bundle contains an invalid model archive")
            }
            zip.getInputStream(entry).use { input ->
                BufferedOutputStream(FileOutputStream(extractedArchive)).use { output ->
                    val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                    var writtenBytes = 0L
                    while (true) {
                        currentCoroutineContext().ensureActive()
                        val count = input.read(buffer)
                        if (count < 0) break
                        writtenBytes += count
                        if (writtenBytes > expectedSize) {
                            throw IOException("Bundled TTS model exceeds the expected size")
                        }
                        output.write(buffer, 0, count)
                    }
                }
            }
        }

        if (extractedArchive.length() != expectedSize) {
            throw IOException(
                "Bundled TTS model is incomplete: expected $expectedSize, got ${extractedArchive.length()}",
            )
        }
        verifySha256(extractedArchive, expectedSha256, deleteOnMismatch = false)
        return extractedArchive
    }

    @Suppress("DEPRECATION")
    private suspend fun extractTarBz2(
        archive: File,
        destination: File,
        descriptor: TtsModelDescriptor,
    ) {
        val destinationPrefix = destination.canonicalPath + File.separator
        var extractedBytes = 0L
        TarArchiveInputStream(
            BZip2CompressorInputStream(
                BufferedInputStream(FileInputStream(archive)),
                true,
            ),
        ).use { tar ->
            while (true) {
                currentCoroutineContext().ensureActive()
                val entry = tar.nextTarEntry ?: break
                if (!shouldExtractTtsArchiveEntry(entry.name, descriptor)) {
                    continue
                }
                extractEntry(tar, entry, destination, destinationPrefix).also {
                    extractedBytes += it
                }
                if (extractedBytes > descriptor.maxExtractedSizeBytes) {
                    throw IOException("TTS model archive exceeds the extraction limit")
                }
            }
        }
    }

    private fun extractEntry(
        tar: TarArchiveInputStream,
        entry: TarArchiveEntry,
        destination: File,
        destinationPrefix: String,
    ): Long {
        if (entry.isSymbolicLink || entry.isLink) {
            throw IOException("TTS model archive contains unsupported links")
        }
        val outputFile = File(destination, entry.name)
        val canonicalPath = outputFile.canonicalPath
        if (!canonicalPath.startsWith(destinationPrefix)) {
            throw IOException("TTS model archive contains an unsafe path")
        }
        if (entry.isDirectory) {
            outputFile.mkdirs()
            return 0L
        }

        outputFile.parentFile?.mkdirs()
        BufferedOutputStream(FileOutputStream(outputFile)).use { output ->
            tar.copyTo(output)
        }
        return outputFile.length()
    }

    private fun getInstallationDirectory(descriptor: TtsModelDescriptor) =
        File(modelRoot, descriptor.installationDirectoryName)

    private fun getPartialArchive(descriptor: TtsModelDescriptor) =
        File(downloadRoot, "${descriptor.installationDirectoryName}.tar.bz2.part")

    private fun markerContents(descriptor: TtsModelDescriptor) =
        "${descriptor.version}\n${descriptor.modelContentSha256}\n"
}
