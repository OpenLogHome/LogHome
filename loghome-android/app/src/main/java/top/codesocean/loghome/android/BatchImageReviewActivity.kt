package top.codesocean.loghome.android

import android.app.Activity
import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import android.widget.GridLayout
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.isVisible
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch
import top.codesocean.loghome.android.databinding.ActivityBatchImageReviewBinding
import top.codesocean.loghome.android.databinding.ItemBatchImageBinding
import top.codesocean.loghome.android.web.ImageUploadPreparation

class BatchImageReviewActivity : AppCompatActivity() {
    private lateinit var binding: ActivityBatchImageReviewBinding
    private val reviewItems = mutableListOf<ReviewItem>()
    private var editingIndex = -1

    private val imageEditLauncher =
        registerForActivityResult(androidx.activity.result.contract.ActivityResultContracts.StartActivityForResult()) { result ->
            val index = editingIndex
            editingIndex = -1
            if (index !in reviewItems.indices || result.resultCode != RESULT_OK) {
                return@registerForActivityResult
            }
            val outputUri = result.data?.data ?: return@registerForActivityResult
            val wasModified = result.data?.getBooleanExtra(ImageEditActivity.EXTRA_WAS_MODIFIED, false) == true
            reviewItems[index] = reviewItems[index].copy(
                workingUri = outputUri,
                edited = wasModified || outputUri != reviewItems[index].originalUri,
            )
            renderItems()
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBatchImageReviewBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val inputUris = getInputUris(intent)
        if (inputUris.isEmpty()) {
            setResult(Activity.RESULT_CANCELED)
            finish()
            return
        }

        reviewItems += inputUris.map { uri -> ReviewItem(originalUri = uri, workingUri = uri) }
        setupActions()
        renderItems()
    }

    private fun setupActions() {
        binding.cancelButton.setOnClickListener {
            setResult(Activity.RESULT_CANCELED)
            finish()
        }
        binding.confirmButton.setOnClickListener {
            finishWithPreparedUris()
        }
    }

    private fun renderItems() {
        binding.imageGrid.removeAllViews()
        reviewItems.forEachIndexed { index, item ->
            val itemBinding = ItemBatchImageBinding.inflate(layoutInflater, binding.imageGrid, false)
            itemBinding.root.setOnClickListener {
                editingIndex = index
                imageEditLauncher.launch(ImageEditActivity.createIntent(this, item.workingUri))
            }
            itemBinding.indexLabel.text = (index + 1).toString()
            itemBinding.editedBadge.isVisible = item.edited
            lifecycleScope.launch {
                runCatching {
                    ImageUploadPreparation.loadThumbnailBitmap(
                        context = this@BatchImageReviewActivity,
                        imageUri = item.workingUri,
                        maxDimension = 720,
                    )
                }.onSuccess { bitmap ->
                    itemBinding.thumbnail.setImageBitmap(bitmap)
                }.onFailure {
                    itemBinding.thumbnail.setImageURI(item.workingUri)
                }
            }

            val margin = (resources.displayMetrics.density * 6f).toInt()
            val params = GridLayout.LayoutParams().apply {
                width = 0
                height = resources.getDimensionPixelSize(R.dimen.batch_image_tile_height)
                columnSpec = GridLayout.spec(GridLayout.UNDEFINED, 1f)
                setMargins(margin, margin, margin, margin)
            }
            binding.imageGrid.addView(itemBinding.root, params)
        }
    }

    private fun finishWithPreparedUris() {
        setLoading(true)
        lifecycleScope.launch {
            runCatching {
                val keepOriginal = binding.keepOriginalCheckbox.isChecked
                reviewItems.map { item ->
                    when {
                        keepOriginal && !item.edited -> item.originalUri
                        keepOriginal -> item.workingUri
                        else -> ImageUploadPreparation.prepareImageForUpload(
                            context = this@BatchImageReviewActivity,
                            imageUri = item.workingUri,
                            keepOriginal = false,
                        )
                    }
                }
            }.onSuccess { outputUris ->
                setResult(Activity.RESULT_OK, createResultIntent(outputUris))
                finish()
            }.onFailure { error ->
                setLoading(false)
                Snackbar.make(
                    binding.root,
                    "处理图片失败: ${error.message ?: "未知错误"}",
                    Snackbar.LENGTH_LONG,
                ).show()
            }
        }
    }

    private fun setLoading(loading: Boolean) {
        binding.loadingView.visibility = if (loading) View.VISIBLE else View.GONE
        binding.confirmButton.isEnabled = !loading
        binding.cancelButton.isEnabled = !loading
        binding.keepOriginalCheckbox.isEnabled = !loading
    }

    private fun createResultIntent(uris: List<Uri>): Intent {
        return Intent().apply {
            if (uris.isNotEmpty()) {
                data = uris.first()
                clipData = ClipData.newUri(contentResolver, "reviewed-image", uris.first()).also { clip ->
                    uris.drop(1).forEach { uri ->
                        clip.addItem(ClipData.Item(uri))
                    }
                }
            }
            addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
        }
    }

    private fun getInputUris(intent: Intent): List<Uri> {
        val extraUris =
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                intent.getParcelableArrayListExtra(EXTRA_INPUT_URIS, Uri::class.java)
            } else {
                @Suppress("DEPRECATION")
                intent.getParcelableArrayListExtra(EXTRA_INPUT_URIS)
            }
        val result = linkedSetOf<Uri>()
        extraUris?.let(result::addAll)
        intent.data?.let(result::add)
        intent.clipData?.let { clipData ->
            for (index in 0 until clipData.itemCount) {
                clipData.getItemAt(index)?.uri?.let(result::add)
            }
        }
        return result.toList()
    }

    data class ReviewItem(
        val originalUri: Uri,
        val workingUri: Uri,
        val edited: Boolean = false,
    )

    companion object {
        private const val EXTRA_INPUT_URIS = "extra_input_uris"

        fun createIntent(context: Context, uris: Array<Uri>): Intent {
            val uriList = ArrayList(uris.toList())
            return Intent(context, BatchImageReviewActivity::class.java).apply {
                putParcelableArrayListExtra(EXTRA_INPUT_URIS, uriList)
                if (uriList.isNotEmpty()) {
                    data = uriList.first()
                    clipData = ClipData.newUri(context.contentResolver, "selected-images", uriList.first()).also { clip ->
                        uriList.drop(1).forEach { uri ->
                            clip.addItem(ClipData.Item(uri))
                        }
                    }
                }
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
        }
    }
}
