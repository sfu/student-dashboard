import test from 'ava'
import sinon from 'sinon'
import libraryIsOpen from '../libraryIsOpen'

test('false if closed_all_day', t => {
  const location = {
    "in_range": true,
    "location": "Fraser Library",
    "open_all_day": false,
    "close_time": "12:00AM",
    "open_time": "12:00AM",
    "closed_all_day": true
  }
  t.false(libraryIsOpen(location))
})

test('true if open_all_day', t => {
  const location = {
    "in_range": true,
    "location": "Bennett Library",
    "open_all_day": true,
    "close_time": "12:00AM",
    "open_time": "12:00AM",
    "closed_all_day": false
  }
  t.true(libraryIsOpen(location))
})

test('true if in_range AND actually in range', t => {
  const clock = sinon.useFakeTimers(new Date(2016,11,19,12,0,0).getTime())
  const location = {
    "in_range": true,
    "location": "Belzberg Library",
    "open_all_day": false,
    "close_time": " 5:00PM",
    "open_time": "10:00AM",
    "closed_all_day": false
  }
  t.true(libraryIsOpen(location))
  clock.restore()
})

test('false if in_range AND NOT actually in range', t => {
  const clock = sinon.useFakeTimers(new Date(2016,11,19,9,0,0).getTime())
  const location = {
    "in_range": true,
    "location": "Belzberg Library",
    "open_all_day": false,
    "close_time": " 5:00PM",
    "open_time": "10:00AM",
    "closed_all_day": false
  }
  t.false(libraryIsOpen(location))
  clock.restore()
})
