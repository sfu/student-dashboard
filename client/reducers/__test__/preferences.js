import test from 'ava'
import preferences, { DEFAULT } from '../preferences'

test('Default', t => {
  const nextState = preferences(undefined, {})
  t.deepEqual(nextState, DEFAULT)
})

test('GET_PREFERENCES', t => {
  const nextState = preferences(DEFAULT, {
    type: 'GET_PREFERENCES'
  })
  t.deepEqual(nextState, DEFAULT)
})

test('SET_PREFERENCE', t => {
  const nextState = preferences(DEFAULT, {
    type: 'SET_PREFERENCE',
    preference: 'timeFormat',
    value: '24h'
  })
  const expected = {
    ...DEFAULT,
    timeFormat: '24h'
  }
  t.deepEqual(nextState, expected)
})

test('SET_PREFERENCE should throw for transitBookmarks', t => {
  t.throws(() => {
    preferences(DEFAULT, {
      type: 'SET_PREFERENCE',
      preference: 'transitBookmarks',
      value: ['12345']
    })
  }, TypeError)
})

test('ADD_TRANSIT_BOOKMARK should throw if missing `stop`', t => {
  t.throws(() => {
    preferences(DEFAULT, {
      type: 'ADD_TRANSIT_BOOKMARK',
      route: '145'
    })

  }, TypeError)
})

test('ADD_TRANSIT_BOOKMARK should throw if missing `route`', t => {
  t.throws(() => {
    preferences(DEFAULT, {
      type: 'ADD_TRANSIT_BOOKMARK',
      stop: '12345'
    })

  }, TypeError)
})

test('ADD_TRANSIT_BOOKMARK - initial empty', t => {
  const nextState = preferences(DEFAULT, {
    type: 'ADD_TRANSIT_BOOKMARK',
    stop: '12345',
    route: '145'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['145']
    }
  }

  t.deepEqual(nextState, expected)
})

test('ADD_TRANSIT_BOOKMARK - existing stop, new route', t => {
  const nextState = preferences({
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['145']
    }
  }, {
    type: 'ADD_TRANSIT_BOOKMARK',
    stop: '12345',
    route: '004'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['004', '145',]
    }

  }
  t.deepEqual(nextState, expected)
})

test('ADD_TRANSIT_BOOKMARK - existing stop, duplicate route', t => {
  const nextState = preferences({
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['145']
    }

  }, {
    type: 'ADD_TRANSIT_BOOKMARK',
    stop: '12345',
    route: '145'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['145']
    }
  }

  t.deepEqual(nextState, expected)
})

test('ADD_TRANSIT_BOOKMARK - new stop', t => {
  const nextState = preferences({
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['145']
    }

  }, {
    type: 'ADD_TRANSIT_BOOKMARK',
    stop: '98765',
    route: '135'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['145'],
      '98765': ['135']
    }
  }

  t.deepEqual(nextState, expected)

})

test('REMOVE_TRANSIT_BOOKMARK - remove only route from stop', t=> {
  const nextState = preferences({
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['145'],
      '98765': ['135']
    }

  }, {
    type: 'REMOVE_TRANSIT_BOOKMARK',
    stop: '98765',
    route: '135'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['145']
    }
  }

  t.deepEqual(nextState, expected)
})

test('REMOVE_TRANSIT_BOOKMARK - remove one stop from many stops', t=> {
  const nextState = preferences({
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['135', '144', '145'],
      '50490': ['004', '209']
    }

  }, {
    type: 'REMOVE_TRANSIT_BOOKMARK',
    stop: '12345',
    route: '135'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['144', '145'],
      '50490': ['004', '209']
    }
  }

  t.deepEqual(nextState, expected)
})

test('REMOVE_TRANSIT_BOOKMARK -- non-bookmarked stop', t=> {
  const nextState = preferences({
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['135', '144', '145'],
      '50490': ['004', '209']
    }

  }, {
    type: 'REMOVE_TRANSIT_BOOKMARK',
    stop: '98765',
    route: '135'
  })

  const expected = {
    ...DEFAULT,
    transitBookmarks: {
      '12345': ['135', '144', '145'],
      '50490': ['004', '209']
    }

  }

  t.deepEqual(nextState, expected)
})

test('REMOVE_TRANSIT_BOOKMARK -- empty bookmarks', t=> {
  const nextState = preferences(DEFAULT, {
    type: 'REMOVE_TRANSIT_BOOKMARK',
    stop: '99999',
    route: '123'
  })

  t.deepEqual(nextState, DEFAULT)
})
