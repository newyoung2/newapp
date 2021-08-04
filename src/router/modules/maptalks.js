/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'
import Home from '@/views/Home.vue'

const d3 = {
  path: '/maptalks',
  component: Home,
  redirect: '/maptalks/map1',
  meta: {
    title: 'd3',
    icon: 'd3'
  },
  children: [
      {
        path: '/maptalks/map1',
        component: () => import('@/views/maptalks/map1.vue')
      },
      {
        path: '/maptalks/map2',
        component: () => import('@/views/maptalks/map2.vue')
      },
      {
        path: '/maptalks/map3',
        component: () => import('@/views/maptalks/map3.vue')
      },
      {
        path: '/maptalks/map4',
        component: () => import('@/views/maptalks/map4.vue')
      },
      {
        path: '/maptalks/map5',
        component: () => import('@/views/maptalks/map5.vue')
      },
      {
        path: '/maptalks/map6',
        component: () => import('@/views/maptalks/map6.vue')
      },
      {
        path: '/maptalks/map7',
        component: () => import('@/views/maptalks/map7.vue')
      }
      
  ]
}

export default d3
