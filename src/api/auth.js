import {
  JAPI,
  // JAPI_C,
  FQJAPI,
  FQAPI,
  request
} from './config'

// 获取userInfo
export const getUserInfo = () => request.get(`${JAPI}/activity/base/info`)

/**
 * 获取签名
 * @param {Object} data
 */
export const getSign = data => request.get(`${FQJAPI}/f/ding/sign`, { params: data })

/**
 * 钉钉authcode 换取 token
 * @param {Object} data 登录信息
 */
export const dingLogin = data => request.post(`${FQAPI}/ding/login`, data)

/**
 * 获取客服信息
 * @param {string} corpId
 */
export const getCustomerService = corpId => request({
  url: `${FQJAPI}/groups/track/customer_service?`,
  method: 'GET',
  params: {
    corpId
  }
})
