import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 导入element-ui
import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// 面包屑导航模块
import Breadcrumb from './components/Breadcrumb.vue'

// 导入第三方ui插件
import TreeTable from 'vue-table-with-tree-grid'

Vue.component('breadcrumb', Breadcrumb)

Vue.component('tree-table', TreeTable)

// 把axios挂载在Vue的原型对象上
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 添加请求拦截器
axios.interceptors.request.use(config => {
  // 挂载token在请求头的Authorization字段上
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
