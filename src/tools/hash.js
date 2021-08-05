export function hashCode (strKey, isLong) {
  let hash = 0
  if (typeof strKey === 'string') {
    for (var i = 0, l = strKey.length; i < l; i++) {
      hash = hash * 31 + strKey.charCodeAt(i)
      if (!isLong) {
        hash = intValue(hash)
      }
    }
  }
  return hash
};
export function intValue (num) {
  var MAX_VALUE = 0x7fffffff
  var MIN_VALUE = -0x80000000
  if (num > MAX_VALUE || num < MIN_VALUE) {
    return 0xFFFFFFFF
  }
  return num
};
