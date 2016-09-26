import assert from 'assert'
import calcTerm from '../calcTerm'

const tests = [

  // SHOULD BE FALL 2016 (1167)
  {
    date: new Date('2016-09-26').getTime(),
    shouldBeTerm: '1167'
  },

  {
    date: new Date('2016-12-24').getTime(),
    shouldBeTerm: '1167'
  },

  // SHOULD BE SPRING 2017 (1171)
  {
    date: new Date('2016-12-25').getTime(),
    shouldBeTerm: '1171'
  },

  {
    date: new Date('2017-01-01').getTime(),
    shouldBeTerm: '1171'
  },

  {
    date: new Date('2017-04-23').getTime(),
    shouldBeTerm: '1171'
  },

  // SHOULD BE SUMMER 2017 (1174)
  {
    date: new Date('2017-04-24').getTime(),
    shouldBeTerm: '1174'
  },

  {
    date: new Date('2017-08-24').getTime(),
    shouldBeTerm: '1174'
  },

  // SHOULD BE FALL 1997 (0977)
  {
    date: new Date('1997-09-01').getTime(),
    shouldBeTerm: '0977'
  }

]

tests.forEach((test, i) => {
  const result = calcTerm(test.date)
  assert.strictEqual(result, test.shouldBeTerm, `tests[${i}]: got ${result}, should be ${test.shouldBeTerm}`)
})
