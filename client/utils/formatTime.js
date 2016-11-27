import moment from 'moment'
import {
  TIME_FORMAT_12H_WITH_PERIOD,
  TIME_FORMAT_24H
} from '../const'

export default (timestamp, format='12h') => {
  const timeFormat = format === '12h' ? TIME_FORMAT_12H_WITH_PERIOD : TIME_FORMAT_24H
  return moment(timestamp).format(timeFormat)
}
