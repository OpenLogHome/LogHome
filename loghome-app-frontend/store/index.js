import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const store = new Vuex.Store({
    state: {
		version:"非正式版本",
		appVersion:null,
		hypernotion:false
	},
    mutations: {
	},
    actions: {}
})

export default store