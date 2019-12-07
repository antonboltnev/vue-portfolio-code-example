import Vue from 'vue'
import App from './App.vue'
import store from './vuex/store.js'
import './components/filters/filters.less'
import './components/layout/layout.less'
import './components/users_list/users_list.less'
import './theme/colors.less'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store
}).$mount('#app')
