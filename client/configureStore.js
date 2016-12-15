/*eslint import/namespace: [2, { allowComputed: true }]*/

import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers'

const reducerObj = {}

Object.keys(reducers).forEach(r => reducerObj[r] = reducers[r])

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export default () => {
  return createStore(
    combineReducers(reducerObj),
    composeEnhancers(
      applyMiddleware(thunkMiddleware),
    )
  )
}
