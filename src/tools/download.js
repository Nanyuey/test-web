// download.js
const UA = window.navigator.userAgent.toLowerCase()

const ie = !!(UA.match(/MSIE\s([\d.]+)/i) || // IE 11 Trident/7.0; rv:11.0
  UA.match(/Trident\/.+?rv:(([\d.]+))/i))

const edge = !!UA.match(/Edge\/([\d.]+)/i) // IE 12 and 12+

function download (url, title, type) {
  const $a = document.createElement('a')

  $a.download = title + '.' + type
  $a.target = '_blank'
  $a.href = url

  // Chrome and Firefox
  if (typeof MouseEvent === 'function' && !ie && !edge) {
    const evt = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: false
    })
    $a.dispatchEvent(evt)
  }
  // IE
  else {
    const html = '' + '<body style="margin:0;">' + '<img src="' + url + '" style="max-width:100%;" title="' + '" />' + '</body>'
    const tab = window.open()
    tab.document.write(html)
  }
}

export default download
