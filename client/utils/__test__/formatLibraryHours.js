import test from 'ava'
import formatLibraryHours from '../formatLibraryHours'
import { TIME_SEPARATOR } from '../../const/timeFormat'

test('Open All Day', t => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": true,
    "close_time": "12:00AM",
    "open_time": "12:00AM",
    "closed_all_day": false
  }
  t.is((formatLibraryHours(location)), 'Open 24-Hours')
})

test('Closed All Day', t => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": false,
    "close_time": "12:00AM",
    "open_time": "12:00AM",
    "closed_all_day": true
  }
  t.is((formatLibraryHours(location)), 'Closed All Day')
})

test('Specific Hours, 12h', t => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": false,
    "close_time": " 5:00PM",
    "open_time": "10:00AM",
    "closed_all_day": false
  }
  const expected = `10:00 AM ${TIME_SEPARATOR} 5:00 PM`
  t.is(formatLibraryHours(location), expected)
})

test('Specific Hours, 12h, same meridiem', t => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": false,
    "close_time": " 5:00PM",
    "open_time": " 1:00PM",
    "closed_all_day": false
  }
  const expected = `1:00 ${TIME_SEPARATOR} 5:00 PM`
  t.is(formatLibraryHours(location), expected)
})

test('Specific Hours, 24h', t => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": false,
    "close_time": " 5:00PM",
    "open_time": "10:00AM",
    "closed_all_day": false
  }
  const expected = `10:00 ${TIME_SEPARATOR} 17:00`
  t.is(formatLibraryHours(location, '24h'), expected)
})
