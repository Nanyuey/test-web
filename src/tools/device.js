const UA = window.navigator.userAgent.toLowerCase()
// const LOCATION = window.location

const search = window.location.search
const sourceMatch = /source=(.+?)(&|$)/
const toMatch = /to=(.+?)(&|$)/
const source = search.match(sourceMatch) && search.match(sourceMatch)[1]
const to = search.match(toMatch) && search.match(toMatch)[1]

/**
 * [isWeChat 微信]
 * @type {Boolean}
 */
export const isWeChat = !!UA.match(/MicroMessenger/i)

/**
 * [isDingTalk 钉钉] 钉钉app中
 * @type {Boolean}
 */
export const isDingTalk = !!/DingTalk/i.test(UA)

export const isAndroid = !!/Android/i.test(UA)

export const isAliPay = !!/AlipayClient/i.test(UA)

export const isQQ = !!/QQ\/[0-9]/i.test(UA)

/**
 * [isWorkNotice 钉钉] 钉钉工作通知
 * @type {Boolean}
 *
 * */
export const isWorkNotice = source === 'dingOa' && to === 'slide'
// export const isNoticeToApp = source === 'dingOa' && to === 'app'

/**
 * [isMock] 模拟用户环境
 * @type {Boolean}
 *
 * */
export const isMock = to === 'mock'

/*
 * [isMobile 移动设备]
 * @type {Boolean}
 */
export const isMobile = !!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(UA)

export const dingtalkVersion = process.env.VUE_APP_VERSION.includes('d')

export const isProduction = !process.env.VUE_APP_VERSION.includes('test')

export const isWeChatWork = !!/wxwork/i.test(UA)

export const isEpa = isWeChatWork

export const isIos = !!/iPhone|iPad|iPod/i.test(UA)

export const isWin = /windows/i.test(UA)

export const isSafari = /safari/.test(UA) && !/chrome/.test(UA)

export const isThumbnails = !!/Thumbnails/i.test(UA)

export const ie = !!(UA.match(/MSIE\s([\d.]+)/i) || // IE 11 Trident/7.0; rv:11.0
  UA.match(/Trident\/.+?rv:(([\d.]+))/i))

export const edge = !!UA.match(/Edge\/([\d.]+)/i) // IE 12 and 12+

export const isFirefox = !!UA.match(/Firefox/i)

/**
 * 判断应用是否是在钉钉容器里（app或者钉钉首页进入的番茄）
 * @Author   degfy@sina.com
 * @DateTime 2017-01-19T15:27:37+0800
 * @return   {Boolean}
 */
export const isInDingtalk = function () {
  if (isDingTalk) {
    return true
  }
  if (window.parent !== window) {
    const Storage = window.sessionStorage
    if (Storage.isInDingtalk) {
      return true
    }

    const match = window.location.search.match(/corpid=(.+?)(&|$)/)
    if (match) {
      Storage.isDingTalk = true
      return true
    }
  }

  return false
}

function checkWebp () {
  if (isDingTalk && isWin) {
    return false
  }
  try {
    return (document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0)
  } catch (err) {
    return false
  }
}

export const isSupportWebp = checkWebp()

export const dpr = window.devicePixelRatio || 1
export const width = window.innerWidth
export const height = window.innerHeight

/**
 * 判断是不是IE浏览器(不包括Edge)
 * @type {Boolean}
 */
// eslint-disable-next-line no-useless-escape
export const isIe = UA.indexOf('msie') > 0 || !!UA.match(/Trident.*rv\:11\./i)
