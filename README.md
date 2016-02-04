# simple-redux-react

Getting the average app running with React, Redux, react-redux, redux-devtools, and react-router-redux, is getting way too complicated. I'm glad that it's so flexible and customizable but all of my projects follow a similar pattern when getting things going.

This project doesn't solve all edge cases... for those you can wire it up yourself or submit a PR if you think this is missing a commong config.


## Installation
`npm install simple-redux-react`


## Configuration

The most common cases are implied but can be overridden. Here is the ***minimal amount of code needed*** to get redux with a router:


While the above snippet gets a router working and redux up, you'll need at least one reducer to do any real work.

```javascript
import {registerRedux} from './simple-react-redux'

export const {dispatch} = registerRedux({
  routes: require('./routes'),
  renderToElementId: 'react-root',
  reducers: {
    app:   require('./reducers/app'),
    posts: require('./reducers/posts'),
  },
});
```


<br>

#### Customizing

You'll want to add reducers and middleware at some point so you can add those as needed.

```javascript
import {registerRedux} from 'simple-react-redux'

export const {dispatch} = registerRedux({
  // default options are overridable
  debug: false,                     // turns redux-devtools and logging on/off
  renderToElementId: 'react-root',
  disableLoggingMiddleware: false,
  disableDevTools: false,
  
  // pass in Routes component
  routes: require('./routes'),
  
  // router reducer is already included, add more as needed
  reducers: {
    app:   require('./reducers/app'),
    posts: require('./reducers/posts'),
  },

  // optioally add your own middleware
  middleware: [
    myCustomMiddleware(),
  ],
});
```


## Exports

Sometimes you'll need access to the `store` or the `Root` view. You can use these:
```javascript
const {store, dispatch, Root} = registerRedux(...);
```
