package top.codesocean.loghome.android.ui

import android.content.Context
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import top.codesocean.loghome.android.R

object SplashImageLoader {
    suspend fun decode(context: Context): Bitmap? = withContext(Dispatchers.IO) {
        val metrics = context.resources.displayMetrics
        val targetWidth = metrics.widthPixels.coerceAtLeast(1)
        val targetHeight = metrics.heightPixels.coerceAtLeast(1)

        val bounds = BitmapFactory.Options().apply {
            inJustDecodeBounds = true
        }
        BitmapFactory.decodeResource(context.resources, R.drawable.splash, bounds)

        val decodeOptions = BitmapFactory.Options().apply {
            inSampleSize = calculateInSampleSize(
                rawWidth = bounds.outWidth,
                rawHeight = bounds.outHeight,
                targetWidth = targetWidth,
                targetHeight = targetHeight,
            )
            inPreferredConfig = Bitmap.Config.RGB_565
        }

        BitmapFactory.decodeResource(context.resources, R.drawable.splash, decodeOptions)
    }

    private fun calculateInSampleSize(
        rawWidth: Int,
        rawHeight: Int,
        targetWidth: Int,
        targetHeight: Int,
    ): Int {
        var sampleSize = 1
        if (rawHeight > targetHeight || rawWidth > targetWidth) {
            val halfHeight = rawHeight / 2
            val halfWidth = rawWidth / 2
            while (halfHeight / sampleSize >= targetHeight && halfWidth / sampleSize >= targetWidth) {
                sampleSize *= 2
            }
        }
        return sampleSize.coerceAtLeast(1)
    }
}
