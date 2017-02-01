import getHours from 'date-fns/get_hours'
import getMinutes from 'date-fns/get_minutes'
import dateForHoursAndMinutes from '../dateForHoursAndMinutes'

it('should correctly create a date given hours and minutes', () => {
  const hours = 11
  const minutes = 45
  const result = dateForHoursAndMinutes(hours, minutes)
  expect(getHours(result)).toBe(hours)
  expect(getMinutes(result)).toBe(minutes)
})
