import test from 'ava'
import convert from '../convertLibraryTimeStringTo24Hours'

test('12:00AM => 00:00', t => {
  t.is(convert('12:00AM'), '00:00')
})

test('9:00AM => 09:00', t => {
  t.is(convert('09:00AM'), '09:00')
})

test('10:00AM => 10:00', t => {
  t.is(convert('10:00AM'), '10:00')
})

test('1:00PM => 13:00', t => {
  t.is(convert('1:00PM'), '13:00')
})

test(' 1:00PM => 13:00 (leading space)', t => {
  t.is(convert(' 1:00PM'), '13:00')
})
