package top.codesocean.loghome.android.assets

import android.content.Context
import android.os.Build
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.io.InputStream
import java.util.zip.ZipEntry
import java.util.zip.ZipInputStream

object AssetRepository {
    private const val WEB_ZIP_ASSET = "web/web.zip"
    private const val ACTIVE_WEB_DIR_NAME = "web"
    private const val PENDING_WEB_DIR_NAME = "web_pending"
    private const val STAGING_WEB_DIR_NAME = "web_staging"
    private const val BACKUP_WEB_DIR_NAME = "web_backup"
    private const val VERSION_FILE_NAME = ".version"
    private const val INDEX_FILE_NAME = "index.html"
    private const val UPDATE_ZIP_NAME = "loghome-web-update.zip"

    private val httpClient = OkHttpClient()

    suspend fun prepareAssets(context: Context): String = withContext(Dispatchers.IO) {
        val activeDir = webDir(context, ACTIVE_WEB_DIR_NAME)
        val pendingDir = webDir(context, PENDING_WEB_DIR_NAME)
        val stagingDir = webDir(context, STAGING_WEB_DIR_NAME)
        val backupDir = webDir(context, BACKUP_WEB_DIR_NAME)
        val currentVersion = currentBuildVersion(context)

        deleteRecursivelyIfExists(stagingDir)
        promotePendingAssetsIfReady(activeDir, pendingDir, backupDir, currentVersion)
        recoverFromBackupIfNeeded(activeDir, backupDir)

        if (
            !isPreparedAssetDirectory(activeDir) ||
            shouldInstallBundledAssets(readVersion(activeDir), currentVersion)
        ) {
            installBundledAssets(context, activeDir, stagingDir, backupDir, currentVersion)
        }

        recoverFromBackupIfNeeded(activeDir, backupDir)

        val indexFile = File(activeDir, INDEX_FILE_NAME)
        check(indexFile.exists() && indexFile.isFile && indexFile.length() > 0L) {
            "index.html not found: ${indexFile.absolutePath}"
        }
        indexFile.absolutePath
    }

    suspend fun getCurrentAssetVersion(context: Context): String = withContext(Dispatchers.IO) {
        readVersion(webDir(context, ACTIVE_WEB_DIR_NAME)).orEmpty()
    }

    suspend fun hotUpdateAssets(
        context: Context,
        url: String,
        newVersion: String,
        onProgress: ((Double, String) -> Unit)? = null,
    ) = withContext(Dispatchers.IO) {
        val pendingDir = webDir(context, PENDING_WEB_DIR_NAME)
        val tempZip = File(context.cacheDir, UPDATE_ZIP_NAME)
        val targetVersion = normalizeVersion(newVersion)

        try {
            deleteRecursivelyIfExists(pendingDir)
            deleteRecursivelyIfExists(tempZip)
            onProgress?.invoke(0.0, "downloading")

            downloadZip(url, tempZip, onProgress)

            onProgress?.invoke(0.0, "extracting")
            pendingDir.mkdirs()
            unzipZipFile(tempZip, pendingDir, onProgress)

            onProgress?.invoke(0.0, "validating")
            validateCandidateDirectory(pendingDir)
            writeVersion(pendingDir, targetVersion)
            check(isPreparedAssetDirectory(pendingDir)) {
                "Prepared web assets are invalid after writing version"
            }

            onProgress?.invoke(1.0, "completed")
        } catch (error: Exception) {
            deleteRecursivelyIfExists(pendingDir)
            onProgress?.invoke(0.0, "failed")
            throw error
        } finally {
            deleteRecursivelyIfExists(tempZip)
        }
    }

    private fun promotePendingAssetsIfReady(
        activeDir: File,
        pendingDir: File,
        backupDir: File,
        currentVersion: String,
    ) {
        if (!pendingDir.exists()) {
            return
        }
        if (!isPreparedAssetDirectory(pendingDir)) {
            deleteRecursivelyIfExists(pendingDir)
            return
        }
        if (shouldInstallBundledAssets(readVersion(pendingDir), currentVersion)) {
            deleteRecursivelyIfExists(pendingDir)
            return
        }

        activatePreparedDirectory(activeDir, pendingDir, backupDir)
    }

    private fun recoverFromBackupIfNeeded(activeDir: File, backupDir: File) {
        if (isPreparedAssetDirectory(activeDir)) {
            return
        }
        if (!isPreparedAssetDirectory(backupDir)) {
            return
        }

        deleteRecursivelyIfExists(activeDir)
        moveDirectory(backupDir, activeDir)
    }

    private fun installBundledAssets(
        context: Context,
        activeDir: File,
        stagingDir: File,
        backupDir: File,
        currentVersion: String,
    ) {
        deleteRecursivelyIfExists(stagingDir)
        stagingDir.mkdirs()
        context.assets.open(WEB_ZIP_ASSET).use { input ->
            unzipIntoDirectory(input, stagingDir)
        }
        validateCandidateDirectory(stagingDir)
        writeVersion(stagingDir, currentVersion)
        activatePreparedDirectory(activeDir, stagingDir, backupDir)
    }

    private fun activatePreparedDirectory(activeDir: File, candidateDir: File, backupDir: File) {
        check(isPreparedAssetDirectory(candidateDir)) {
            "Candidate web asset directory is invalid: ${candidateDir.absolutePath}"
        }

        val hadActiveDir = activeDir.exists()
        if (hadActiveDir) {
            deleteRecursivelyIfExists(backupDir)
            moveDirectory(activeDir, backupDir)
        }

        try {
            moveDirectory(candidateDir, activeDir)
        } catch (error: Exception) {
            deleteRecursivelyIfExists(activeDir)
            if (hadActiveDir && backupDir.exists()) {
                moveDirectory(backupDir, activeDir)
            }
            throw IOException("Failed to activate web assets", error)
        }
    }

    private fun downloadZip(
        url: String,
        tempZip: File,
        onProgress: ((Double, String) -> Unit)?,
    ) {
        val request = Request.Builder().url(url).build()
        httpClient.newCall(request).execute().use { response ->
            check(response.isSuccessful) { "Unexpected response: ${response.code}" }
            val body = response.body ?: error("Empty response body")
            val totalBytes = body.contentLength()

            body.byteStream().use { input ->
                FileOutputStream(tempZip).use { output ->
                    val buffer = ByteArray(DEFAULT_BUFFER_SIZE)
                    var receivedBytes = 0L
                    while (true) {
                        val read = input.read(buffer)
                        if (read == -1) {
                            break
                        }
                        output.write(buffer, 0, read)
                        receivedBytes += read
                        if (totalBytes > 0) {
                            onProgress?.invoke(
                                receivedBytes.toDouble() / totalBytes.toDouble(),
                                "downloading",
                            )
                        }
                    }
                }
            }
        }
    }

    private fun unzipZipFile(
        zipFile: File,
        targetDir: File,
        onProgress: ((Double, String) -> Unit)?,
    ) {
        val totalFiles = countZipFiles(zipFile).coerceAtLeast(1)
        var extractedFiles = 0

        ZipInputStream(zipFile.inputStream().buffered()).use { zip ->
            while (true) {
                val entry = zip.nextEntry ?: break
                if (!entry.isDirectory) {
                    writeZipEntry(zip, targetDir, entry)
                    extractedFiles += 1
                    onProgress?.invoke(
                        extractedFiles.toDouble() / totalFiles.toDouble(),
                        "extracting",
                    )
                }
                zip.closeEntry()
            }
        }
    }

    private fun validateCandidateDirectory(targetDir: File) {
        val indexFile = File(targetDir, INDEX_FILE_NAME)
        check(indexFile.exists() && indexFile.isFile && indexFile.length() > 0L) {
            "index.html not found in ${targetDir.absolutePath}"
        }

        val fileCount = targetDir.walkTopDown().count { it.isFile && it.name != VERSION_FILE_NAME }
        check(fileCount > 0) { "No web assets extracted into ${targetDir.absolutePath}" }
    }

    private fun isPreparedAssetDirectory(targetDir: File): Boolean {
        val version = readVersion(targetDir) ?: return false
        if (version.isBlank()) {
            return false
        }

        val indexFile = File(targetDir, INDEX_FILE_NAME)
        return indexFile.exists() && indexFile.isFile && indexFile.length() > 0L
    }

    private fun shouldInstallBundledAssets(existingVersion: String?, bundledVersion: String): Boolean {
        if (existingVersion.isNullOrBlank()) {
            return true
        }

        val existingLong = existingVersion.toLongOrNull()
        val bundledLong = bundledVersion.toLongOrNull()
        if (existingLong != null && bundledLong != null) {
            return existingLong < bundledLong
        }

        return false
    }

    private fun readVersion(targetDir: File): String? {
        val versionFile = File(targetDir, VERSION_FILE_NAME)
        if (!versionFile.exists() || !versionFile.isFile) {
            return null
        }

        return versionFile.readText().trim().takeIf { it.isNotBlank() }
    }

    private fun writeVersion(targetDir: File, version: String) {
        File(targetDir, VERSION_FILE_NAME).writeText(version)
    }

    private fun normalizeVersion(version: String): String {
        return version.trim().ifBlank { System.currentTimeMillis().toString() }
    }

    private fun moveDirectory(source: File, target: File) {
        if (!source.exists()) {
            return
        }

        deleteRecursivelyIfExists(target)
        target.parentFile?.mkdirs()
        if (source.renameTo(target)) {
            return
        }

        try {
            source.copyRecursively(target, overwrite = true)
        } catch (error: Exception) {
            deleteRecursivelyIfExists(target)
            throw IOException("Failed to copy ${source.absolutePath} to ${target.absolutePath}", error)
        }

        deleteRecursivelyIfExists(source)
    }

    private fun deleteRecursivelyIfExists(target: File) {
        if (!target.exists()) {
            return
        }
        if (!target.deleteRecursively() && target.exists()) {
            throw IOException("Failed to delete ${target.absolutePath}")
        }
    }

    private fun currentBuildVersion(context: Context): String {
        val packageInfo = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            context.packageManager.getPackageInfo(
                context.packageName,
                android.content.pm.PackageManager.PackageInfoFlags.of(0),
            )
        } else {
            @Suppress("DEPRECATION")
            context.packageManager.getPackageInfo(context.packageName, 0)
        }

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            packageInfo.longVersionCode.toString()
        } else {
            @Suppress("DEPRECATION")
            packageInfo.versionCode.toString()
        }
    }

    private fun unzipIntoDirectory(input: InputStream, targetDir: File) {
        ZipInputStream(input.buffered()).use { zip ->
            while (true) {
                val entry = zip.nextEntry ?: break
                if (!entry.isDirectory) {
                    writeZipEntry(zip, targetDir, entry)
                }
                zip.closeEntry()
            }
        }
    }

    private fun countZipFiles(zipFile: File): Int {
        var count = 0
        ZipInputStream(zipFile.inputStream().buffered()).use { zip ->
            while (true) {
                val entry = zip.nextEntry ?: break
                if (!entry.isDirectory) {
                    count += 1
                }
                zip.closeEntry()
            }
        }
        return count
    }

    private fun writeZipEntry(zipInput: ZipInputStream, targetDir: File, entry: ZipEntry) {
        val outFile = File(targetDir, entry.name)
        val targetPath = targetDir.canonicalPath + File.separator
        val outPath = outFile.canonicalPath
        check(outPath.startsWith(targetPath)) { "Blocked zip entry outside target dir: ${entry.name}" }

        outFile.parentFile?.mkdirs()
        FileOutputStream(outFile).use { output ->
            zipInput.copyTo(output)
        }
    }

    private fun webDir(context: Context, name: String): File {
        return File(context.filesDir, name)
    }
}
