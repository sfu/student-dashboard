import React from 'react'
import { App } from 'components/App'
import ViewerQueries from 'queries/ViewerQueries'

const Transit = () => <h1>Transit</h1>
const Settings = () => <h1>Settings</h1>

function errorLoading(err) {
 console.error('Dynamic page loading failed', err) // eslint-disable-line
}

function loadRoute(cb) {
 return (module) => cb(null, module.default)
}


export default {
  path: '/',
  component: App,
  indexRoute: {
    getComponent(location, cb) {
      System.import('pages/Dashboard').then(loadRoute(cb)).catch(errorLoading)
    },
    title: 'Dashboard',
    queries: ViewerQueries
  },
  childRoutes: [
    {
      path: 'courses',
      title: 'Courses',
      getComponent(location, cb) {
        System.import('pages/Courses').then(loadRoute(cb)).catch(errorLoading)
      },
      queries: ViewerQueries
    },
    {
      path: 'transit',
      title: 'Transit',
      component: Transit,
      queries: ViewerQueries
    },
    {
      path: 'library',
      title: 'Library',
      getComponent(location, cb) {
        System.import('pages/Library').then(loadRoute(cb)).catch(errorLoading)
      },
      queries: ViewerQueries
    },
    {
      path: 'room_finder',
      title: 'Room Finder',
      getComponent(location, cb) {
        System.import('pages/RoomFinder').then(loadRoute(cb)).catch(errorLoading)
      },
      queries: ViewerQueries
    },
    {
      path: 'settings',
      title: 'Settings',
      component: Settings,
      queries: ViewerQueries
    },

  ]
}
