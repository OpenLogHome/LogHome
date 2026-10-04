import Vue from 'vue'
import Vuex from 'vuex'
import { readAiAssistanceDisabled, persistAiAssistanceDisabled } from '@/common/ai-preference.js'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		aiAssistanceDisabled: readAiAssistanceDisabled(),
		version:"非正式版本",
		appVersion:null,
		appVersionStr:null,
		hypernotion:false,
		isDarkMode: false,
		themeMode: "light"
	},
    mutations: {
		updateAiAssistanceDisabled(state, disabled) {
			state.aiAssistanceDisabled = disabled === true;
		},
		updateDarkMode(state, isDark) {
			state.isDarkMode = isDark;
		},
		updateThemeMode(state, mode) {
			state.themeMode = mode;
		}
	},
    actions: {
		setAiAssistanceDisabled({ commit }, disabled) {
			persistAiAssistanceDisabled(disabled === true);
			commit('updateAiAssistanceDisabled', disabled);
		}
	}
})

export default store
