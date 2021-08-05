const city = {
  11: '北京',
  12: '天津',
  13: '河北',
  14: '山西',
  15: '内蒙古',
  21: '辽宁',
  22: '吉林',
  23: '黑龙江 ',
  31: '上海',
  32: '江苏',
  33: '浙江',
  34: '安徽',
  35: '福建',
  36: '江西',
  37: '山东',
  41: '河南',
  42: '湖北 ',
  43: '湖南',
  44: '广东',
  45: '广西',
  46: '海南',
  50: '重庆',
  51: '四川',
  52: '贵州',
  53: '云南',
  54: '西藏 ',
  61: '陕西',
  62: '甘肃',
  63: '青海',
  64: '宁夏',
  65: '新疆',
  71: '台湾',
  81: '香港',
  82: '澳门',
  83: '台湾',
  91: '国外'
}

const checkLastStr = idcard => {
  if (idcard.length !== 18) return true

  const computeArr = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
  const checkArr = ['1', '0', 'x', '9', '8', '7', '6', '5', '4', '3', '2']
  const lastStrSub =
    computeArr
      .map((item, index) => item * idcard[index])
      .reduce((a, b) => a + b) % 11
  return (
    checkArr[lastStrSub] && checkArr[lastStrSub] === idcard[17].toLowerCase()
  )
}

export default {
  isIdcard (value) {
    const reg = /(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$)/
    return reg.test(value) && city[value.substr(0, 2)] && checkLastStr(value)
  },
  isEmpty (value) {
    if (typeof value === 'string') {
      return value.trim() === ''
    } else if (Array.isArray(value)) {
      return value.length === 0
    }
    return false
  },
  isEmail (email) {
    return email && /^(\w+(\w|-|\.)*)@(\w+(\w|-)+)(\.\w+){1,}$/.test(email)
  },
  isMobile (mobile) {
    return mobile && /^1[3|4|5|6|7|8|9]\d{9}$/.test(mobile)
  },
  isNumber (number) {
    return !isNaN(number) && /^[0-9]+.?[0-9]*$/.test(number)
  },
  isInt (number) {
    return /^[0-9]*[1-9][0-9]*$/.test(number)
  },
  isDate (date) {
    return date && /^(\d{2,4})(-|\/)(\d{1,2})(-|\/)(\d{1,2})$/.test(date)
  },
  isMin (value, min) {
    return value.length <= min
  },
  isMax (value, max) {
    return value.length >= max
  },
  isMinMax (value, min, max) {
    const len = value.length
    return len >= min && len <= max
  },
  isNick (nick) {
    return nick && /^[\w\u4E00-\u9FA5]{2,20}$/.test(nick)
  },
  isMoney (num) {
    return !isNaN(num) && /^[0-9]*(\.[0-9]{1,2})?$/.test(num)
  },
  isObjectId (id) {
    return id && /^[a-fA-F0-9]{24}$/.test(id)
  },
  isShortId (id) {
    return id && /^[a-zA-Z0-9]{4,8}$/.test(id)
  }
}
