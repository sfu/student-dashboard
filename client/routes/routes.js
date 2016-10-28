import React from 'react'
import {Route, IndexRoute} from 'react-router'

import { App } from 'components/App'
import { Dashboard } from 'components/Dashboard'
import { Courses } from 'components/Courses'
import { Library } from 'components/Library'
import { LibraryBarcode } from 'components/LibraryBarcode'
import RoomFinder from 'components/RoomFinder'
import ViewerQueries from 'queries/ViewerQueries'


export default (
  <Route path="/" component={App}>
    <IndexRoute title="Dashboard" component={Dashboard} queries={ViewerQueries} />
    <Route title="Courses" path="courses" component={Courses} queries={ViewerQueries} />
    <Route title="Transit" path="transit" component={() => <h1>Transit</h1>} />
    <Route title="Library" path="library" component={Library} queries={ViewerQueries}/>
    <Route title="Library Barcode" path="library/barcode" fullScreen={true} component={LibraryBarcode} />
    <Route title="Room Finder" path="room_finder" component={RoomFinder} />
    <Route title="Settings" path="settings" component={() => <h1>Settings</h1>} />
  </Route>
)
