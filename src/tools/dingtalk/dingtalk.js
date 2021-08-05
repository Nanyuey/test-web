import DingtalkClient from './dingtalk-instance.js'
import { formatDate } from 'tools/index.js'
import * as dd from 'dingtalk-jsapi'

const JsApiList = [
  'runtime.permission.requestAuthCode',
  'biz.user.get',
  'biz.ding.post',
  'biz.contact.choose',
  'biz.contact.complexPicker',
  'biz.contact.departmentsPicker',
  'biz.contact.externalComplexPicker',
  'biz.util.downloadFile',
  'biz.util.previewImage',
  'device.notification.toast',
  'biz.navigation.quit',
  'biz.navigation.setTitle',
  'biz.util.encrypt', // 加密
  'biz.util.decrypt', // 解密
  'biz.alipay.pay' // 支付
]

function init (corpid, notChangeCorp) {
  return DingtalkClient.init(JsApiList, corpid, '', notChangeCorp)
}

function ready () {
  return DingtalkClient.ready()
}

function login () {
  return DingtalkClient.login()
}

function getUserInfo () {
  return DingtalkClient.getUserInfo()
}

function getCorpId () {
  return DingtalkClient.getCorpId()
}

function ContactChoose (users, { maxUsers = 10000, responseUserOnly = true, disabledUsers = [], title = '选人选部门' } = {}) {
  users = users instanceof Array ? users : undefined
  return new Promise((resolve, reject) => {
    ready()
      .then(() => {
        try {
          dd.biz.contact.complexPicker({
            corpId: getCorpId(),
            users,
            onSuccess: resolve,
            onFail: err => {
              if (err.errorMessage !== 'Cancel') reject(err)
            },
            multiple: true,
            title: title, // 标题
            limitTips: '超出人数限制', // 超过限定人数返回提示
            maxUsers: maxUsers, // 最大可选人数
            pickedUsers: users, // 已选用户
            disabledUsers: disabledUsers, // 不可选用户
            appId: process.env.VUE_APP_DING_APPId, // 微应用的Id
            permissionType: 'GLOBAL', // 选人权限，目前只有GLOBAL这个参数
            responseUserOnly: responseUserOnly, // 返回人，或者返回人和部门
            startWithDepartmentId: 0
          })
        } catch (err) {
          console.log(err)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  })
}

function ContactChooseGroup (groups) {
  groups = groups instanceof Array ? groups : undefined
  return new Promise((resolve, reject) => {
    if (!ready()) {
      reject(new Error('钉钉sdk加载失败，请刷新重试'))
      return
    }
    ready()
      .then(() => {
        const corpId = getCorpId()
        dd.biz.contact.departmentsPicker({
          multiple: true, // 是否多选： true多选 false单选； 默认true
          corpId, // 企业id
          maxDepartments: 100, // 最大选择部门数量
          pickedDepartments: groups, // 已选部门
          appId: process.env.VUE_APP_DING_APPId, // 微应用的Id
          permissionType: 'GLOBAL', // 选人权限，目前只有GLOBAL这个参数
          onSuccess: resolve,
          onFail: err => {
            console.log(err)
          }
        })
      })
      .catch(reject)
  })
}

function dingPost (users = [], { title, url, showInApp, image, text, content } = {}) {
  return new Promise((resolve, reject) => {
    if (!ready()) {
      reject(new Error('钉钉sdk加载失败，请刷新重试'))
      return
    }
    ready()
      .then(() => {
        const corpId = getCorpId()
        dd.biz.ding.post({
          users, // 用户列表，userid
          corpId, // 企业id
          type: 2, // 钉类型 1：image  2：link
          alertType: 2,
          alertDate: { format: 'yyyy-MM-dd HH:mm', value: formatDate(new Date(), 'yyyy-MM-dd hh:mm') },
          attachment: {
            title, // 附件的标题
            url, // 附件点击后跳转url
            image, // 附件显示时的图片 【可选】
            text, // 附件显示时的消息体 【可选】
            showInApp // 跳转url在PC客户端上的打开方式，true：从PC容器内打开，false：跳转到浏览器打开 【可选】
          },
          text: content, // 消息体
          onSuccess: resolve,
          onFail: reject
        })
      })
      .catch(reject)
  })
}

function closeSlidePanel () {
  return dd.biz.navigation.quit({
    message: 'close slidePanel', // 退出信息，传递给openModal或者openSlidePanel的onSuccess函数的result参数
    onSuccess: function (result) {
      /**/
    },
    onFail: function () {}
  })
}

function alipay ({ info }) {
  return new Promise((resolve, reject) => {
    if (!ready()) {
      reject(new Error('钉钉sdk加载失败，请刷新重试'))
    }
    ready().then(() => {
      dd.biz.alipay.pay({
        info: info,
        onSuccess: resolve,
        onFail: reject
      })
    }).catch(reject)
  })
}

export {
  init,
  ready,
  login,
  getUserInfo,
  getCorpId,
  ContactChooseGroup,
  dingPost,
  closeSlidePanel,
  alipay,
  ContactChoose
}
