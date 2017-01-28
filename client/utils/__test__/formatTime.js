import test from 'ava'
import formatTime from '../formatTime'

const testDate = 1485815100000

test('should return a 24-hour time string', t => {
  t.is(formatTime(testDate, '24h'), `14:25`)
})

test('should return a 12-hour time string with period', t => {
  t.is(formatTime(testDate, '12h'), `2:25 PM`)
})

test('default to 12-hour when no format passed', t => {
  t.is(formatTime(testDate), `2:25 PM`)
})
