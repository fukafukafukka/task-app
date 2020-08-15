import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.component('v-select', vSelect)

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import App from './App.vue'
import store from "./store"

Vue.config.productionTip = false;

new Vue({
  store: store,
  render: h => h(App),
}).$mount('#app')
