function randHex (len) {
  var arr = '0123456789abcdef'
  var rst = ''
  while (len--) {
    rst += arr[Math.floor(Math.random() * arr.length)]
  }
  return rst
}

function GenObjectId () {
  function genDateId () {
    return Math.round(new Date().getTime() / 1000).toString(16)
  }

  function genMachinePid () {
    var key = '___genMachinePid___'
    var id = localStorage.getItem(key)
    if (!id || !/[0-9a-f]{10}/i.test(id)) {
      id = randHex(10)
      localStorage.setItem(key, id)
    }
    return id
  }

  function genIncId () {
    var key = '___genObjectid_inc___'
    var inc = localStorage.getItem(key) || 0
    if (inc < 0xffffff) {
      inc++
    } else {
      inc = 0
    }
    localStorage.setItem(key, inc)
    const hexInc = inc.toString(16)
    return new Array(7 - hexInc.length).join(0) + hexInc
  }
  return genDateId() + genMachinePid() + genIncId()
};

export default id => {
  if (typeof id === 'string' && /^[0-9a-f]{24}$/i.test(id)) {
    return id
  } else {
    return GenObjectId()
  }
}
