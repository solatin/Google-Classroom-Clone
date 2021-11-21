import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-app-polyfill/ie11';

import store, { persistor } from './reducers/store';

import App from './App';

const LoadingOverlay = () => <div>Loading</div>;

const Root = () => {

  console.log('Root');

  return (
    <StrictMode>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<LoadingOverlay />}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
        </PersistGate>
      </Provider>
    </StrictMode>
  );
};

ReactDOM.render(<Root />, document.getElementById('root'));
