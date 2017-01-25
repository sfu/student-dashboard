import moment from 'moment'
import {
  TIME_FORMAT_12H_WITH_PERIOD,
  TIME_FORMAT_12H_WITHOUT_PERIOD,
  TIME_FORMAT_24H,
  TIME_SEPARATOR
} from '../const'

// start and end are moment() objects
export default (start, end, format='12h') => {

  if (!(start instanceof moment)) {
    throw new TypeError('`start` must be a `moment` object')
  }

  if (!(end instanceof moment)) {
    throw new TypeError('`end` must be a `moment` object')
  }

  if (start.isSame(end)) {
    return format === '12h' ? end.format(TIME_FORMAT_12H_WITH_PERIOD) : end.format(TIME_FORMAT_24H)
  }

  if (format === '24h') {
    return `${start.format(TIME_FORMAT_24H)} ${TIME_SEPARATOR} ${end.format(TIME_FORMAT_24H)}`
  }

  // if both start and end are in the same period, only return the period on the end time
  const startPeriod = start.hour() >= 12 ? 'PM' : 'AM'
  const endPeriod = end.hour() >= 12 ? 'PM' : 'AM'
  if (startPeriod === endPeriod) {
    return `${start.format(TIME_FORMAT_12H_WITHOUT_PERIOD)} ${TIME_SEPARATOR} ${end.format(TIME_FORMAT_12H_WITH_PERIOD)}`
  } else {
    return `${start.format(TIME_FORMAT_12H_WITH_PERIOD)} ${TIME_SEPARATOR} ${end.format(TIME_FORMAT_12H_WITH_PERIOD)}`
  }
}
