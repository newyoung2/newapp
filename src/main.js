import Vue from 'vue'
// 引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App.vue'
import router from './router'
import store from './store'

// 全局过滤器&全局过滤器定义
import filters from "@/filter/index.js";
Object.entries(filters).forEach((item) => {
  Vue.filter(item[0], item[1]);
});

Vue.use(ElementUI)

// 中央事件总线
Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
