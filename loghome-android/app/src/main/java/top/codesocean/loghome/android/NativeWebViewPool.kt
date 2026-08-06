package top.codesocean.loghome.android

import android.app.Activity
import android.content.Context
import android.content.MutableContextWrapper
import android.os.Handler
import android.os.Looper
import android.util.Log
import android.view.ViewGroup
import android.webkit.ConsoleMessage
import android.webkit.WebChromeClient
import android.webkit.WebView
import top.codesocean.loghome.android.ui.SystemUiHelper
import top.codesocean.loghome.android.web.InjectedHtmlWebViewClient
import top.codesocean.loghome.android.web.LogHomeWebViewConfigurator
import top.codesocean.loghome.android.web.WebViewBridgeInterface

object NativeWebViewPool {
    private const val TAG = "NativeWebViewPool"
    private const val PRELOAD_ROUTE = "/pages/native/preload"

    private val mainHandler = Handler(Looper.getMainLooper())
    private var warmSlot: WarmSlot? = null
    private var warming = false

    data class AcquiredWebView(
        val webView: WebView,
        val bridgeInterface: WebViewBridgeInterface,
        val injectedScript: String,
    )

    private data class WarmSlot(
        val localPath: String,
        val themeBackgroundColor: Int,
        val contextWrapper: MutableContextWrapper,
        val webView: WebView,
        val bridgeInterface: WebViewBridgeInterface,
        val injectedScript: String,
        var ready: Boolean = false,
    )

    fun acquire(activity: Activity, localPath: String): AcquiredWebView? {
        if (Looper.myLooper() != Looper.getMainLooper()) {
            return null
        }

        val slot = warmSlot ?: return null
        if (slot.localPath != localPath) {
            destroySlot(slot, "local path changed")
            return null
        }
        if (slot.themeBackgroundColor != SystemUiHelper.resolveInitialBackgroundColor(activity)) {
            destroySlot(slot, "theme changed")
            return null
        }
        if (!slot.ready || slot.injectedScript.isBlank()) {
            return null
        }

        warmSlot = null
        warming = false
        slot.contextWrapper.baseContext = activity
        (slot.webView.parent as? ViewGroup)?.removeView(slot.webView)
        Log.d(TAG, "Acquired warm WebView")
        return AcquiredWebView(
            webView = slot.webView,
            bridgeInterface = slot.bridgeInterface,
            injectedScript = slot.injectedScript,
        )
    }

    fun warm(context: Context, localPath: String, injectedScript: String) {
        if (injectedScript.isBlank()) {
            return
        }

        val appContext = context.applicationContext
        mainHandler.post {
            warmOnMainThread(appContext, localPath, injectedScript)
        }
    }

    private fun warmOnMainThread(context: Context, localPath: String, injectedScript: String) {
        warmSlot?.let { slot ->
            if (slot.localPath != localPath) {
                destroySlot(slot, "local path changed")
            }
        }
        if (warming || warmSlot != null) {
            return
        }

        warming = true
        val contextWrapper = MutableContextWrapper(context)
        val bridgeInterface = WebViewBridgeInterface()
        val webView = WebView(contextWrapper)
        val themeBackgroundColor = SystemUiHelper.resolveInitialBackgroundColor(context)
        val slot = WarmSlot(
            localPath = localPath,
            themeBackgroundColor = themeBackgroundColor,
            contextWrapper = contextWrapper,
            webView = webView,
            bridgeInterface = bridgeInterface,
            injectedScript = injectedScript,
        )
        warmSlot = slot

        LogHomeWebViewConfigurator.applyDefaultSettings(webView)
        webView.setBackgroundColor(themeBackgroundColor)
        webView.alpha = 0f
        webView.addJavascriptInterface(bridgeInterface, "LogHomeBridge")
        webView.webViewClient = InjectedHtmlWebViewClient(
            context = context,
            injectedScriptProvider = { injectedScript },
            onPageLoadingChanged = { loading ->
                mainHandler.post {
                    val current = warmSlot ?: return@post
                    if (current.webView !== webView) {
                        return@post
                    }
                    if (!loading) {
                        current.ready = true
                        warming = false
                        Log.d(TAG, "Warm WebView ready")
                    }
                }
            },
            onPageError = { errorText ->
                mainHandler.post {
                    val current = warmSlot ?: return@post
                    if (current.webView === webView) {
                        destroySlot(current, "preload failed: $errorText")
                    }
                }
            },
            onMissingLocalResource = {
                mainHandler.post {
                    val current = warmSlot ?: return@post
                    if (current.webView === webView) {
                        destroySlot(current, "preload resource missing")
                    }
                }
            },
        )
        webView.webChromeClient = object : WebChromeClient() {
            override fun onConsoleMessage(consoleMessage: ConsoleMessage): Boolean {
                Log.d("LogHomeWebView", consoleMessage.message())
                return super.onConsoleMessage(consoleMessage)
            }
        }
        webView.loadUrl(WebViewActivity.resolveEntryUrl(localPath, PRELOAD_ROUTE))
    }

    fun invalidate(reason: String = "invalidated") {
        if (Looper.myLooper() == Looper.getMainLooper()) {
            warmSlot?.let { destroySlot(it, reason) }
            return
        }
        mainHandler.post {
            warmSlot?.let { destroySlot(it, reason) }
        }
    }

    private fun destroySlot(slot: WarmSlot, reason: String) {
        if (warmSlot === slot) {
            warmSlot = null
        }
        warming = false
        slot.bridgeInterface.clearHandler()
        (slot.webView.parent as? ViewGroup)?.removeView(slot.webView)
        slot.webView.destroy()
        Log.d(TAG, "Destroyed warm WebView: $reason")
    }
}
