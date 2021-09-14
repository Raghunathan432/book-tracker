import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VModal from 'vue-js-modal'
import VueMeta from 'vue-meta'
 
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})
Vue.config.productionTip = false
Vue.use(VModal)

new Vue({
  router,
  store,
  render: function (h) { return h(App) }
}).$mount('#app')
