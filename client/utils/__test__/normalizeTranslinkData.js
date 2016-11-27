import test from 'ava'
import normalizeTranslinkData from '../normalizeTranslinkData'
import {
  thisIsFine,
  thisIsNotFine
} from './mocks/translinkData'

test('When stops are all one destination', t => {
  t.deepEqual(normalizeTranslinkData(thisIsFine), thisIsFine)
})

test('When stops have multiple destinations', t => {
  const result = normalizeTranslinkData(thisIsNotFine)
  t.is(result.length, 2)
  t.is(result[0].Schedules.length, 3)
  t.is(result[1].Schedules.length, 3)
})
