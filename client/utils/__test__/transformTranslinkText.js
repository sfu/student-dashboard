import test from 'ava'
import transformTranslinkText from '../transformTranslinkText'

test('SFU -> SFU', t => {
  t.is(transformTranslinkText('SFU'), 'SFU')
})

test('COQ STN -> Coquitlam Station', t => {
  t.is(transformTranslinkText('COQ STN'), 'Coquitlam Station')
})

test('METROTOWN STN -> Metrotown Station', t => {
  t.is(
    transformTranslinkText('METROTOWN STN'),
    'Metrotown Station'
  )
})

test('VCC-CLARK STN -> VCC-Clark Station', t => {
  t.is(
    transformTranslinkText('VCC-CLARK STN'),
    'VCC-Clark Station'
  )
})
