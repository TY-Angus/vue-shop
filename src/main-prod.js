import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
// 导入element-ui
// import './plugins/element.js'

// 导入字体图标
import './assets/fonts/iconfont.css'

// 导入全局样式表
import './assets/css/global.css'

// 面包屑导航模块
import Breadcrumb from './components/Breadcrumb.vue'

// 导入第三方ui插件
import TreeTable from 'vue-table-with-tree-grid'

// 导入第三方副文本编辑器
import VueQuillEditor from 'vue-quill-editor'

// 导入nprogress包
import NProgress from 'nprogress'

Vue.component('breadcrumb', Breadcrumb)

Vue.component('tree-table', TreeTable)

Vue.use(VueQuillEditor)

// 把axios挂载在Vue的原型对象上
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 添加请求拦截器
// 在request拦截器中展示进度条
axios.interceptors.request.use(config => {
  // 挂载token在请求头的Authorization字段上
  NProgress.start()
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})

// 在reponse拦截器中隐藏进度条
axios.interceptors.response.use(config => {
  NProgress.done()
  return config
})

Vue.config.productionTip = false

// 过滤器
Vue.filter('dateFormat', function(originVal) {
  const dt = new Date(originVal)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, 0)
  const d = (dt.getDate() + '').padStart(2, 0)
  const h = (dt.getHours() + '').padStart(2, 0)
  const f = (dt.getMinutes() + '').padStart(2, 0)
  const s = (dt.getSeconds() + '').padStart(2, 0)
  return `${y}-${m}-${d} ${h}:${f}:${s}`
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
