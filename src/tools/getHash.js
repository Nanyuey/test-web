import SparkMD5 from 'spark-md5'

const getHash = (file) => {
  console.log(file, 'getHash')
  const blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
  const chunkSize = 4 * 1024 * 1024 // Read in chunks of 4MB
  const chunks = Math.ceil(file.size / chunkSize)
  let currentChunk = 0
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  return new Promise((resolve, reject) => {
    fileReader.onload = function (e) {
      spark.append(e.target.result)
      currentChunk++
      if (currentChunk < chunks) {
        loadNext()
      } else {
        const hash = spark.end()
        resolve(hash)
        console.log('computed hash', spark.end())
      }
    }

    fileReader.onerror = function (err) {
      reject(err)
    }

    function loadNext () {
      const start = currentChunk * chunkSize
      const end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize
      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end))
    }
    loadNext()
  })
}

export {
  getHash
}
