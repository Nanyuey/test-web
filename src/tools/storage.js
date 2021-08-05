import { clone } from './funcs'

const Storage = window.localStorage
const DataKeeper = Object.create(null)

function isJSON (obj) {
  return typeof obj === 'object' && Object.prototype.toString.call(obj).toLowerCase() === '[object object]' && !obj.length
}

/**
 * 设置存储
 * @param {[type]} key
 * @param {[type]} value [value===null时,删除, false, undefined 等值无效, 0有效]
 */
const SetStore = function (key, value) {
  if (typeof key === 'string') {
    if (value === null) {
      Storage.removeItem(key)
      delete DataKeeper[key]
    } else if (value || value === 0 || value === '') {
      DataKeeper[key] = clone(value)
      Storage.setItem(key, (isJSON(value) || Array.isArray(value)) ? JSON.stringify(value) : value.toString())
    }
  }
  return this
}

/**
 * 获取
 * @param {[type]}  key
 * @param {Boolean} isJson [是否是JSON数据]
 */
const GetStore = function (key, isJson) {
  if (key && typeof key === 'string') {
    if (DataKeeper[key] !== undefined) {
      return clone(DataKeeper[key])
    }

    let data = Storage.getItem(key)
    if (typeof data === 'string' && data !== '') {
      data = data.trim()
      if (isJson) {
        try {
          data = JSON.parse(data)
        } catch (e) {
          data = {}
          console.warn('转换json错误', e)
        }
      }
      DataKeeper[key] = data
      return data
    }
  }
  return undefined
}

export default {
  set: SetStore,
  get: GetStore
}
