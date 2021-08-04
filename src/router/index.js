import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

/* Layout */
import Home from '../views/Home.vue'

export const constantRoutes = [
    {
        path: '/',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: () => import('@/views/welcome'),
              },
        ]
    },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
//动态注册modules文件夹中的.js路由文件  
const modulesFiles = require.context('./modules', true, /\.js$/)
 
const modules = modulesFiles.keys().reduce((modules, modulePath) => {
  const value = modulesFiles(modulePath)
  modules.push(value.default)
  return modules
}, [])

export const asyncRoutes = [
   ...modules,
  // 404页面必须放到最后
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

// const originalPush = router.prototype.push;
// router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

export default router
