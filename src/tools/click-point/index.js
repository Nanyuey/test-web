import qs from 'qs'
import Store from '@/store'
import config from './config'

const ClickPoint = {}
ClickPoint.install = function (Vue) {
  /**
   * 埋点
   * @param {Object} point
   */
  Vue.prototype.$clickPoint = function (point = {}) {
    const user = Store.getters['user/user']
    const { _id, nickName, currentCorp, corpName, currentGroup } = user || {}
    // 基础参数
    const basicParams = {
      app_type: 'url_tj', // 必须是这个才能统计出来
      log_type: 'click',
      type: 'dingding_tj',
      rad: Math.random(),
      versionType: 'D'
    }
    // 用户信息
    const userParams = {
      taobaoNick: _id,
      groupId: currentGroup,
      userId: _id,
      userName: nickName,
      corpId: currentCorp,
      corpName
    }
    // 根据point生成的参数
    const gParams = {}
    const _log = { ...point } // 输出当前操作触发的埋点数据
    if (typeof point === 'string') {
      gParams.point = point
    } else if (typeof point === 'object') {
      const { module = 'form', page, device, operate, version } = point
      const _v = version || 'd'
      let _p
      try {
        const _operate = config[module][page][device][operate]
        _p = _operate[_v]
        _log.point = _operate[_v]
        _log.name = _operate.name
        _log.version = _v
      } catch (error) {
        console.warn(error)
      }
      if (_p) {
        gParams.point = _p
      } else {
        console.warn('未找到对应的点', point)
      }
    }
    const params = {
      ...basicParams,
      ...userParams,
      ...gParams
    }

    const queryStr = qs.stringify(params)
    new Image().src = `//ftj.superboss.cc/tj.jpg?${queryStr}`
  }
}

export default ClickPoint
