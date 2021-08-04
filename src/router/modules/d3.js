/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'
import Home from '@/views/Home.vue'

const d3 = {
  path: '/d3',
  component: Home,
  redirect: '/d3/waterBall',
  meta: {
    title: 'd3',
    icon: 'd3'
  },
  children: [
      {
        path: '/d3/waterBall',
        component: () => import('@/views/d3/waterBall.vue')
      },
      {
        path: '/d3/zoomPack',
        component: () => import('@/views/d3/zoomPack.vue')
      },
      {
        path: '/d3/chinaMap',
        component: () => import('@/views/d3/chinaMap.vue')
      }
      
  ]
}

export default d3
