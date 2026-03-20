import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		version:"非正式版本",
		appVersion:null,
		appVersionStr:null,
		hypernotion:false,
		isDarkMode: false,
		themeMode: "system"
	},
    mutations: {
		updateDarkMode(state, isDark) {
			state.isDarkMode = isDark;
		},
		updateThemeMode(state, mode) {
			state.themeMode = mode;
		}
	},
    actions: {}
})

export default store
