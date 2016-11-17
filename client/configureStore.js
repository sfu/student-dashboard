/*eslint import/namespace: [2, { allowComputed: true }]*/

import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import * as reducers from './reducers'

const reducerObj = {}

Object.keys(reducers).forEach(r => reducerObj[r] = reducers[r])

export default () => {
  return createStore(
    combineReducers(reducerObj),
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__(),
    applyMiddleware(thunkMiddleware)
  )
}
