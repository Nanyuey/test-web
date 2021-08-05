import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import Store from '@/store'
import { errorLog } from './error'
import router from '../router'
import { dingtalkVersion } from './device'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  // timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    const requestId = uuidv4()
    const Token = Store.getters['user/token']
    const corpId = Store.getters['user/corpId']
    config.headers['x-request-id'] = requestId
    config.headers['content-type'] = 'application/json'
    if (Token) {
      config.headers['x-request-token'] = Token
    }
    if (corpId && dingtalkVersion) {
      config.headers['x-current-corpid'] = corpId
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    if (!response.data || !response.data.status || !response.data.status.code) {
      errorLog({ name: 'API请求错误：未识别到状态码', error: {}, data: response })
    } else if (`${response.data.status.code}`.includes('5')) {
      errorLog({ name: 'API请求错误：获取内容不匹配', error: {}, data: response })
    }

    const res = response.data
    const status = res.status || (res.status = {})
    if (status.code !== 200) {
      // 登录异常的状态
      if ([451, 11001, 11012, 11003].includes(status.code)) {
          Store.commit('user/logout')
          sessionStorage.redirectUrl = window.location.href
          location.href = `${location.origin}`
      }
      // 无权限
      if ([11403].includes(status.code)) {
        location.reload()
      }
      return Promise.reject(status)
    } else {
      res.code = 200
      return res
    }
  },
  error => {
    errorLog({ name: 'API请求错误：http非200', error: {}, data: error.response })
    console.warn('http请求非200，未进入拦截器', error.response)
    return Promise.reject(error.response || error)
  }
)

export default service
