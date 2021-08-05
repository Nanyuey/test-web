
import Store from '@/store'

// 白屏统计
// window.logInfo = {}; // 统计页面加载时间
// window.logInfo.openTime = window.performance && window.performance.timing.navigationStart || 0;
// window.logInfo.whiteScreenTime = +new Date() - window.logInfo.openTime;
// window.logInfo.mobile = mobileType();
// document.addEventListener('DOMContentLoaded', function () {
//   window.logInfo.readyTime = +new Date() - window.logInfo.openTime;
// });
// window.onload = function () {
//   window.logInfo.allloadTime = +new Date() - window.logInfo.openTime;
//   window.logInfo.nowTime = new Date().getTime();
//   let timname = {
//     whiteScreenTime: '白屏时间',
//     readyTime: '用户可操作时间',
//     allloadTime: '总下载时间',
//     mobile: '使用设备',
//     nowTime: '时间',
//   };
//   let logStr = '';
//   for (let i in timname) {
//     // console.warn(timname[i] + ':' + window.logInfo[i] + 'ms');
//     if (i === 'mobile') {
//       logStr += '&' + i + '=' + window.logInfo[i];
//     } else {
//       logStr += '&' + i + '=' + window.logInfo[i];
//     }
//   }
//   (new Image()).src = '/japi/p/log/collect/save?' + logStr;
// };
//
// function mobileType () {
//   let u = navigator.userAgent;
//   let app = navigator.appVersion;
//   // 移动终端浏览器版本信息
//   let type = {
//     ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), // ios终端
//     iPad: u.indexOf('iPad') > -1, // 是否iPad
//     android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, // android终端或者uc浏览器
//     iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1, // 是否为iPhone或者QQHD浏览器
//     trident: u.indexOf('Trident') > -1, // IE内核
//     presto: u.indexOf('Presto') > -1, // opera内核
//     webKit: u.indexOf('AppleWebKit') > -1, // 苹果、谷歌内核
//     gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') === -1, // 火狐内核
//     mobile: !!u.match(/AppleWebKit.*Mobile/i) || !!u.match(/MIDP|SymbianOS|NOKIA|SAMSUNG|LG|NEC|TCL|Alcatel|BIRD|DBTEL|Dopod|PHILIPS|HAIER|LENOVO|MOT-|Nokia|SonyEricsson|SIE-|Amoi|ZTE/), // 是否为移动终端
//     webApp: u.indexOf('Safari') === -1 // 是否web应该程序，没有头部与底部
//   };
//   let lists = Object.keys(type);
//   for (let i = 0; i < lists.length; i++) {
//     if (type[lists[i]]) {
//       return lists[i];
//     }
//   }
// }

const defaults = {
  msg: '', // 错误的具体信息
  url: '', // 错误所在的url
  line: '', // 错误所在的行
  col: '', // 错误所在的列
  nowTime: '' // 时间
}

window.onerror = function (msg, url, line, col, error) {
  console.log('in on error', msg, url, line, col, error)
  if (msg === 'ResizeObserver loop limit exceeded') return
  col = col || (window.event && window.event.errorCharacter) || 0

  defaults.url = url
  defaults.line = line
  defaults.col = col
  defaults.nowTime = new Date().getTime()

  if (error && error.stack) {
    // 如果浏览器有堆栈信息，直接使用
    defaults.msg = error.stack.toString()
  // eslint-disable-next-line no-caller
  } else if (arguments.callee) {
    // 尝试通过callee拿堆栈信息
    let ext = []
    // eslint-disable-next-line no-caller
    let fn = arguments.callee.caller
    let floor = 3
    while (fn && (--floor > 0)) {
      ext.push(fn.toString())
      if (fn === fn.caller) {
        break
      }
      fn = fn.caller
    }
    ext = ext.join(',')
    // console.log(`ext: ${ext}`)
    defaults.msg = error && error.stack && error.stack.toString()
  }
  let str = ''
  for (const i in defaults) {
    // console.log(i,defaults[i]);
    if (defaults[i] === null || defaults[i] === undefined) {
      defaults[i] = 'null'
    }
    str += '&' + i + '=' + defaults[i].toString()
  }
  let userinfo = Store.getters['user/user']
  if (typeof userinfo === 'object') {
    userinfo = JSON.stringify(userinfo)
  }
  if (userinfo) userinfo = encodeURIComponent(userinfo)
  str = encodeURIComponent(str.replace('&', '').replace('\n', '').replace(/\s/g, ''))

  new Image().src = '/japi/p/log/collect/save?' + str + '&userinfo=' + userinfo
}

// 增加线上 promise 未捕获错误统计
window.addEventListener('unhandledrejection', event => {
  let error = event.reason && event.reason.message
  if (!error) {
    error = typeof event.reason === 'object' ? JSON.stringify(event.reason) : event.reason
  }

  (new Image()).src = '/japi/p/log/collect/save?msg=' + encodeURIComponent(error)
})
