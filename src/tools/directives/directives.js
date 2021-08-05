import changeTitle from 'tools/change-title.js'
const LIMIT_INPUT_HANDLER = '_limit-input-handler' // limit input 事件handler
const LIMIT_INPUT_LAST_VALUE = '_limit-input_last_value' // limit input 上一次合法值

// 事件添加和删除
export const on = function (element, event, handler, useCapture = true) {
  if (!element || !event || !handler) return
  element.addEventListener(event, handler, useCapture)
}
export const off = function (element, event, handler, useCapture = true) {
  if (!element || !event || !handler) return
  element.removeEventListener(event, handler, useCapture)
}

export const title = {
  inserted: function (el, binding) {
    const suffix = el.getAttribute('data-suffix') || ''
    let title = el.getAttribute('data-title') || ''
    if (!title) {
      title = suffix
    } else if (suffix) {
      title += (' - ' + suffix)
    }
    changeTitle(title)
  }
}
const _onlyInputNumberEvent = function () {
  this.value = this.value.replace(/^0*|\D/g, '')
}
// 不能输入中文
const _onlyInputWordEvent = function () {
  this.value = this.value.replace(/[\u4E00-\u9FA5\uF900-\uFA2D]/ig, '')
}

// 文本框只允许输入数字
export const onlyInputNumber = {
  inserted: function (el, binding) {
    el.addEventListener('keyup', _onlyInputNumberEvent, false)
  },
  unbind: function (el, binding) {
    el.removeEventListener('keyup', _onlyInputNumberEvent, false)
  }
}

export const onlyInputWord = {
  inserted: function (el, binding) {
    el.addEventListener('keyup', _onlyInputWordEvent, false)
  },
  unbind: function (el, binding) {
    el.removeEventListener('keyup', _onlyInputWordEvent, false)
  }
}

export const focus = {
  inserted (el, binding) {
    const { value = true } = binding
    if (el.nodeName === 'DIV') el = el.children[0]
    value && el.focus()
    // $(el).on('focus', event => {
    //   setTimeout(() => el.select())
    // })
  }
}

const numberChange = function (e) {
  const value = e.target.value
  if (!value) return
  let newValue = parseFloat(value)
  if (!newValue && newValue !== 0) newValue = ''
  if (`${newValue}` !== value) {
    e.target.value = newValue
    const input = new InputEvent('input')
    e.target.dispatchEvent(input)
  }
}
/**
 * input 输入数值限制
 * @alias v-number
 * @example v-number="{ minus: false, max: 10, min: 10, num: 2 }"
 * @date 2020-12-3
 * @description 默认限制输入正整数
 */
export const number = {
  inserted (el, binding) {
    // 初始化事件和值
    el[LIMIT_INPUT_LAST_VALUE] = ''
    el[LIMIT_INPUT_HANDLER] = e => {
      const {
        minus = false,
        num = 0,
        max = Number.MAX_SAFE_INTEGER,
        min = Number.MIN_SAFE_INTEGER
      } = binding.value || {}
      let typeReg = ''
      if (num === 0) {
        typeReg = minus ? /[^\d-]/g : /[^\d]/g
      } else {
        typeReg = minus ? /[^.\d-]/g : /[^.\d]/g
      }
      const correctReg = new RegExp(`^(-)*(\\d+)\\.(\\d{0,${num}}).*$`)
      let value = e.target.value
      // 修正
      value = value.replace(typeReg, '')
      if (value.length > 1) {
        const valueArray = value.split('')
        value = valueArray.reduce((pre, cur, index) => {
          if (cur === '.' && pre.includes('.')) return pre
          if (cur === '-' && (index !== 0 || pre.includes('-'))) return pre
          return pre + cur
        })
      }
      value = value.replace(correctReg, '$1$2.$3')
      if (parseFloat(value) < min || parseFloat(value) > max) {
        value = el[LIMIT_INPUT_LAST_VALUE]
      }
      // 存储正确结果
      e.target.value = value
      el[LIMIT_INPUT_LAST_VALUE] = value
    }

    // 添加事件
    on(el, 'input', el[LIMIT_INPUT_HANDLER])
    on(el, 'change', numberChange)
  },
  unbind (el, binding) {
    off(el, 'input', el[LIMIT_INPUT_HANDLER])
    off(el, 'change', numberChange)
  }
}
