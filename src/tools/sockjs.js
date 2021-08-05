
import SockJS from 'sockjs-client'
import { isFun } from 'tools/index.js'
let socket = null
let gvue = null
let __resolve = null
let __cresolve = null
const _promise = new Promise(resolve => {
  __resolve = resolve
})
const _closePromise = new Promise(resolve => {
  __cresolve = resolve
})
function $sock (...arg) {
  socket = new SockJS(...arg)
  socket.onopen = () => __resolve && __resolve()

  socket.onclose = () => {
    console.log('ws close')
    __resolve = null
    __cresolve && __cresolve()
  }

  return socket
}
export default {
  install (Vue, options) {
    if (gvue) {
      return Vue
    }
    gvue = Vue
    Vue.prototype.$sock = $sock
    Vue.prototype.$_open = function (fn) {
      _promise
        .then(() => {
          if (socket && isFun(fn)) {
            fn()
          }
        })
        .catch(console.log)
      return this
    }
    Vue.prototype.$_message = function (fn) {
      _promise
        .then(() => {
          if (socket && isFun(fn)) {
            socket.onmessage = (msg) => fn(msg)
          }
        })
        .catch(console.log)
      return this
    }

    Vue.prototype.$_close = function (fn) {
      _closePromise.then(() => {
        if (socket && isFun(fn)) {
          fn()
          __cresolve = null
        }
      }).catch(console.log)
      return this
    }

    Vue.prototype.$_send = function (...arg) {
      _promise
        .then(() => {
          if (socket) {
            socket.send(...arg)
          }
        })
        .catch(console.log)
      return this
    }
  }
}
