import test from 'ava'
import MemoryStore from '../memory'


test.beforeEach(t => {
  t.context.store = new MemoryStore()
})

test.afterEach(t => {
  t.context.store = null
})

test('Instantiate a new MemoryStore', t => {
  t.truthy(t.context.store, t.context.store instanceof MemoryStore)
})

test('Store a PGT in the store', t => {
  const mapobj = t.context.store.set('PGTIOU12345', 'PGT12345')
  const test = mapobj.get('PGTIOU12345')
  t.is(test.pgt, 'PGT12345')
})

test('Retreive a PGT from the store', t => {
  t.context.store.set('PGTIOU12345', 'PGT12345')
  const test = t.context.store.get('PGTIOU12345')
  t.is(test, 'PGT12345')
})

test('Retreive all PGTs from the store', t => {
  t.context.store.set('A', 1)
  t.context.store.set('B', 2)
  t.context.store.set('C', 3)
  const test = t.context.store.all()
  t.is(Array.from(test).length, 3)
})

test('Delete a PGT from the store', t => {
  const mapobj = t.context.store.set('A', 1)
  t.context.store.del('A')
  t.is(mapobj.size, 0)
})

test('Clear all PGTs from the store', t => {
  const mapobj = t.context.store.set('A', 1)
  t.context.store.set('B', 2)
  t.context.store.set('C', 3)
  t.context.store.clear()
  t.is(mapobj.size, 0)
})
