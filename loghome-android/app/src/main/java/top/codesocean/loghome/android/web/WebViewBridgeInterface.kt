package top.codesocean.loghome.android.web

import android.webkit.JavascriptInterface

class WebViewBridgeInterface(
    onMessage: (String) -> Unit = {},
) {
    @Volatile
    private var messageHandler: (String) -> Unit = onMessage

    fun updateHandler(onMessage: (String) -> Unit) {
        messageHandler = onMessage
    }

    fun clearHandler() {
        messageHandler = {}
    }

    @JavascriptInterface
    fun postMessage(message: String) {
        messageHandler(message)
    }
}
