import convert from '../convertLibraryTimeStringTo24Hours'

it('12:00AM => 00:00', () => {
  expect(convert('12:00AM')).toBe('00:00')
})

it('9:00AM => 09:00', () => {
  expect(convert('09:00AM')).toBe('09:00')
})

it('10:00AM => 10:00', () => {
  expect(convert('10:00AM')).toBe('10:00')
})

it('1:00PM => 13:00', () => {
  expect(convert('1:00PM')).toBe('13:00')
})

it(' 1:00PM => 13:00 (leading space)', () => {
  expect(convert(' 1:00PM')).toBe('13:00')
})
