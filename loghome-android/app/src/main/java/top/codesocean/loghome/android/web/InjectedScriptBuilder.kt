package top.codesocean.loghome.android.web

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject

object InjectedScriptBuilder {
    private const val BRIDGE_SHIM = """
(function() {
    if (window.__logHomeNativeBridge) {
        return;
    }
    const callbacks = new Map();
    let nextId = 1;
    window.__logHomeNativeBridge = {
        resolve: function(id, value) {
            const callback = callbacks.get(String(id));
            if (!callback) {
                return;
            }
            callbacks.delete(String(id));
            callback.resolve(value);
        },
        reject: function(id, error) {
            const callback = callbacks.get(String(id));
            if (!callback) {
                return;
            }
            callbacks.delete(String(id));
            callback.reject(new Error(error || "Native bridge error"));
        }
    };
    window.flutter_inappwebview = window.flutter_inappwebview || {};
    window.flutter_inappwebview.callHandler = function(name) {
        const args = Array.prototype.slice.call(arguments, 1);
        return new Promise(function(resolve, reject) {
            const id = String(nextId++);
            callbacks.set(id, { resolve: resolve, reject: reject });
            if (!window.LogHomeBridge || !window.LogHomeBridge.postMessage) {
                callbacks.delete(id);
                reject(new Error("Native bridge unavailable"));
                return;
            }
            window.LogHomeBridge.postMessage(JSON.stringify({
                id: id,
                name: name,
                args: args
            }));
        });
    };
})();
"""

    suspend fun build(
        context: Context,
        statusBarHeightDp: Double,
        navigationBarHeightDp: Double,
        assetVersion: String,
    ): String = withContext(Dispatchers.IO) {
        val jsBridgeSource = context.assets.open("js/jsbridge.js").bufferedReader().use { it.readText() }
        val assignments = buildString {
            appendLine("window.jsBridge.statusBarHeight = $statusBarHeightDp;")
            appendLine("window.jsBridge.navigationBarHeight = $navigationBarHeightDp;")
            appendLine("window.jsBridge.appVersion = ${JSONObject.quote(assetVersion)};")
        }

        sanitizeForInlineScript(listOf(BRIDGE_SHIM, jsBridgeSource, assignments).joinToString("\n"))
    }

    private fun sanitizeForInlineScript(source: String): String {
        return source.replace("</script", "<\\/script", ignoreCase = true)
    }
}
