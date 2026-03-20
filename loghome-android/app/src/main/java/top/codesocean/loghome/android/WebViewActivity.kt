package top.codesocean.loghome.android

import android.Manifest
import android.annotation.SuppressLint
import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.ClipData
import android.content.ClipboardManager
import android.content.ComponentName
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.ServiceConnection
import android.content.pm.PackageManager
import android.graphics.Color
import android.net.Uri
import android.os.BatteryManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.util.Log
import android.view.KeyEvent
import android.webkit.ConsoleMessage
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.OnBackPressedCallback
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import androidx.core.view.ViewCompat
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.core.view.isVisible
import androidx.core.view.updatePadding
import androidx.lifecycle.lifecycleScope
import com.google.android.material.dialog.MaterialAlertDialogBuilder
import com.google.android.material.snackbar.Snackbar
import kotlinx.coroutines.CancellableContinuation
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import top.codesocean.loghome.android.assets.AssetRepository
import top.codesocean.loghome.android.audio.AudioPlaybackService
import top.codesocean.loghome.android.databinding.ActivityWebviewBinding
import top.codesocean.loghome.android.databinding.DialogHotUpdateBinding
import top.codesocean.loghome.android.ui.SystemUiHelper
import top.codesocean.loghome.android.ui.SplashImageLoader
import top.codesocean.loghome.android.web.InjectedHtmlWebViewClient
import top.codesocean.loghome.android.web.ImageUploadPreparation
import top.codesocean.loghome.android.web.InjectedScriptBuilder
import top.codesocean.loghome.android.web.WebViewImageSaver
import top.codesocean.loghome.android.web.WebViewBridgeInterface
import top.codesocean.loghome.android.web.WebViewFontCache
import java.io.File
import kotlin.coroutines.resume

class WebViewActivity : AppCompatActivity() {
    private lateinit var binding: ActivityWebviewBinding

    private var localPath: String = ""
    private var currentSystemBarColor: Int = Color.WHITE
    private var volumeKeyEnabled = false
    private var topInsetCss = 0.0
    private var bottomInsetCss = 0.0
    private var lastBackPressedAt = 0L
    private var injectedScript: String? = null
    private var pendingRestart = false
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private var pendingImageDownloadUrl: String? = null
    private var pendingMultipleImageUris: Array<Uri>? = null
    private var pendingChooserPrefersImages = false
    private var pendingChooserAllowsMultiple = false

    private var audioService: AudioPlaybackService? = null
    private var isAudioServiceBound = false
    private val serviceWaiters = mutableListOf<CancellableContinuation<AudioPlaybackService>>()

    private val notificationPermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            if (!granted && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
                Snackbar.make(binding.root, R.string.grant_notification_permission, Snackbar.LENGTH_LONG)
                    .show()
            }
        }

    private val imageSavePermissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { granted ->
            val imageUrl = pendingImageDownloadUrl
            pendingImageDownloadUrl = null
            if (!granted) {
                Snackbar.make(binding.root, "需要存储权限才能保存图片", Snackbar.LENGTH_LONG).show()
                return@registerForActivityResult
            }
            if (!imageUrl.isNullOrBlank()) {
                downloadImageWithWatermark(imageUrl)
            }
        }

    private val fileChooserLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val callback = fileChooserCallback ?: return@registerForActivityResult
            val uris = extractChooserUris(result.resultCode, result.data)
            val shouldTreatAsImages = pendingChooserPrefersImages
            val allowsMultiple = pendingChooserAllowsMultiple
            pendingChooserPrefersImages = false
            pendingChooserAllowsMultiple = false
            Log.d(
                "LogHomeFileChooser",
                "resultCode=${result.resultCode}, uris=${uris?.joinToString()}, " +
                    "shouldTreatAsImages=$shouldTreatAsImages, allowsMultiple=$allowsMultiple",
            )
            if (uris.isNullOrEmpty()) {
                fileChooserCallback = null
                callback.onReceiveValue(null)
                return@registerForActivityResult
            }
            if (!allowsMultiple && (shouldTreatAsImages || uris.all(::isImageUri))) {
                if (uris.size == 1) {
                    binding.root.post {
                        runCatching {
                            imageEditLauncher.launch(ImageEditActivity.createIntent(this, uris.first()))
                        }.onFailure { error ->
                            fileChooserCallback = null
                            callback.onReceiveValue(null)
                            Snackbar.make(
                                binding.root,
                                "无法打开图片编辑器: ${error.message ?: "未知错误"}",
                                Snackbar.LENGTH_LONG,
                            ).show()
                        }
                    }
                }
                return@registerForActivityResult
            }
            if (allowsMultiple && (shouldTreatAsImages || uris.all(::isImageUri))) {
                pendingMultipleImageUris = uris
                    binding.root.post {
                        runCatching {
                            batchImageReviewLauncher.launch(BatchImageReviewActivity.createIntent(this, uris))
                        }.onFailure { error ->
                            fileChooserCallback = null
                            callback.onReceiveValue(null)
                            Snackbar.make(
                                binding.root,
                                "无法打开多图编辑页: ${error.message ?: "未知错误"}",
                                Snackbar.LENGTH_LONG,
                            ).show()
                        }
                    }
                return@registerForActivityResult
            }
            fileChooserCallback = null
            callback.onReceiveValue(uris)
        }

    private val imageEditLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val callback = fileChooserCallback ?: return@registerForActivityResult
            fileChooserCallback = null
            pendingMultipleImageUris = null
            if (result.resultCode != RESULT_OK) {
                callback.onReceiveValue(null)
                return@registerForActivityResult
            }
            val outputUri = result.data?.data
            callback.onReceiveValue(outputUri?.let { arrayOf(it) })
        }

    private val batchImageReviewLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val callback = fileChooserCallback ?: return@registerForActivityResult
            fileChooserCallback = null
            pendingMultipleImageUris = null
            if (result.resultCode != RESULT_OK) {
                callback.onReceiveValue(null)
                return@registerForActivityResult
            }
            callback.onReceiveValue(extractChooserUris(result.resultCode, result.data))
        }

    private val audioServiceConnection = object : ServiceConnection {
        override fun onServiceConnected(name: ComponentName?, service: IBinder?) {
            val binder = service as? AudioPlaybackService.LocalBinder ?: return
            audioService = binder.getService()
            val pending = serviceWaiters.toList()
            serviceWaiters.clear()
            pending.forEach { continuation ->
                if (continuation.isActive) {
                    continuation.resume(audioService!!)
                }
            }
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            audioService = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityWebviewBinding.inflate(layoutInflater)
        setContentView(binding.root)

        localPath = intent.getStringExtra(EXTRA_LOCAL_PATH).orEmpty()

        WindowCompat.setDecorFitsSystemWindows(window, true)
        setupWindowInsets()
        setupBackHandling()
        setupRetry()
        setupWebView()
        loadSplashOverlayImage()
        ensureNotificationPermission()
        bindAudioService()
        applySystemBarStyle(Color.WHITE)

        if (localPath.isBlank() && !isDevServerEnabled()) {
            restartToSplash()
            return
        }

        binding.root.post {
            lifecycleScope.launch {
                rebuildInjectedScript()
                loadLocalContent()
            }
        }
    }

    override fun onDestroy() {
        fileChooserCallback?.onReceiveValue(null)
        fileChooserCallback = null
        pendingMultipleImageUris = null
        if (isAudioServiceBound) {
            unbindService(audioServiceConnection)
            isAudioServiceBound = false
        }
        audioService = null
        binding.webView.destroy()
        super.onDestroy()
    }

    override fun dispatchKeyEvent(event: KeyEvent): Boolean {
        if (volumeKeyEnabled && event.action == KeyEvent.ACTION_DOWN) {
            when (event.keyCode) {
                KeyEvent.KEYCODE_VOLUME_UP -> {
                    dispatchVolumeKeyEvent("up")
                    return true
                }

                KeyEvent.KEYCODE_VOLUME_DOWN -> {
                    dispatchVolumeKeyEvent("down")
                    return true
                }
            }
        }
        return super.dispatchKeyEvent(event)
    }

    private fun setupWindowInsets() {
        ViewCompat.setOnApplyWindowInsetsListener(binding.root) { _, insets ->
            val bars = insets.getInsets(WindowInsetsCompat.Type.systemBars())
            val density = resources.displayMetrics.density.toDouble()

            topInsetCss = minOf(bars.top / density, 29.0)
            bottomInsetCss = bars.bottom / density

            insets
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Suppress("DEPRECATION")
    private fun setupWebView() {
        binding.webView.apply {
            alpha = 0f
            settings.javaScriptEnabled = true
            settings.domStorageEnabled = true
            settings.allowFileAccess = true
            settings.allowContentAccess = true
            settings.allowFileAccessFromFileURLs = true
            settings.allowUniversalAccessFromFileURLs = true
            settings.builtInZoomControls = false
            settings.displayZoomControls = false
            settings.setSupportZoom(false)
            settings.mediaPlaybackRequiresUserGesture = false
            isVerticalScrollBarEnabled = false
            isHorizontalScrollBarEnabled = false
            overScrollMode = android.view.View.OVER_SCROLL_NEVER
            isLongClickable = true
            addJavascriptInterface(WebViewBridgeInterface(::handleBridgeMessage), "LogHomeBridge")
            webViewClient = InjectedHtmlWebViewClient(
                context = this@WebViewActivity,
                injectedScriptProvider = { injectedScript.orEmpty() },
                onPageLoadingChanged = { loading ->
                    binding.loadingContainer.post {
                        if (loading) {
                            if (binding.loadingContainer.isVisible) {
                                binding.webView.alpha = 0f
                            }
                            binding.errorContainer.isVisible = false
                        } else if (binding.loadingContainer.isVisible) {
                            revealWebViewContent()
                        }
                    }
                },
                onPageError = { errorText ->
                    binding.root.post { showError(errorText) }
                },
                onMissingLocalResource = {
                    binding.root.post { verifyLocalResourcePath(showMessage = true) }
                },
            )
            webChromeClient = object : WebChromeClient() {
                override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                    Log.d("LogHomeWebView", consoleMessage.message())
                    return super.onConsoleMessage(consoleMessage)
                }

                override fun onShowFileChooser(
                    webView: android.webkit.WebView?,
                    filePathCallback: ValueCallback<Array<Uri>>?,
                    fileChooserParams: FileChooserParams?,
                ): Boolean {
                    if (filePathCallback == null || fileChooserParams == null) {
                        return false
                    }
                    fileChooserCallback?.onReceiveValue(null)
                    fileChooserCallback = filePathCallback
                    pendingChooserPrefersImages = fileChooserParams.acceptTypes.any {
                        it?.contains("image", ignoreCase = true) == true
                    }
                    pendingChooserAllowsMultiple =
                        fileChooserParams.mode == FileChooserParams.MODE_OPEN_MULTIPLE
                    Log.d(
                        "LogHomeFileChooser",
                        "showFileChooser mode=${fileChooserParams.mode}, " +
                            "acceptTypes=${fileChooserParams.acceptTypes.joinToString()}, " +
                            "allowsMultiple=$pendingChooserAllowsMultiple, " +
                            "prefersImages=$pendingChooserPrefersImages",
                    )
                    val chooserIntent = try {
                        fileChooserParams.createIntent()
                    } catch (error: ActivityNotFoundException) {
                        fileChooserCallback = null
                        pendingChooserPrefersImages = false
                        pendingChooserAllowsMultiple = false
                        Snackbar.make(
                            binding.root,
                            "Cannot open file picker: ${error.message}",
                            Snackbar.LENGTH_LONG,
                        ).show()
                        return false
                    }
                    return try {
                        fileChooserLauncher.launch(chooserIntent)
                        true
                    } catch (error: ActivityNotFoundException) {
                        fileChooserCallback?.onReceiveValue(null)
                        fileChooserCallback = null
                        pendingChooserPrefersImages = false
                        pendingChooserAllowsMultiple = false
                        Snackbar.make(
                            binding.root,
                            "Cannot open file picker: ${error.message}",
                            Snackbar.LENGTH_LONG,
                        ).show()
                        false
                    }
                }
            }
            setOnLongClickListener {
                val hitTestResult = hitTestResult
                val imageUrl = when (hitTestResult.type) {
                    android.webkit.WebView.HitTestResult.IMAGE_TYPE,
                    android.webkit.WebView.HitTestResult.SRC_IMAGE_ANCHOR_TYPE,
                    -> hitTestResult.extra

                    else -> null
                }?.trim().orEmpty()

                if (imageUrl.isBlank()) {
                    return@setOnLongClickListener false
                }

                showImageLongPressMenu(imageUrl)
                true
            }
        }
    }

    private fun showImageLongPressMenu(imageUrl: String) {
        MaterialAlertDialogBuilder(this)
            .setItems(arrayOf("下载到本地")) { _, which ->
                if (which == 0) {
                    requestImageDownload(imageUrl)
                }
            }
            .show()
    }

    private fun showMultiImageUploadOptions() {
        MaterialAlertDialogBuilder(this)
            .setTitle("图片上传")
            .setMessage("多图上传不支持逐张裁剪，可选择默认压缩上传，或按原图上传。")
            .setNegativeButton("取消") { _, _ ->
                fileChooserCallback?.onReceiveValue(null)
                fileChooserCallback = null
                pendingMultipleImageUris = null
            }
            .setNeutralButton("原图") { _, _ ->
                completeMultipleImageUpload(keepOriginal = true)
            }
            .setPositiveButton("压缩上传") { _, _ ->
                completeMultipleImageUpload(keepOriginal = false)
            }
            .show()
    }

    private fun completeMultipleImageUpload(keepOriginal: Boolean) {
        val callback = fileChooserCallback ?: return
        val uris = pendingMultipleImageUris
        pendingMultipleImageUris = null
        if (uris.isNullOrEmpty()) {
            fileChooserCallback = null
            callback.onReceiveValue(null)
            return
        }
        if (keepOriginal) {
            fileChooserCallback = null
            callback.onReceiveValue(uris)
            return
        }

        val progressSnackbar = Snackbar.make(binding.root, "正在处理图片...", Snackbar.LENGTH_INDEFINITE)
        progressSnackbar.show()
        lifecycleScope.launch {
            runCatching {
                uris.map { uri ->
                    ImageUploadPreparation.prepareImageForUpload(
                        context = this@WebViewActivity,
                        imageUri = uri,
                        keepOriginal = false,
                    )
                }.toTypedArray()
            }.onSuccess { processedUris ->
                progressSnackbar.dismiss()
                fileChooserCallback = null
                callback.onReceiveValue(processedUris)
            }.onFailure { error ->
                progressSnackbar.dismiss()
                fileChooserCallback = null
                callback.onReceiveValue(null)
                Snackbar.make(
                    binding.root,
                    "处理图片失败: ${error.message ?: "未知错误"}",
                    Snackbar.LENGTH_LONG,
                ).show()
            }
        }
    }

    private fun requestImageDownload(imageUrl: String) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.Q &&
            ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE) !=
            PackageManager.PERMISSION_GRANTED
        ) {
            pendingImageDownloadUrl = imageUrl
            imageSavePermissionLauncher.launch(Manifest.permission.WRITE_EXTERNAL_STORAGE)
            return
        }
        downloadImageWithWatermark(imageUrl)
    }

    private fun downloadImageWithWatermark(imageUrl: String) {
        val progressSnackbar = Snackbar.make(binding.root, "正在保存图片...", Snackbar.LENGTH_INDEFINITE)
        progressSnackbar.show()
        lifecycleScope.launch {
            runCatching {
                WebViewImageSaver.saveWatermarkedImage(
                    context = this@WebViewActivity,
                    imageUrl = imageUrl,
                    currentPageUrl = binding.webView.url,
                    userAgent = binding.webView.settings.userAgentString,
                )
            }.onSuccess {
                progressSnackbar.dismiss()
                Snackbar.make(binding.root, "已保存到本地相册", Snackbar.LENGTH_LONG).show()
            }.onFailure { error ->
                progressSnackbar.dismiss()
                Snackbar.make(
                    binding.root,
                    "保存失败: ${error.message ?: "未知错误"}",
                    Snackbar.LENGTH_LONG,
                ).show()
            }
        }
    }

    private fun loadSplashOverlayImage() {
        lifecycleScope.launch {
            val bitmap = SplashImageLoader.decode(this@WebViewActivity)
            if (!isFinishing && !isDestroyed && bitmap != null) {
                binding.loadingSplashImage.setImageBitmap(bitmap)
            }
        }
    }

    private fun setupRetry() {
        binding.retryButton.setOnClickListener {
            lifecycleScope.launch {
                binding.errorContainer.isVisible = false
                rebuildInjectedScript()
                loadLocalContent()
            }
        }
    }

    private fun setupBackHandling() {
        onBackPressedDispatcher.addCallback(
            this,
            object : OnBackPressedCallback(true) {
                override fun handleOnBackPressed() {
                    if (binding.webView.canGoBack()) {
                        binding.webView.goBack()
                        return
                    }

                    val now = System.currentTimeMillis()
                    if (now - lastBackPressedAt > 2_000) {
                        lastBackPressedAt = now
                        Snackbar.make(binding.root, R.string.press_again_exit, Snackbar.LENGTH_SHORT)
                            .show()
                    } else {
                        finish()
                    }
                }
            },
        )
    }

    private fun bindAudioService() {
        val serviceIntent = Intent(this, AudioPlaybackService::class.java)
        startService(serviceIntent)
        isAudioServiceBound = bindService(
            serviceIntent,
            audioServiceConnection,
            Context.BIND_AUTO_CREATE,
        )
    }

    private suspend fun rebuildInjectedScript() {
        injectedScript = InjectedScriptBuilder.build(
            context = this,
            statusBarHeightDp = topInsetCss,
            navigationBarHeightDp = bottomInsetCss,
            assetVersion = AssetRepository.getCurrentAssetVersion(this),
        )
    }

    private suspend fun loadLocalContent() {
        if (!verifyLocalResourcePath(showMessage = false)) {
            return
        }

        showLoadingOverlay()
        binding.errorContainer.isVisible = false
        binding.webView.loadUrl(resolveEntryUrl(localPath))
        applySystemBarStyle(currentSystemBarColor)
    }

    private fun verifyLocalResourcePath(showMessage: Boolean): Boolean {
        if (isDevServerEnabled()) {
            return true
        }

        if (pendingRestart) {
            return false
        }

        val exists = File(localPath).exists()
        if (exists) {
            return true
        }

        if (showMessage) {
            Snackbar.make(binding.root, R.string.resource_missing, Snackbar.LENGTH_LONG).show()
        }
        pendingRestart = true
        lifecycleScope.launch {
            delay(3_000)
            restartToSplash()
        }
        return false
    }

    private fun ensureNotificationPermission() {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.TIRAMISU) {
            return
        }
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.POST_NOTIFICATIONS) ==
            PackageManager.PERMISSION_GRANTED
        ) {
            return
        }
        notificationPermissionLauncher.launch(Manifest.permission.POST_NOTIFICATIONS)
    }

    private fun restartToSplash() {
        startActivity(
            Intent(this, SplashActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TASK or
                    Intent.FLAG_ACTIVITY_CLEAR_TOP
            },
        )
        finish()
    }

    private fun showError(message: String) {
        binding.loadingContainer.animate().cancel()
        binding.webView.animate().cancel()
        binding.webView.alpha = 1f
        binding.loadingContainer.isVisible = false
        binding.errorContainer.isVisible = true
        binding.errorText.text = getString(R.string.load_failed) + ": " + message
    }

    private fun showLoadingOverlay() {
        binding.loadingContainer.animate().cancel()
        binding.webView.animate().cancel()
        binding.loadingContainer.alpha = 1f
        binding.loadingContainer.isVisible = true
        binding.webView.alpha = 0f
    }

    private fun revealWebViewContent() {
        binding.loadingContainer.animate().cancel()
        binding.webView.animate().cancel()
        binding.webView.animate()
            .alpha(1f)
            .setDuration(180)
            .start()
        binding.loadingContainer.animate()
            .alpha(0f)
            .setDuration(180)
            .withEndAction {
                binding.loadingContainer.isVisible = false
                binding.loadingContainer.alpha = 1f
            }
            .start()
    }

    private fun handleBridgeMessage(rawMessage: String) {
        lifecycleScope.launch {
            val call = runCatching { JSONObject(rawMessage) }.getOrElse { return@launch }
            val callId = call.optString("id")
            val name = call.optString("name")
            val args = call.optJSONArray("args") ?: JSONArray()

            runCatching {
                dispatchBridgeCall(name, args)
            }.onSuccess { result ->
                resolveBridgeCall(callId, result)
            }.onFailure { error ->
                Log.e(TAG, "Bridge call failed: name=$name, args=${args}", error)
                rejectBridgeCall(callId, "bridge[$name] failed: ${error.message ?: "Unknown bridge error"}")
            }
        }
    }

    private suspend fun dispatchBridgeCall(name: String, args: JSONArray): Any? {
        return when (name) {
            "setNavigationBarVisible" -> {
                val visible = if (args.length() > 0) args.getBoolean(0) else true
                setNavigationBarVisible(visible)
                true
            }

            "setStatusBarStyle" -> {
                val colorValue = args.optString(0)
                applySystemBarStyle(SystemUiHelper.parseColorOrFallback(colorValue))
                true
            }

            "getBatteryLevel" -> getBatteryLevel()
            "getBatteryState" -> getBatteryState()

            "enableVolumeKeyListener" -> {
                volumeKeyEnabled = true
                true
            }

            "disableVolumeKeyListener" -> {
                volumeKeyEnabled = false
                true
            }

            "openInBrowser" -> openInBrowser(args.optString(0))

            "hotUpdateAssets" -> {
                val url = args.optString(0)
                val version = args.optString(1)
                runHotUpdate(url, version)
            }

            "replacePlaylist" -> {
                val articleIds = mutableListOf<String>()
                val listArg = args.opt(0) as? JSONArray
                if (listArg != null) {
                    for (index in 0 until listArg.length()) {
                        articleIds += listArg.optString(index)
                    }
                }
                val startArticleId = args.opt(1)?.takeUnless { it == JSONObject.NULL }?.toString()
                requireAudioService().replacePlaylist(articleIds, startArticleId)
                true
            }

            "playAudio" -> {
                requireAudioService().play()
                true
            }

            "pauseAudio" -> {
                requireAudioService().pause()
                true
            }

            "getPlaybackProgress" -> requireAudioService().getProgressJson()
            "getAvailableVoices" -> requireAudioService().getAvailableVoicesJson()

            "setVoice" -> {
                requireAudioService().setVoice(args.optString(0))
                true
            }

            "jumpToArticleParagraph" -> {
                requireAudioService().jumpToArticleParagraph(
                    articleId = args.optString(0),
                    paragraphId = args.optString(1),
                )
            }

            "copyToClipboard" -> {
                copyToClipboard(args.optString(0))
                true
            }

            "getClipboardData" -> getClipboardData()
            "downloadFont" -> withContext(Dispatchers.IO) {
                Log.d(
                    TAG,
                    "downloadFont request key=${args.optString(0)}, url=${args.optString(1)}, format=${args.optString(2)}, version=${args.optString(3)}",
                )
                WebViewFontCache.ensureFont(
                    context = this@WebViewActivity,
                    fontKey = args.optString(0),
                    fontUrl = args.optString(1),
                    fontFormat = args.optString(2),
                    fontVersion = args.optString(3),
                )
            }
            else -> throw IllegalArgumentException("Unknown bridge handler: $name")
        }
    }

    private fun setNavigationBarVisible(visible: Boolean) {
        val controller = WindowInsetsControllerCompat(window, binding.root)
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        applySystemBarStyle(currentSystemBarColor)
        if (visible) {
            controller.show(WindowInsetsCompat.Type.systemBars())
        } else {
            controller.hide(WindowInsetsCompat.Type.systemBars())
        }
    }

    private fun applySystemBarStyle(color: Int) {
        currentSystemBarColor = color
        SystemUiHelper.applySystemBarStyle(window, binding.root, color)
        binding.webView.setBackgroundColor(color)
        binding.loadingContainer.setBackgroundColor(color)
        binding.errorContainer.setBackgroundColor(color)
    }

    private fun resolveBridgeCall(callId: String, value: Any?) {
        val script = "window.__logHomeNativeBridge?.resolve(${JSONObject.quote(callId)}, ${toJavaScriptLiteral(value)});"
        binding.webView.post {
            binding.webView.evaluateJavascript(script, null)
        }
    }

    private fun rejectBridgeCall(callId: String, errorMessage: String) {
        val script =
            "window.__logHomeNativeBridge?.reject(${JSONObject.quote(callId)}, ${JSONObject.quote(errorMessage)});"
        binding.webView.post {
            binding.webView.evaluateJavascript(script, null)
        }
    }

    private fun toJavaScriptLiteral(value: Any?): String {
        return when (value) {
            null -> "null"
            is String -> JSONObject.quote(value)
            is Boolean, is Number -> value.toString()
            is JSONObject, is JSONArray -> value.toString()
            else -> JSONObject.wrap(value)?.toString() ?: "null"
        }
    }

    private fun dispatchVolumeKeyEvent(direction: String) {
        val script =
            "window.dispatchEvent(new CustomEvent('volumeKeyPress', { detail: ${JSONObject.quote(direction)} }));"
        binding.webView.evaluateJavascript(script, null)
    }

    private suspend fun runHotUpdate(url: String, newVersion: String): Boolean {
        val dialogBinding = DialogHotUpdateBinding.inflate(layoutInflater)
        val dialog = MaterialAlertDialogBuilder(this)
            .setTitle(R.string.hot_update_title)
            .setView(dialogBinding.root)
            .setCancelable(false)
            .create()

        dialog.show()
        return runCatching {
            AssetRepository.hotUpdateAssets(this, url, newVersion) { progress, status ->
                dialogBinding.root.post {
                    dialogBinding.progressBar.progress = (progress * 1000).toInt()
                    dialogBinding.progressPercent.text = String.format("%.1f%%", progress * 100)
                    dialogBinding.progressStatus.text = when (status) {
                        "downloading" -> "下载资源包中... ${String.format("%.1f%%", progress * 100)}"
                        "extracting" -> "解压资源包中... ${String.format("%.1f%%", progress * 100)}"
                        "validating" -> "校验资源包中..."
                        "completed" -> "更新完成，准备重启应用..."
                        "failed" -> "更新失败，请尝试重新更新"
                        else -> getString(R.string.hot_update_prepare)
                    }
                    dialog.setTitle(
                        when (status) {
                            "downloading" -> getString(R.string.download_updating)
                            "extracting" -> getString(R.string.extract_updating)
                            "validating" -> getString(R.string.hot_update_title)
                            "completed" -> getString(R.string.update_complete)
                            else -> getString(R.string.hot_update_title)
                        },
                    )
                }
            }
            delay(1_000)
            dialog.dismiss()
            restartToSplash()
            true
        }.getOrElse { error ->
            dialog.dismiss()
            Snackbar.make(
                binding.root,
                getString(R.string.hot_update_failed) + ": ${error.message}",
                Snackbar.LENGTH_LONG,
            ).show()
            false
        }
    }

    private fun getBatteryLevel(): Int {
        val batteryManager = getSystemService(BATTERY_SERVICE) as BatteryManager
        return batteryManager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY)
    }

    private fun getBatteryState(): String {
        val intent = registerReceiver(null, IntentFilter(Intent.ACTION_BATTERY_CHANGED))
        val status = intent?.getIntExtra(BatteryManager.EXTRA_STATUS, -1) ?: -1
        return when (status) {
            BatteryManager.BATTERY_STATUS_CHARGING -> "charging"
            BatteryManager.BATTERY_STATUS_FULL -> "full"
            BatteryManager.BATTERY_STATUS_DISCHARGING,
            BatteryManager.BATTERY_STATUS_NOT_CHARGING,
            -> "discharging"

            else -> "unknown"
        }
    }

    private fun openInBrowser(url: String): Boolean {
        if (url.isBlank()) {
            return false
        }
        return try {
            startActivity(Intent(Intent.ACTION_VIEW, android.net.Uri.parse(url)))
            true
        } catch (_: ActivityNotFoundException) {
            false
        }
    }

    private fun copyToClipboard(text: String) {
        val clipboard = getSystemService(CLIPBOARD_SERVICE) as ClipboardManager
        clipboard.setPrimaryClip(ClipData.newPlainText("text", text))
    }

    private fun getClipboardData(): String {
        val clipboard = getSystemService(CLIPBOARD_SERVICE) as ClipboardManager
        return clipboard.primaryClip
            ?.takeIf { it.itemCount > 0 }
            ?.getItemAt(0)
            ?.coerceToText(this)
            ?.toString()
            .orEmpty()
    }

    private fun isImageUri(uri: Uri): Boolean {
        val mimeType = contentResolver.getType(uri)?.lowercase()
        if (mimeType?.startsWith("image/") == true) {
            return true
        }
        val path = uri.toString().lowercase()
        return path.endsWith(".jpg") ||
            path.endsWith(".jpeg") ||
            path.endsWith(".png") ||
            path.endsWith(".webp") ||
            path.endsWith(".gif") ||
            path.endsWith(".bmp")
    }

    private fun extractChooserUris(resultCode: Int, data: Intent?): Array<Uri>? {
        if (resultCode != Activity.RESULT_OK) {
            return null
        }
        val uris = linkedSetOf<Uri>()
        data?.data?.let(uris::add)
        val clipData = data?.clipData
        if (clipData != null) {
            for (index in 0 until clipData.itemCount) {
                clipData.getItemAt(index)?.uri?.let(uris::add)
            }
        }
        if (uris.isEmpty()) {
            return null
        }
        return uris.toTypedArray()
    }

    private suspend fun requireAudioService(): AudioPlaybackService {
        audioService?.let { return it }
        return suspendCancellableCoroutine { continuation ->
            audioService?.let {
                continuation.resume(it)
                return@suspendCancellableCoroutine
            }
            serviceWaiters += continuation
        }
    }

    companion object {
        private const val TAG = "WebViewActivity"
        const val EXTRA_LOCAL_PATH = "extra_local_path"

        fun isDevServerEnabled(): Boolean {
            return BuildConfig.WEBVIEW_ENTRY_URL.isNotBlank()
        }

        fun resolveEntryUrl(localPath: String): String {
            return BuildConfig.WEBVIEW_ENTRY_URL.takeIf { it.isNotBlank() }
                ?: File(localPath).toURI().toString()
        }
    }
}
