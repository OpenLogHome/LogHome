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

    private const val TREE_SCENE_DIAGNOSTICS = """
(function() {
    function reportTreeSceneDiagnostics() {
        try {
            const canvas = document.createElement("canvas");
            let webgl2 = null;
            let webgl = null;
            try {
                webgl2 = canvas.getContext("webgl2");
            } catch (error) {}
            try {
                webgl = webgl2 || canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
            } catch (error) {}
            let lowPerformanceMode = null;
            try {
                lowPerformanceMode = window.localStorage ? window.localStorage.getItem("loghomeTreePlantLowPerformance") : null;
            } catch (error) {
                lowPerformanceMode = "__storage_error__";
            }
            console.info("[TREE3D_DIAG]" + JSON.stringify({
                href: window.location ? window.location.href : "",
                readyState: document.readyState,
                lowPerformanceMode: lowPerformanceMode,
                hasWebGLRenderingContext: typeof window.WebGLRenderingContext !== "undefined",
                hasWebGL2RenderingContext: typeof window.WebGL2RenderingContext !== "undefined",
                webgl2Context: !!webgl2,
                webglContext: !!webgl
            }));
        } catch (error) {
            console.info("[TREE3D_DIAG_FAIL]" + String((error && error.message) || error));
        }
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", function() {
            setTimeout(reportTreeSceneDiagnostics, 0);
        }, { once: true });
    } else {
        setTimeout(reportTreeSceneDiagnostics, 0);
    }
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

        sanitizeForInlineScript(
            listOf(BRIDGE_SHIM, jsBridgeSource, assignments, TREE_SCENE_DIAGNOSTICS).joinToString("\n"),
        )
    }

    private fun sanitizeForInlineScript(source: String): String {
        return source.replace("</script", "<\\/script", ignoreCase = true)
    }
}
