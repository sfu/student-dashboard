import test from 'ava'
import RedisStore from '../redis'
import redis from 'fakeredis'

test('Throws an error when no redis client is provided', t => {
  t.throws(() => {
    new RedisStore()
  })
})

test('Instantiate a new RedisStore', t => {
  const store = new RedisStore(redis.createClient())
  t.truthy(store, store instanceof RedisStore)
})

test('Store a PGT in the store', async t => {
  const store = new RedisStore(redis.createClient())
  const result = store.set('A', 1)
  t.is(await result, 'OK')
})

test('Retreive a PGT from the store', async t => {
  const store = new RedisStore(redis.createClient())
  const pgt = 'PGT12345'
  const iou = 'PGTIOU12345'
  await store.set(iou, pgt)
  const result = store.get(iou)
  t.is(await result, pgt)
})

// test('Retreive all PGTs from the store', t => {

// })
//
// test('Delete a PGT from the store', t => {
// })
//
// test('Clear all PGTs from the store', t => {
// })
