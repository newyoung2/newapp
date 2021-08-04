/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'
import Home from '@/views/Home.vue'

const d3 = {
  path: '/cesium',
  component: Home,
  redirect: '/cesium/test1',
  meta: {
    title: 'd3',
    icon: 'd3'
  },
  children: [
      {
        path: '/cesium/test1',
        component: () => import('@/views/cesium/test1.vue')
      }
      
  ]
}

export default d3
