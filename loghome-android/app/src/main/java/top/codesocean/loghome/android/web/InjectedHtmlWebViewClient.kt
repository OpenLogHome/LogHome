package top.codesocean.loghome.android.web

import android.content.Context
import android.net.Uri
import android.webkit.WebResourceError
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebView
import android.webkit.WebViewClient
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.ByteArrayInputStream
import java.io.File
import java.io.FileInputStream

class InjectedHtmlWebViewClient(
    private val context: Context,
    private val injectedScriptProvider: () -> String,
    private val onPageLoadingChanged: (Boolean) -> Unit,
    private val onPageError: (String) -> Unit,
    private val onMissingLocalResource: () -> Unit,
) : WebViewClient() {
    private val httpClient = OkHttpClient()

    override fun shouldInterceptRequest(
        view: WebView?,
        request: WebResourceRequest?,
    ): WebResourceResponse? {
        val url = request?.url ?: return super.shouldInterceptRequest(view, request)
        return when {
            request.isForMainFrame && url.scheme == "file" -> {
                interceptLocalHtml(url) ?: super.shouldInterceptRequest(view, request)
            }

            request.isForMainFrame && (url.scheme == "http" || url.scheme == "https") -> {
                interceptRemoteHtml(url.toString()) ?: super.shouldInterceptRequest(view, request)
            }

            (url.scheme == "http" || url.scheme == "https") &&
                url.host == WebViewFontCache.FONT_ASSET_HOST &&
                url.path?.startsWith(WebViewFontCache.FONT_ASSET_PATH_PREFIX) == true -> {
                interceptReaderFont(url) ?: super.shouldInterceptRequest(view, request)
            }

            else -> super.shouldInterceptRequest(view, request)
        }
    }

    override fun onPageStarted(view: WebView?, url: String?, favicon: android.graphics.Bitmap?) {
        onPageLoadingChanged(true)
        super.onPageStarted(view, url, favicon)
    }

    override fun onPageFinished(view: WebView?, url: String?) {
        onPageLoadingChanged(false)
        super.onPageFinished(view, url)
    }

    override fun onReceivedError(
        view: WebView?,
        request: WebResourceRequest?,
        error: WebResourceError?,
    ) {
        if (request?.isForMainFrame == true) {
            onPageLoadingChanged(false)
            onPageError(error?.description?.toString() ?: "Unknown error")
            if (request.url?.scheme == "file") {
                onMissingLocalResource()
            }
        }
        super.onReceivedError(view, request, error)
    }

    private fun injectIntoHead(html: String, script: String): String {
        val injection = "<script>$script</script>"
        val headRegex = Regex("<head[^>]*>", RegexOption.IGNORE_CASE)
        val match = headRegex.find(html)
        return if (match != null) {
            buildString(html.length + injection.length + 16) {
                append(html.substring(0, match.range.last + 1))
                append(injection)
                append(html.substring(match.range.last + 1))
            }
        } else {
            "$injection$html"
        }
    }

    private fun interceptLocalHtml(url: Uri): WebResourceResponse? {
        val path = Uri.decode(url.path ?: return null)
        if (!path.endsWith(".html", ignoreCase = true)) {
            return null
        }

        return runCatching {
            val originalHtml = File(path).readText(Charsets.UTF_8)
            val injectedHtml = injectIntoHead(originalHtml, injectedScriptProvider())
            WebResourceResponse(
                "text/html",
                "utf-8",
                ByteArrayInputStream(injectedHtml.toByteArray(Charsets.UTF_8)),
            )
        }.getOrNull()
    }

    private fun interceptRemoteHtml(url: String): WebResourceResponse? {
        return runCatching {
            httpClient.newCall(
                Request.Builder()
                    .url(url)
                    .get()
                    .build(),
            ).execute().use { response ->
                if (!response.isSuccessful) {
                    return null
                }

                val body = response.body ?: return null
                val contentType = body.contentType()
                val mimeType = contentType?.let { "${it.type}/${it.subtype}" } ?: "text/html"
                if (mimeType != "text/html") {
                    return null
                }

                val charset = contentType?.charset(Charsets.UTF_8) ?: Charsets.UTF_8
                val injectedHtml = injectIntoHead(body.string(), injectedScriptProvider())
                WebResourceResponse(
                    mimeType,
                    charset.name(),
                    response.code,
                    response.message,
                    response.headers.toMultimap().mapValues { (_, values) -> values.joinToString("; ") },
                    ByteArrayInputStream(injectedHtml.toByteArray(charset)),
                )
            }
        }.getOrNull()
    }

    private fun interceptReaderFont(url: Uri): WebResourceResponse? {
        val fileName = url.lastPathSegment ?: return null
        val fontFile = WebViewFontCache.resolveCachedFontFile(context, fileName) ?: return null
        val mimeType = when {
            fileName.endsWith(".ttf", ignoreCase = true) -> "font/ttf"
            fileName.endsWith(".otf", ignoreCase = true) -> "font/otf"
            fileName.endsWith(".woff", ignoreCase = true) -> "font/woff"
            fileName.endsWith(".woff2", ignoreCase = true) -> "font/woff2"
            else -> "application/octet-stream"
        }
        val headers = mapOf(
            "Access-Control-Allow-Origin" to "*",
            "Cache-Control" to "public, max-age=31536000, immutable",
        )
        return WebResourceResponse(
            mimeType,
            null,
            200,
            "OK",
            headers,
            FileInputStream(fontFile),
        )
    }
}
