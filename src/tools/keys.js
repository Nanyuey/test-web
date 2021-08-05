const keys = {
  logoutKey: '--system-logout',
  loginKey: '--system-login',
  tokenCookiesKey: '--login-token',
  mTokenCookiesKey: '--mlogin-token',
  userKey: '--gift-user',
  dingUserKey: '--dingUser',
  corpIdKey: '__corp_id__'
}

export function setkeys (obj) {
  Object.keys(keys).forEach(k => obj[k] && (keys[k] = obj[k]))
  return keys
}

export function getkeys () {
  return keys
}

export function getkey (type) {
  return keys[type] || null
}
