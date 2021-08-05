import Cookies from 'js-cookie'
import { dingtalkVersion } from 'tools/device'

const Store = window.sessionStorage

function getSafeUrl (url) {
  url = url || '/redirect'

  setTimeout(() => location.replace(url), 500)
  return url
}

const config = {
  // domain: process.env.VUE_APP_COOKIES_DOMAIN,
  expires: 0.01
}
const REDIRECT_KEY = '_redirect_'

export function setRedirect (url) {
  const data = JSON.stringify({ url, dingVersion: dingtalkVersion })
  Store && Store.setItem(REDIRECT_KEY, data)
  Cookies.set(REDIRECT_KEY, data, config)
}

export function clearRedirect () {
  Store && Store.removeItem(REDIRECT_KEY)
  Cookies.remove(REDIRECT_KEY, config)
}

export function getRedirect () {
  let resetUrl = ''
  let redirect = (Store && Store.getItem(REDIRECT_KEY)) || Cookies.get(REDIRECT_KEY)
  Store && Store.removeItem(REDIRECT_KEY)
  Cookies.remove(REDIRECT_KEY, config)

  try {
    redirect = redirect && JSON.parse(redirect)
    if (redirect && redirect.dingVersion) {
      resetUrl = redirect.url
    }
  } catch (e) {
    console.log(e)
    resetUrl = ''
  }
  return getSafeUrl(resetUrl)
}
