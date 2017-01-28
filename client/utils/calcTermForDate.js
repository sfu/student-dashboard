import isWithinRange from 'date-fns/is_within_range'
import getYear from 'date-fns/get_year'
import getMonth from 'date-fns/get_month'
import leftPad from './leftPad'
import { TERM_DATES } from '../const'

const SPRING = '1'
const SUMMER = '4'
const FALL = '7'

// Term codes are 4 digit integers. The first 3 digits represent the year with
// an offset of 1900. The last digit represents Spring, Summer, or Fall.
// For example: 1164 stands for 2016 Summer.
export default (date = new Date()) => {
  let term

  // SUMMER
  if (isWithinRange(
    date,
    new Date(`${getYear(date)}-${TERM_DATES.summer.start.month}-${TERM_DATES.summer.start.day}`).getTime(),
    new Date(`${getYear(date)}-${TERM_DATES.summer.end.month}-${TERM_DATES.summer.end.day}`).getTime(),
    null, '[]'
  )) {
    term = SUMMER

  // FALL
} else if (isWithinRange(
    date,
    new Date(`${getYear(date)}-${TERM_DATES.fall.start.month}-${TERM_DATES.fall.start.day}`).getTime(),
    new Date(`${getYear(date)}-${TERM_DATES.fall.end.month}-${TERM_DATES.fall.end.day}`).getTime(),
    null, '[]'
  )) {
    term = FALL

  // SPRING
  } else {
    term = SPRING
  }

  // if term is SPRING and we're still in December, year++
  const year = leftPad((((term === SPRING && getMonth(date) === 11) ?
    getYear(date) + 1 :
    getYear(date)
  ) - 1900).toString(), 3, '0')

  return `${year}${term}`
}
