import bookshelf from './db'

export default bookshelf.extend({
  tableName: 'users',
  hasTimestamps: true
}, {
  findByUsername(username) {
    return this.forge().query({where: { username: username }}).fetch()
  }
})
