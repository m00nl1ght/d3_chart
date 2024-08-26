import Vue from 'vue'
import vuetify from '@/plugins/vuetify' // path to vuetify export

import App from './App.vue'
import router from './router'
import i18n from '@/plugins/i18n'

import './assets/main.css'

// Vue.prototype.$t = (val) => val
// Vue.prototype.$te = () => true

new Vue({
  router,
  render: (h) => h(App),
  vuetify,
  i18n
}).$mount('#app')
