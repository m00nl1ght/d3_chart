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
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/line-with-area',
      name: 'line-with-area',
      component: () => import('../views/LineWithAreaView.vue')
    }
  ]
})

export default router
