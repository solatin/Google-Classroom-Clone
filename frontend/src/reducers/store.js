import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';

import rootReducer from '.';

let appliedMiddleware = applyMiddleware(thunkMiddleware);

if (process.env.NODE_ENV === `development`) {
  const { createLogger } = require(`redux-logger`); // eslint-disable-line
  const loggerMiddleware = createLogger();

  appliedMiddleware = applyMiddleware(thunkMiddleware, loggerMiddleware);
  appliedMiddleware = applyMiddleware(thunkMiddleware);
}

// create store using preloaded state
const store = createStore(
  rootReducer,
  compose(
    appliedMiddleware,
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f
  )
);

export const persistor = persistStore(store);

export default store;
