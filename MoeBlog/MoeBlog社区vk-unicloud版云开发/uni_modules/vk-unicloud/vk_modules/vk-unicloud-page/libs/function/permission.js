function $hasRole(...args) {
	const userRoles = this.$store.state.$user.userInfo.role || [];
	return args.some(arg => {
		if (Array.isArray(arg)) {
			return arg.every(role => userRoles.includes(role));
		} else {
			return userRoles.includes(arg);
		}
	});
}

function $hasPermission(...args) {
	const userPermission = this.$store.state.$user.permission || []
	return args.some(arg => {
		if (Array.isArray(arg)) {
			return arg.every(permission => userPermission.includes(permission));
		} else {
			return userPermission.includes(arg);
		}
	});
}

export default function(Vue) {
	// #ifndef VUE3
	Vue.prototype.$hasRole = $hasRole;
	Vue.prototype.$hasPermission = $hasPermission;
	// #endif

	// #ifdef VUE3
	Vue.config.globalProperties.$hasRole = $hasRole;
	Vue.config.globalProperties.$hasPermission = $hasPermission;
	// #endif
}