import Vue from 'vue'
import VueRouter from 'vue-router'
import DonatView from '@/views/DonatView.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: DonatView
    },
    {
      path: '/stacked-area',
      name: 'stacked-area',
      component: () => import('../views/StackedAreaView.vue')
    },
    {
      path: '/line-with-area',
      name: 'line-with-area',
      component: () => import('../views/LineWithAreaView.vue')
    },
    {
      path: '/stacked-bar',
      name: 'stacked-bar',
      component: () => import('../views/StackedBarView.vue')
    }
  ]
})

export default router
