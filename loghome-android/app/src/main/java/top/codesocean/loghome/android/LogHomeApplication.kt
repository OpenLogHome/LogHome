package top.codesocean.loghome.android

import android.app.Application
import android.webkit.WebView
import androidx.appcompat.app.AppCompatDelegate

class LogHomeApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
        WebView.setWebContentsDebuggingEnabled(BuildConfig.DEBUG)
    }
}
