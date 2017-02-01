import { default as header, DEFAULT } from '../header'

it('returns default state when no action passed', () => {
  const nextState = header(undefined, {})
  expect(nextState).toEqual(DEFAULT)
})

it('toggles the nav state when action TOGGLE_HEADER_NAV passed', () => {
  const nextState = header(DEFAULT, { type: 'TOGGLE_HEADER_NAV' })
  expect(nextState.showNav).toBe(true)
})
