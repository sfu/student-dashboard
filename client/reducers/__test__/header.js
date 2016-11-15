import test from 'ava'
import header from '../header'

test('returns default state when no action passed', t => {
  const nextState = header(undefined, undefined)
  t.deepEqual(nextState, { showNav: false })
})

test('toggles the nav state when action TOGGLE_HEADER_NAV passed', t => {
  const state = {
    showNav: false
  }
  const nextState = header(state, 'TOGGLE_HEADER_NAV')
  t.is(nextState.showNav, true)
})
