package top.codesocean.loghome.android

/** Validate the page path without treating URLs or punctuation in query values as paths. */
object NativeRouteUrl {
    fun normalize(routeUrl: String?): String? {
        val trimmed = routeUrl?.trim().orEmpty().removePrefix("#")
        if (trimmed.isBlank() || trimmed.startsWith("//")) return null
        val route = if (trimmed.startsWith("/")) trimmed else "/$trimmed"
        val path = route.substringBefore('?').substringBefore('#')
        if (!path.startsWith("/pages/")) return null
        if (path.split('/').any { it == "." || it == ".." }) return null
        return route
    }
}
