import React from 'react'
import {Route, IndexRoute} from 'react-router'

import {App} from 'components/App'
import {Dashboard} from 'components/Dashboard'
import ViewerQueries from 'queries/ViewerQueries'

export default (
  <Route path="/" component={App}>
    <IndexRoute title="Dashboard" component={Dashboard} queries={ViewerQueries} />
    <Route title="Courses" path="courses" component={() => <h1>Courses</h1>} />
    <Route title="Transit" path="transit" component={() => <h1>Transit</h1>} />
    <Route title="Library" path="library" component={() => <h1>Library</h1>} />
    <Route title="Room Finder" path="room_finder" component={() => <h1>Room Finder</h1>} />
  </Route>
)
