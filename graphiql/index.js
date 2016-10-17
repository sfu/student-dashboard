import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import CustomGraphiQL from './graphiql'

//figure out who we are, and then render
const jwt = document.cookie.split(';').filter(
  c => c.indexOf('graphiqljwt') === 0
).join('').split('graphiqljwt=')[1]

ReactDOM.render(<CustomGraphiQL jwt={jwt} />, document.getElementById('graphiql'))
