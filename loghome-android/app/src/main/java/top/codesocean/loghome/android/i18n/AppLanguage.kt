package top.codesocean.loghome.android.i18n

import android.content.Context
import android.content.res.Resources
import androidx.appcompat.app.AppCompatDelegate
import androidx.core.os.LocaleListCompat
import java.util.Locale

/**
 * 应用语言（i18n）单一入口。
 *
 * Source of truth 在 H5 设置页：H5 写 localStorage('loghome_language') 并经 setAppLanguage 桥
 * 同步到这里；本对象只保留原生镜像（SharedPreferences），用于原生 chrome 的资源选择与注入回 H5。
 * 无显式设置时跟随系统；API 33+ 系统级"按应用语言"设置同样经由系统 Locale 生效。
 */
object AppLanguage {
    const val LANG_ZH_CN = "zh-CN"
    const val LANG_EN = "en"
    const val FOLLOW_SYSTEM = "follow-system"
    val SUPPORTED = listOf(LANG_ZH_CN, LANG_EN)

    private const val PREFS_NAME = "loghome_language"
    private const val KEY_LANGUAGE = "language"

    /** 'en-US'/'en' → en；'zh'/'zh-Hans'/'zh-TW' → zh-CN；其余 null */
    fun normalize(raw: String?): String? {
        if (raw.isNullOrBlank()) return null
        val value = raw.trim().lowercase().replace('_', '-')
        return when {
            value == "en" || value.startsWith("en-") -> LANG_EN
            value == "zh" || value.startsWith("zh-") -> LANG_ZH_CN
            else -> null
        }
    }

    /** 设备/系统生效语言（含 API 33+ 系统设置里对本应用的覆盖项） */
    fun systemLanguage(): String {
        val locale = try {
            Resources.getSystem().configuration.locales[0]
        } catch (error: Exception) {
            null
        } ?: Locale.getDefault()
        return normalize(locale.toLanguageTag()) ?: normalize(locale.language) ?: LANG_ZH_CN
    }

    fun savedLanguage(context: Context): String? =
        normalize(
            context.applicationContext
                .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
                .getString(KEY_LANGUAGE, null),
        )

    /** 应用当前生效语言：显式设置优先，否则跟随系统 */
    fun currentLanguage(context: Context): String = savedLanguage(context) ?: systemLanguage()

    fun save(context: Context, language: String) {
        context.applicationContext
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .putString(KEY_LANGUAGE, language)
            .apply()
    }

    fun clearSaved(context: Context) {
        context.applicationContext
            .getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            .edit()
            .remove(KEY_LANGUAGE)
            .apply()
    }

    /**
     * 应用语言到框架（appcompat 1.7 对 API 24-32 提供回退实现，API 33+ 与系统设置联动）。
     * language 传 null 表示恢复跟随系统；设置可能触发正在运行的 Activity 重建。
     */
    fun applyToFramework(language: String?) {
        val tag = language?.let { normalize(it) }
        AppCompatDelegate.setApplicationLocales(
            if (tag == null) LocaleListCompat.getEmptyLocaleList()
            else LocaleListCompat.forLanguageTags(tag),
        )
    }
}
