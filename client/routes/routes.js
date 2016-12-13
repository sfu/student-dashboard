import React from 'react'
import App from 'components/App'
import Loading from 'components/Loading'
import RelayFetchError from 'components/RelayFetchError'
import ViewerQueries from 'queries/ViewerQueries'
import L from 'leaflet'
import {
  updateMapZoom,
  updateMapCenter,
  setSelectedStop,
  fetchSchedulesForBusStop,
  toggleLocateOnMount,
  fetchStop,
  fetchStops,
  fetchSchedulesForBookmarks
} from 'actions/transit'

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

export default (reduxStore) => { // eslint-disable-line
  return {
    path: '/',
    component: App,
    indexRoute: {
      getComponent(location, cb) {
        System.import('pages/Dashboard').then(loadRoute(cb)).catch(errorLoading)
      },
      title: 'Dashboard',
      queries: ViewerQueries,
      render,
      onEnter({params}, replace, done) {
        const { dispatch } = reduxStore
        const { transit } = reduxStore.getState()
        const { transitBookmarks } = transit
        // if no bookmarks, then don't bother calling fetch on them
        if (!transitBookmarks.length) {
          done()
        } else {
          dispatch(fetchSchedulesForBookmarks())
          done()
        }
      }
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
        path: 'transit(/:stopNumber)',
        title: 'Transit',
        getComponent(location, cb) {
          System.import('pages/Transit').then(loadRoute(cb)).catch(errorLoading)
        },
        onEnter: ({ params }, replace, done) => {
          const { stopNumber } = params
          const { dispatch } = reduxStore
          const { transit } = reduxStore.getState()

          if (!stopNumber) { return done() }

          // set locateOnMount to false
          dispatch(toggleLocateOnMount(false))

          // if stop has already been fetched
          // set it, update map, fetch map schedules
          const stopObj = transit.stops.find(s => s.StopNo == stopNumber)
          if (stopObj) {
            dispatch(setSelectedStop(stopObj))
            dispatch(updateMapZoom(18))
            dispatch(updateMapCenter(new L.latLng(
              stopObj.Latitude,
              stopObj.Longitude
            )))
            dispatch(fetchSchedulesForBusStop(stopNumber))
            done()
          }
          // stop has not already been fetched
          // get it, set it, update map, fetch schedules
          else {
            dispatch(fetchStop(stopNumber)).then(() => {
              const { transit } = reduxStore.getState()
              const stopObj = transit.stops.find(s => s.StopNo == stopNumber)
              // invalid stop number
              if (!stopObj) {
                if (!transit.selectedStop) {
                  dispatch(toggleLocateOnMount(true))
                  replace('/transit')
                  done()
                }

              // valid stop
              } else {
                dispatch(setSelectedStop(stopObj))
                dispatch(updateMapZoom(18))
                dispatch(updateMapCenter(new L.latLng(
                  stopObj.Latitude,
                  stopObj.Longitude
                )))
                dispatch(fetchSchedulesForBusStop(stopNumber))
                dispatch(fetchStops({
                  latitude: stopObj.Latitude,
                  longitude: stopObj.Longitude
                }, 600))
                done()
              }
            })
          }
        }
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
}
