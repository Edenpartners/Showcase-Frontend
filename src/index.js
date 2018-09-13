import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'antd/dist/antd.css';
import thunk from 'redux-thunk';

import rootReducer from './reducers';

import App from './App';

const store = createStore(rootReducer, applyMiddleware(thunk));
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);
