import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import LiveView from './LiveView';
import MomentUtils from '@date-io/moment';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
      <MuiPickersUtilsProvider utils={MomentUtils}>
          <LiveView />
      </MuiPickersUtilsProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
