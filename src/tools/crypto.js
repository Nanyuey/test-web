// export async function encryption(data, password) {
//   const forge = await
//   import ('third/forge/forge.min.js')

//   const key = forge.pkcs5.pbkdf2(password, '', 3, 16),
//     cipher = forge.cipher.createCipher('AES-ECB', key)

//   cipher.start({ iv: '' })
//   cipher.update(forge.util.createBuffer(data))
//   cipher.finish()
//   return forge.util.encode64(cipher.output.data)
// }

// export async function decryption(data, password) {
//   const forge = await
//   import ('third/forge/forge.min.js')

//   const key = forge.pkcs5.pbkdf2(password, '', 3, 16),
//     decipher = forge.cipher.createDecipher('AES-ECB', key)

//   data = forge.util.decode64(data)

//   decipher.start({ iv: '' })
//   decipher.update(forge.util.createBuffer(data))
//   decipher.finish()
//   return decipher.output.data
// }
import { HmacMD5 } from 'crypto-js'

const sort = 'raycloud'.split('').sort().join('')

export const hmacMD5 = (value) => {
  return HmacMD5(value, sort).toString()
}
