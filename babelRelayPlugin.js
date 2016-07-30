const babelRelayPlugin   = require('babel-relay-plugin')
const introspectionQuery = require('graphql/utilities').introspectionQuery
const request            = require('sync-request')

const graphqlUrl = 'https://my.sfu.ca/graphql-test/graphql'
const response = request('POST', graphqlUrl, {
  body: JSON.stringify({
    query: introspectionQuery
  })
})

const schema = JSON.parse(response.body.toString('utf-8'))

module.exports = babelRelayPlugin(schema.data, {
  abortOnError: true,
})
