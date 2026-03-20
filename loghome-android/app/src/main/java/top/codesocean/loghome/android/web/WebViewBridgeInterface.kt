package top.codesocean.loghome.android.web

import android.webkit.JavascriptInterface

class WebViewBridgeInterface(
    private val onMessage: (String) -> Unit,
) {
    @JavascriptInterface
    fun postMessage(message: String) {
        onMessage(message)
    }
}
