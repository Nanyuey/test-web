/**
 * Perform no operation.
 */
export function noop () {}

/**
 * Always return false.
 */
export const no = () => false

/**
 * Ensure a function is called only once.
 */
export function once (fn) {
  let called = false
  return function () {
    if (!called) {
      called = true
      fn.apply(this, arguments)
    }
  }
}

export function isUndef (v) {
  return v === undefined || v === null
}

export function isDef (v) {
  return v !== undefined && v !== null
}

export function isTrue (v) {
  return v === true
}

export function isBoolean (v) {
  return typeof v === 'boolean'
}

export function isEmptyJSON (obj) {
  for (const key in obj) {
    return false
  }
  return true
}

export function isFalse (v) {
  return v === false
}
/**
 * Check if value is primitive
 */
export function isPrimitive (value) {
  return typeof value === 'string' || typeof value === 'number'
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
export function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

export function isFun (func) {
  return typeof func === 'function'
}

export function isString (input) {
  return typeof input === 'string'
}

export function clone (obj) {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Array) {
    const copy = []
    for (let i = 0, len = obj.length; i < len; ++i) {
      copy[i] = clone(obj[i])
    }
    return copy
  }
  if (obj instanceof Object) {
    const copy = {}
    for (const attr in obj) {
      // eslint-disable-next-line no-prototype-builtins
      if (obj.hasOwnProperty(attr)) {
        copy[attr] = clone(obj[attr])
      }
    }
    return copy
  }
}

/*
 * 频率控制 返回函数连续调用时，fn 执行频率限定为每多少时间执行一次
 * @param fn {function}  需要调用的函数
 * @param delay  {number}    延迟时间，单位毫秒
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
export function throttle (fn, delay, immediate, debounce) {
  let curr = +new Date() // 当前事件
  let lastCall = 0
  let lastExec = 0
  let timer = null
  let diff // 时间差
  let context // 上下文
  let args
  const exec = function () {
    lastExec = curr
    fn.apply(context, args)
  }

  return function () {
    curr = +new Date()
    context = this
    args = arguments
    diff = curr - (debounce ? lastCall : lastExec) - delay
    clearTimeout(timer)

    if (debounce) {
      if (immediate) {
        timer = setTimeout(exec, delay)
      } else if (diff >= 0) {
        exec()
      }
    } else {
      if (diff >= 0) {
        exec()
      } else if (immediate) {
        timer = setTimeout(exec, -diff)
      }
    }
    lastCall = curr
  }
}

/*
 * 空闲控制 返回函数连续调用时，空闲时间必须大于或等于 delay，fn 才会执行
 * @param fn {function}  要调用的函数
 * @param delay   {number}    空闲时间
 * @param immediate  {bool} 给 immediate参数传递false 绑定的函数先执行，而不是delay后后执行。
 * @return {function}实际调用函数
 */
export function debounce (fn, delay, immediate) {
  return throttle(fn, delay, immediate, true)
}

export function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function getSelectionText () {
  if (window.getSelection) {
    return window.getSelection().toString()
  } else if (document.selection && document.selection.createRange) {
    return document.selection.createRange().text
  }
  return ''
}

const jsLoaderMap = Object.create(null)

/**
 * 载入第三方js脚本
 * @Author   degfy@sina.com
 * @DateTime 2017-08-16T16:58:32+0800
 * @param    {[type]}                 url      [description]
 * @param    {[type]}                 document [description]
 * @return   {[type]}                          [description]
 */
export function jsLoader (url, document, toHead = false) {
  if (!jsLoaderMap[url]) {
    jsLoaderMap[url] = new Promise(resolve => {
      const script = document.createElement('script')
      script.type = 'text/javascript'

      if (script.readyState) { // IE
        script.onreadystatechange = function () {
          if (script.readyState === 'loaded' || script.readyState === 'complete') {
            script.onreadystatechange = null
            resolve()
          }
        }
      } else { // Others: Firefox, Safari, Chrome, and Opera
        script.onload = resolve
      }

      script.src = url
      if (toHead) {
        document.head.appendChild(script)
      } else {
        document.body.appendChild(script)
      }
    })
  }
  return jsLoaderMap[url]
}

export function formatDate (date = new Date(), format = 'yyyy-MM-dd hh:mm:ss') {
  date = new Date(date)
  const map = {
    M: date.getMonth() + 1, // 月份
    d: date.getDate(), // 日
    h: date.getHours(), // 小时
    m: date.getMinutes(), // 分
    s: date.getSeconds(), // 秒
    q: Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  }
  format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
    let v = map[t]
    if (v !== undefined) {
      if (all.length > 1) {
        v = '0' + v
        v = v.substr(v.length - 2)
      }
      return v
    } else if (t === 'y') {
      return (`${date.getFullYear()}`).substr(4 - all.length)
    }
    return all
  })
  return format
}

export function getCurrentPeriod (date = new Date(), type = 'quarter') {
  date = new Date(date)
  const year = date.getFullYear()
  const month = date.getMonth()
  let period = ''
  let res = ''
  switch (type) {
    case 'month':
      period = month < 8 ? `0${month + 1}` : month + 1
      res = `${year}-${period}`
      break
    case 'quarter':
      period = [
        'Q1', 'Q1', 'Q1',
        'Q2', 'Q2', 'Q2',
        'Q3', 'Q3', 'Q3',
        'Q4', 'Q4', 'Q4'
      ][month]
      res = `${year}-${period}`
      break
    case 'semiannual':
      period = [
        '上半年', '上半年', '上半年', '上半年', '上半年', '上半年', '上半年',
        '下半年', '下半年', '下半年', '下半年', '下半年', '下半年', '下半年'
      ][month]
      res = `${year}-${period}`
      break
    case 'year':
      res = `${year}`
      break
    default:
      break
  }
  return res
}

export function shortof (str, len) {
  if (typeof str !== 'string') return ''
  for (let i = 0, clen = 0, len2 = str.length; i < len2; ++i) {
    clen += /^[\u4E00-\u9FA5]+$/.test(str[i]) ? 2 : 1
    if (clen >= len) {
      return str.substr(0, i + 1) + '...'
    }
  }
  return str
}

export const encodeHtml = string => {
  if (!string) return string
  return string.replace(/[<>&"]/g, function (char) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;'
    }[char]
  })
}

export const decodeHtml = (string, isLight) => {
  if (!string) return string
  if (isLight) {
    return string.replace(/&(lt|gt|amp|quot);/ig, function (all, char) {
      return {
        lt: '<',
        gt: '>',
        amp: '&',
        quot: '"'
      }[char]
    })
  } else {
    return string.replace(/&(lt|gt|nbsp|amp|quot);/ig, function (all, char) {
      return {
        lt: '<',
        gt: '>',
        nbsp: ' ',
        amp: '&',
        quot: '"'
      }[char]
    })
  }
}

// export function getUrlExt (url) {
//   if (isString(url)) {
//     url = url.replace(/(\?|#).*$/, '')
//     const match = url.match(/\.([^\.]+?)$/)
//     return (match && match[1]) || ''
//   }
// }

export function isImage (ext) {
  return ['jpeg', 'jpg', 'png', 'gif', 'tif', 'bmp', 'webp', 'svg'].indexOf(ext) >= 0
}

// com 替换成 cn
export function imgUrlTransform (jsonObj) {
  let str = JSON.stringify(jsonObj)
  const oldQiniuReg = new RegExp('//img.fanqier.com/', 'ig')
  str = str.replace(oldQiniuReg, '//img.fanqier.cn/')
  return JSON.parse(str)
}

export function base64Img2Blob (code) {
  const parts = code.split(';base64,')
  const contentType = parts[0].split(':')[1]
  const raw = window.atob(parts[1])
  const rawLength = raw.length
  const uInt8Array = new Uint8Array(rawLength)
  for (let i = 0; i < rawLength; ++i) {
    uInt8Array[i] = raw.charCodeAt(i)
  }
  return new Blob([uInt8Array], { type: contentType })
}

export function openUrl (url) {
  const aLink = document.createElement('a')
  const evt = document.createEvent('MouseEvents')
  evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  aLink.href = url
  aLink.dispatchEvent(evt)
}

export function downloadFile (fileName, content) {
  const aLink = document.createElement('a')
  const blob = base64Img2Blob(content) // new Blob([content]);

  const evt = document.createEvent('MouseEvents')
  evt.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
  aLink.download = fileName
  aLink.href = URL.createObjectURL(blob)
  aLink.dispatchEvent(evt)
}

// 解析url中的params,以对象的形式返回
export function deparams (url) {
  const query = {}
  if (url && typeof url === 'string') {
    const arr = url.split('?')
    if (arr) {
      const length = arr.length
      let paramsString = null
      switch (length) {
        case 1:
          if (arr[0].includes('=')) {
            paramsString = arr[0]
          }
          break
        case 2:
          paramsString = arr[1]
          break
        default:
      }
      if (paramsString) {
        const items = paramsString.split('&')
        items.forEach((item) => {
          const q = item.split('=')
          const key = q[0]
          const value = q[1]
          if (key) {
            query[key] = value
          }
        })
      }
    }
  }
  return query
}

function hasClass (el, cls) {
  if (!el || !cls) return false
  if (cls.indexOf(' ') !== -1) throw new Error('className should not contain space.')
  if (el.classList) {
    return el.classList.contains(cls)
  } else {
    return (' ' + el.className + ' ').indexOf(' ' + cls + ' ') > -1
  }
}

const trim = function trim (string) {
  return (string || '').replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, '')
}

export function addClass (el, cls) {
  if (!el) return
  var curClass = el.className
  var classes = (cls || '').split(' ')

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.add(clsName)
    } else if (!hasClass(el, clsName)) {
      curClass += ' ' + clsName
    }
  }
  if (!el.classList) {
    el.className = curClass
  }
}

export function removeClass (el, cls) {
  if (!el || !cls) return
  var classes = cls.split(' ')
  var curClass = ' ' + el.className + ' '

  for (var i = 0, j = classes.length; i < j; i++) {
    var clsName = classes[i]
    if (!clsName) continue

    if (el.classList) {
      el.classList.remove(clsName)
    } else if (hasClass(el, clsName)) {
      curClass = curClass.replace(' ' + clsName + ' ', ' ')
    }
  }
  if (!el.classList) {
    el.className = trim(curClass)
  }
}
