export default str => {
  const d = new Date()
  const t = str.split(':')
  d.setHours(t[0])
  d.setMinutes(t[1])
  return d
}
