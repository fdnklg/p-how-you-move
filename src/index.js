import React from 'react';
import ReactDOM from 'react-dom';
import {StoreProvider} from 'easy-peasy';

import Store from "state/Store";
import Appwrapper from 'components/';

ReactDOM.render(
  <StoreProvider store={Store}>
    <Appwrapper />
  </StoreProvider>
  ,
  document.getElementById('root')
);
