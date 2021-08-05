import { MessageBox } from 'element-ui'
import showPayDialog from 'components/package-pay/index'
import Store from 'store'

/**
 * @name createNodeOfService - 创建联系客服a标签
 * @param {string} text - a标签内的文字
 * @return {string} 联系客服a标签的字符串
 */
function createNodeOfService (text, serviceData) {
  return `<div><a class="primary" href="${serviceData && serviceData.contactUrl}">${text}>></a></div>`
}

// function versionName ({ maxPeople, version }) {
//   if (version === 0) return '未开通'
//   if (version === 1) return '试用版'
//   if (version === 2) {
//     return `${maxPeople}人`
//   }
//   return '未知版'
// }

// 提示的内容
const tipsContent = (type, { serviceData, primaryAdmin }) => {
  return {
    // 试用期到期
    'trial-expires--admin': {
      node: createNodeOfService('联系客服，再次开启使用', serviceData),
      content: '当前组织试用期已到期，请尽快完成续费升级'
    },
    'trial-expires--normal': {
      node: createNodeOfService('联系客服，再次开启使用', serviceData),
      content: `当前组织试用期已到期，请联系主管理员${primaryAdmin}尽快完成续费升级`
    },
    // 套餐到期
    'package-expires--admin': {
      node: createNodeOfService('联系客服', serviceData),
      content: '<div>当前组织套餐已到期，请尽快完成续费</div>'
    },
    'package-expires--normal': {
      node: createNodeOfService('联系客服', serviceData),
      content: `<div>当前组织套餐已到期，请联系主管理员${primaryAdmin}尽快完成续费</div>`
    },
    // 无创建权限
    'create-permission--admin': {
      node: '',
      content: `<div>当前组织管理员才能创建绩效考核，请联系管理员${primaryAdmin}配置权限，再创建绩效考核</div>`,
      isShowPayDialog: false,
      confirmButtonText: '确定'
    },
    // 钉组织管理员首次进入
    'admin-init--admin': {
      node: '',
      content: '<div>当前组织已经开通番茄绩效，是否立即试用？</div>',
      isShowPayDialog: false,
      confirmButtonText: '立即试用'
    }
  }[type]
}

/**
 * @name showAlertTips
 * @param {string} type - 类型 - admin 管理员 normal 普通身份
 * @example showAlertTips('out-person--admin')
 */
export async function showAlertTips (type) {
  !Store.getters['user/service'] && await Store.dispatch('user/getCustomerService')
  const data = {
    serviceData: Store.getters['user/service'],
    primaryAdmin: Store.getters['admin/primaryAdmin']
  }
  const tipsObject = tipsContent(type, data) || {}

  // 提示内容 format

  // 默认点击button显示升级支付弹窗
  const isShowPayDialog = tipsObject.isShowPayDialog !== false
  const html = tipsObject.content + tipsObject.node
  const confirmButtonText = tipsObject.confirmButtonText || '升级使用'
  const title = tipsObject.title || ''
  MessageBox.alert(html, '', {
    title: title || '',
    showClose: false,
    dangerouslyUseHTMLString: true,
    center: true,
    confirmButtonText: confirmButtonText,
    confirmButtonClass: 'el-button--medium',
    showConfirmButton: type && !type.includes('--normal'),
    customClass: 'top-30vh',
    async beforeClose (action, instance, done) {
      if (isShowPayDialog) {
        instance.alertType = type
        showPayDialog({ instance: instance })
        return
      }
      if (type === 'admin-init--admin') {
        this.$clickPoint({ module: 'account', page: 'account', device: 'pc', operate: 'dingTryout' })
        await Store.dispatch('user/getUserData')
        return done()
      }
      done()
    }
  })
}
