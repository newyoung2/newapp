/** When your routing table is too long, you can split it into small modules **/

// import Layout from '@/layout'
import Home from '@/views/Home.vue'

const three = {
  path: '/three',
  component: Home,
  redirect: '/three/unit2Example1',
  meta: {
    title: 'three',
    icon: 'three'
  },
  children: [
    {
        path: '/three/unit2Example1',
        component: () => import('@/views/unit2/example1.vue')
      },
      {
        path: '/three/unit2Example2',
        component: () => import('@/views/unit2/example2.vue')
      },
      {
        path: '/three/unit2Example3',
        component: () => import('@/views/unit2/example3.vue')
      },
      {
        path: '/three/unit2Example4',
        component: () => import('@/views/unit2/example4.vue')
      },
      {
        path: '/three/unit2Example5',
        component: () => import('@/views/unit2/example5.vue')
      },
      {
        path: '/three/unit2Example6',
        component: () => import('@/views/unit2/example6.vue')
      },
      {
        path: '/three/unit2Example7',
        component: () => import('@/views/unit2/example7.vue')
      },
      {
        path: '/three/unit2Example8',
        component: () => import('@/views/unit2/example8.vue')
      },
      {
        path: '/three/unit2Example9',
        component: () => import('@/views/unit2/example9.vue')
      },
      {
        path: '/three/unit2Example10',
        component: () => import('@/views/unit2/example10.vue')
      },
      {
        path: '/three/unit2Example11',
        component: () => import('@/views/unit2/example11.vue')
      }
  ]
}
export default three
