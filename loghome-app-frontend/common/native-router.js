const ROUTER_METHODS = {
	navigateTo: 'nativeNavigateTo',
	redirectTo: 'nativeRedirectTo',
	reLaunch: 'nativeReLaunch',
	navigateBack: 'nativeNavigateBack',
}

const UNSUPPORTED_QUERY_KEYS = ['noneAnimation', 'nativeRouter']

function getBridge() {
	return typeof window !== 'undefined' ? window.jsBridge : null
}

function getOriginalRouter(uniRef) {
	if (!uniRef.__loghomeOriginalRouter) {
		uniRef.__loghomeOriginalRouter = {
			navigateTo: uniRef.navigateTo && uniRef.navigateTo.bind(uniRef),
			redirectTo: uniRef.redirectTo && uniRef.redirectTo.bind(uniRef),
			reLaunch: uniRef.reLaunch && uniRef.reLaunch.bind(uniRef),
			switchTab: uniRef.switchTab && uniRef.switchTab.bind(uniRef),
			navigateBack: uniRef.navigateBack && uniRef.navigateBack.bind(uniRef),
		}
	}
	return uniRef.__loghomeOriginalRouter
}

function getCurrentRoutePath() {
	try {
		const pages = typeof getCurrentPages === 'function' ? getCurrentPages() : []
		const currentPage = pages && pages.length ? pages[pages.length - 1] : null
		return (currentPage && (currentPage.route || currentPage.__route__)) || ''
	} catch (error) {
		return ''
	}
}

function splitUrl(url) {
	const hashIndex = url.indexOf('#')
	const hash = hashIndex >= 0 ? url.slice(hashIndex) : ''
	const withoutHash = hashIndex >= 0 ? url.slice(0, hashIndex) : url
	const queryIndex = withoutHash.indexOf('?')
	return {
		path: queryIndex >= 0 ? withoutHash.slice(0, queryIndex) : withoutHash,
		query: queryIndex >= 0 ? withoutHash.slice(queryIndex) : '',
		hash,
	}
}

function normalizePathSegments(path) {
	const segments = []
	path.split('/').forEach((segment) => {
		if (!segment || segment === '.') return
		if (segment === '..') {
			segments.pop()
			return
		}
		segments.push(segment)
	})
	return '/' + segments.join('/')
}

export function resolveRouteUrl(rawUrl) {
	if (!rawUrl || typeof rawUrl !== 'string') return ''
	if (/^[a-z][a-z0-9+.-]*:\/\//i.test(rawUrl)) return ''

	const parts = splitUrl(rawUrl.trim())
	if (!parts.path) return ''

	let path = parts.path
	if (path.startsWith('/')) {
		path = normalizePathSegments(path)
	} else {
		const currentRoute = getCurrentRoutePath()
		const baseDir = currentRoute ? currentRoute.split('/').slice(0, -1).join('/') : ''
		path = normalizePathSegments('/' + [baseDir, path].filter(Boolean).join('/'))
	}

	if (!path.startsWith('/pages/')) return ''
	return path + parts.query + parts.hash
}

function hasQueryFlag(url, key, expectedValue) {
	const queryIndex = url.indexOf('?')
	if (queryIndex < 0) return false
	const hashIndex = url.indexOf('#', queryIndex)
	const query = url.slice(queryIndex + 1, hashIndex >= 0 ? hashIndex : undefined)
	return query.split('&').some((pair) => {
		const [rawKey, rawValue = ''] = pair.split('=')
		let decodedKey = rawKey || ''
		let decodedValue = rawValue || ''
		try {
			decodedKey = decodeURIComponent(decodedKey)
			decodedValue = decodeURIComponent(decodedValue)
		} catch (error) {
			return false
		}
		if (decodedKey !== key) return false
		if (expectedValue === undefined) return true
		return decodedValue === expectedValue
	})
}

function shouldUseOriginal(method, options, routeUrl) {
	if (typeof window !== 'undefined' && window.__LOGHOME_DISABLE_NATIVE_ROUTER__) return true
	if (method !== 'navigateBack' && !routeUrl) return true
	if (options && options.events) return true
	if (method !== 'navigateBack') {
		if (UNSUPPORTED_QUERY_KEYS.some((key) => hasQueryFlag(routeUrl, key, key === 'nativeRouter' ? '0' : undefined))) {
			return true
		}
	}
	return false
}

function isNativeRouterAvailable(method) {
	const bridge = getBridge()
	const nativeMethod = ROUTER_METHODS[method]
	return !!(
		bridge &&
		bridge.inApp &&
		bridge.nativeRouterAvailable &&
		nativeMethod &&
		typeof bridge[nativeMethod] === 'function'
	)
}

function markNativeRouterEnvironment() {
	if (typeof document === 'undefined') return
	const bridge = getBridge()
	const enabled = !!(bridge && bridge.inApp && bridge.nativeRouterAvailable)
	document.documentElement.classList.toggle('loghome-native-router', enabled)
}

function callCallback(callback, payload) {
	if (typeof callback === 'function') {
		callback(payload)
	}
}

function callOriginal(original, method, options) {
	const fn = original[method]
	return typeof fn === 'function' ? fn(options) : undefined
}

function callNativeNavigateBack(original, options) {
	const bridge = getBridge()
	if (!isNativeRouterAvailable('navigateBack')) {
		return callOriginal(original, 'navigateBack', options)
	}
	return Promise.resolve()
		.then(() => bridge.nativeNavigateBack({ delta: Number((options && options.delta) || 1) || 1 }))
		.then((result) => {
			if (result && result.ok === false) {
				throw new Error(result.reason || 'native router rejected')
			}
			return result
		})
		.catch((error) => {
			console.warn('[native-router] fallback to uni back:', error)
			return callOriginal(original, 'navigateBack', options)
		})
}

function runNativeRouter(original, method, options) {
	const bridge = getBridge()
	const nativeMethod = ROUTER_METHODS[method]
	const normalizedOptions = options || {}
	const routeUrl = method === 'navigateBack' ? '' : resolveRouteUrl(normalizedOptions.url)

	if (!isNativeRouterAvailable(method) || shouldUseOriginal(method, normalizedOptions, routeUrl)) {
		return callOriginal(original, method, options)
	}

	const payload = method === 'navigateBack'
		? { delta: Number(normalizedOptions.delta || 1) || 1 }
		: { url: routeUrl }

	const promise = Promise.resolve()
		.then(() => bridge[nativeMethod](payload))
		.then((result) => {
			if (result && result.ok === false) {
				throw new Error(result.reason || 'native router rejected')
			}
			callCallback(normalizedOptions.success, { nativeRouter: true, result })
			callCallback(normalizedOptions.complete, { nativeRouter: true, result })
			return result
		})
		.catch((error) => {
			console.warn('[native-router] fallback to uni router:', method, error)
			const fallbackResult = callOriginal(original, method, options)
			if (fallbackResult === undefined && typeof original[method] !== 'function') {
				callCallback(normalizedOptions.fail, error)
				callCallback(normalizedOptions.complete, error)
			}
			return fallbackResult
		})

	return promise
}

export function installNativeRouter(uniRef) {
	if (!uniRef || uniRef.__loghomeNativeRouterInstalled) return
	markNativeRouterEnvironment()
	const original = getOriginalRouter(uniRef)
	Object.keys(ROUTER_METHODS).forEach((method) => {
		if (typeof original[method] !== 'function') return
		uniRef[method] = function patchedNativeRouter(options) {
			return runNativeRouter(original, method, options)
		}
	})
	installNativeBackClickInterceptor(original)
	uniRef.__loghomeNativeRouterInstalled = true
}

function dispatchNativeBackRequest(source) {
	if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return false
	try {
		const event = new CustomEvent('loghomeNativeBack', {
			cancelable: true,
			detail: { source },
		})
		return window.dispatchEvent(event) === false
	} catch (error) {
		return false
	}
}

function installNativeBackClickInterceptor(original) {
	if (typeof document === 'undefined' || document.__loghomeNativeBackInterceptorInstalled) return
	let lastBackAt = 0
	const handleBackEvent = (event) => {
		const bridge = getBridge()
		if (!(bridge && bridge.inApp && bridge.nativeRouterAvailable)) return
		const target = event.target && event.target.closest
			? event.target.closest('.uni-page-head-hd, [data-loghome-native-back]')
			: null
		if (!target) return

		const now = Date.now()
		if (now - lastBackAt < 500) {
			event.preventDefault()
			event.stopPropagation()
			if (event.stopImmediatePropagation) event.stopImmediatePropagation()
			return
		}
		lastBackAt = now
		event.preventDefault()
		event.stopPropagation()
		if (event.stopImmediatePropagation) event.stopImmediatePropagation()
		if (dispatchNativeBackRequest('app-nav-back')) return
		callNativeNavigateBack(original, { delta: 1 })
	}
	document.addEventListener('touchend', handleBackEvent, true)
	document.addEventListener('click', handleBackEvent, true)
	document.__loghomeNativeBackInterceptorInstalled = true
}
