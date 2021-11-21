import { createReducer } from 'reduxsauce';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { AuthTypes } from 'src/actions';

const INITIAL_STATE = {
  node: { name: 'sol' },
  error: null,
  loading: false
};

const logoutRequest = () => INITIAL_STATE;

const loginRequest = (state = INITIAL_STATE) => ({
  ...state,
  node: null,
  error: null,
  loading: true
});

const loginSuccess = (state = INITIAL_STATE, action) => ({
  ...state,
  error: null,
  node: action.user,
  loading: false
});

const loginFailure = (state = INITIAL_STATE, action) => ({
  ...state,
  loading: false,
  error: action.error
});

export const HANDLERS = {
  [AuthTypes.LOGIN_REQUEST]: loginRequest,
  [AuthTypes.LOGIN_SUCCESS]: loginSuccess,
  [AuthTypes.LOGIN_FAILURE]: loginFailure,
  [AuthTypes.LOGOUT_REQUEST]: logoutRequest
};

export const modal = createReducer(INITIAL_STATE, HANDLERS);

const persistConfig = {
  keyPrefix: 'sdq-',
  key: 'user',
  storage
};

export default persistReducer(persistConfig, modal);
