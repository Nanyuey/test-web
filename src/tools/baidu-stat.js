import { jsLoader } from 'tools'

export default function (id) {
  if (!id) return
  window._hmt = window._hmt || []
  return window.location.protocol === 'https:' ? jsLoader(`//hm.baidu.com/hm.js?${id}`, window.document) : ''
}
