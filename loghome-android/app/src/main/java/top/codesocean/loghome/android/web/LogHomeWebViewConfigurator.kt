package top.codesocean.loghome.android.web

import android.annotation.SuppressLint
import android.webkit.WebView

object LogHomeWebViewConfigurator {
    @SuppressLint("SetJavaScriptEnabled")
    @Suppress("DEPRECATION")
    fun applyDefaultSettings(webView: WebView) {
        webView.apply {
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
        }
    }
}
