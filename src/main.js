import './lib/css'
import './lib/script'
import './lib/global'

import Vue from 'vue'
import App from './App'
import router from './router'
import EventBus from './lib/eventBus.js'
import axios from 'axios'
import store from './store/index'
import Vuelidate from 'vuelidate'
import DataTable from 'laravel-vue-datatable'
import Table from 'ant-design-vue'
import BeeGridTable from 'beegridtable'
import BeeLocale from 'beegridtable/src/locale'
import 'beegridtable/dist/styles/beegridtable.css'
import LoadScript from 'vue-plugin-load-script'
import VueQuillEditor from 'vue-quill-editor'
import VueApexCharts from 'vue-apexcharts'
import Loading from 'vue-loading-overlay'
import VueToast from 'vue-toast-notification'
import 'vue-toast-notification/dist/theme-sugar.css'
// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.component('loading', Loading)
Vue.use(VueToast)
Vue.component('apexchart', VueApexCharts)
Vue.use(VueQuillEditor /* { default global options } */)
Vue.use(BeeGridTable, {
  locale: BeeLocale,
  capture: true
})

Vue.prototype.$bus = EventBus
Vue.prototype.$http = axios
Vue.use(LoadScript)
Vue.use(Table)
Vue.use(store)
Vue.use(Vuelidate)
Vue.use(DataTable)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
