import test from 'ava'
import formatTimeRange from '../formatTimeRange'
import moment from 'moment'
import { TIME_SEPARATOR } from '../../const'

test('should throw with a non-moment start', t => {
  t.throws(() => {formatTimeRange(new Date(), moment(), '12h')}, TypeError)
})

test('should throw with a non-moment end', t => {
  t.throws(() => {formatTimeRange(moment(), new Date(), '12h')}, TypeError)
})

test('should return a 24-hour time string', t => {
  const start = moment('2016-11-04 11:30')
  const end = moment('2016-11-04 13:20')
  const result = formatTimeRange(start, end, '24h')
  t.is(result, `11:30 ${TIME_SEPARATOR} 13:20`)
})

test('a 12-hour string spanning noon should have periods on start and end', t => {
  const start = moment('2016-11-04 11:30')
  const end = moment('2016-11-04 13:20')
  const result = formatTimeRange(start, end)
  t.is(result, `11:30 AM ${TIME_SEPARATOR} 1:20 PM`)
})

test('a 12-hour string before noon should have period on end only', t => {
  const start = moment('2016-11-04 10:30')
  const end = moment('2016-11-04 11:20')
  const result = formatTimeRange(start, end)
  t.is(result, `10:30 ${TIME_SEPARATOR} 11:20 AM`)
})

test('a 12-hour string after noon should have period on end only', t => {
  const start = moment('2016-11-04 15:30')
  const end = moment('2016-11-04 16:20')
  const result = formatTimeRange(start, end)
  t.is(result, `3:30 ${TIME_SEPARATOR} 4:20 PM`)
})

test('a 12-hour string returns only the end w/ period when start & end are the same', t => {
  const start = moment('2016-11-04 23:59')
  const end = moment('2016-11-04 23:59')
  const result = formatTimeRange(start, end)
  t.is(result, '11:59 PM')
})

test('a 24-hour string returns only the end in 24H when start & end are the same', t => {
  const start = moment('2016-11-04 23:59')
  const end = moment('2016-11-04 23:59')
  const result = formatTimeRange(start, end, '24h')
  t.is(result, '23:59')
})
