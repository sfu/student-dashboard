import setHours from 'date-fns/set_hours'
import setMinutes from 'date-fns/set_minutes'

export default (hour = 0, minute = 0) => {
  return setMinutes(setHours(new Date(), hour), minute)
}
