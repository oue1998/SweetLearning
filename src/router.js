import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('./views/Home.vue')
    
    
  },
  {
    path: '/rules',
    name: 'Rules',
    component: () => import('./views/Rules.vue')
  },
  {
    path: '/game',
    name: 'Game',
    component: () => import('./views/Game.vue')
  }
]

const router = new VueRouter({
  //hash ทำให้เวลากดรีเฟรซกลับไปที่ลิ้งที่ใช้
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
