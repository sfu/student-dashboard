import React from 'react'
import {render} from 'react-dom'
import App from './components/App'

render(
  <App currentUser={window.ENV.CURRENT_USER} />, document.getElementById('app')
)
