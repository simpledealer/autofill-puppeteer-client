export default key => new Promise((resolve, reject) => {
  const timeoutId = setTimeout(() => {
    reject(new Error('AutofillDaemonNotInstalled'))
  }, 200)

  window.location.href = `sd-autofill://${key}`
  window.addEventListener('blur', () => {
    clearTimeout(timeoutId)
    resolve()
  })
})
