import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router/index'
import store from './store/index'
import VueVirtualScroller from 'vue-virtual-scroller'


Vue.use(VueVirtualScroller)



Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
