const NEXT = 'NEXT'
const PREV = 'PREV'
const TERM_CODES = {
  '1': 'Spring',
  '4': 'Summer',
  '7': 'Fall'
}

export default (termCode, direction) => {
  if (direction !== NEXT && direction !== PREV) {
    throw new RangeError (`\`direction\` is not an allowed value. Must be either NEXT or PREV; received ${direction}`)
  }

  if (typeof termCode !== 'string') {
    throw new TypeError(`\`termCode\` must be a \`string\`, received \`${typeof termCode}\``)
  }

  if (parseInt(termCode.substr(0, 1)) > 1) {
    throw new RangeError(`\`termCode\` provided (${termCode}) is outside acceptable range`)
  }

  if (termCode.length !== 4) {
    throw new RangeError(`\`termCode\` ${termCode} is malformed`)
  }

  if (Object.keys(TERM_CODES).indexOf(termCode.substr(3)) === -1) {
    throw new RangeError(`Invalid term provided in \`termCode\` (received ${termCode.substr(termCode.length-1)})`)
  }

  const term = termCode.substr(3)
  const year = parseInt(termCode.substr(0,3))
  let nextTerm, nextYear

  switch (direction) {
    case NEXT:
      switch (term) {
        case '1':
          nextTerm = '4'
        break
        case '4':
          nextTerm = '7'
        break
        case '7':
          nextTerm = '1'
          nextYear = year + 1
        break
      }
    break
    case PREV:
      switch (term) {
        case '7':
          nextTerm = '4'
        break
        case '4':
          nextTerm = '1'
        break
        case '1':
          nextTerm = '7'
          nextYear = year - 1
        break
      }
  }
  nextYear = nextYear || year
  return `${nextYear.toString()}${nextTerm}`

}
