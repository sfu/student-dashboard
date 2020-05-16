import RedisStore from '../redis';
import redis from 'fakeredis';

describe('RedisStore', () => {
  let context;

  beforeEach(() => {
    context = {
      client: redis.createClient(),
    };
  });

  afterEach(() => {
    context = {};
  });

  it('Throws an error when no redis client is provided', () => {
    expect(() => {
      new RedisStore();
    }).toThrow();
  });

  it('Instantiate a new RedisStore', () => {
    const store = new RedisStore(context.client);
    expect(store).toBeTruthy();
  });

  it('Store a PGT in the store', async () => {
    const store = new RedisStore(context.client);
    const result = store.set('A', 1);
    expect(await result).toBe('OK');
  });

  it('Retreive a PGT from the store', async () => {
    const store = new RedisStore(context.client);
    const pgt = 'PGT12345';
    const iou = 'PGTIOU12345';
    await store.set(iou, pgt);
    const result = store.get(iou);
    expect(await result).toBe(pgt);
  });

  it('Delete a PGT from the store', async () => {
    const store = new RedisStore(context.client);
    const pgt = 'PGT12345';
    const iou = 'PGTIOU12345';
    await store.set(iou, pgt);
    const result = store.del(iou);
    expect(await result).toBe(1);
  });
});
