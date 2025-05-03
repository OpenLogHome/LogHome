import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		version:"非正式版本",
		appVersion:null,
		hypernotion:false,
		isDarkMode: false
	},
    mutations: {
		updateDarkMode(state, isDark) {
			state.isDarkMode = isDark;
		}
	},
    actions: {}
})

export default store