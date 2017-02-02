import formatTime from '../formatTime'

describe('formatTime', () => {
  const testDate = 1485815100000
  it('should return a 24-hour time string', () => {
    expect(formatTime(testDate, '24h')).toBe(`14:25`)
  })

  it('should return a 12-hour time string with period', () => {
    expect(formatTime(testDate, '12h')).toBe(`2:25 PM`)
  })

  it('default to 12-hour when no format passed', () => {
    expect(formatTime(testDate)).toBe(`2:25 PM`)
  })
})
