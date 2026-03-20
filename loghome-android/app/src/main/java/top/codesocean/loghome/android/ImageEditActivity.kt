package top.codesocean.loghome.android

import android.app.Activity
import android.content.ClipData
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.view.View
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.launch
import top.codesocean.loghome.android.databinding.ActivityImageEditBinding
import top.codesocean.loghome.android.web.ImageUploadPreparation

class ImageEditActivity : AppCompatActivity() {
    private lateinit var binding: ActivityImageEditBinding
    private lateinit var inputUri: Uri

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityImageEditBinding.inflate(layoutInflater)
        setContentView(binding.root)

        inputUri = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
            intent.getParcelableExtra(EXTRA_INPUT_URI, Uri::class.java)
        } else {
            @Suppress("DEPRECATION")
            intent.getParcelableExtra(EXTRA_INPUT_URI)
        }
            ?: run {
                finish()
                return
            }

        setupActions()
        loadImage()
    }

    private fun setupActions() {
        binding.cancelButton.setOnClickListener {
            setResult(Activity.RESULT_CANCELED)
            finish()
        }
        binding.confirmButton.setOnClickListener {
            saveEditedImage()
        }
        binding.rotateLeftButton.setOnClickListener {
            binding.editorView.rotateCounterClockwise()
        }
        binding.rotateRightButton.setOnClickListener {
            binding.editorView.rotateClockwise()
        }
        binding.resetButton.setOnClickListener {
            binding.editorView.resetCurrentTransform()
        }
        binding.aspectOriginalButton.setOnClickListener {
            binding.editorView.setCropAspectRatio(null)
            updateAspectSelection(binding.aspectOriginalButton.id)
        }
        binding.aspectSquareButton.setOnClickListener {
            binding.editorView.setCropAspectRatio(1f)
            updateAspectSelection(binding.aspectSquareButton.id)
        }
        binding.aspectFourThreeButton.setOnClickListener {
            binding.editorView.setCropAspectRatio(4f / 3f)
            updateAspectSelection(binding.aspectFourThreeButton.id)
        }
        binding.aspectSixteenNineButton.setOnClickListener {
            binding.editorView.setCropAspectRatio(16f / 9f)
            updateAspectSelection(binding.aspectSixteenNineButton.id)
        }
    }

    private fun loadImage() {
        setLoading(true)
        lifecycleScope.launch {
            runCatching {
                ImageUploadPreparation.loadEditableBitmap(this@ImageEditActivity, inputUri)
            }.onSuccess { bitmap ->
                binding.editorView.setImageBitmap(bitmap)
                updateAspectSelection(binding.aspectOriginalButton.id)
                setLoading(false)
            }.onFailure { error ->
                setLoading(false)
                Snackbar.make(binding.root, "加载图片失败: ${error.message}", Snackbar.LENGTH_LONG).show()
                setResult(Activity.RESULT_CANCELED)
                finish()
            }
        }
    }

    private fun saveEditedImage() {
        setLoading(true)
        binding.confirmButton.isEnabled = false
        lifecycleScope.launch {
            runCatching {
                val keepOriginal = binding.originalCheckbox.isChecked
                val wasModified = binding.editorView.hasUserModifications()
                val outputUri =
                    if (keepOriginal && !wasModified) {
                        inputUri
                    } else {
                        val cropped = binding.editorView.exportCroppedBitmap()
                        ImageUploadPreparation.writeEditedBitmapForUpload(
                            context = this@ImageEditActivity,
                            bitmap = cropped,
                            preserveQuality = keepOriginal,
                        )
                    }
                outputUri to wasModified
            }.onSuccess { (outputUri, wasModified) ->
                setResult(
                    Activity.RESULT_OK,
                    Intent().apply {
                        data = outputUri
                        flags = Intent.FLAG_GRANT_READ_URI_PERMISSION
                        putExtra(EXTRA_WAS_MODIFIED, wasModified)
                    },
                )
                finish()
            }.onFailure { error ->
                setLoading(false)
                binding.confirmButton.isEnabled = true
                Snackbar.make(binding.root, "处理图片失败: ${error.message}", Snackbar.LENGTH_LONG).show()
            }
        }
    }

    private fun setLoading(loading: Boolean) {
        binding.loadingView.visibility = if (loading) View.VISIBLE else View.GONE
        binding.confirmButton.isEnabled = !loading
        binding.cancelButton.isEnabled = !loading
    }

    private fun updateAspectSelection(checkedId: Int) {
        binding.aspectOriginalButton.isChecked = checkedId == binding.aspectOriginalButton.id
        binding.aspectSquareButton.isChecked = checkedId == binding.aspectSquareButton.id
        binding.aspectFourThreeButton.isChecked = checkedId == binding.aspectFourThreeButton.id
        binding.aspectSixteenNineButton.isChecked = checkedId == binding.aspectSixteenNineButton.id
    }

    companion object {
        private const val EXTRA_INPUT_URI = "extra_input_uri"
        const val EXTRA_WAS_MODIFIED = "extra_was_modified"

        fun createIntent(context: Context, inputUri: Uri): Intent {
            return Intent(context, ImageEditActivity::class.java).apply {
                data = inputUri
                clipData = ClipData.newUri(context.contentResolver, "selected-image", inputUri)
                putExtra(EXTRA_INPUT_URI, inputUri)
                addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            }
        }
    }
}
