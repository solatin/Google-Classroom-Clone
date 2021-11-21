import { combineReducers } from 'redux';

import modal from './modal';
import currentUser from './currentUser';
import classList from './classList';

const rootReducer = combineReducers({
  currentUser,
  modal,
  classList
});

export default rootReducer;
