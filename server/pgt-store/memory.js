export default class MemoryStore {
  constructor() {
    this.store = new Map()
  }

  get(pgtiou) {
    return this.store.get(pgtiou)['pgt']
  }

  set(pgtiou, pgt) {
    return this.store.set(pgtiou, { pgt })
  }

  all() {
    return this.store.entries()
  }

  del(pgtiou) {
    this.store.delete(pgtiou)
  }

  clear() {
    this.store.clear()
  }
}
