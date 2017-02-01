import MemoryStore from '../memory'

describe('MemoryStore', () => {
  let context

  beforeEach(() => {
    context = {
      store: new MemoryStore()
    }
  })

  afterEach(() => {
    context = {}
  })

  it('Instantiate a new MemoryStore', () => {
    expect(context.store).toBeTruthy()
  })

  it('Store a PGT in the store', () => {
    const mapobj = context.store.set('PGTIOU12345', 'PGT12345')
    const test = mapobj.get('PGTIOU12345')
    expect(test.pgt).toBe('PGT12345')
  })

  it('Retreive a PGT from the store', () => {
    context.store.set('PGTIOU12345', 'PGT12345')
    const test = context.store.get('PGTIOU12345')
    expect(test).toBe('PGT12345')
  })

  it('Retreive all PGTs from the store', () => {
    context.store.set('A', 1)
    context.store.set('B', 2)
    context.store.set('C', 3)
    const test = context.store.all()
    expect(Array.from(test).length).toBe(3)
  })

  it('Delete a PGT from the store', () => {
    const mapobj = context.store.set('A', 1)
    context.store.del('A')
    expect(mapobj.size).toBe(0)
  })

  it('Clear all PGTs from the store', () => {
    const mapobj = context.store.set('A', 1)
    context.store.set('B', 2)
    context.store.set('C', 3)
    context.store.clear()
    expect(mapobj.size).toBe(0)
  })

})
