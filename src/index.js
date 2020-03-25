import React from 'react';
import ReactDOM from 'react-dom';
import {StoreProvider} from 'easy-peasy';

import Store from "state/Store";
import Appwrapper from 'components/';

import config from "./config";
window.$config = config;

ReactDOM.render(
  <StoreProvider store={Store}>
    <Appwrapper />
  </StoreProvider>
  ,
  document.getElementById('root')
);
