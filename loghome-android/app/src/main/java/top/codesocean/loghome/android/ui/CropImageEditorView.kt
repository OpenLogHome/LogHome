package top.codesocean.loghome.android.ui

import android.content.Context
import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.Path
import android.graphics.RectF
import android.util.AttributeSet
import android.view.MotionEvent
import android.view.ScaleGestureDetector
import android.view.View
import kotlin.math.abs
import kotlin.math.max
import kotlin.math.roundToInt

class CropImageEditorView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
) : View(context, attrs) {
    private var bitmap: Bitmap? = null
    private var cropAspectRatio: Float? = null
    private var originalAspectRatio: Float? = null
    private var imageScale = 1f
    private var minImageScale = 1f
    private var maxImageScale = 4f
    private var imageLeft = 0f
    private var imageTop = 0f
    private var defaultLeft = 0f
    private var defaultTop = 0f
    private var defaultScale = 1f
    private var lastTouchX = 0f
    private var lastTouchY = 0f
    private var isDragging = false
    private var rotationTurns = 0

    private val cropRect = RectF()
    private val imagePaint = Paint(Paint.ANTI_ALIAS_FLAG or Paint.FILTER_BITMAP_FLAG)
    private val dimPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.parseColor("#A6000000")
    }
    private val borderPaint = Paint(Paint.ANTI_ALIAS_FLAG).apply {
        color = Color.WHITE
        style = Paint.Style.STROKE
        strokeWidth = context.resources.displayMetrics.density * 2f
    }
    private val overlayPath = Path()
    private val scaleGestureDetector =
        ScaleGestureDetector(
            context,
            object : ScaleGestureDetector.SimpleOnScaleGestureListener() {
                override fun onScale(detector: ScaleGestureDetector): Boolean {
                    applyScale(detector.scaleFactor, detector.focusX, detector.focusY)
                    return true
                }
            },
        )

    fun setImageBitmap(bitmap: Bitmap) {
        this.bitmap = bitmap
        originalAspectRatio = bitmap.width.toFloat() / bitmap.height.toFloat()
        if (cropAspectRatio == null) {
            cropAspectRatio = originalAspectRatio
        }
        recalculateCropRect()
        resetTransform()
        invalidate()
    }

    fun setCropAspectRatio(ratio: Float?) {
        cropAspectRatio = ratio ?: originalAspectRatio
        recalculateCropRect()
        resetTransform()
        invalidate()
    }

    fun getCurrentCropAspectRatio(): Float? = cropAspectRatio

    fun rotateClockwise() {
        rotateBy(90f)
    }

    fun rotateCounterClockwise() {
        rotateBy(-90f)
    }

    fun resetCurrentTransform() {
        resetTransform()
        invalidate()
    }

    fun hasUserModifications(): Boolean {
        val currentRatio = cropAspectRatio
        val defaultRatio = originalAspectRatio
        val ratioChanged = currentRatio != null && defaultRatio != null && abs(currentRatio - defaultRatio) > 0.001f
        return ratioChanged ||
            rotationTurns % 4 != 0 ||
            abs(imageScale - defaultScale) > 0.01f ||
            abs(imageLeft - defaultLeft) > 1f ||
            abs(imageTop - defaultTop) > 1f
    }

    fun exportCroppedBitmap(): Bitmap {
        val source = bitmap ?: throw IllegalStateException("Bitmap is not loaded.")
        val sourceLeft = ((cropRect.left - imageLeft) / imageScale).coerceIn(0f, source.width.toFloat())
        val sourceTop = ((cropRect.top - imageTop) / imageScale).coerceIn(0f, source.height.toFloat())
        val sourceRight = ((cropRect.right - imageLeft) / imageScale).coerceIn(0f, source.width.toFloat())
        val sourceBottom = ((cropRect.bottom - imageTop) / imageScale).coerceIn(0f, source.height.toFloat())

        val cropX = sourceLeft.roundToInt().coerceIn(0, source.width - 1)
        val cropY = sourceTop.roundToInt().coerceIn(0, source.height - 1)
        val cropWidth = (sourceRight.roundToInt() - cropX).coerceAtLeast(1).coerceAtMost(source.width - cropX)
        val cropHeight = (sourceBottom.roundToInt() - cropY).coerceAtLeast(1).coerceAtMost(source.height - cropY)

        return Bitmap.createBitmap(source, cropX, cropY, cropWidth, cropHeight)
    }

    override fun onSizeChanged(w: Int, h: Int, oldw: Int, oldh: Int) {
        super.onSizeChanged(w, h, oldw, oldh)
        recalculateCropRect()
        resetTransform()
    }

    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        val source = bitmap ?: return
        canvas.drawColor(Color.BLACK)
        val drawRect = RectF(
            imageLeft,
            imageTop,
            imageLeft + source.width * imageScale,
            imageTop + source.height * imageScale,
        )
        canvas.drawBitmap(source, null, drawRect, imagePaint)
        drawCropOverlay(canvas)
    }

    override fun onTouchEvent(event: MotionEvent): Boolean {
        if (bitmap == null) {
            return false
        }
        scaleGestureDetector.onTouchEvent(event)
        when (event.actionMasked) {
            MotionEvent.ACTION_DOWN -> {
                lastTouchX = event.x
                lastTouchY = event.y
                isDragging = true
                parent?.requestDisallowInterceptTouchEvent(true)
            }

            MotionEvent.ACTION_MOVE -> {
                if (!scaleGestureDetector.isInProgress && isDragging) {
                    translateBy(event.x - lastTouchX, event.y - lastTouchY)
                    lastTouchX = event.x
                    lastTouchY = event.y
                }
            }

            MotionEvent.ACTION_UP,
            MotionEvent.ACTION_CANCEL,
            -> {
                isDragging = false
                parent?.requestDisallowInterceptTouchEvent(false)
            }
        }
        return true
    }

    private fun rotateBy(degrees: Float) {
        val source = bitmap ?: return
        val matrix = Matrix().apply { postRotate(degrees) }
        bitmap = Bitmap.createBitmap(source, 0, 0, source.width, source.height, matrix, true)
        rotationTurns += if (degrees > 0f) 1 else -1
        originalAspectRatio = bitmap!!.width.toFloat() / bitmap!!.height.toFloat()
        if (cropAspectRatio == null || abs(cropAspectRatio!! - source.width.toFloat() / source.height.toFloat()) < 0.001f) {
            cropAspectRatio = originalAspectRatio
        }
        recalculateCropRect()
        resetTransform()
        invalidate()
    }

    private fun recalculateCropRect() {
        val ratio = cropAspectRatio ?: originalAspectRatio ?: return
        if (width == 0 || height == 0) {
            return
        }
        val horizontalPadding = width * 0.08f
        val verticalPadding = height * 0.08f
        val availableWidth = width - (horizontalPadding * 2f)
        val availableHeight = height - (verticalPadding * 2f)

        val targetWidth: Float
        val targetHeight: Float
        if (availableWidth / availableHeight > ratio) {
            targetHeight = availableHeight
            targetWidth = targetHeight * ratio
        } else {
            targetWidth = availableWidth
            targetHeight = targetWidth / ratio
        }

        cropRect.set(
            (width - targetWidth) / 2f,
            (height - targetHeight) / 2f,
            (width + targetWidth) / 2f,
            (height + targetHeight) / 2f,
        )
    }

    private fun resetTransform() {
        val source = bitmap ?: return
        if (cropRect.isEmpty) {
            return
        }
        imageScale = max(cropRect.width() / source.width, cropRect.height() / source.height)
        minImageScale = imageScale
        maxImageScale = imageScale * 5f
        imageLeft = cropRect.centerX() - (source.width * imageScale) / 2f
        imageTop = cropRect.centerY() - (source.height * imageScale) / 2f
        defaultScale = imageScale
        defaultLeft = imageLeft
        defaultTop = imageTop
        constrainTranslation()
    }

    private fun applyScale(scaleFactor: Float, focusX: Float, focusY: Float) {
        val newScale = (imageScale * scaleFactor).coerceIn(minImageScale, maxImageScale)
        val appliedFactor = newScale / imageScale
        imageLeft = focusX - (focusX - imageLeft) * appliedFactor
        imageTop = focusY - (focusY - imageTop) * appliedFactor
        imageScale = newScale
        constrainTranslation()
        invalidate()
    }

    private fun translateBy(dx: Float, dy: Float) {
        imageLeft += dx
        imageTop += dy
        constrainTranslation()
        invalidate()
    }

    private fun constrainTranslation() {
        val source = bitmap ?: return
        val drawWidth = source.width * imageScale
        val drawHeight = source.height * imageScale

        imageLeft = if (drawWidth <= cropRect.width()) {
            cropRect.centerX() - drawWidth / 2f
        } else {
            imageLeft.coerceIn(cropRect.right - drawWidth, cropRect.left)
        }

        imageTop = if (drawHeight <= cropRect.height()) {
            cropRect.centerY() - drawHeight / 2f
        } else {
            imageTop.coerceIn(cropRect.bottom - drawHeight, cropRect.top)
        }
    }

    private fun drawCropOverlay(canvas: Canvas) {
        overlayPath.reset()
        overlayPath.addRect(0f, 0f, width.toFloat(), height.toFloat(), Path.Direction.CW)
        overlayPath.addRect(cropRect, Path.Direction.CCW)
        canvas.drawPath(overlayPath, dimPaint)
        canvas.drawRect(cropRect, borderPaint)
    }
}
