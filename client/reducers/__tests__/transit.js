import transit, { DEFAULT } from '../transit'

describe('Transit Reducer', () => {
  it('Default', () => {
    const nextState = transit(undefined, {})
    expect(nextState).toEqual(DEFAULT)
  })
})
