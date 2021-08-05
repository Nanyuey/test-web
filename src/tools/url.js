/**
 *
 * @desc 根据参数名获取url中对应的参数值
 * @param  {String} name url 中的参数名
 * @param  {String} url  链接的url地址 www.hahaha.com?name=abc&value=aaa
 * @return {String} g返回链接里的参数值
 */

function getQueryStringRegExp (name, url = window.location.href) {
  const params = url.replace(/^.+\?/, '').split('&')
  let result = ''
  const item = params.find((item) => {
    return item.match(name)
  })
  if (!item) return result
  item.replace(/^(.+)=(.+)$/, (_, key, value) => {
    // 如果匹配到查询的参数，就直接返回
    if (name === key) return (result = value)
  })
  return result
}

/**
*
* @desc   获取url中的所有参数以对象的形式返回
* @param  {String} url  链接的url地址 www.hahaha.com?name=abc&value=aaa
* @return {Object} 将链接里的参数以键值对的形式返回
*/

function urlParamsToObject (url = window.location.href) {
  const paramsString = url.replace(/(.+)\?/, '')
  const paramsArray = paramsString.split('&')
  const result = {}
  paramsArray.map(function (item) {
    item.replace(/^(.+)=(.+)$/, (_, key, value) => {
      result[key] = window.decodeURIComponent(value)
    })
  })
  return result
}

/**
*
* @desc   url 添加查询参数
* @param  {String} domain  域名地址 www.hahaha.com
* @param  {Object} newParams  添加的参数,对象的形式{key:value}
* @return {String} 返回一个完整的url地址，即域名加参数
*/
function appendQueryParamsToUrl (url, newParams) {
  const originUrl = url.replace(/\?.*$/, '')
  const targetParams = urlParamsToObject(url)
  Object.assign(targetParams, newParams)
  return objectToUrlParams(originUrl, targetParams)
}

/**
*
* @desc   对象序列化成url参数的形式
* @param  {String} domain  域名地址 www.hahaha.com
* @param  {Object} data  对象数据{key:value}
* @return {String} 返回一个完整的url地址，即域名加参数
*/

function objectToUrlParams (data) {
  const result = []
  Object.keys(data).forEach(key => {
    const value = data[key]
    if (value || value === 0) {
      result.push(`${key}=${value}`)
    }
  })
  return result.length ? result.join('&') : ''
}

const defaultAvatar = require('assets/img/user/avatar.png')

/**
 * @desc 取得相对地址
 * @param  {String} url  域名地址 http://www.baidu.com | http://www.baidu.com
 * @return {String} relativeUrl //www.baidu.com
 */
function getRelativeUrl (url = '') {
  if (!url) return defaultAvatar
  const rule = new RegExp('^http(s?):')
  return url.replace(rule, '')
}

export {
  getQueryStringRegExp,
  urlParamsToObject,
  objectToUrlParams,
  appendQueryParamsToUrl,
  getRelativeUrl
}
