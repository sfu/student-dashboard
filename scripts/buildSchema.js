/* eslint no-console: 0 */

const axios = require('axios');
const introspectionQuery = require('graphql/utilities').introspectionQuery;
const assert = require('assert');
const fs = require('fs');
const path = require('path');

assert(
  process.env.GRAPHQL_SERVER,
  `No GRAPHQL_SERVER is defined in your environment. Check your .env.${
    process.env.NODE_ENV || 'production'
  } file.`
);
const { GRAPHQL_SERVER } = process.env;

const query = JSON.stringify({
  query: introspectionQuery,
});

axios
  .post(GRAPHQL_SERVER, query)
  .then((response) => {
    let schema;

    try {
      schema = JSON.stringify(response.data, null, 2);
    } catch (e) {
      console.log('Response from GraphQL server is not valid JSON...');
      console.log(response.data);
    }

    fs.writeFileSync(
      `${path.resolve(__dirname, '../data/schema.json')}`,
      schema,
      'utf-8'
    );
  })
  .catch((error) => {
    console.log('Error fetching GraphQL schema:');
    console.log(error);
  });
