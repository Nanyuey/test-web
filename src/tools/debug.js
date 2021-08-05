import { errorLog } from 'tools/error.js'
import { getkeys } from 'tools/keys.js'
import { removeToken } from './auth'

const localCheck = () => {
  const { logoutKey, loginKey, userKey, dingUserKey } = getkeys()
  const logType = (location.search.match(/log=([a-z|A-Z]*)/) || [])[1]

  switch (logType) {
    case 'all':
      errorLog({
        name: 'log_all',
        error: {},
        data: {
          localStorage: JSON.stringify(window.localStorage)
        // cookie: Cookies.getJSON(),
        }
      })
      break
    default:
      break
  }

  const clearType = (location.search.match(/clear=([a-z|A-Z]*)/) || [])[1]

  if (clearType === 'user') {
    // 清除本地用户信息
    [logoutKey, loginKey, userKey, dingUserKey].forEach(key => {
      localStorage.removeItem(key)
    })
    removeToken()
  } else if (clearType === 'all') {
    // 清除所有本地信息
    Object.keys(localStorage).forEach(key => localStorage.removeItem(key))
    removeToken()
  }
}
localCheck()

export function debug () {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = '//cdn.bootcss.com/eruda/1.5.4/eruda.min.js'
    document.body.appendChild(script)
    script.onload = function () {
      setTimeout(() => {
        resolve()
      }, 100)
      // eslint-disable-next-line no-undef
      eruda.init()
    }
  })
  // return jsLoader(`https://cdn.jsdelivr.net/npm/erud`, window.document).then(() => {
  //   window.eruda.init()
  // })
}
