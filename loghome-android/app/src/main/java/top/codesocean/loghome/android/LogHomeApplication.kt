package top.codesocean.loghome.android

import android.app.Application
import android.webkit.WebView
import androidx.appcompat.app.AppCompatDelegate
import top.codesocean.loghome.android.ui.SystemUiHelper

class LogHomeApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        val initialBackgroundColor = SystemUiHelper.resolveInitialBackgroundColor(this)
        AppCompatDelegate.setDefaultNightMode(
            if (SystemUiHelper.shouldUseDarkIcons(initialBackgroundColor)) {
                AppCompatDelegate.MODE_NIGHT_NO
            } else {
                AppCompatDelegate.MODE_NIGHT_YES
            },
        )
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)
    }
}
