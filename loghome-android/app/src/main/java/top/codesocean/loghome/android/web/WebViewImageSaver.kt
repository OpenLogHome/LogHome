package top.codesocean.loghome.android.web

import android.content.ContentValues
import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.Rect
import android.media.MediaScannerConnection
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.provider.MediaStore
import android.util.Base64
import android.webkit.CookieManager
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import okhttp3.OkHttpClient
import okhttp3.Request
import top.codesocean.loghome.android.R
import java.io.File
import java.io.FileOutputStream
import java.io.IOException

object WebViewImageSaver {
    private const val DOWNLOAD_FOLDER_NAME = "原木社区"
    private val httpClient = OkHttpClient()

    data class SavedImage(
        val uri: Uri,
        val displayName: String,
    )

    suspend fun saveWatermarkedImage(
        context: Context,
        imageUrl: String,
        currentPageUrl: String?,
        userAgent: String?,
    ): SavedImage = withContext(Dispatchers.IO) {
        val sourceBitmap = decodeBitmap(context, imageUrl, currentPageUrl, userAgent)
            ?: throw IOException("Unable to decode image content.")
        val watermarkBitmap = BitmapFactory.decodeResource(context.resources, R.drawable.logo_watermark)
            ?: throw IOException("Unable to decode watermark image.")
        val watermarkedBitmap = addWatermark(sourceBitmap, watermarkBitmap)
        saveBitmap(context, watermarkedBitmap)
    }

    private fun decodeBitmap(
        context: Context,
        imageUrl: String,
        currentPageUrl: String?,
        userAgent: String?,
    ): Bitmap? {
        val uri = Uri.parse(imageUrl)
        return when (uri.scheme?.lowercase()) {
            "http", "https" -> decodeRemoteBitmap(imageUrl, currentPageUrl, userAgent)
            "content" -> context.contentResolver.openInputStream(uri)?.use(BitmapFactory::decodeStream)
            "file" -> BitmapFactory.decodeFile(uri.path)
            "data" -> decodeDataUriBitmap(imageUrl)
            "blob" -> throw IOException("Blob image URLs are not supported for native download.")
            null -> BitmapFactory.decodeFile(imageUrl)
            else -> throw IOException("Unsupported image URL scheme: ${uri.scheme}")
        }
    }

    private fun decodeRemoteBitmap(
        imageUrl: String,
        currentPageUrl: String?,
        userAgent: String?,
    ): Bitmap? {
        val requestBuilder = Request.Builder().url(imageUrl)
        CookieManager.getInstance().getCookie(imageUrl)
            ?.takeIf { it.isNotBlank() }
            ?.let { requestBuilder.header("Cookie", it) }
        userAgent?.takeIf { it.isNotBlank() }?.let { requestBuilder.header("User-Agent", it) }
        currentPageUrl?.takeIf { it.isNotBlank() }?.let { requestBuilder.header("Referer", it) }
        return httpClient.newCall(requestBuilder.build()).execute().use { response ->
            if (!response.isSuccessful) {
                throw IOException("Failed to download image: HTTP ${response.code}")
            }
            response.body?.byteStream()?.use(BitmapFactory::decodeStream)
        }
    }

    private fun decodeDataUriBitmap(imageUrl: String): Bitmap? {
        val base64Marker = "base64,"
        val startIndex = imageUrl.indexOf(base64Marker)
        if (startIndex == -1) {
            throw IOException("Unsupported data URI image format.")
        }
        val encoded = imageUrl.substring(startIndex + base64Marker.length)
        val imageBytes = Base64.decode(encoded, Base64.DEFAULT)
        return BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.size)
    }

    private fun addWatermark(source: Bitmap, watermark: Bitmap): Bitmap {
        val target = source.copy(Bitmap.Config.ARGB_8888, true)
        val canvas = Canvas(target)
        val maxTargetWidth = (target.width * 0.03f).coerceAtLeast(18f)
        val maxTargetHeight = (target.height * 0.03f).coerceAtLeast(18f)
        val scale = minOf(
            maxTargetWidth / watermark.width,
            maxTargetHeight / watermark.height,
        )
        val drawWidth = (watermark.width * scale).toInt().coerceAtLeast(1)
        val drawHeight = (watermark.height * scale).toInt().coerceAtLeast(1)
        val padding = (minOf(target.width, target.height) * 0.015f).toInt().coerceAtLeast(8)
        val left = (target.width - drawWidth - padding).coerceAtLeast(0)
        val top = (target.height - drawHeight - padding).coerceAtLeast(0)
        val destination = Rect(left, top, left + drawWidth, top + drawHeight)
        val paint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG).apply {
            alpha = 235
        }

        canvas.drawBitmap(watermark, null, destination, paint)
        return target
    }

    private fun saveBitmap(context: Context, bitmap: Bitmap): SavedImage {
        val compressFormat = if (bitmap.hasAlpha()) Bitmap.CompressFormat.PNG else Bitmap.CompressFormat.JPEG
        val fileExtension = if (compressFormat == Bitmap.CompressFormat.PNG) "png" else "jpg"
        val mimeType = if (compressFormat == Bitmap.CompressFormat.PNG) "image/png" else "image/jpeg"
        val fileName = "loghome_${System.currentTimeMillis()}.$fileExtension"
        val quality = if (compressFormat == Bitmap.CompressFormat.PNG) 100 else 92

        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
            saveWithMediaStore(context, bitmap, compressFormat, quality, mimeType, fileName)
        } else {
            saveLegacyBitmap(context, bitmap, compressFormat, quality, mimeType, fileName)
        }
    }

    private fun saveWithMediaStore(
        context: Context,
        bitmap: Bitmap,
        compressFormat: Bitmap.CompressFormat,
        quality: Int,
        mimeType: String,
        fileName: String,
    ): SavedImage {
        val values = ContentValues().apply {
            put(MediaStore.MediaColumns.DISPLAY_NAME, fileName)
            put(MediaStore.MediaColumns.MIME_TYPE, mimeType)
            put(MediaStore.MediaColumns.RELATIVE_PATH, "${Environment.DIRECTORY_PICTURES}/$DOWNLOAD_FOLDER_NAME")
            put(MediaStore.MediaColumns.IS_PENDING, 1)
        }
        val collection = MediaStore.Images.Media.getContentUri(MediaStore.VOLUME_EXTERNAL_PRIMARY)
        val imageUri = context.contentResolver.insert(collection, values)
            ?: throw IOException("Failed to create image record.")

        try {
            context.contentResolver.openOutputStream(imageUri)?.use { outputStream ->
                if (!bitmap.compress(compressFormat, quality, outputStream)) {
                    throw IOException("Failed to encode image.")
                }
            } ?: throw IOException("Failed to open image output stream.")

            val readyValues = ContentValues().apply {
                put(MediaStore.MediaColumns.IS_PENDING, 0)
            }
            context.contentResolver.update(imageUri, readyValues, null, null)
            return SavedImage(imageUri, fileName)
        } catch (error: Exception) {
            context.contentResolver.delete(imageUri, null, null)
            throw error
        }
    }

    @Suppress("DEPRECATION")
    private fun saveLegacyBitmap(
        context: Context,
        bitmap: Bitmap,
        compressFormat: Bitmap.CompressFormat,
        quality: Int,
        mimeType: String,
        fileName: String,
    ): SavedImage {
        val picturesDir =
            Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_PICTURES)
        val targetDir = File(picturesDir, DOWNLOAD_FOLDER_NAME)
        if (!targetDir.exists() && !targetDir.mkdirs()) {
            throw IOException("Failed to create picture directory.")
        }

        val outputFile = File(targetDir, fileName)
        FileOutputStream(outputFile).use { outputStream ->
            if (!bitmap.compress(compressFormat, quality, outputStream)) {
                throw IOException("Failed to encode image.")
            }
        }
        MediaScannerConnection.scanFile(
            context,
            arrayOf(outputFile.absolutePath),
            arrayOf(mimeType),
            null,
        )
        return SavedImage(Uri.fromFile(outputFile), fileName)
    }
}
