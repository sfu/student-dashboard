import convert from './convertLibraryTimeStringTo24Hours'
import dateFromTimeString from './dateFromTimeString'
import isWithinRange from 'date-fns/is_within_range'
/*
  The Library Hours API (api.lib.sfu.ca/hours/summary) contains an `in_range
  property which is supposed to indicate if the current time is within the
  range of `open_time` and `end_time`. This has proven to not be completely
  reliable (e.g. when the library closes early). This function determines if
  a library location is actually currently open based on the following:
    * if closed_all_day === true => false
    * if open_all_day === true => true
    * if in_range === true:
      * sanity check current time is between `open_time` and `close_time`
*/

export default location => {
  const {
    closed_all_day,
    open_all_day,
    in_range,
    open_time,
    close_time
  } = location

  if (closed_all_day) { return false }
  if (open_all_day) { return true }

  // trust, but verify
  if (in_range) {
    // convert open_time and close_time to date objects
    // if both === "12:00AM", close_time should be 23:59:59
    const open24 = convert(open_time)
    const openDate = dateFromTimeString(open24)
    const close24 = close_time === '12:00AM' ? '23:59' : convert(close_time)
    const closeDate = dateFromTimeString(close24)
    const now = new Date()
    return isWithinRange(now, openDate, closeDate)
  }
}
