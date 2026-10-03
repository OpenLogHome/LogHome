package top.codesocean.loghome.android.ui

import org.junit.Assert.assertEquals
import org.junit.Test

class WebViewBottomInsetsTest {
    @Test fun reservesThreeButtonNavigationWithoutKeyboard() {
        assertEquals(144, WebViewBottomInsets.viewportBottom(144, 0, true))
    }

    @Test fun handlesGestureNavigationAndDevicesWithoutBottomBar() {
        assertEquals(24, WebViewBottomInsets.viewportBottom(24, 0, true))
        assertEquals(0, WebViewBottomInsets.viewportBottom(0, 0, true))
    }

    @Test fun keyboardOverlapsNavigationRatherThanAddingToIt() {
        assertEquals(800, WebViewBottomInsets.viewportBottom(144, 800, true))
        assertEquals(144, WebViewBottomInsets.viewportBottom(144, 100, true))
    }

    @Test fun immersiveReaderUsesFullHeightButStillAvoidsKeyboard() {
        assertEquals(0, WebViewBottomInsets.viewportBottom(144, 0, false))
        assertEquals(800, WebViewBottomInsets.viewportBottom(144, 800, false))
    }

    @Test fun restoresNavigationSpaceAfterKeyboardAndImmersiveMode() {
        val states = listOf(
            WebViewBottomInsets.viewportBottom(144, 0, true),
            WebViewBottomInsets.viewportBottom(144, 800, true),
            WebViewBottomInsets.viewportBottom(144, 0, true),
            WebViewBottomInsets.viewportBottom(144, 0, false),
            WebViewBottomInsets.viewportBottom(144, 0, true),
        )
        assertEquals(listOf(144, 800, 144, 0, 144), states)
    }
}
