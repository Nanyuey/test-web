import { debounce } from 'lodash'
import { isMobile } from 'tools/device'
function screenInit (baseWidth) {
  const docEle = document.documentElement
  function setHtmlFontSize () {
    let deviceWidth = docEle.clientWidth
    let fontSize = ''
    if (baseWidth === 375) {
      fontSize = deviceWidth / baseWidth * 12.5
    } else if (baseWidth === 1280) {
      const defaultRatio = 1280 / 698 // 原设计稿默认比例
      const deviceHeight = docEle.clientHeight
      const ratio = deviceWidth / deviceHeight // 实际现有比例
      if (ratio > defaultRatio) {
        // 当实际比例大于默认比例 则宽度需缩小
        deviceWidth = deviceWidth * defaultRatio / ratio
      }
      deviceWidth = deviceWidth > 1100 ? deviceWidth : 1100
      fontSize = deviceWidth / baseWidth * 64
    }
    document.documentElement.style.fontSize = fontSize + 'px'
  }
  setHtmlFontSize()
  window.addEventListener('resize', debounce(setHtmlFontSize, 80))
}
function setSize (num) {
  const fontSize = parseFloat(document.documentElement.style.fontSize)
  if (isMobile) {
    return num * fontSize / 12.5
  } else {
    return num * fontSize / 64
  }
}
export {
  screenInit,
  setSize
}
