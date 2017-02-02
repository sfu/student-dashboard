import formatTimeRange from '../formatTimeRange'
import { TIME_SEPARATOR } from '../../const'

describe('formatTimeRange', () => {
  it('should throw with a non-Date start', () => {
    const d = new Date()
    expect(() => {formatTimeRange({}, d, '12h')}).toThrowError(TypeError)
  })

  it('should throw with a non-Date end', () => {
    const d = new Date()
    expect(() => {formatTimeRange(d, {}, '12h')}).toThrowError(TypeError)
  })

  it('should return a 24-hour time string', () => {
    const start = new Date('2016-11-04 11:30')
    const end = new Date('2016-11-04 13:20')
    const result = formatTimeRange(start, end, '24h')
    expect(result).toBe(`11:30 ${TIME_SEPARATOR} 13:20`)
  })

  it('a 12-hour string spanning noon should have periods on start and end', () => {
    const start = new Date('2016-11-04 11:30')
    const end = new Date('2016-11-04 13:20')
    const result = formatTimeRange(start, end)
    expect(result).toBe(`11:30 AM ${TIME_SEPARATOR} 1:20 PM`)
  })

  it('a 12-hour string before noon should have period on end only', () => {
    const start = new Date('2016-11-04 10:30')
    const end = new Date('2016-11-04 11:20')
    const result = formatTimeRange(start, end)
    expect(result).toBe(`10:30 ${TIME_SEPARATOR} 11:20 AM`)
  })

  it('a 12-hour string after noon should have period on end only', () => {
    const start = new Date('2016-11-04 15:30')
    const end = new Date('2016-11-04 16:20')
    const result = formatTimeRange(start, end)
    expect(result).toBe(`3:30 ${TIME_SEPARATOR} 4:20 PM`)
  })

  it('a 12-hour string returns only the end w/ period when start & end are the same', () => {
    const start = new Date('2016-11-04 23:59')
    const end = new Date('2016-11-04 23:59')
    const result = formatTimeRange(start, end)
    expect(result).toBe('11:59 PM')
  })

  it('a 24-hour string returns only the end in 24H when start & end are the same', () => {
    const start = new Date('2016-11-04 23:59')
    const end = new Date('2016-11-04 23:59')
    const result = formatTimeRange(start, end, '24h')
    expect(result).toBe('23:59')
  })
})
