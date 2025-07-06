import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './theme/index.css'
import ElementUI from 'element-ui'
// 引入axios
import axios from 'axios';
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
// 挂载到vue原型链上
Vue.prototype.axios = axios;
const BASE_URL_PRODUCTION = "http://loghomeservice.codesocean.top"
const BASE_URL_DEV = "http://127.0.0.1:9000"
Vue.prototype.$baseUrl = BASE_URL_DEV;
Vue.prototype.$imgBaseUrl = "http://img.codesocean.top"

Vue.use(ElementUI);

Vue.config.productionTip = false


axios.interceptors.request.use(
    config => {
        if(router.history.current.name == "登录") return config;
        let tk = JSON.parse(window.localStorage.getItem('token'));
        if(tk) {
            tk = tk.tk;
            config.headers.Authorization = tk;//把localStorage的token放在Authorization里
        } else {
            alert("登录失效，请退出重新登录。");
            router.push({name:"登录"});
        }
        return config;
    }
);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')


