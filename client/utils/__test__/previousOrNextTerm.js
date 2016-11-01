import test from 'ava'
import previousOrNextTerm from '../previousOrNextTerm'
const NEXT = 'NEXT'
const PREV = 'PREV'

test('should throw TypeError when receiving other than string', t => {
  t.throws(() => {previousOrNextTerm(1167, NEXT)}, TypeError)
})

test('should throw RangeError if term code outside range', t => {
  t.throws(() => {previousOrNextTerm('2167', NEXT)}, RangeError)
})

test('should throw RangeError if term code is too long', t => {
  t.throws(() => {previousOrNextTerm('12345', NEXT)}, RangeError)
})

test('should throw RangeError if term code is too short', t => {
  t.throws(() => {previousOrNextTerm('123', NEXT)}, RangeError)
})

test('should throw RangeError if invalid term provided in termCode', t => {
  t.throws(() => {previousOrNextTerm('1169', NEXT)}, RangeError)
})

test('should throw RangeError if invalid direction provided', t => {
  t.throws(() => {previousOrNextTerm('1167', 'WHARRRGARBL')})
})

test('previous term before 1167 should return "1164"', t => {
  t.is(previousOrNextTerm('1167', PREV), '1164')
})

test('previous term before 1164 should return "1161"', t => {
  t.is(previousOrNextTerm('1164', PREV), '1161')
})

test('previous term before 1161 should return "1157"', t => {
  t.is(previousOrNextTerm('1161', PREV), '1157')
})

test('next term after 1167 should return "1171"', t => {
  t.is(previousOrNextTerm('1167', NEXT), '1171')
})

test('next term after 1171 should return "1174"', t => {
  t.is(previousOrNextTerm('1171', NEXT), '1174')
})

test('next term after 1174 should return "1177"', t => {
  t.is(previousOrNextTerm('1174', NEXT), '1177')
})
