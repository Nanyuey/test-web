// import User from 'store/user.js'
import Store from '@/store'
import { isFun, isBoolean } from './funcs.js'
// import { Toast } from '@/components/toast/index'
// import Tip from '@/components/alert-tip/index'
import { EventBus, SHOW_ERROR } from './event-bus/index'

export function getErrorType (code) {
  code = Number(code)
  let page
  switch (code) {
    case 11001:
      page = '401'
      break
    case 402:
    case 403:
      page = '402'
      break
    case 414:
      page = '414'
      break
    case 404:
    case 40404:
      page = '404'
      break
    case 5003:
      page = 'network-block-up'
      break
    default:
      break
  }
  return page
}

export function errorDeal (code = 40404) {
  code = Number(code)
  const page = getErrorType(code)
  if (page) {
    EventBus.$emit(SHOW_ERROR, page)
    return page
  }

  return false
}

export function error (err, { before, after, errDeal = errorDeal } = {}) {
  console.trace(err)
  const { code, status, message } = err || {}
  const errorCode = code || status
  const errorMsg = message ||
    ((typeof status === 'number' && status !== 200)
      ? `网络异常：${status}`
      : '系统异常，请稍后重试'
    )
  if (isFun(before)) {
    const ret = before(err)
    if (isBoolean(ret)) return ret
  }

  if (errorCode && errDeal(errorCode)) return true

  if (isFun(after)) {
    const ret = after(err)
    if (isBoolean(ret)) return ret
  }
  // Toast({
  //   text: errorMsg,
  //   // type: 'warn',
  //   time: 5 * 1000
  // })
  // Tip({
  //   type: 'error',
  //   message: errorMsg
  // })
}

export function checkRes (res) {
  if (!res || !res.body) return
  let flag = true
  const { body } = res
  if (!body.status || body.status.code !== 200) {
    error(body.status)
    flag = false
  }
  return flag
}

function getErrorMsg (info) {
  const name = (info && info.name) || '未命名错误'
  let error = (info && info.error) || info || {}
  const data = info && info.data

  if (error && typeof error !== 'string') {
    error = {
      message: error.message,
      stack: error.stack
    }
  }
  return { name, data, error }
}

export const errorLog = (info) => {
  // console.log('errorLog -> info', info)
  const msg = JSON.stringify(getErrorMsg(info))
  let userinfo = Store.getters['user/user']
  if (typeof userinfo === 'object') {
    userinfo = JSON.stringify(userinfo)
  }

  new Image().src = `/japi/p/log/collect/save?msg=${encodeURIComponent(msg)}&userinfo=${encodeURIComponent(userinfo)}&url=${encodeURIComponent(location.href)}`
}

export const log = (info) => {
  const msg = JSON.stringify(getErrorMsg(info))
  console.log(msg)
}
