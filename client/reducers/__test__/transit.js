import test from 'ava'
import transit, { DEFAULT } from '../transit'

test('Default', t => {
  const nextState = transit(undefined, {})
  t.deepEqual(nextState, DEFAULT)
})

test('ADD_TRANSIT_BOOKMARK should throw if missing `stop`', t => {
  t.throws(() => {
    transit(DEFAULT, {
      type: 'ADD_TRANSIT_BOOKMARK',
      route: '145'
    })

  }, TypeError)
})

test('ADD_TRANSIT_BOOKMARK should throw if missing `route`', t => {
  t.throws(() => {
    transit(DEFAULT, {
      type: 'ADD_TRANSIT_BOOKMARK',
      stop: '12345'
    })

  }, TypeError)
})

test('ADD_TRANSIT_BOOKMARK should throw if missing `destination`', t => {
  t.throws(() => {
    transit(DEFAULT, {
      type: 'ADD_TRANSIT_BOOKMARK',
      stop: '12345',
      route: '145'
    })

  }, TypeError)
})

test('ADD_TRANSIT_BOOKMARK - initial empty', t => {
  const nextState = transit(DEFAULT, {
    type: 'ADD_TRANSIT_BOOKMARK',
    stop: '12345',
    route: '145',
    destination: 'SFU'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'SFU' }
    ]
  }

  t.deepEqual(nextState, expected)
})

test('ADD_TRANSIT_BOOKMARK - existing stop & route, new destination', t => {
  const nextState = transit({
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'SFU' }
    ]
  }, {
    type: 'ADD_TRANSIT_BOOKMARK',
    stop: '12345',
    route: '145',
    destination: 'PRODUCTION STATION'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'SFU' },
      { stop: '12345', 'route': '145', 'destination': 'PRODUCTION STATION' }
    ]

  }
  t.deepEqual(nextState, expected)
})

test('ADD_TRANSIT_BOOKMARK - new stop', t => {
  const nextState = transit({
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'SFU' }
    ]

  }, {
    type: 'ADD_TRANSIT_BOOKMARK',
    stop: '98765',
    route: '135',
    destination: 'BURRARD STATION'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'SFU' },
      { stop: '98765', 'route': '135', 'destination': 'BURRARD STATION' }
    ]
  }

  t.deepEqual(nextState, expected)

})

test('REMOVE_TRANSIT_BOOKMARK - remove existing bookmark', t=> {
  const nextState = transit({
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'SFU' },
      { stop: '12345', 'route': '145', 'destination': 'PRODUCTION STATION' }
    ]

  }, {
    type: 'REMOVE_TRANSIT_BOOKMARK',
    stop: '12345',
    route: '145',
    destination: 'SFU'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'PRODUCTION STATION' },
    ]
  }

  t.deepEqual(nextState, expected)
})

test('REMOVE_TRANSIT_BOOKMARK -- non-existant bookmark', t=> {
  const nextState = transit({
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'SFU' },
      { stop: '12345', 'route': '145', 'destination': 'PRODUCTION STATION' }
    ]

  }, {
    type: 'REMOVE_TRANSIT_BOOKMARK',
    stop: '98765',
    route: '135',
    destination: 'NOWHERE'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: [
      { stop: '12345', 'route': '145', 'destination': 'SFU' },
      { stop: '12345', 'route': '145', 'destination': 'PRODUCTION STATION' }
    ]

  }

  t.deepEqual(nextState, expected)
})

test('REMOVE_TRANSIT_BOOKMARK -- empty bookmarks', t=> {
  const nextState = transit(DEFAULT, {
    type: 'REMOVE_TRANSIT_BOOKMARK',
    stop: '99999',
    route: '145',
    destination: 'SFU'
  })

  t.deepEqual(nextState, DEFAULT)
})
