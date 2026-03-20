package top.codesocean.loghome.android.web

import android.content.Context
import android.util.Log
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.IOException
import java.security.MessageDigest
import java.util.Locale

object WebViewFontCache {
    private const val TAG = "ReaderFont"
    const val FONT_ASSET_HOST = "appassets.androidplatform.net"
    const val FONT_ASSET_PATH_PREFIX = "/reader-fonts/"
    private const val FONT_CACHE_DIR_NAME = "reader_fonts"
    private val httpClient = OkHttpClient()
    private val supportedFormats = setOf("ttf", "otf", "woff", "woff2")

    fun ensureFont(
        context: Context,
        fontKey: String,
        fontUrl: String,
        fontFormat: String,
        fontVersion: String?,
    ): String {
        val rawKey = fontKey.trim()
        require(rawKey.isNotBlank()) { "fontKey is required" }
        require(fontUrl.isNotBlank()) { "fontUrl is required" }
        require(fontUrl.startsWith("http://") || fontUrl.startsWith("https://")) {
            "fontUrl must be an http(s) URL"
        }
        val normalizedFormat = normalizeFormat(fontFormat)
        val normalizedVersion = normalizeVersion(fontVersion)
        val cacheKey = buildCacheKey(rawKey)
        val fileName = "${cacheKey}_${normalizedVersion}.${normalizedFormat}"

        val cacheDir = File(context.filesDir, FONT_CACHE_DIR_NAME).apply { mkdirs() }
        cleanupOldVersions(cacheDir, cacheKey, fileName)

        val targetFile = File(cacheDir, fileName)
        if (targetFile.exists() && targetFile.length() > 0L) {
            Log.d(
                TAG,
                "cache hit rawKey=$rawKey cacheKey=$cacheKey version=$normalizedVersion format=$normalizedFormat path=${targetFile.absolutePath}",
            )
            return buildFontAssetUrl(fileName)
        }

        val tempFile = File(cacheDir, "$fileName.downloading")
        if (tempFile.exists()) {
            tempFile.delete()
        }

        try {
            Log.d(
                TAG,
                "start download rawKey=$rawKey cacheKey=$cacheKey version=$normalizedVersion format=$normalizedFormat url=$fontUrl target=${targetFile.absolutePath}",
            )

            val request = Request.Builder().url(fontUrl).get().build()
            httpClient.newCall(request).execute().use { response ->
                if (!response.isSuccessful) {
                    throw IOException("download font failed, HTTP ${response.code}, url=$fontUrl")
                }
                val body = response.body ?: throw IOException("download font failed, empty response body, url=$fontUrl")
                tempFile.outputStream().use { output ->
                    body.byteStream().use { input ->
                        input.copyTo(output)
                    }
                }
            }

            if (tempFile.length() <= 0L) {
                tempFile.delete()
                throw IOException("downloaded font is empty, url=$fontUrl")
            }

            if (targetFile.exists() && !targetFile.delete()) {
                tempFile.delete()
                throw IOException("failed to replace existing font cache file: ${targetFile.absolutePath}")
            }

            if (!tempFile.renameTo(targetFile)) {
                tempFile.copyTo(targetFile, overwrite = true)
                tempFile.delete()
            }

            Log.d(
                TAG,
                "download success rawKey=$rawKey cacheKey=$cacheKey version=$normalizedVersion path=${targetFile.absolutePath} bytes=${targetFile.length()}",
            )

            return buildFontAssetUrl(fileName)
        } catch (error: Exception) {
            if (tempFile.exists()) {
                tempFile.delete()
            }
            Log.e(
                TAG,
                "ensureFont failed rawKey=$rawKey cacheKey=$cacheKey version=$normalizedVersion format=$normalizedFormat url=$fontUrl target=${targetFile.absolutePath}",
                error,
            )
            throw error
        }
    }

    fun resolveCachedFontFile(context: Context, fileName: String): File? {
        if (fileName.isBlank() || fileName.contains("/") || fileName.contains("\\") || fileName.contains("..")) {
            return null
        }
        val cacheDir = File(context.filesDir, FONT_CACHE_DIR_NAME)
        val targetFile = File(cacheDir, fileName)
        if (!targetFile.exists() || !targetFile.isFile || targetFile.length() <= 0L) {
            return null
        }
        return targetFile
    }

    private fun cleanupOldVersions(cacheDir: File, normalizedKey: String, currentFileName: String) {
        cacheDir.listFiles()
            ?.filter { file ->
                file.isFile &&
                    file.name.startsWith("${normalizedKey}_") &&
                    file.name != currentFileName &&
                    !file.name.endsWith(".downloading")
            }
            ?.forEach { file -> file.delete() }
    }

    private fun buildCacheKey(raw: String): String {
        val digest = MessageDigest.getInstance("SHA-256").digest(raw.toByteArray(Charsets.UTF_8))
        return digest.joinToString("") { byte -> "%02x".format(Locale.US, byte) }.take(24)
    }

    private fun normalizeVersion(raw: String?): String {
        val value = raw?.trim().orEmpty()
        if (value.isBlank()) {
            return "1"
        }

        return value
            .lowercase(Locale.US)
            .replace(Regex("[^a-z0-9._-]"), "_")
            .replace(Regex("_+"), "_")
            .trim('_')
            .ifBlank { "1" }
    }

    private fun normalizeFormat(raw: String): String {
        val value = raw.trim().lowercase(Locale.US)
        if (value in supportedFormats) {
            return value
        }
        return "ttf"
    }

    private fun buildFontAssetUrl(fileName: String): String {
        return "https://$FONT_ASSET_HOST$FONT_ASSET_PATH_PREFIX$fileName"
    }
}
