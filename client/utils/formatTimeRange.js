import formatDate from 'date-fns/format'
import getHours from 'date-fns/get_hours'
import {
  TIME_FORMAT_12H_WITH_PERIOD,
  TIME_FORMAT_12H_WITHOUT_PERIOD,
  TIME_FORMAT_24H,
  TIME_SEPARATOR
} from '../const'

// start and end are Date objects
export default (start, end, format='12h') => {

  if (!(start instanceof Date)) {
    throw new TypeError('`start` must be a `Date` object')
  }

  if (!(end instanceof Date)) {
    throw new TypeError('`end` must be a `Date` object')
  }

  if (start.getTime() === end.getTime()) {
    return formatDate(end, format === '12h' ? TIME_FORMAT_12H_WITH_PERIOD : TIME_FORMAT_24H)
  }

  if (format === '24h') {
    return `${formatDate(start, TIME_FORMAT_24H)} ${TIME_SEPARATOR} ${formatDate(end, TIME_FORMAT_24H)}`
  }

  // if both start and end are in the same period, only return the period on the end time
  const startPeriod = getHours(start) >= 12 ? 'PM' : 'AM'
  const endPeriod = getHours(end) >= 12 ? 'PM' : 'AM'
  if (startPeriod === endPeriod) {
    return `${formatDate(start, TIME_FORMAT_12H_WITHOUT_PERIOD)} ${TIME_SEPARATOR} ${formatDate(end, TIME_FORMAT_12H_WITH_PERIOD)}`
  } else {
    return `${formatDate(start, TIME_FORMAT_12H_WITH_PERIOD)} ${TIME_SEPARATOR} ${formatDate(end, TIME_FORMAT_12H_WITH_PERIOD)}`
  }
}
