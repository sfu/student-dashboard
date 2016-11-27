export default (string) => {
  const uppercase = ['SFU', 'UBC', 'BCIT', 'VCC']
  const replacements = {
    MCGILL: 'McGill',
    COQ: 'Coquitlam',
    STN: 'Station'
  }

  return string.trim().replace(/\-/g, " - ").split(' ').map(w => {
    if (uppercase.includes(w)) {
      return w
    }

    if (Object.keys(replacements).includes(w)) {
      return replacements[w]
    }

    return w.slice(0, 1).toUpperCase() + w.slice(1).toLowerCase()
  }).join(' ').replace(/\ - /g, "-")
}
