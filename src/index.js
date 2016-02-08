import React from 'react'
import ReactDOM from 'react-dom'
import { applyMiddleware, compose, createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistory, routeReducer } from 'react-router-redux'


// a logger that's good enough for day one
const genericlogger = store => next => action => {
  console.log('[Dispatching]', action);
  let result = next(action);
  console.log('[Store]', store.getState());
  return result;
};


const defaultOpts = {
  debug: false,
  renderToElementId: 'react-root',
  disableLoggingMiddleware: false,
  disableDevTools: false,
  disableLogger: false,
  reducers: {},
  middleware: [],
}


export function registerRedux(userOpts) {
  const defaultMiddlware = [];
  const defaultEnhancers = [];
  const opts = {...defaultOpts, ...userOpts};

  if (opts.debug) {
    var {DevTools} = require('./devtools');
    defaultEnhancers.push(DevTools.instrument());
  }

  const reduxRouterMiddleware = syncHistory(browserHistory)
  defaultMiddlware.push(reduxRouterMiddleware);

  if (!opts.debug || !opts.disableLogger) {
    defaultMiddlware.push(genericlogger);
  }

  const middleware = applyMiddleware(
    ...defaultMiddlware,
    ...opts.middleware
  );


  const reducer = combineReducers({
    routing: routeReducer,
    ...opts.reducers
  })

  const store = compose(
    middleware,
    ...defaultEnhancers
  )(createStore)(reducer);

  // Required for replaying actions from devtools to work
  reduxRouterMiddleware.listenForReplays(store);

  if (!opts.routes) {
    throw new Error("Missing `router` key with a component as it's value");
  }

  const Root = () => (
    <Provider store={store}>
      <div>
        <opts.routes history={browserHistory} />
        {DevTools &&
          <DevTools />
        }
      </div>
    </Provider>
  )

  if (opts.renderToElementId) {
    ReactDOM.render(<Root />, document.getElementById(opts.renderToElementId));
  }

  return {store, dispatch: store.dispatch, Root};
}
