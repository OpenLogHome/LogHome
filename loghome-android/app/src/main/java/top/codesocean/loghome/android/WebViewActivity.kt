package top.codesocean.loghome.android

import android.Manifest
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
import android.graphics.BitmapFactory
import android.graphics.Rect
import android.graphics.drawable.ColorDrawable
import android.net.Uri
import android.os.BatteryManager
import android.os.Build
import android.os.Bundle
import android.os.IBinder
import android.util.Log
import android.view.KeyEvent
import android.view.ViewGroup
import android.view.ViewTreeObserver
import android.webkit.ConsoleMessage
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebView
import android.view.animation.PathInterpolator
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
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.suspendCancellableCoroutine
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import okhttp3.OkHttpClient
import okhttp3.Request
import top.codesocean.loghome.android.assets.AssetRepository
import top.codesocean.loghome.android.audio.AudiobookPlaybackState
import top.codesocean.loghome.android.audio.Article
import top.codesocean.loghome.android.audio.AudioPlaybackService
import top.codesocean.loghome.android.audio.NativeAudiobookPlayerView
import top.codesocean.loghome.android.databinding.ActivityWebviewBinding
import top.codesocean.loghome.android.databinding.DialogHotUpdateBinding
import top.codesocean.loghome.android.i18n.AppLanguage
import top.codesocean.loghome.android.logistics.StoreLogisticsService
import top.codesocean.loghome.android.ui.SystemUiHelper
import top.codesocean.loghome.android.ui.WebViewBottomInsets
import top.codesocean.loghome.android.ui.SplashImageLoader
import top.codesocean.loghome.android.web.InjectedHtmlWebViewClient
import top.codesocean.loghome.android.web.ImageUploadPreparation
import top.codesocean.loghome.android.web.InjectedScriptBuilder
import top.codesocean.loghome.android.web.LogHomeWebViewConfigurator
import top.codesocean.loghome.android.web.WebViewImageSaver
import top.codesocean.loghome.android.web.WebViewBridgeInterface
import top.codesocean.loghome.android.web.WebViewFontCache
import java.io.File
import kotlin.coroutines.resume

class WebViewActivity : AppCompatActivity() {
    private lateinit var binding: ActivityWebviewBinding
    private lateinit var activeWebView: WebView
    private var activeWebViewBridge: WebViewBridgeInterface? = null
    private var activeWebViewFromPool = false

    private var localPath: String = ""
    private var initialRouteUrl: String = ""
    private var suppressLoadingOverlay = false
    private var useWarmWebView = false
    private var awaitingInitialPageReveal = false
    private var initialBackgroundColor: Int = Color.WHITE
    private var themeBackgroundColor: Int = Color.WHITE
    private var currentSystemBarColor: Int = Color.WHITE
    private var systemBarsVisible = true
    private var volumeKeyEnabled = false
    private var topInsetCss = 0.0
    // The native viewport consumes the bottom inset; H5 must not reserve it again.
    private val bottomInsetCss = 0.0
    private var navigationBottomInsetPx = 0
    private var lastKeyboardVisible: Boolean? = null
    private var lastKeyboardHeightCss = 0.0
    private var lastAppliedBottomInsetPx = -1
    private var lastBackPressedAt = 0L
    private var injectedScript: String? = null
    private var pendingRestart = false
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null
    private var pendingImageDownloadUrl: String? = null
    private var pendingMultipleImageUris: Array<Uri>? = null
    private var pendingChooserPrefersImages = false
    private var pendingChooserAllowsMultiple = false
    private var nativeWebViewWarmupPosted = false
    private var nativeBackDispatching = false
    private val routeTransitionInterpolator by lazy {
        PathInterpolator(0.22f, 0.61f, 0.36f, 1f)
    }

    private var audioService: AudioPlaybackService? = null
    private var isAudioServiceBound = false
    private val serviceWaiters = mutableListOf<CancellableContinuation<AudioPlaybackService>>()
    private var nativeAudiobookTitle = ""
    private var nativeAudiobookCoverUrl = ""
    private var audiobookCoverJob: Job? = null
    private val audiobookCoverHttpClient = OkHttpClient()
    private var lastDispatchedAudiobookParagraph = ""
    private val audiobookVoiceNames = mutableMapOf<String, String>()
    private val audioPlaybackStateListener: (AudiobookPlaybackState) -> Unit = { state ->
        binding.root.post {
            renderNativeAudiobookState(state)
            dispatchAudiobookHighlightState(state)
        }
    }
    private val keyboardVisibleFrame = Rect()
    private val keyboardLayoutListener = ViewTreeObserver.OnGlobalLayoutListener {
        val density = resources.displayMetrics.density.toDouble()
        val windowInsets = ViewCompat.getRootWindowInsets(binding.root)
        val imeVisible = windowInsets?.isVisible(WindowInsetsCompat.Type.ime()) == true
        val imeBottomInset = windowInsets
            ?.getInsets(WindowInsetsCompat.Type.ime())
            ?.bottom
            ?: 0

        // In edge-to-edge mode getWindowVisibleDisplayFrame() may still contain the
        // area behind the IME. Prefer the authoritative IME inset so this fallback
        // cannot undo the result produced by setupWindowInsets().
        if (imeVisible && imeBottomInset > 0) {
            applyBottomViewportInset(imeBottomInset)
            updateKeyboardVisibility(
                visible = true,
                heightCss = imeBottomInset / density,
            )
            return@OnGlobalLayoutListener
        }

        val rootView = binding.root.rootView ?: return@OnGlobalLayoutListener
        val rootHeight = rootView.height
        if (rootHeight <= 0) {
            return@OnGlobalLayoutListener
        }

        binding.root.getWindowVisibleDisplayFrame(keyboardVisibleFrame)
        val heightDiff = (rootHeight - keyboardVisibleFrame.bottom).coerceAtLeast(0)
        val keyboardVisible = heightDiff > (100 * density)

        applyBottomViewportInset(if (keyboardVisible) heightDiff else 0)

        updateKeyboardVisibility(
            visible = keyboardVisible,
            heightCss = if (keyboardVisible) heightDiff / density else 0.0,
        )
    }

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
            audioService?.addPlaybackStateListener(audioPlaybackStateListener)
            val pending = serviceWaiters.toList()
            serviceWaiters.clear()
            pending.forEach { continuation ->
                if (continuation.isActive) {
                    continuation.resume(audioService!!)
                }
            }
        }

        override fun onServiceDisconnected(name: ComponentName?) {
            audioService?.removePlaybackStateListener(audioPlaybackStateListener)
            audioService = null
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        initialBackgroundColor = if (intent.hasExtra(EXTRA_INITIAL_BACKGROUND_COLOR)) {
            intent.getIntExtra(EXTRA_INITIAL_BACKGROUND_COLOR, Color.WHITE)
        } else {
            SystemUiHelper.resolveInitialBackgroundColor(this)
        }
        themeBackgroundColor = initialBackgroundColor
        currentSystemBarColor = initialBackgroundColor
        window.setBackgroundDrawable(ColorDrawable(initialBackgroundColor))
        WindowCompat.setDecorFitsSystemWindows(window, false)
        binding = ActivityWebviewBinding.inflate(layoutInflater)
        setContentView(binding.root)
        SystemUiHelper.applySystemBarStyle(window, binding.root, initialBackgroundColor)
        binding.webView.setBackgroundColor(initialBackgroundColor)
        binding.loadingContainer.setBackgroundColor(initialBackgroundColor)
        binding.errorContainer.setBackgroundColor(initialBackgroundColor)

        localPath = intent.getStringExtra(EXTRA_LOCAL_PATH).orEmpty()
        initialRouteUrl = intent.getStringExtra(EXTRA_ROUTE_URL).orEmpty()
        suppressLoadingOverlay = intent.getBooleanExtra(
            EXTRA_SUPPRESS_LOADING_OVERLAY,
            initialRouteUrl.isNotBlank(),
        )
        useWarmWebView = intent.getBooleanExtra(EXTRA_USE_WARM_WEBVIEW, initialRouteUrl.isNotBlank())
        NativeRouteStack.register(this)
        prepareActiveWebView()

        setupWindowInsets()
        setupKeyboardVisibilityFallback()
        setupBackHandling()
        setupRetry()
        setupNativeAudiobookPlayer()
        setupWebView()
        configureInitialLoadingOverlay()
        prepareRouteTransitionVisuals()
        if (!suppressLoadingOverlay) {
            loadSplashOverlayImage()
        }
        ensureNotificationPermission()
        bindAudioService()
        applySystemBarStyle(initialBackgroundColor)

        if (localPath.isBlank() && !isDevServerEnabled()) {
            restartToSplash()
            return
        }

        binding.root.post {
            lifecycleScope.launch {
                if (activeWebViewFromPool && initialRouteUrl.isNotBlank()) {
                    rebuildInjectedScript()
                    loadLocalContent()
                    scheduleNativeWebViewWarmup(300L)
                    return@launch
                }
                rebuildInjectedScript()
                loadLocalContent()
            }
        }
    }

    override fun onResume() {
        super.onResume()
        fadeOutTransitionDimOverlay()
        ViewCompat.requestApplyInsets(binding.root)
        syncWebSafeAreaInsets()
    }

    override fun onDestroy() {
        NativeRouteStack.unregister(this)
        fileChooserCallback?.onReceiveValue(null)
        fileChooserCallback = null
        pendingMultipleImageUris = null
        audiobookCoverJob?.cancel()
        audioService?.removePlaybackStateListener(audioPlaybackStateListener)
        if (isAudioServiceBound) {
            unbindService(audioServiceConnection)
            isAudioServiceBound = false
        }
        audioService = null
        binding.root.viewTreeObserver.takeIf { it.isAlive }
            ?.removeOnGlobalLayoutListener(keyboardLayoutListener)
        activeWebViewBridge?.clearHandler()
        if (::activeWebView.isInitialized) {
            activeWebView.destroy()
        }
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
            navigationBottomInsetPx = insets.getInsetsIgnoringVisibility(
                WindowInsetsCompat.Type.navigationBars() or WindowInsetsCompat.Type.displayCutout(),
            ).bottom
            val safeTopInsets = insets.getInsets(
                WindowInsetsCompat.Type.systemBars() or
                    WindowInsetsCompat.Type.displayCutout(),
            )
            val ime = insets.getInsets(WindowInsetsCompat.Type.ime())
            val keyboardVisible = insets.isVisible(WindowInsetsCompat.Type.ime())
            val density = resources.displayMetrics.density.toDouble()

            val newTopInsetCss = safeTopInsets.top / density
            topInsetCss = newTopInsetCss
            val keyboardHeightCss = ime.bottom / density

            applyBottomViewportInset(
                if (keyboardVisible) ime.bottom else 0,
            )

            // Also refresh unchanged values: a new document may have inherited stale insets.
            syncWebSafeAreaInsets()

            updateKeyboardVisibility(
                visible = keyboardVisible,
                heightCss = if (keyboardVisible) keyboardHeightCss else 0.0,
            )

            insets
        }
        ViewCompat.requestApplyInsets(binding.root)
    }

    private fun syncWebSafeAreaInsets() {
        if (!::activeWebView.isInitialized) {
            return
        }
        val script = """
            (function() {
                if (window.jsBridge) {
                    window.jsBridge.statusBarHeight = $topInsetCss;
                    window.jsBridge.navigationBarHeight = $bottomInsetCss;
                }
                var root = document.documentElement;
                if (!root) return;
                root.classList.add('loghome-edge-to-edge');
                root.style.setProperty('--loghome-native-safe-top', '${topInsetCss}px');
                root.style.setProperty('--loghome-native-safe-bottom', '${bottomInsetCss}px');
                root.style.setProperty('--loghome-safe-bottom', '0px');
            })();
        """.trimIndent()
        activeWebView.post {
            if (!isFinishing && !isDestroyed) {
                activeWebView.evaluateJavascript(script, null)
            }
        }
    }

    private fun setupKeyboardVisibilityFallback() {
        binding.root.viewTreeObserver.addOnGlobalLayoutListener(keyboardLayoutListener)
    }

    private fun applyBottomViewportInset(bottomInsetPx: Int) {
        if (!::activeWebView.isInitialized) {
            return
        }

        val normalizedInset = WebViewBottomInsets.viewportBottom(
            navigationBottom = navigationBottomInsetPx,
            imeBottom = bottomInsetPx,
            systemBarsVisible = systemBarsVisible,
        )
        if (lastAppliedBottomInsetPx == normalizedInset) {
            return
        }

        val layoutParams = activeWebView.layoutParams as? ViewGroup.MarginLayoutParams ?: return
        lastAppliedBottomInsetPx = normalizedInset
        if (layoutParams.bottomMargin == normalizedInset) {
            return
        }

        layoutParams.bottomMargin = normalizedInset
        activeWebView.layoutParams = layoutParams
        val playerParams = binding.nativeAudiobookPlayer.layoutParams as? ViewGroup.MarginLayoutParams
        if (playerParams != null) {
            playerParams.bottomMargin = normalizedInset + (12 * resources.displayMetrics.density).toInt()
            binding.nativeAudiobookPlayer.layoutParams = playerParams
        }
    }

    private fun updateKeyboardVisibility(visible: Boolean, heightCss: Double) {
        val previousKeyboardVisible = lastKeyboardVisible
        val normalizedHeightCss = if (visible) heightCss.coerceAtLeast(0.0) else 0.0
        val heightChanged = kotlin.math.abs(lastKeyboardHeightCss - normalizedHeightCss) >= 0.5
        if (previousKeyboardVisible == visible && !heightChanged) {
            return
        }

        lastKeyboardVisible = visible
        lastKeyboardHeightCss = normalizedHeightCss
        if (previousKeyboardVisible != null || visible) {
            dispatchKeyboardVisibilityEvent(
                visible = visible,
                heightCss = normalizedHeightCss,
            )
        }
    }

    private fun prepareActiveWebView() {
        val warmWebView = if (shouldUseWarmWebView()) {
            NativeWebViewPool.acquire(this, localPath)
        } else {
            null
        }

        if (warmWebView == null) {
            activeWebView = binding.webView
            activeWebViewBridge = WebViewBridgeInterface(::handleBridgeMessage)
            activeWebViewFromPool = false
            return
        }

        activeWebView = warmWebView.webView
        activeWebViewBridge = warmWebView.bridgeInterface
        // The target route may cause a document reload before this activity rebuilds its own script.
        injectedScript = warmWebView.injectedScript
        activeWebViewBridge?.updateHandler(::handleBridgeMessage)
        activeWebViewFromPool = true
        replaceBindingWebView(activeWebView)
    }

    private fun shouldUseWarmWebView(): Boolean {
        return useWarmWebView && initialRouteUrl.isNotBlank()
    }

    private fun replaceBindingWebView(webView: WebView) {
        if (webView === binding.webView) {
            return
        }

        val originalWebView = binding.webView
        val parent = originalWebView.parent as? ViewGroup ?: return
        val index = parent.indexOfChild(originalWebView)
        val layoutParams = originalWebView.layoutParams
        parent.removeView(originalWebView)
        originalWebView.destroy()
        (webView.parent as? ViewGroup)?.removeView(webView)
        parent.addView(webView, index, layoutParams)
    }

    private fun setupWebView() {
        activeWebView.apply {
            setBackgroundColor(initialBackgroundColor)
            alpha = 0f
            LogHomeWebViewConfigurator.applyDefaultSettings(this)
            val bridge = activeWebViewBridge ?: WebViewBridgeInterface(::handleBridgeMessage).also {
                activeWebViewBridge = it
            }
            bridge.updateHandler(::handleBridgeMessage)
            if (!activeWebViewFromPool) {
                addJavascriptInterface(bridge, "LogHomeBridge")
            }
            webViewClient = InjectedHtmlWebViewClient(
                context = this@WebViewActivity,
                injectedScriptProvider = { injectedScript.orEmpty() },
                onPageLoadingChanged = { loading ->
                    binding.loadingContainer.post {
                        if (!loading) {
                            ViewCompat.requestApplyInsets(binding.root)
                            syncWebSafeAreaInsets()
                        }
                        if (suppressLoadingOverlay) {
                            binding.errorContainer.isVisible = false
                            if (!loading && awaitingInitialPageReveal) {
                                awaitingInitialPageReveal = false
                                revealWebViewContent()
                                scheduleNativeWebViewWarmup(150L)
                            }
                            return@post
                        }
                        if (loading) {
                            if (binding.loadingContainer.isVisible) {
                                activeWebView.alpha = 0f
                            }
                            binding.errorContainer.isVisible = false
                        } else if (binding.loadingContainer.isVisible) {
                            revealWebViewContent()
                        }
                        if (!loading) {
                            scheduleNativeWebViewWarmup(150L)
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

                // 漫画阅读器内禁止长按保存，其他页面不受影响
                if (url?.contains("pages/readers/mangaReader") == true) {
                    return@setOnLongClickListener true
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
                    currentPageUrl = activeWebView.url,
                    userAgent = activeWebView.settings.userAgentString,
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

    private fun configureInitialLoadingOverlay() {
        if (suppressLoadingOverlay) {
            binding.loadingContainer.animate().cancel()
            activeWebView.animate().cancel()
            binding.loadingSplashImage.isVisible = false
            binding.loadingContainer.isVisible = true
            binding.loadingContainer.alpha = 1f
            activeWebView.alpha = 0f
            return
        }

        binding.loadingContainer.isVisible = true
        binding.loadingContainer.alpha = 1f
        activeWebView.alpha = 0f
    }

    private fun prepareRouteTransitionVisuals() {
        if (shouldUseWarmWebView()) {
            showTransitionEdgeShadow(fadeOut = true)
        }
    }

    private fun showTransitionDimOverlay() {
        binding.transitionDimOverlay.animate().cancel()
        binding.transitionDimOverlay.isVisible = true
        binding.transitionDimOverlay.alpha = 0f
        binding.transitionDimOverlay.animate()
            .alpha(0.10f)
            .setDuration(220L)
            .setInterpolator(routeTransitionInterpolator)
            .start()
    }

    private fun fadeOutTransitionDimOverlay() {
        if (!::binding.isInitialized) {
            return
        }
        if (!binding.transitionDimOverlay.isVisible && binding.transitionDimOverlay.alpha <= 0f) {
            return
        }

        binding.transitionDimOverlay.animate().cancel()
        binding.transitionDimOverlay.animate()
            .alpha(0f)
            .setDuration(220L)
            .setInterpolator(routeTransitionInterpolator)
            .withEndAction {
                binding.transitionDimOverlay.isVisible = false
            }
            .start()
    }

    private fun showTransitionEdgeShadow(fadeOut: Boolean) {
        binding.transitionEdgeShadow.animate().cancel()
        binding.transitionEdgeShadow.isVisible = true
        binding.transitionEdgeShadow.alpha = 0.24f

        if (!fadeOut) {
            return
        }

        binding.transitionEdgeShadow.animate()
            .alpha(0f)
            .setStartDelay(90L)
            .setDuration(260L)
            .setInterpolator(routeTransitionInterpolator)
            .withEndAction {
                binding.transitionEdgeShadow.isVisible = false
            }
            .start()
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
                    if (binding.nativeAudiobookPlayer.isVisible) {
                        binding.nativeAudiobookPlayer.isVisible = false
                        return
                    }
                    if (nativeBackDispatching) {
                        return
                    }
                    nativeBackDispatching = true
                    dispatchNativeBackRequest { consumed ->
                        nativeBackDispatching = false
                        if (!consumed) {
                            handleNativeBackFallback()
                        }
                    }
                }
            },
        )
    }

    private fun dispatchNativeBackRequest(onResult: (Boolean) -> Unit) {
        val script = """
            (function() {
                try {
                    var event = new CustomEvent("loghomeNativeBack", {
                        cancelable: true,
                        detail: { source: "android-system-back" }
                    });
                    return window.dispatchEvent(event) === false;
                } catch (error) {
                    return false;
                }
            })();
        """.trimIndent()

        activeWebView.evaluateJavascript(script) { result ->
            onResult(result == "true")
        }
    }

    private fun handleNativeBackFallback() {
        if (NativeRouteStack.activeCount() > 1) {
            finishForNativeRouteBack()
            return
        }

        if (activeWebView.canGoBack()) {
            activeWebView.goBack()
            return
        }

        // 进程或下层 Activity 被系统回收后 NativeRouteStack 只剩当前页，
        // 但 Task 返回栈里仍有下层页面记录，此时应 finish 让系统重建下层页面
        if (!isTaskRoot) {
            finishForNativeRouteBack()
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
            language = AppLanguage.currentLanguage(this),
            savedLanguage = AppLanguage.savedLanguage(this),
        )
    }

    private suspend fun loadLocalContent() {
        if (!verifyLocalResourcePath(showMessage = false)) {
            return
        }

        if (suppressLoadingOverlay) {
            awaitingInitialPageReveal = true
            binding.loadingSplashImage.isVisible = false
            binding.loadingContainer.setBackgroundColor(initialBackgroundColor)
            binding.loadingContainer.isVisible = true
            binding.loadingContainer.alpha = 1f
            activeWebView.alpha = 0f
        } else {
            showLoadingOverlay()
        }
        binding.errorContainer.isVisible = false
        val targetUrl = resolveEntryUrl(localPath, initialRouteUrl)
        if (activeWebViewFromPool && initialRouteUrl.isNotBlank()) {
            routeWarmWebView(targetUrl)
            scheduleWarmRouteRevealFallback()
        } else {
            activeWebView.loadUrl(targetUrl)
        }
        applySystemBarStyle(currentSystemBarColor)
        if (suppressLoadingOverlay) {
            scheduleNativeWebViewWarmup(800L)
        }
    }

    private fun routeWarmWebView(targetUrl: String) {
        val script = """
            (function() {
                if (window.jsBridge) {
                    window.jsBridge.statusBarHeight = $topInsetCss;
                    window.jsBridge.navigationBarHeight = $bottomInsetCss;
                }
                window.location.replace(${JSONObject.quote(targetUrl)});
            })();
        """.trimIndent()
        activeWebView.evaluateJavascript(script, null)
        syncWebSafeAreaInsets()
    }

    private fun scheduleWarmRouteRevealFallback() {
        binding.root.postDelayed({
            if (!isFinishing && !isDestroyed && awaitingInitialPageReveal) {
                awaitingInitialPageReveal = false
                revealWebViewContent()
                scheduleNativeWebViewWarmup(150L)
            }
        }, 250L)
    }

    private fun scheduleNativeWebViewWarmup(delayMillis: Long) {
        if (nativeWebViewWarmupPosted || injectedScript.isNullOrBlank()) {
            return
        }
        if (localPath.isBlank() && !isDevServerEnabled()) {
            return
        }

        nativeWebViewWarmupPosted = true
        activeWebView.postDelayed(
            {
                nativeWebViewWarmupPosted = false
                if (isFinishing || isDestroyed) {
                    return@postDelayed
                }
                NativeWebViewPool.warm(
                    context = applicationContext,
                    localPath = localPath,
                    injectedScript = injectedScript.orEmpty(),
                )
            },
            delayMillis,
        )
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
        activeWebView.animate().cancel()
        activeWebView.alpha = 1f
        binding.loadingContainer.isVisible = false
        binding.errorContainer.isVisible = true
        binding.errorText.text = getString(R.string.load_failed) + ": " + message
    }

    private fun showLoadingOverlay() {
        binding.loadingContainer.animate().cancel()
        activeWebView.animate().cancel()
        binding.loadingContainer.alpha = 1f
        binding.loadingContainer.isVisible = true
        activeWebView.alpha = 0f
    }

    private fun revealWebViewContent() {
        binding.loadingContainer.animate().cancel()
        activeWebView.animate().cancel()
        activeWebView.animate()
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
                val backgroundColor = SystemUiHelper.parseColorOrFallback(
                    colorValue,
                    currentSystemBarColor,
                )
                if (backgroundColor != currentSystemBarColor) {
                    applySystemBarStyle(backgroundColor)
                }
                true
            }

            "rememberThemeBackground" -> {
                val backgroundColor = SystemUiHelper.parseColorOrFallback(
                    args.optString(0),
                    themeBackgroundColor,
                )
                rememberThemeBackground(backgroundColor)
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

            "queryStoreLogistics" -> StoreLogisticsService.query(
                applicationContext,
                args.optJSONObject(0) ?: JSONObject(),
            )

            "hotUpdateAssets" -> {
                val url = args.optString(0)
                val version = args.optString(1)
                runHotUpdate(url, version)
            }

            "openNativeAudiobookPlayer" -> {
                val payload = args.optJSONObject(0) ?: JSONObject()
                openNativeAudiobookPlayer(payload)
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
            "setAppLanguage" -> {
                // i18n：H5 设置页同步应用语言。args[0] 为 'zh-CN' | 'en' | 'follow-system'
                val preference = when (val firstArg = args.opt(0)) {
                    is JSONObject -> firstArg.optString("language", firstArg.optString("lang"))
                    null, JSONObject.NULL -> ""
                    else -> firstArg.toString()
                }.trim()
                if (preference == AppLanguage.FOLLOW_SYSTEM) {
                    if (AppLanguage.savedLanguage(this) != null) {
                        AppLanguage.clearSaved(this)
                        NativeWebViewPool.invalidate("language preference cleared")
                        rebuildInjectedScript()
                        AppLanguage.applyToFramework(null)
                    }
                    true
                } else {
                    val language = AppLanguage.normalize(preference)
                        ?: throw IllegalArgumentException("Unsupported language: $preference")
                    if (AppLanguage.savedLanguage(this) != language) {
                        AppLanguage.save(this, language)
                        // 预热 WebView 的注入脚本带旧语言，必须清池重建
                        NativeWebViewPool.invalidate("language changed")
                        rebuildInjectedScript()
                        AppLanguage.applyToFramework(language)
                    }
                    true
                }
            }
            "nativeNavigateTo" -> {
                syncThemeBackgroundFromRoute(args)
                nativeNavigateTo(readNativeRouteUrl(args))
            }
            "nativeRedirectTo" -> {
                syncThemeBackgroundFromRoute(args)
                nativeRedirectTo(readNativeRouteUrl(args))
            }
            "nativeReLaunch" -> {
                syncThemeBackgroundFromRoute(args)
                nativeReLaunch(readNativeRouteUrl(args))
            }
            "nativeSwitchTab" -> {
                syncThemeBackgroundFromRoute(args)
                nativeSwitchTab(readNativeRouteUrl(args))
            }
            "nativeNavigateBack" -> nativeNavigateBack(readNativeRouteDelta(args))
            else -> throw IllegalArgumentException("Unknown bridge handler: $name")
        }
    }

    private fun readNativeRouteUrl(args: JSONArray): String {
        val firstArg = args.opt(0)
        val rawUrl = when (firstArg) {
            is JSONObject -> firstArg.optString("url")
            null, JSONObject.NULL -> ""
            else -> firstArg.toString()
        }
        return normalizeNativeRouteUrl(rawUrl).orEmpty()
    }

    private fun syncThemeBackgroundFromRoute(args: JSONArray) {
        val payload = args.opt(0) as? JSONObject ?: return
        val colorValue = payload.optString("themeBackgroundColor")
        if (colorValue.isBlank()) {
            return
        }
        rememberThemeBackground(
            SystemUiHelper.parseColorOrFallback(colorValue, themeBackgroundColor),
        )
    }

    private fun rememberThemeBackground(backgroundColor: Int) {
        val themeChanged = themeBackgroundColor != backgroundColor
        themeBackgroundColor = backgroundColor
        SystemUiHelper.rememberBackgroundColor(applicationContext, backgroundColor)
        if (themeChanged) {
            NativeWebViewPool.invalidate("theme changed")
        }
    }

    private fun readNativeRouteDelta(args: JSONArray): Int {
        val firstArg = args.opt(0)
        val rawDelta = when (firstArg) {
            is JSONObject -> firstArg.optInt("delta", 1)
            is Number -> firstArg.toInt()
            else -> 1
        }
        return rawDelta.coerceAtLeast(1)
    }

    private fun nativeNavigateTo(routeUrl: String): JSONObject {
        if (routeUrl.isBlank()) {
            return nativeRouteResult(false, "invalid route url")
        }
        runAfterBridgeResolve {
            showTransitionDimOverlay()
            startActivity(createNativeRouteIntent(routeUrl))
            @Suppress("DEPRECATION")
            overridePendingTransition(R.anim.loghome_ios_push_enter, R.anim.loghome_ios_push_exit)
        }
        return nativeRouteResult(true).put("url", routeUrl)
    }

    private fun nativeRedirectTo(routeUrl: String): JSONObject {
        if (routeUrl.isBlank()) {
            return nativeRouteResult(false, "invalid route url")
        }
        runAfterBridgeResolve {
            showTransitionDimOverlay()
            startActivity(createNativeRouteIntent(routeUrl))
            @Suppress("DEPRECATION")
            overridePendingTransition(R.anim.loghome_ios_push_enter, R.anim.loghome_ios_push_exit)
            finish()
        }
        return nativeRouteResult(true).put("url", routeUrl)
    }

    private fun nativeReLaunch(routeUrl: String): JSONObject {
        if (routeUrl.isBlank()) {
            return nativeRouteResult(false, "invalid route url")
        }
        runAfterBridgeResolve {
            startActivity(
                createNativeRouteIntent(routeUrl, useWarmWebView = false).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_CLEAR_TASK or
                        Intent.FLAG_ACTIVITY_CLEAR_TOP
                },
            )
            @Suppress("DEPRECATION")
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }
        return nativeRouteResult(true).put("url", routeUrl)
    }

    private fun nativeSwitchTab(routeUrl: String): JSONObject {
        if (routeUrl.isBlank()) {
            return nativeRouteResult(false, "invalid route url")
        }
        runAfterBridgeResolve {
            startActivity(
                createNativeRouteIntent(routeUrl, useWarmWebView = false).apply {
                    flags = Intent.FLAG_ACTIVITY_NEW_TASK or
                        Intent.FLAG_ACTIVITY_CLEAR_TASK or
                        Intent.FLAG_ACTIVITY_CLEAR_TOP
                },
            )
            @Suppress("DEPRECATION")
            overridePendingTransition(android.R.anim.fade_in, android.R.anim.fade_out)
        }
        return nativeRouteResult(true).put("url", routeUrl)
    }

    private fun nativeNavigateBack(delta: Int): JSONObject {
        if (NativeRouteStack.activeCount() <= 1) {
            return nativeRouteResult(false, "native route stack has no previous page")
        }
        runAfterBridgeResolve {
            NativeRouteStack.finishTop(delta)
        }
        return nativeRouteResult(true).put("delta", delta)
    }

    private fun createNativeRouteIntent(routeUrl: String, useWarmWebView: Boolean = true): Intent {
        return Intent(this, WebViewActivity::class.java)
            .putExtra(EXTRA_LOCAL_PATH, localPath)
            .putExtra(EXTRA_ROUTE_URL, routeUrl)
            .putExtra(EXTRA_SUPPRESS_LOADING_OVERLAY, true)
            .putExtra(EXTRA_USE_WARM_WEBVIEW, useWarmWebView)
            .putExtra(
                EXTRA_INITIAL_BACKGROUND_COLOR,
                themeBackgroundColor,
            )
    }

    private fun runAfterBridgeResolve(action: () -> Unit) {
        binding.root.postDelayed(action, 24L)
    }

    private fun nativeRouteResult(ok: Boolean, reason: String? = null): JSONObject {
        return JSONObject()
            .put("ok", ok)
            .apply {
                if (!reason.isNullOrBlank()) {
                    put("reason", reason)
                }
            }
    }

    fun finishForNativeRouteBack() {
        showTransitionEdgeShadow(fadeOut = false)
        finish()
        @Suppress("DEPRECATION")
        overridePendingTransition(R.anim.loghome_ios_pop_enter, R.anim.loghome_ios_pop_exit)
    }

    private fun setNavigationBarVisible(visible: Boolean) {
        systemBarsVisible = visible
        val controller = WindowInsetsControllerCompat(window, binding.root)
        controller.systemBarsBehavior =
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
        if (visible) {
            controller.show(WindowInsetsCompat.Type.systemBars())
        } else {
            controller.hide(WindowInsetsCompat.Type.systemBars())
        }
        val insets = ViewCompat.getRootWindowInsets(binding.root)
        val imeBottom = if (insets?.isVisible(WindowInsetsCompat.Type.ime()) == true) {
            insets.getInsets(WindowInsetsCompat.Type.ime()).bottom
        } else 0
        applyBottomViewportInset(imeBottom)
        ViewCompat.requestApplyInsets(binding.root)
        syncWebSafeAreaInsets()
    }

    private fun applySystemBarStyle(color: Int) {
        currentSystemBarColor = color
        SystemUiHelper.applySystemBarStyle(window, binding.root, color)
        // The WebView draws the status-bar background in edge-to-edge mode.
        window.statusBarColor = Color.TRANSPARENT
        activeWebView.setBackgroundColor(color)
        binding.loadingContainer.setBackgroundColor(color)
        binding.errorContainer.setBackgroundColor(color)
        binding.errorText.setTextColor(if (SystemUiHelper.shouldUseDarkIcons(color)) Color.BLACK else Color.WHITE)
        if (!systemBarsVisible) {
            val controller = WindowInsetsControllerCompat(window, binding.root)
            controller.systemBarsBehavior =
                WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            controller.hide(WindowInsetsCompat.Type.systemBars())
        }
    }

    private fun resolveBridgeCall(callId: String, value: Any?) {
        val script = "window.__logHomeNativeBridge?.resolve(${JSONObject.quote(callId)}, ${toJavaScriptLiteral(value)});"
        activeWebView.post {
            activeWebView.evaluateJavascript(script, null)
        }
    }

    private fun rejectBridgeCall(callId: String, errorMessage: String) {
        val script =
            "window.__logHomeNativeBridge?.reject(${JSONObject.quote(callId)}, ${JSONObject.quote(errorMessage)});"
        activeWebView.post {
            activeWebView.evaluateJavascript(script, null)
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
        activeWebView.evaluateJavascript(script, null)
    }

    private fun dispatchKeyboardVisibilityEvent(visible: Boolean, heightCss: Double) {
        val detail = JSONObject()
            .put("visible", visible)
            .put("height", heightCss)
        val script = """
            (function() {
                var detail = $detail;
                var root = document.documentElement;
                if (root) {
                    root.style.setProperty('--loghome-keyboard-height', detail.height + 'px');
                    root.classList.toggle('loghome-keyboard-visible', detail.visible === true);
                }
                window.dispatchEvent(new CustomEvent('keyboardVisibilityChange', { detail: detail }));
            })();
        """.trimIndent()
        activeWebView.post {
            activeWebView.evaluateJavascript(script, null)
        }
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

    private fun setupNativeAudiobookPlayer() {
        binding.nativeAudiobookPlayer.setListener(
            object : NativeAudiobookPlayerView.Listener {
                override fun onPlayPause() {
                    val service = audioService ?: return
                    if (service.getPlaybackState().isPlaying) {
                        service.pause()
                    } else {
                        service.play()
                    }
                }

                override fun onPrevious() {
                    audioService?.skipToPreviousParagraph()
                }

                override fun onNext() {
                    audioService?.skipToNextParagraph()
                }

                override fun onSeekTo(positionMs: Long) {
                    audioService?.seekTo(positionMs)
                }

                override fun onChooseVoice() {
                    showAudiobookVoiceDialog()
                }

                override fun onChooseSpeed() {
                    showAudiobookSpeedDialog()
                }

                override fun onChooseSleepTimer() {
                    showAudiobookSleepTimerDialog()
                }

                override fun onCollapse() {
                    binding.nativeAudiobookPlayer.isVisible = false
                }
            },
        )
    }

    private suspend fun openNativeAudiobookPlayer(payload: JSONObject): Boolean {
        val articleIdsJson = payload.optJSONArray("articleIds") ?: JSONArray()
        val articleIds = buildList {
            for (index in 0 until articleIdsJson.length()) {
                articleIdsJson.optString(index).takeIf { it.isNotBlank() }?.let(::add)
            }
        }
        if (articleIds.isEmpty()) {
            throw IllegalArgumentException("听书章节列表不能为空")
        }

        nativeAudiobookTitle = payload.optString("bookTitle").ifBlank { "原木听书" }
        loadNativeAudiobookCover(payload.optString("coverUrl"))
        binding.nativeAudiobookPlayer.setBookTitle(nativeAudiobookTitle)
        binding.nativeAudiobookPlayer.alpha = 0f
        binding.nativeAudiobookPlayer.isVisible = true
        binding.nativeAudiobookPlayer.animate().cancel()
        binding.nativeAudiobookPlayer.animate()
            .alpha(1f)
            .setDuration(180L)
            .start()

        val service = requireAudioService()
        val startArticleId = payload.optString("startArticleId").takeIf { it.isNotBlank() }
        val playlistKey = payload.optString("playlistKey")
        val inlineArticlesJson = payload.optJSONArray("articles") ?: JSONArray()
        val inlineArticles = buildList {
            for (index in 0 until inlineArticlesJson.length()) {
                inlineArticlesJson.optJSONObject(index)?.let { articleJson ->
                    add(Article.fromJson(articleJson))
                }
            }
        }
        if (!service.isCurrentPlaylist(articleIds, playlistKey)) {
            lastDispatchedAudiobookParagraph = ""
            service.replacePlaylist(articleIds, startArticleId, inlineArticles, playlistKey)
        }

        val startParagraphId = payload.opt("startParagraphId")
            ?.takeUnless { it == JSONObject.NULL }
            ?.toString()
            ?.takeIf { it.isNotBlank() }
        if (startArticleId != null && startParagraphId != null) {
            service.jumpToArticleParagraph(startArticleId, startParagraphId)
        }
        return true
    }

    private fun loadNativeAudiobookCover(coverUrl: String) {
        if (coverUrl == nativeAudiobookCoverUrl) {
            return
        }
        nativeAudiobookCoverUrl = coverUrl
        audiobookCoverJob?.cancel()
        binding.nativeAudiobookPlayer.setCoverBitmap(null)
        if (coverUrl.isBlank()) {
            return
        }

        audiobookCoverJob = lifecycleScope.launch(Dispatchers.IO) {
            val bitmap = runCatching {
                val request = Request.Builder().url(coverUrl).build()
                audiobookCoverHttpClient.newCall(request).execute().use { response ->
                    if (!response.isSuccessful) return@use null
                    val body = response.body ?: return@use null
                    if (body.contentLength() > 8L * 1024L * 1024L) return@use null
                    body.byteStream().use(BitmapFactory::decodeStream)
                }
            }.getOrNull()
            withContext(Dispatchers.Main) {
                if (nativeAudiobookCoverUrl == coverUrl) {
                    binding.nativeAudiobookPlayer.setCoverBitmap(bitmap)
                }
            }
        }
    }

    private fun renderNativeAudiobookState(state: AudiobookPlaybackState) {
        if (!binding.nativeAudiobookPlayer.isVisible && !state.hasContent) {
            return
        }
        binding.nativeAudiobookPlayer.setBookTitle(nativeAudiobookTitle)
        binding.nativeAudiobookPlayer.render(
            state = state,
            voiceName = audiobookVoiceNames[state.voiceId],
        )
    }

    private fun dispatchAudiobookHighlightState(state: AudiobookPlaybackState) {
        val articleId = state.articleId ?: return
        val paragraphId = state.paragraphId ?: return
        val paragraphKey = "$articleId:$paragraphId"
        if (lastDispatchedAudiobookParagraph == paragraphKey) {
            return
        }
        lastDispatchedAudiobookParagraph = paragraphKey
        val detail = JSONObject()
            .put("articleId", articleId)
            .put("paragraphId", paragraphId)
            .put("chapterTitle", state.chapterTitle)
            .put("isPlaying", state.isPlaying)
        activeWebView.evaluateJavascript(
            "window.dispatchEvent(new CustomEvent('loghome:audiobook-progress',{detail:$detail}));",
            null,
        )
    }

    private fun showAudiobookVoiceDialog() {
        val service = audioService ?: return
        lifecycleScope.launch {
            val voices = withContext(Dispatchers.IO) { service.getAvailableVoicesJson() }
            val voiceIds = mutableListOf<String>()
            val labels = mutableListOf<String>()
            for (index in 0 until voices.length()) {
                val voice = voices.optJSONObject(index) ?: continue
                val id = voice.optString("id")
                if (id.isBlank()) continue
                val name = voice.optString("name", id)
                val description = voice.optString("description")
                voiceIds += id
                labels += if (description.isBlank()) name else "$name\n$description"
                audiobookVoiceNames[id] = name
            }
            if (voiceIds.isEmpty() || isFinishing) {
                return@launch
            }
            MaterialAlertDialogBuilder(this@WebViewActivity)
                .setTitle("选择听书音色")
                .setItems(labels.toTypedArray()) { _, which ->
                    val voiceId = voiceIds[which]
                    val loading = Snackbar.make(
                        binding.root,
                        "正在准备 ${audiobookVoiceNames[voiceId] ?: "音色"}…",
                        Snackbar.LENGTH_INDEFINITE,
                    )
                    loading.show()
                    binding.nativeAudiobookPlayer.hideModelDownloadProgress()
                    lifecycleScope.launch {
                        runCatching {
                            service.setVoice(voiceId) { downloadedBytes, totalBytes ->
                                binding.root.post {
                                    if (!isFinishing && !isDestroyed) {
                                        binding.nativeAudiobookPlayer.showModelDownloadProgress(
                                            downloadedBytes,
                                            totalBytes,
                                        )
                                    }
                                }
                            }
                        }
                            .onSuccess {
                                Snackbar.make(binding.root, "音色已切换", Snackbar.LENGTH_SHORT).show()
                            }
                            .onFailure { error ->
                                Snackbar.make(
                                    binding.root,
                                    "音色加载失败：${error.message ?: "未知错误"}",
                                    Snackbar.LENGTH_LONG,
                                ).show()
                            }
                        binding.nativeAudiobookPlayer.hideModelDownloadProgress()
                        loading.dismiss()
                    }
                }
                .setNegativeButton("取消", null)
                .show()
        }
    }

    private fun showAudiobookSpeedDialog() {
        val speeds = floatArrayOf(0.75f, 1.0f, 1.25f, 1.5f, 1.75f, 2.0f)
        val labels = speeds.map { speed -> "${speed}×" }.toTypedArray()
        MaterialAlertDialogBuilder(this)
            .setTitle("播放倍速")
            .setItems(labels) { _, which -> audioService?.setPlaybackSpeed(speeds[which]) }
            .setNegativeButton("取消", null)
            .show()
    }

    private fun showAudiobookSleepTimerDialog() {
        val labels = arrayOf("关闭定时", "15 分钟", "30 分钟", "60 分钟", "90 分钟")
        val minutes = arrayOf<Int?>(null, 15, 30, 60, 90)
        MaterialAlertDialogBuilder(this)
            .setTitle("睡眠定时")
            .setItems(labels) { _, which ->
                audioService?.setSleepTimer(minutes[which])
                Snackbar.make(
                    binding.root,
                    minutes[which]?.let { "将在 $it 分钟后暂停" } ?: "已关闭睡眠定时",
                    Snackbar.LENGTH_SHORT,
                ).show()
            }
            .setNegativeButton("取消", null)
            .show()
    }

    companion object {
        private const val TAG = "WebViewActivity"
        const val EXTRA_LOCAL_PATH = "extra_local_path"
        const val EXTRA_ROUTE_URL = "extra_route_url"
        const val EXTRA_SUPPRESS_LOADING_OVERLAY = "extra_suppress_loading_overlay"
        const val EXTRA_USE_WARM_WEBVIEW = "extra_use_warm_webview"
        const val EXTRA_INITIAL_BACKGROUND_COLOR = "extra_initial_background_color"

        fun isDevServerEnabled(): Boolean {
            return BuildConfig.WEBVIEW_ENTRY_URL.isNotBlank()
        }

        fun resolveEntryUrl(localPath: String, routeUrl: String = ""): String {
            val entryUrl = BuildConfig.WEBVIEW_ENTRY_URL.takeIf { it.isNotBlank() }
                ?: File(localPath).toURI().toString()
            val normalizedRoute = normalizeNativeRouteUrl(routeUrl) ?: return entryUrl
            val baseUrl = entryUrl.substringBefore("#")
            return "$baseUrl#$normalizedRoute"
        }

        fun normalizeNativeRouteUrl(routeUrl: String?): String? {
            return NativeRouteUrl.normalize(routeUrl)
        }
    }
}
