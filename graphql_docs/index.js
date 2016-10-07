import React from 'react'
import ReactDOM from 'react-dom'
import { GraphQLDocs } from 'graphql-docs'
import axios from 'axios'

function fetcher(query) {
    return axios({
      url: process.env.GRAPHQL_SERVER,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: JSON.stringify({ query })
    }).then(function(response) {
      return response.data
    })
}

ReactDOM.render(
    <GraphQLDocs fetcher={fetcher} />,
    document.getElementById('app')
)
