import test from 'ava'
import getHours from 'date-fns/get_hours'
import getMinutes from 'date-fns/get_minutes'
import dateForHoursAndMinutes from '../dateForHoursAndMinutes'

test('should correctly create a date given hours and minutes', t => {
  const hours = 11
  const minutes = 45
  const result = dateForHoursAndMinutes(hours, minutes)
  t.is(getHours(result), hours)
  t.is(getMinutes(result), minutes)
})
