const blockSize = 4 * 1024 * 1024

async function Qetag (binaryString) {
  const forge = await import('../third/forge/forge.min.js')

  const bufferSize = binaryString.length
  const prefix = bufferSize > blockSize ? 0x96 : 0x16
  const blockCount = Math.ceil(bufferSize / blockSize)
  const sha1String = []

  for (var i = 0; i < blockCount; i++) {
    sha1String.push(sha1(binaryString.slice(i * blockSize, (i + 1) * blockSize)))
  }

  if (!sha1String.length) {
    return 'Fto5o-5ea0sNMlW_75VgGJCv2AcJ'
  }
  var sha1Buffer = forge.util.createBuffer()

  sha1String.forEach(function (it) {
    sha1Buffer.putBuffer(it)
  })

  if (blockCount > 1) {
    sha1Buffer = sha1(sha1Buffer.data)
  }

  var endBuffer = forge.util.createBuffer()

  endBuffer.putByte(prefix)
  endBuffer.putBuffer(sha1Buffer)

  var outStr = forge.util.encode64(endBuffer.data)

  return outStr.replace(/\//g, '_').replace(/\+/g, '-')

  function sha1 (binaryString) {
    var md = forge.md.sha1.create()
    md.update(binaryString)
    return md.digest()
  }
}

function _readAsBinaryString (file) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = res => {
      resolve(res.target.result)
    }
    fileReader.readAsBinaryString(file)
  })
}

async function QEtagFile (file) {
  const fileBinaryString = await _readAsBinaryString(file)
  return await Qetag(fileBinaryString)
}

export { QEtagFile }
