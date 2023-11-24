import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardView from '../views/DashboardView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: DashboardView,
    beforeEnter: (to, from, next) => {
      if (localStorage.getItem('token') === '' || !localStorage.getItem('token')) {
        console.log(localStorage.getItem('token'))
        return next({
          name: 'home'
        })
      } else {
        next()
      }
      
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
