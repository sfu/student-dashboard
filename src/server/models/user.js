import bookshelf from './db'
import {sync as uid} from 'uid-safe'

export default bookshelf.extend({
  tableName: 'users',
  hasTimestamps: true,
  defaults: {
    uuid: uid(24)
  }
}, {
  findByUsername(username) {
    return this.forge().query({where: { username: username }}).fetch()
  }
})
