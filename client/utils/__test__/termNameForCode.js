import test from 'ava'
import termNameForCode from '../termNameForCode'

test('should throw TypeError when receiving other than string', t => {
  t.throws(() => {termNameForCode(1167)}, TypeError)
})

test('should throw RangeError if term code outside range', t => {
  t.throws(() => {termNameForCode('2167')}, RangeError)
})

test('should throw RangeError if term code is too long', t => {
  t.throws(() => {termNameForCode('12345')}, RangeError)
})

test('should throw RangeError if term code is too short', t => {
  t.throws(() => {termNameForCode('123')}, RangeError)
})

test('should throw RangeError if invalid term provided in termCode', t => {
  t.throws(() => {termNameForCode('1169')}, RangeError)

})

test('1167 should return "Fall 2016"', t => {
  t.is(termNameForCode('1167'), 'Fall 2016')
})

test('1171 should return "Spring 2017"', t => {
  t.is(termNameForCode('1171'), 'Spring 2017')
})

test('1174 should return "Summer 2017"', t => {
  t.is(termNameForCode('1174'), 'Summer 2017')
})

test('0977 should return "Fall 1997"', t => {
  t.is(termNameForCode('0977'), 'Fall 1997')
})
