import { isDingTalk, isWorkNotice, isMobile } from 'tools/index'
// import { Toast } from '@/components/toast/index'
// import Mui from 'tools/mui.js'
import * as dd from 'dingtalk-jsapi'
let readyPromise = null

/**
 * window.SdkUrl 加载的钉钉JsApi 文件地址
 * SdkHaveReady api 是否准备好了
 */
export default async function (title) {
  if (isDingTalk) {
    // await jsLoader(SDK_URL, window.document)

    const dingSDK = dd
    if (!dingSDK) {
      // Toast('dingSDK 加载失败，请刷新后重试', { time: 6000 })
      return
    }
    if (!readyPromise) {
      readyPromise = new Promise((resolve, reject) => {
        dingSDK.ready(resolve)
        dingSDK.error(reject)
      })
    }

    await readyPromise
    if (isWorkNotice || isMobile) {
      return dingSDK.biz.navigation.setTitle({ title }).catch(e => {
        console.log(e)
      })
    } else {
      return Promise.resolve()
    }
  }

  if (title === undefined || window.document.title === title) {
    return
  }

  document.title = title
  // const mobile = navigator.userAgent.toLowerCase()
  // if (/iphone|ipad|ipod/.test(mobile)) {
  //   const iframe = document.createElement('iframe')
  //   iframe.style.display = 'none'
  //   // 替换成站标favicon路径或者任意存在的较小的图片即可
  //   iframe.setAttribute('src', '/static/img/logo/favicon.png')
  //   const iframeCallback = function () {
  //     setTimeout(function () {
  //       iframe.removeEventListener('load', iframeCallback)
  //       document.body.removeChild(iframe)
  //     }, 0)
  //   }
  //   iframe.addEventListener('load', iframeCallback)
  //   document.body.appendChild(iframe)
  // }
}
