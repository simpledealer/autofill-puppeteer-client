import { toBase64 } from './base64'

export default key => new Promise((resolve, reject) => {
  const timeoutId = setTimeout(() => {
    reject(new Error('AutofillDaemonNotInstalled'))
  }, 200)

  // We Base64 the key because we do not want a situation where special chars in s3 keys
  // would break the url
  window.location.href = `sd-autofill://${toBase64(key)}`
  
  window.addEventListener('blur', () => {
    clearTimeout(timeoutId)
    resolve()
  })
})
