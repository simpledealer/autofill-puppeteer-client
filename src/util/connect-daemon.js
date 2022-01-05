import errors from './errors'

export default key => new Promise((resolve, reject) => {
  const timeoutId = setTimeout(() => {
    reject(errors.DaemonNotInstalledError)
  }, 3000)

  // We Base64 the key because we do not want a situation where special chars in s3 keys
  // would break the url
  window.location.href = `simple-dealer://${key}`

  window.addEventListener('blur', () => {
    clearTimeout(timeoutId)
    resolve()
  })
})
