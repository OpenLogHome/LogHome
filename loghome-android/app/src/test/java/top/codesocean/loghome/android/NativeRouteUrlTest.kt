package top.codesocean.loghome.android

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Test

class NativeRouteUrlTest {
    @Test fun acceptsActivityWebViewWithExternalUrlInQuery() {
        val route = "/pages/apps/h5webview?url=https://haycraft.loghome.ink/&title=Haycraft2026干草块文会"
        assertEquals(route, NativeRouteUrl.normalize(route))
        val encoded = "/pages/apps/h5webview?url=https%3A%2F%2Fhaycraft.loghome.ink%2F"
        assertEquals(encoded, NativeRouteUrl.normalize(encoded))
    }

    @Test fun preservesGuideIdAndQueryPunctuation() {
        assertEquals("/pages/readers/bookInfo?id=645", NativeRouteUrl.normalize(" #pages/readers/bookInfo?id=645 "))
        val route = "/pages/apps/h5webview?url=https://example.com/a..b#chapter"
        assertEquals(route, NativeRouteUrl.normalize(route))
    }

    @Test fun rejectsExternalUrlsAndTraversalInPagePath() {
        for (route in listOf(null, "", "https://haycraft.loghome.ink/", "//example.com/pages/me", "/other/path", "/pages/../me", "/pages/apps/./h5webview")) {
            assertNull(route, NativeRouteUrl.normalize(route))
        }
    }
}
