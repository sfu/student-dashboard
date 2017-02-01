import previousOrNextTerm from '../previousOrNextTerm'
const NEXT = 'NEXT'
const PREV = 'PREV'

it('should throw TypeError when receiving other than string', () => {
  expect(() => {previousOrNextTerm(1167, NEXT)}).toThrowError(TypeError)
})

it('should throw RangeError if term code outside range', () => {
  expect(() => {previousOrNextTerm('2167', NEXT)}).toThrowError(RangeError)
})

it('should throw RangeError if term code is too long', () => {
  expect(() => {previousOrNextTerm('12345', NEXT)}).toThrowError(RangeError)
})

it('should throw RangeError if term code is too short', () => {
  expect(() => {previousOrNextTerm('123', NEXT)}).toThrowError(RangeError)
})

it('should throw RangeError if invalid term provided in termCode', () => {
  expect(() => {previousOrNextTerm('1169', NEXT)}).toThrowError(RangeError)
})

it('should throw RangeError if invalid direction provided', () => {
  expect(() => {previousOrNextTerm('1167', 'WHARRRGARBL')}).toThrow()
})

it('previous term before 1167 should return "1164"', () => {
  expect(previousOrNextTerm('1167', PREV)).toBe('1164')
})

it('previous term before 1164 should return "1161"', () => {
  expect(previousOrNextTerm('1164', PREV)).toBe('1161')
})

it('previous term before 1161 should return "1157"', () => {
  expect(previousOrNextTerm('1161', PREV)).toBe('1157')
})

it('next term after 1167 should return "1171"', () => {
  expect(previousOrNextTerm('1167', NEXT)).toBe('1171')
})

it('next term after 1171 should return "1174"', () => {
  expect(previousOrNextTerm('1171', NEXT)).toBe('1174')
})

it('next term after 1174 should return "1177"', () => {
  expect(previousOrNextTerm('1174', NEXT)).toBe('1177')
})
