import Vue from 'vue'

import App from './App.vue'
import router from './router'
import store from './store'

// 引入lodash工具库
import _ from 'lodash'
Vue.prototype._ = _

// 引入elementui
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/reset.css'

import 'dat.gui/build/dat.gui.js';
import 'dat.gui/build/dat.gui.css';


// 全局过滤器&全局过滤器定义
import filters from "@/filter/index.js";
Object.entries(filters).forEach((item) => {
  Vue.filter(item[0], item[1]);
});

Vue.use(ElementUI)

// 中央事件总线
Vue.prototype.$bus = new Vue()

Vue.config.productionTip = false

var isLogin =  true
router.beforeEach(async(to, from, next) => {
  if(isLogin){
    if(to.matched.length == 0){
      const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])
      router.addRoutes(accessRoutes)
      next({ ...to, replace: true })
    }else{
      next()
    }
    
  }
  
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
