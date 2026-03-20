package top.codesocean.loghome.android

import android.content.Intent
import android.graphics.Color
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.updatePadding
import androidx.lifecycle.lifecycleScope
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.async
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import top.codesocean.loghome.android.assets.AssetRepository
import top.codesocean.loghome.android.databinding.ActivitySplashBinding
import top.codesocean.loghome.android.ui.SystemUiHelper
import top.codesocean.loghome.android.ui.SplashImageLoader

class SplashActivity : AppCompatActivity() {
    private lateinit var binding: ActivitySplashBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivitySplashBinding.inflate(layoutInflater)
        setContentView(binding.root)

        WindowCompat.setDecorFitsSystemWindows(window, false)
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { _, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            binding.root.updatePadding(top = bars.top, bottom = bars.bottom)
            insets
        }
        SystemUiHelper.applySystemBarStyle(window, binding.root, Color.WHITE, forceDarkIcons = true)
        loadSplashImage()

        initializeApp()
    }

    private fun loadSplashImage() {
        lifecycleScope.launch {
            val bitmap = SplashImageLoader.decode(this@SplashActivity)

            if (!isFinishing && !isDestroyed && bitmap != null) {
                binding.splashImage.setImageBitmap(bitmap)
            }
        }
    }

    private fun initializeApp() {
        lifecycleScope.launch {
            runCatching {
                if (WebViewActivity.isDevServerEnabled()) {
                    delay(3_000)
                    ""
                } else {
                    val assetDeferred = async { AssetRepository.prepareAssets(this@SplashActivity) }
                    delay(3_000)
                    assetDeferred.await()
                }
            }.onSuccess { localPath ->
                startActivity(
                    Intent(this@SplashActivity, WebViewActivity::class.java)
                        .putExtra(WebViewActivity.EXTRA_LOCAL_PATH, localPath),
                )
                @Suppress("DEPRECATION")
                overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
                finish()
            }.onFailure {
                Snackbar.make(binding.root, R.string.init_failed, Snackbar.LENGTH_INDEFINITE)
                    .setAction(R.string.retry) { initializeApp() }
                    .show()
            }
        }
    }
}
