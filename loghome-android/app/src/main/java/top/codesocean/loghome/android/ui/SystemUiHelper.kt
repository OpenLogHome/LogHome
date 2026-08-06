package top.codesocean.loghome.android.ui

import android.content.Context
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.view.View
import android.view.Window
import androidx.annotation.ColorInt
import androidx.core.graphics.ColorUtils
import androidx.core.view.WindowCompat

object SystemUiHelper {
    private const val THEME_PREFERENCES = "loghome_native_theme"
    private const val KEY_LAST_BACKGROUND_COLOR = "last_background_color"
    private const val DARK_BACKGROUND_COLOR = 0xFF252525.toInt()

    fun applySystemBarStyle(
        window: Window,
        rootView: View,
        @ColorInt backgroundColor: Int,
        forceDarkIcons: Boolean? = null,
    ) {
        val useDarkIcons = forceDarkIcons ?: shouldUseDarkIcons(backgroundColor)
        window.setBackgroundDrawable(ColorDrawable(backgroundColor))
        window.decorView.setBackgroundColor(backgroundColor)
        rootView.setBackgroundColor(backgroundColor)
        window.statusBarColor = backgroundColor
        window.navigationBarColor = backgroundColor

        val controller = WindowCompat.getInsetsController(window, rootView)
        controller.isAppearanceLightStatusBars = useDarkIcons
        controller.isAppearanceLightNavigationBars = useDarkIcons
    }

    fun shouldUseDarkIcons(@ColorInt backgroundColor: Int): Boolean {
        return ColorUtils.calculateLuminance(backgroundColor) > 0.5
    }

    @ColorInt
    fun resolveInitialBackgroundColor(context: Context): Int {
        val preferences = context.getSharedPreferences(THEME_PREFERENCES, Context.MODE_PRIVATE)
        if (preferences.contains(KEY_LAST_BACKGROUND_COLOR)) {
            return preferences.getInt(KEY_LAST_BACKGROUND_COLOR, Color.WHITE)
        }
        val nightMode = context.resources.configuration.uiMode and Configuration.UI_MODE_NIGHT_MASK
        return if (nightMode == Configuration.UI_MODE_NIGHT_YES) {
            DARK_BACKGROUND_COLOR
        } else {
            Color.WHITE
        }
    }

    fun rememberBackgroundColor(context: Context, @ColorInt backgroundColor: Int) {
        context.getSharedPreferences(THEME_PREFERENCES, Context.MODE_PRIVATE)
            .edit()
            .putInt(KEY_LAST_BACKGROUND_COLOR, backgroundColor)
            .apply()
    }

    @ColorInt
    fun parseColorOrFallback(input: String?, @ColorInt fallback: Int = Color.WHITE): Int {
        if (input.isNullOrBlank()) {
            return fallback
        }

        return runCatching {
            var value = input.trim()
            if (!value.startsWith("#")) {
                value = "#$value"
            }
            if (value.length == 4) {
                val rgb = value.substring(1)
                value = "#${rgb[0]}${rgb[0]}${rgb[1]}${rgb[1]}${rgb[2]}${rgb[2]}"
            }
            Color.parseColor(value)
        }.getOrDefault(fallback)
    }
}
