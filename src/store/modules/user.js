import { getToken, removeToken, setTokenWithExpries } from 'tools/auth'
import Storage from 'tools/storage'
import { getkeys } from 'tools/keys'
import { error, isMock, dingtalkVersion } from 'tools/index'
import { getUserInfo, getCustomerService } from '@/api/auth'

const { userKey, corpIdKey } = getkeys()

const initState = (() => {
  let corpId = Storage.get(corpIdKey)
  // let user = Storage.get(userKey, true) && Storage.get(userKey, true).userInfo
  let user = null
  let token = getToken() || null
  const match = window.location.search.match(/[?&]corpid=(.+?)(&|$)/) || {}
  if (match[1] && match[1] !== corpId) {
    user = null
    if (!isMock) token = null
    corpId = match[1]
    Storage.set(corpIdKey, corpId)
    !isMock && removeToken()
  } else if (!match[1] && !corpId) {
    user = null
    corpId = process.env.VUE_APP_CORP_ID
  }
  return { corpId, user, token }
})()

export default {
  namespaced: true,
  state: {
    user: initState.user,
    token: initState.token,
    service: null,
    corpId: initState.corpId,
    packageServerInfo: null // 套餐信息
  },
  getters: {
    user: state => state.user,
    token: state => state.token,
    service: state => state.service,
    logined: state => !!(state.user && state.token),
    // 付费状态， 0：未付费，1：已付费，-1：已过期
    paidStatus: state => (state.packageServerInfo && state.packageServerInfo.paidStatus) || 0,
    corpId: state => state.corpId
  },
  mutations: {
    saveCustomerService (state, service = {}) {
      state.service = service
    },
    async logout (state) {
      removeToken()
      Storage.set(userKey, null)
      state.token = null
      state.user = null
      state.packageServerInfo = null
    },
    clearUserData (state) {
      removeToken()
      Storage.set(userKey, null)
      state.token = null
      state.user = null
      state.packageServerInfo = null
    },
    // 保存 userInfo
    saveUserData (state, data) {
      if (!data) return
      const { userInfo, packageServerInfo, sysCurrentTimeMillis } = data
      if (userInfo) {
        userInfo.nickName = userInfo.nickName ? userInfo.nickName : userInfo.userName
        state.user = userInfo
      }
      if (packageServerInfo) {
        packageServerInfo.sysCurrentTimeMillis = sysCurrentTimeMillis
        state.packageServerInfo = packageServerInfo
      }
      Storage.set(userKey, data)
    },
    saveToken (state, data) {
      if (data.token) {
        state.token = data.token
        setTokenWithExpries(data.token)
      }
      if (data.user) {
        Storage.set('--user', data.user)
      }
    },
    saveCorpId (state, corpId) {
      if (corpId) { return Storage.set(corpIdKey, corpId) }
      Storage.set(corpIdKey, state.corpId)
    },
    // saveExamineNum (state, examineNum) {
    //   // state.corpInfo.examineNum = examineNum
    // }
  },
  actions: {
    async getCustomerService ({ state, commit }) {
      // 获取客服信息
      return getCustomerService(dingtalkVersion ? state.corpId : null)
        .then(res => {
          commit('saveCustomerService', res.data || {})
        })
        .catch(error)
    },
    async getUserData ({ commit }) {
      return getUserInfo().then(res => {
        commit('saveUserData', res.data)
        return res.data
      }).catch(err => {
        return { error: err }
      })
    },
    async updateCorpId ({ commit }) {
      let corpId
      const match = window.location.search.match(/[?&]corpid=(.+?)(&|$)/) || {}
      if (match[1]) corpId = match[1]
      corpId && commit('saveCorpId', corpId)
    },

    /**
     * 登录
     * @Author   degfy@sina.com
     * @DateTime 2017-09-22T12:38:19+0800
     * @param    {[type]}                 options.commit [description]
     * @param    {[type]}                 info           [description]
     * @return   {[type]}                                [description]
     */
    async login ({ commit, dispatch }, { login }) {
      commit('clearUserData')
      commit('saveToken', login)
      await dispatch('getUserData')
      const domainSource = sessionStorage.getItem('domain_source')
      if (domainSource) {
        sessionStorage.removeItem('domain_source')
      }
    }
  }
}
