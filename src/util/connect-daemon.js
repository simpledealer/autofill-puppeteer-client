export default key => {
  if (typeof window !== 'undefined') {
    window.location.href = `simple-dealer://${key}`
  } else {
    console.log('Cannot call daemon protocol handler. This is not a browser environment')
  }
}
