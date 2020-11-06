import Vue from 'vue'
import Router from 'vue-router'


Vue.use(Router)

/* Layout */
import Home from '../views/Home.vue'

/* Router Modules */
import three from './modules/three'

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
    // {
    //     path: '/login',
    //     name:'login',
    //     component: () => import('@/views/login/index'),
    // },
    // {
    //     path: '/404',
    //     name:'404',
    //     component: () => import('@/views/error-page/404'),
    // },
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
   three,
  // 404 page must be placed at the end !!!
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

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

export default router
