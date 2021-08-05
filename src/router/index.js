import Vue from 'vue'
import VueRouter from 'vue-router'
import Store from '@/store'
import { isDingTalk, error } from 'tools'
import { dingtalkVersion } from 'tools/device'
import { setRedirect } from 'tools/redirect'
import { getToken } from 'tools/auth'
import { init as DingtalkInit, login as DingtalkLogin } from '@/tools/dingtalk/dingtalk'
// 创建静态页面相关路由
import staticHtml from './static-html/index'

const Login = () => import('pc/user/login.vue')

Vue.use(VueRouter)
const routes = [
  ...staticHtml,
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]
async function toLogin (next) {
  // 用钉钉登录
  if (dingtalkVersion && isDingTalk) {
    DingtalkInit().then(async () => {
      // 防止重复登录导致番茄表单token失效
      if (getToken()) {
        await Store.dispatch('user/getUserData')
        await Store.dispatch('user/getCustomerService')
        if (Store.getters['user/user']) {
          return next()
        }
      }
      return DingtalkLogin().then(async () => {
        await Store.dispatch('user/getCustomerService')
        if (Store.getters['user/user']) { next() }
      })
    }).catch(error)
  } else {
    if (getToken()) {
      await Store.dispatch('user/getUserData')
      await Store.dispatch('user/getCustomerService')
      if (Store.getters['user/user']) {
        return next()
      } else if (!dingtalkVersion && location.pathname !== '/login') {
        setRedirect(location.href)
        location.href = '/login'
      }
    } else if (!dingtalkVersion && location.pathname !== '/login') {
      setRedirect(location.href)
      location.href = '/login'
    }
  }
}

async function updateUser () {
  let user = null
  if (getToken()) {
    const res = await Store.dispatch('user/getUserData')
    await Store.dispatch('user/getCustomerService')
    if (!res.error) user = res
  }
  return user
}

const router = new VueRouter({
  linkActiveClass: 'active',
  mode: 'history',
  base: '/test-web/',
  // base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!to.meta.needAuth) return next()
  if (Store.getters['user/logined']) {
    // 首次进来更新用户信息需要更新用户信息
    from.path === '/' && !from.name
      ? await updateUser() && next()
      : next()
  } else {
    toLogin(next, to)
  }
})
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
export default router
