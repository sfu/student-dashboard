import formatLibraryHours from '../formatLibraryHours'
import { TIME_SEPARATOR } from '../../const/timeFormat'

it('Open All Day', () => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": true,
    "close_time": "12:00AM",
    "open_time": "12:00AM",
    "closed_all_day": false
  }
  expect(formatLibraryHours(location)).toBe('Open 24-Hours')
})

it('Closed All Day', () => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": false,
    "close_time": "12:00AM",
    "open_time": "12:00AM",
    "closed_all_day": true
  }
  expect(formatLibraryHours(location)).toBe('Closed All Day')
})

it('Specific Hours, 12h', () => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": false,
    "close_time": " 5:00PM",
    "open_time": "10:00AM",
    "closed_all_day": false
  }
  const expected = `10:00 AM ${TIME_SEPARATOR} 5:00 PM`
  expect(formatLibraryHours(location)).toBe(expected)
})

it('Specific Hours, 12h, same meridiem', () => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": false,
    "close_time": " 5:00PM",
    "open_time": " 1:00PM",
    "closed_all_day": false
  }
  const expected = `1:00 ${TIME_SEPARATOR} 5:00 PM`
  expect(formatLibraryHours(location)).toBe(expected)
})

it('Specific Hours, 24h', () => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": false,
    "close_time": " 5:00PM",
    "open_time": "10:00AM",
    "closed_all_day": false
  }
  const expected = `10:00 ${TIME_SEPARATOR} 17:00`
  expect(formatLibraryHours(location, '24h')).toBe(expected)
})
