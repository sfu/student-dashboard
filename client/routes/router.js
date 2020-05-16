import React from 'react';
import Relay from 'react-relay';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import useRelay from 'react-router-relay';
import routes from './routes';

const renderer = (
  <Router
    history={browserHistory}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
    routes={routes}
  />
);

export default renderer;
