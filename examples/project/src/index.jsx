import React from 'react';
import ReactDOM from 'react-dom';
import { IntlConnector } from './IntlConnector';
import { App } from './App';

ReactDOM.render(
  <IntlConnector>
    <App />
  </IntlConnector>,
  document.getElementById('container')
);
