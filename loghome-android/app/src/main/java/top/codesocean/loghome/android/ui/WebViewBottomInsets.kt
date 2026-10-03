package top.codesocean.loghome.android.ui

/** Insets are measured from the same bottom edge, so keyboard and navigation overlap. */
internal object WebViewBottomInsets {
    fun viewportBottom(navigationBottom: Int, imeBottom: Int, systemBarsVisible: Boolean): Int {
        val navigation = if (systemBarsVisible) navigationBottom.coerceAtLeast(0) else 0
        return maxOf(navigation, imeBottom.coerceAtLeast(0))
    }
}
