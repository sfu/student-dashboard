import test from 'ava'
import { default as header, DEFAULT } from '../header'

test('returns default state when no action passed', t => {
  const nextState = header(undefined, {})
  t.deepEqual(nextState, DEFAULT)
})

test('toggles the nav state when action TOGGLE_HEADER_NAV passed', t => {
  const nextState = header(DEFAULT, { type: 'TOGGLE_HEADER_NAV' })
  t.is(nextState.showNav, true)
})
