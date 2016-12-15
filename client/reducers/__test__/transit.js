import test from 'ava'
import transit, { DEFAULT } from '../transit'

test('Default', t => {
  const nextState = transit(undefined, {})
  t.deepEqual(nextState, DEFAULT)
})
