import Vue from 'vue'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.component('v-select', vSelect)

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)

import Toasted from 'vue-toasted';
Vue.use(Toasted);

import App from './App.vue'
import store from "./store"
import router from './router.js'

Vue.config.productionTip = false;

new Vue({
  store: store,
  created(){
    this.$store.dispatch('getCsrfToken');
    // this.$store.dispatch('reflectTaskTableFromDb');
    // this.$store.dispatch('reflectDoneTaskTable');
    // this.$store.dispatch('reflectDeletedTaskTable');
  },
  router: router,
  render: h => h(App),
}).$mount('#app')
