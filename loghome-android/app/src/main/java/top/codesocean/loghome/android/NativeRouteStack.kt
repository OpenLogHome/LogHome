package top.codesocean.loghome.android

import java.lang.ref.WeakReference

object NativeRouteStack {
    private val activities = mutableListOf<WeakReference<WebViewActivity>>()

    fun register(activity: WebViewActivity) {
        cleanup()
        activities.removeAll { it.get() === activity }
        activities += WeakReference(activity)
    }

    fun unregister(activity: WebViewActivity) {
        activities.removeAll { it.get() == null || it.get() === activity }
    }

    fun finishTop(delta: Int): Boolean {
        cleanup()
        val activeActivities = activities.mapNotNull { it.get() }
        if (activeActivities.isEmpty()) {
            return false
        }
        val count = delta.coerceAtLeast(1).coerceAtMost(activeActivities.size - 1)
        if (count <= 0) {
            return false
        }
        activeActivities.takeLast(count).asReversed().forEach { activity ->
            activity.finishForNativeRouteBack()
        }
        return true
    }

    fun activeCount(): Int {
        cleanup()
        return activities.mapNotNull { it.get() }.size
    }

    private fun cleanup() {
        activities.removeAll { it.get() == null || it.get()?.isFinishing == true }
    }
}
