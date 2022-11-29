import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './plugins/router'
import store from './store'
import $api from '@/plugins/api'

import '@/assets/styles/main.scss'

Vue.config.productionTip = false

// Inject store to api module
$api.store = store

Object.defineProperty(Vue.prototype, '$api', { value: $api })

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
