const babelRelayPlugin   = require('babel-relay-plugin')
const introspectionQuery = require('graphql/utilities').introspectionQuery
const request            = require('sync-request')
// const fs = require('fs')

// const graphqlUrl = 'https://my.sfu.ca/graphql-test/graphql'
const graphqlUrl = 'http://localhost:4567/graphql'
const response = request('POST', graphqlUrl, {
  body: JSON.stringify({
    query: introspectionQuery
  })
})

const schema = JSON.parse(response.body.toString('utf-8'))
// fs.writeFileSync('./schema.json', JSON.stringify(schema, null, 2), 'utf-8')

module.exports = babelRelayPlugin(schema.data, {
  abortOnError: false,
})
