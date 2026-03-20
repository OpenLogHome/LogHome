package top.codesocean.loghome.android.web

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Matrix
import android.media.ExifInterface
import android.net.Uri
import androidx.core.content.FileProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import kotlin.math.max
import kotlin.math.roundToInt

object ImageUploadPreparation {
    private const val PREVIEW_MAX_DIMENSION = 4096
    private const val COMPRESSED_MAX_DIMENSION = 2048
    private const val COMPRESSED_JPEG_QUALITY = 88
    private const val ORIGINAL_EDITED_JPEG_QUALITY = 100

    suspend fun loadEditableBitmap(context: Context, imageUri: Uri): Bitmap = withContext(Dispatchers.IO) {
        val decoded = decodeSampledBitmap(context, imageUri, PREVIEW_MAX_DIMENSION)
            ?: throw IOException("Unable to decode selected image.")
        applyExifOrientation(context, imageUri, decoded)
    }

    suspend fun loadThumbnailBitmap(
        context: Context,
        imageUri: Uri,
        maxDimension: Int,
    ): Bitmap = withContext(Dispatchers.IO) {
        decodeSampledBitmap(context, imageUri, maxDimension)
            ?: throw IOException("Unable to decode image thumbnail.")
    }

    suspend fun prepareImageForUpload(
        context: Context,
        imageUri: Uri,
        keepOriginal: Boolean,
    ): Uri = withContext(Dispatchers.IO) {
        if (keepOriginal) {
            return@withContext imageUri
        }
        val bitmap = loadEditableBitmap(context, imageUri)
        val normalized = resizeIfNeeded(bitmap, COMPRESSED_MAX_DIMENSION)
        writeBitmapToCache(context, normalized, preserveQuality = false)
    }

    suspend fun writeEditedBitmapForUpload(
        context: Context,
        bitmap: Bitmap,
        preserveQuality: Boolean,
    ): Uri = withContext(Dispatchers.IO) {
        writeBitmapToCache(context, bitmap, preserveQuality)
    }

    private fun decodeSampledBitmap(
        context: Context,
        imageUri: Uri,
        maxDimension: Int,
    ): Bitmap? {
        val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
        context.contentResolver.openInputStream(imageUri)?.use { input ->
            BitmapFactory.decodeStream(input, null, bounds)
        }
        if (bounds.outWidth <= 0 || bounds.outHeight <= 0) {
            return null
        }
        val maxSourceDimension = max(bounds.outWidth, bounds.outHeight)
        val sampleSize = max(1, Integer.highestOneBit((maxSourceDimension / maxDimension).coerceAtLeast(1)))
        val decodeOptions = BitmapFactory.Options().apply {
            inSampleSize = sampleSize
            inPreferredConfig = Bitmap.Config.ARGB_8888
        }
        return context.contentResolver.openInputStream(imageUri)?.use { input ->
            BitmapFactory.decodeStream(input, null, decodeOptions)
        }
    }

    private fun applyExifOrientation(
        context: Context,
        imageUri: Uri,
        bitmap: Bitmap,
    ): Bitmap {
        val orientation = context.contentResolver.openInputStream(imageUri)?.use { input ->
            ExifInterface(input).getAttributeInt(
                ExifInterface.TAG_ORIENTATION,
                ExifInterface.ORIENTATION_NORMAL,
            )
        } ?: ExifInterface.ORIENTATION_NORMAL

        val matrix = Matrix()
        when (orientation) {
            ExifInterface.ORIENTATION_ROTATE_90 -> matrix.postRotate(90f)
            ExifInterface.ORIENTATION_ROTATE_180 -> matrix.postRotate(180f)
            ExifInterface.ORIENTATION_ROTATE_270 -> matrix.postRotate(270f)
            ExifInterface.ORIENTATION_FLIP_HORIZONTAL -> matrix.postScale(-1f, 1f)
            ExifInterface.ORIENTATION_FLIP_VERTICAL -> matrix.postScale(1f, -1f)
            ExifInterface.ORIENTATION_TRANSPOSE -> {
                matrix.postRotate(90f)
                matrix.postScale(-1f, 1f)
            }

            ExifInterface.ORIENTATION_TRANSVERSE -> {
                matrix.postRotate(270f)
                matrix.postScale(-1f, 1f)
            }

            else -> return bitmap
        }
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.width, bitmap.height, matrix, true)
    }

    private fun resizeIfNeeded(bitmap: Bitmap, maxDimension: Int): Bitmap {
        val maxSide = max(bitmap.width, bitmap.height)
        if (maxSide <= maxDimension) {
            return bitmap
        }
        val scale = maxDimension.toFloat() / maxSide.toFloat()
        val targetWidth = (bitmap.width * scale).roundToInt().coerceAtLeast(1)
        val targetHeight = (bitmap.height * scale).roundToInt().coerceAtLeast(1)
        return Bitmap.createScaledBitmap(bitmap, targetWidth, targetHeight, true)
    }

    private fun writeBitmapToCache(
        context: Context,
        bitmap: Bitmap,
        preserveQuality: Boolean,
    ): Uri {
        val uploadDir = File(context.cacheDir, "webview-upload").apply {
            mkdirs()
        }
        val compressFormat = if (bitmap.hasAlpha()) Bitmap.CompressFormat.PNG else Bitmap.CompressFormat.JPEG
        val extension = if (compressFormat == Bitmap.CompressFormat.PNG) "png" else "jpg"
        val outputFile = File(uploadDir, "upload_${System.currentTimeMillis()}.$extension")
        val outputBitmap =
            if (preserveQuality || compressFormat == Bitmap.CompressFormat.PNG) {
                bitmap
            } else {
                resizeIfNeeded(bitmap, COMPRESSED_MAX_DIMENSION)
            }
        FileOutputStream(outputFile).use { output ->
            val quality = if (compressFormat == Bitmap.CompressFormat.PNG) {
                100
            } else if (preserveQuality) {
                ORIGINAL_EDITED_JPEG_QUALITY
            } else {
                COMPRESSED_JPEG_QUALITY
            }
            if (!outputBitmap.compress(compressFormat, quality, output)) {
                throw IOException("Failed to encode edited image.")
            }
        }
        return FileProvider.getUriForFile(context, "${context.packageName}.fileprovider", outputFile)
    }
}
