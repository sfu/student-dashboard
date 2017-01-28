import formatTimeRange from './formatTimeRange'
import convert from './convertLibraryTimeStringTo24Hours'
import dateFromTimeString from './dateFromTimeString'
export default (location, format = '12h') => {
  const {
    open_all_day,
    closed_all_day,
    open_time,
    close_time
  } = location

  if (open_all_day) {
    return 'Open 24-Hours'
  }

  if (closed_all_day) {
    return 'Closed All Day'
  }

  return formatTimeRange(
    dateFromTimeString(convert(open_time)),
    dateFromTimeString(convert(close_time)),
    format
  )
}
