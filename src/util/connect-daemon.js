export default key => {
  if (typeof window !== 'undefined') {
    window.location.href = `simple-dealer://${key}`
  }
}
