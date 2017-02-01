import transit, { DEFAULT } from '../transit'

it('Default', () => {
  const nextState = transit(undefined, {})
  expect(nextState).toEqual(DEFAULT)
})
