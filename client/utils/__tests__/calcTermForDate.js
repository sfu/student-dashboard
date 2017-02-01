import calcTermForDate from '../calcTermForDate'


it('2016-09-26 should be 1167', () => {
  expect(calcTermForDate(new Date('2016-09-26'))).toBe('1167')
})

it('2016-12-24 should be 1167', () => {
  expect(calcTermForDate(new Date('2016-12-24'))).toBe('1167')
})

it('2016-12-25 should be 1171', () => {
  expect(calcTermForDate(new Date('2016-12-25'))).toBe('1171')
})

it('2017-01-01 should be 1171', () => {
  expect(calcTermForDate(new Date('2017-01-01'))).toBe('1171')
})

it('2017-04-23 should be 1171', () => {
  expect(calcTermForDate(new Date('2017-04-23'))).toBe('1171')
})

it('2017-04-24 should be 1174', () => {
  expect(calcTermForDate(new Date('2017-04-24'))).toBe('1174')
})

it('2017-08-24 should be 1174', () => {
  expect(calcTermForDate(new Date('2017-08-24'))).toBe('1174')
})

it('1997-09-01 should be 0977', () => {
  expect(calcTermForDate(new Date('1997-09-01'))).toBe('0977')
})
