
import Index from '@/views/static-html/index.vue'
export default [
  {
    path: '/',
    name: 'index',
    component: Index
  }, {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '@/views/static-html/about.vue')
  }]
