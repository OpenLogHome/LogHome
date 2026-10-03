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

    private const val EARLY_THEME_BOOTSTRAP = """
(function() {
    try {
        function rememberThemeBackground(isDarkMode) {
            if (window.flutter_inappwebview && window.flutter_inappwebview.callHandler) {
                window.flutter_inappwebview
                    .callHandler("rememberThemeBackground", isDarkMode ? "#252525" : "#ffffff")
                    .catch(function() {});
            }
        }

        const themeMode = window.localStorage && window.localStorage.getItem("themeMode");
        const isDarkMode = themeMode === "dark";
        const root = document.documentElement;
        root.classList.toggle("dark-mode", isDarkMode);
        root.style.backgroundColor = isDarkMode ? "#121212" : "#ffffff";
        root.style.colorScheme = isDarkMode ? "dark" : "light";

        const style = document.createElement("style");
        style.id = "loghome-early-theme";
        style.textContent =
            "html.dark-mode,html.dark-mode body,html.dark-mode #app{" +
            "background-color:#121212!important;color:#e5e5e5;color-scheme:dark;}" +
            "html.dark-mode .native-preload{background-color:#121212!important;}";
        document.head.appendChild(style);

        rememberThemeBackground(isDarkMode);

        const storagePrototype = window.Storage && window.Storage.prototype;
        if (storagePrototype && !storagePrototype.__logHomeThemePatched) {
            const originalSetItem = storagePrototype.setItem;
            storagePrototype.setItem = function(key, value) {
                originalSetItem.apply(this, arguments);
                if (this === window.localStorage && key === "themeMode") {
                    rememberThemeBackground(value === "dark");
                }
            };
            storagePrototype.__logHomeThemePatched = true;
        }
    } catch (error) {}
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
        language: String,
        savedLanguage: String? = null,
    ): String = withContext(Dispatchers.IO) {
        val jsBridgeSource = context.assets.open("js/jsbridge.js").bufferedReader().use { it.readText() }
        val assignments = buildString {
            appendLine("window.jsBridge.statusBarHeight = $statusBarHeightDp;")
            appendLine("window.jsBridge.navigationBarHeight = $navigationBarHeightDp;")
            appendLine("window.jsBridge.appVersion = ${JSONObject.quote(assetVersion)};")
            // i18n：H5 读取生效语言；原生存在显式设置而 H5 尚未落库时播种本地偏好
            appendLine("window.jsBridge.language = ${JSONObject.quote(language)};")
            if (!savedLanguage.isNullOrBlank()) {
                appendLine(
                    "try { if (!window.localStorage.getItem(\"loghome_language\")) {" +
                        " window.localStorage.setItem(\"loghome_language\", ${JSONObject.quote(savedLanguage)});" +
                        " } } catch (error) {}",
                )
            }
            appendLine("document.documentElement.classList.add('loghome-edge-to-edge');")
            appendLine("document.documentElement.style.setProperty('--loghome-native-safe-top', '${statusBarHeightDp}px');")
            appendLine("document.documentElement.style.setProperty('--loghome-native-safe-bottom', '${navigationBarHeightDp}px');")
            // Android reserves navigation/IME space outside the WebView, including on old H5 bundles.
            appendLine("document.documentElement.style.setProperty('--loghome-safe-bottom', '0px');")
        }

        sanitizeForInlineScript(
            listOf(
                BRIDGE_SHIM,
                jsBridgeSource,
                assignments,
                EARLY_THEME_BOOTSTRAP,
                TREE_SCENE_DIAGNOSTICS,
            ).joinToString("\n"),
        )
    }

    private fun sanitizeForInlineScript(source: String): String {
        return source.replace("</script", "<\\/script", ignoreCase = true)
    }
}
