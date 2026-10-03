package top.codesocean.loghome.android

import android.app.Application
import android.webkit.WebView
import androidx.appcompat.app.AppCompatDelegate
import top.codesocean.loghome.android.i18n.AppLanguage
import top.codesocean.loghome.android.ui.SystemUiHelper

class LogHomeApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        // i18n：在任何 Activity 创建前回放已保存的应用语言（null = 跟随系统，不干预）
        AppLanguage.applyToFramework(AppLanguage.savedLanguage(this))
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
