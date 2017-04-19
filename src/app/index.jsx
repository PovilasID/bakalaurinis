import React from 'react';
import ReactDOM from 'react-dom';
//import injectTapEventPlugin from 'react-tap-event-plugin';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { Router, browserHistory } from 'react-router';
import ReduxPromise from 'redux-promise';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme'

var injectTapEventPlugin = require("react-tap-event-plugin");


import reducers from './reducers';
import routes from './routes';

import 'bootstrap-social';

// for bundling your styles
import './bundle.scss';

injectTapEventPlugin();
const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);


ReactDOM.render(
    <Provider store={createStoreWithMiddleware(reducers)}>
      <MuiThemeProvider  muiTheme={getMuiTheme()}>
        <Router history={browserHistory} routes={routes} />
      </MuiThemeProvider>
    </Provider>
  , document.querySelector('.react-root'));
