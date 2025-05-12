let debug = process.env.NODE_ENV !== 'production';
const install = Vue => {
	let vk = Vue.prototype ? Vue.prototype.vk : Vue.config.globalProperties.vk;
	if (vk) {
		vk.log = console.log;
		if (typeof vk.getConfig === "function") {
			debug = vk.getConfig().debug;
		}
		if (!debug) {
			console.log = function(...obj) {};
		}
	}
}

export default {
	install
}