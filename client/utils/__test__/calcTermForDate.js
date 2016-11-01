import test from 'ava'
import calcTermForDate from '../calcTermForDate'


test('2016-09-26 should be 1167', t => {
  t.is((calcTermForDate(new Date('2016-09-26'))), '1167')
})

test('2016-12-24 should be 1167', t => {
  t.is((calcTermForDate(new Date('2016-12-24'))), '1167')
})

test('2016-12-25 should be 1171', t => {
  t.is((calcTermForDate(new Date('2016-12-25'))), '1171')
})

test('2017-01-01 should be 1171', t => {
  t.is((calcTermForDate(new Date('2017-01-01'))), '1171')
})

test('2017-04-23 should be 1171', t => {
  t.is((calcTermForDate(new Date('2017-04-23'))), '1171')
})

test('2017-04-24 should be 1174', t => {
  t.is((calcTermForDate(new Date('2017-04-24'))), '1174')
})

test('2017-08-24 should be 1174', t => {
  t.is((calcTermForDate(new Date('2017-08-24'))), '1174')
})

test('1997-09-01 should be 0977', t => {
  t.is((calcTermForDate(new Date('1997-09-01'))), '0977')
})
