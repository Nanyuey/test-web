import Cookies from 'js-cookie'
import { getkeys } from './keys'
window.cookies = Cookies

const { tokenCookiesKey, mTokenCookiesKey } = getkeys()

const cookiesConf = {
  domain: process.env.VUE_APP_COOKIES_DOMAIN,
  expires: 365
}
// 手机端签到auth
export function getMToken (id) {
  return Cookies.get(`${mTokenCookiesKey}-${id}`)
}
export function setMToken (token, id) {
  return Cookies.set(`${mTokenCookiesKey}-${id}`, token)
}
export function setMTokenWithExpries (token, id) {
  return Cookies.set(`${mTokenCookiesKey}-${id}`, token, cookiesConf)
}

export function removeMToken (id) {
  return Cookies.remove(`${mTokenCookiesKey}-${id}`, cookiesConf)
}

export function getToken () {
  return Cookies.get(tokenCookiesKey)
}

export function setToken (token) {
  return Cookies.set(tokenCookiesKey, token)
}

export function removeToken () {
  return Cookies.remove(tokenCookiesKey, cookiesConf)
}

export function setTokenWithExpries (token) {
  return Cookies.set(tokenCookiesKey, token, cookiesConf)
}
