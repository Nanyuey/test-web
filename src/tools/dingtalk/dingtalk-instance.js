import Storage from '../storage'
import User from '@/store/index'
// import { Toast } from '@/components/toast/index'
import Router from '@/router/index'
import { isMobile, isDingTalk, errorLog, error } from 'tools/index'
import { getkeys } from 'tools/keys'
import { getSign, dingLogin } from '@/api/auth'
import * as dd from 'dingtalk-jsapi'

const { corpIdKey } = getkeys()
// const SdkName = 'dd'
const DefaultJsApiList = [
  'runtime.permission.requestAuthCode',
  'biz.user.get'
]

let G_DING_INSTANCE = null
let gPromise = null
let dingSDK

/**
 * 获取新的CorpID，如果检查到cropid 不是最新的先退出登录
 * @Author   degfy@sina.com
 * @DateTime 2017-06-30T14:55:33+0800
 * @param    {[type]}                 corpid [description]
 * @return   {[type]}                        [description]
 */
function getRealCorpId (corpid) {
  const savedCorpId = Storage.get(corpIdKey)
  let newCorpId = corpid
  if (!newCorpId) {
    const match = window.location.search.match(/[?&]corpid=(.+?)(&|$)/) || {}
    newCorpId = match[1] || savedCorpId
  }

  if (newCorpId !== savedCorpId) {
    User.commit('user/clearUserData')
    Storage.set(corpIdKey, newCorpId)
  }
  return newCorpId || process.env.VUE_APP_CORP_ID
}

function getRealCorpIdNoChange (corpid) {
  const savedCorpId = Storage.get(corpIdKey)
  if (savedCorpId) {
    return savedCorpId
  }

  if (corpid) {
    return corpid
  }

  const match = window.location.search.match(/[?&]corpid=(.+?)(&|$)/) || {}
  const newCorpId = match[1] || savedCorpId

  if (newCorpId) {
    Storage.set(corpIdKey, newCorpId)
  }
  return newCorpId || process.env.VUE_APP_CORP_ID
}

class DingtalkClient {
  constructor (jsApiList = DefaultJsApiList, corpid) {
    this.jsApiList = jsApiList
    this.corpid = corpid
  }

  /**
   * sdk 准备
   * @Author   degfy@sina.com
   * @DateTime 2017-08-03T16:33:37+0800
   * @return   {[type]}                 [description]
   */
  async prepare () {
    // await jsLoader(SdkUrl, window.document)
    // dingSDK = window[SdkName]
    dingSDK = dd

    if (!dingSDK) {
      errorLog({ name: 'dingSDK 不存在', error: {} })
      await new Promise((resolve, reject) => {})
      return
    }
    // 非钉版，则不需要config
    if (isDingTalk) {
      const signUrl = decodeURIComponent(window.location.href)
      if (!this.corpid) {
        Router.push({ name: 'login-error' })
        return
      }
      const params = {
        corpid: encodeURIComponent(this.corpid),
        url: encodeURIComponent(signUrl),
        _t: Math.random()
      }
      const res = await getSign(params).catch(e => { console.log(e) })
      if (!res) {
        errorLog({ name: 'API请求签名信息失败,没有返回结果', error: {}, data: res })
      } else {
        const { data, status } = res || {}
        if ((status && status.code !== 200) || !data || !data.sign) {
          errorLog({ name: 'API请求签名信息失败', error: {}, data: res })
        } else if (data.url !== encodeURIComponent(window.location.href)) {
          errorLog({
            name: '钉钉签名路径与当前路径不一致',
            error: {},
            data: {
              data,
              signUrl,
              presentUrl: window.location.href
            }
          })
        } else {
          try {
            dingSDK.config(Object.assign({ jsApiList: this.jsApiList }, data.sign))
          } catch (e) {
            console.log(e)
            errorLog({ name: '钉钉鉴权失败', error: e, data })
          }
        }
      }
    }

    await new Promise((resolve, reject) => {
      dingSDK.ready(() => {
        resolve()
        console.log('sdkReady')
      })
      dingSDK.error(e => {
        errorLog({ name: '钉钉签名验证错误', error: e })
        Toast(`数据验证错误：${e && JSON.stringify(e)}, 请刷新或重新进入后尝试`, { time: 6000 })
        console.log(e)
      })
    })
  }

  /**
   * 单例模式,入口
   * @Author   degfy@sina.com
   * @DateTime 2017-08-03T16:32:58+0800
   * @param    {Array}                 jsApiList 签名授权列表
   * @param    {String}                 corpid    企业ID
   * @return   {DingtalkClient}
   */
  static instance (jsApiList, corpid) {
    if (!(G_DING_INSTANCE instanceof DingtalkClient)) {
      G_DING_INSTANCE = new DingtalkClient(jsApiList, corpid)
    }
    return G_DING_INSTANCE
  }

  /**
   * DingtalkClient 初始化
   * @Author   degfy@sina.com
   * @DateTime 2017-08-03T16:31:31+0800
   * @param    {Array}                 jsApiList 签名授权列表
   * @param    {String}                 corpid    企业ID
   * @return   {Promise}
   */
  static init (jsApiList, corpid, fn, notChangeCorp) {
    if (!gPromise) {
      if (!G_DING_INSTANCE) {
        if (notChangeCorp) {
          corpid = getRealCorpIdNoChange(corpid)
        } else {
          corpid = getRealCorpId(corpid)
        }
        G_DING_INSTANCE = DingtalkClient.instance(jsApiList, corpid)
      }
      gPromise = G_DING_INSTANCE.prepare()
      if (typeof fn === 'function') {
        gPromise = gPromise.then(fn)
      }
    }
    return gPromise
  }

  static ready () {
    return gPromise
  }

  /**
   * 用户登录
   * @Author   degfy@sina.com
   * @DateTime 2017-11-02T17:15:18+0800
   * @return   {[type]}                 [description]
   */
  static async login () {
    if (User.getters.logined) {
      return await User.dispatch('user/getUserData')
    }

    if (!dingSDK) {
      throw Error('must call DingtalkClient::init firstly.')
    }

    const corpId = G_DING_INSTANCE.corpid
    const { code: authCode } = await new Promise((resolve, reject) => {
      dingSDK.runtime.permission.requestAuthCode({
        corpId,
        onSuccess: resolve,
        onFail (err) {
          console.log('requestAuthCode', err)
          const error = Error(err.errorMessage)
          error.code = Number(err.errorCode) || err.errorCode
          if (error.code === 3) {
            error.code = 717
          }
          reject(error)
        }
      })
    })
    const res = await dingLogin({ corpId, authCode }).catch(e => {
      errorLog({ name: '钉钉登录异常', error: e, data: res })
    })
    if (!res) {
      throw Error('免登异常：网络异常，请稍后重试')
    }
    const { data, status } = res || {}

    if (status.code !== 200) {
      throw status
    }

    const param = isMobile ? 'from-mobile-dingtalk' : 'from-pc-dingtalk'
    await User.dispatch('user/login', {
      login: data,
      log: { param }
    }).catch(error)
  }

  /**
   * 获取 用户信息 dingSDK有bug, 废弃
   * @Author   degfy@sina.com
   * @DateTime 2017-11-02T17:13:58+0800
   * @return   {[type]}                 [description]
   */
  static async getUserInfo () {
    if (!dingSDK) {
      errorLog({ name: 'dingSDK 不存在', error: {} })
      Toast('dingSDK 不存在，请刷新后尝试', { time: 6000 })
    }
    return gPromise
      .then(() => {
        return new Promise((resolve, reject) => {
          const handle = setTimeout(() => reject(Error('get dingTalk user info timeout!')), 3000)
          dingSDK.biz.user.get({
            onSuccess (userInfo) {
              clearTimeout(handle)
              resolve(userInfo)
            },
            onFail: reject
          })
        })
      })
  }
}

DingtalkClient.getCorpId = getRealCorpId

export default DingtalkClient
