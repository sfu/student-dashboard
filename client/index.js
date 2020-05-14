import 'babel-polyfill';
import './routerHotLoadPatch';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { Provider } from 'react-redux';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import ReactGA from 'react-ga';
import useRelay from 'react-router-relay';
import routes from './routes/routes';

// import {AppContainer} from 'react-hot-loader'
// import Renderer from './routes/router'

import { toggleHeaderNav } from 'actions/header';
import configureStore from './configureStore';

const { NODE_ENV, GOOGLE_ANALYTICS_CODE } = process.env;

const store = configureStore();

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', {
    credentials: 'same-origin',
  })
);

if (NODE_ENV !== 'production') {
  const RelayNetworkDebug = require('react-relay/lib/RelayNetworkDebug');
  RelayNetworkDebug.init();
}

browserHistory.listen(() => {
  if (store.getState().header.showNav) {
    store.dispatch(toggleHeaderNav());
  }
});

if (GOOGLE_ANALYTICS_CODE) {
  ReactGA.initialize(GOOGLE_ANALYTICS_CODE, {
    debug: NODE_ENV !== 'production',
  });
}

const logPageView = () => {
  if (GOOGLE_ANALYTICS_CODE) {
    ReactGA.set({ page: window.location.pathname });
    ReactGA.pageview(window.location.pathname);
  }
};

const RootElement = document.getElementById('sorry');
ReactDOM.render(
  <Provider store={store}>
    <Router
      history={browserHistory}
      render={applyRouterMiddleware(useRelay)}
      environment={Relay.Store}
      routes={routes(store)}
      onUpdate={logPageView}
    />
  </Provider>,
  RootElement
);

//
// const render = () => {
//   ReactDOM.render(<AppContainer>{Renderer}</AppContainer>, RootElement)
// }
//
// render()
//
// if (module.hot) {
//   module.hot.accept('./routes/router', () => {
//     const NextRootContainer = require('./routes/router').default
//     render(
//       <AppContainer>
//          {NextRootContainer}
//       </AppContainer>,
//       RootElement
//     )
//   })
// }
