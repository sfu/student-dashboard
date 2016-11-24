import React from 'react'
import App from 'components/App'
import Loading from 'components/Loading'
import RelayFetchError from 'components/RelayFetchError'
import ViewerQueries from 'queries/ViewerQueries'

import styles from 'components/App/App.css'

function errorLoading(err) {
  console.error(err.stack) //eslint-disable-line
  throw new Error('Dynamic page loading failed', err) // eslint-disable-line
}

function loadRoute(cb) {
  return (module) => cb(null, module.default)
}

const render = ({done, error, props, retry, element}) => {  // eslint-disable-line
  if (!done && !error && !props) {
    // data is being fetched, show loading indicator
    return (<div className={styles.loadingWrapper}><Loading /></div>)
  } else if (!done && error) {
    // error returned from the server
    return (
      <div className={styles.fetchError}>
        <RelayFetchError error={error} retry={retry} />
      </div>
    )
  } else if (done && props) {
    return React.cloneElement(element, {...props})
  }
}

export default {
  path: '/',
  component: App,
  indexRoute: {
    getComponent(location, cb) {
      System.import('pages/Dashboard').then(loadRoute(cb)).catch(errorLoading)
    },
    title: 'Dashboard',
    queries: ViewerQueries,
    render
  },
  childRoutes: [
    {
      path: 'courses',
      title: 'Courses',
      getComponent(location, cb) {
        System.import('pages/Courses').then(loadRoute(cb)).catch(errorLoading)
      },
      queries: ViewerQueries,
      render
    },
    {
      path: 'transit',
      title: 'Transit',
      getComponent(location, cb) {
        System.import('pages/Transit').then(loadRoute(cb)).catch(errorLoading)
      },

    },
    {
      path: 'library',
      title: 'Library',
      getComponent(location, cb) {
        System.import('pages/Library').then(loadRoute(cb)).catch(errorLoading)
      },
      queries: ViewerQueries,
      render
    },
    {
      path: 'room_finder',
      title: 'Room Finder',
      getComponent(location, cb) {
        System.import('pages/RoomFinder').then(loadRoute(cb)).catch(errorLoading)
      }
    },
    {
      path: 'settings',
      title: 'Settings',
      getComponent(location, cb) {
        System.import('pages/Settings').then(loadRoute(cb)).catch(errorLoading)
      },

    },

  ]
}
