import { createReducer } from 'reduxsauce';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ClassListTypes } from 'src/actions/classList';

const INITIAL_STATE = {
  list: [],
  error: null,
  loading: false
};

const resetRequest = () => INITIAL_STATE;

const fetchRequest = (state = INITIAL_STATE) => ({
  ...state,
  error: null,
  loading: true
});

const fetchSuccess = (state = INITIAL_STATE, action) => ({
  ...state,
  error: null,
  list: action.list,
  loading: false
});

const fetchFailure = (state = INITIAL_STATE, action) => ({
  ...state,
  loading: false,
  error: action.error
});

export const HANDLERS = {
  [ClassListTypes.LIST_CLASS_FETCH_REQUEST]: fetchRequest,
  [ClassListTypes.LIST_CLASS_FETCH_SUCCESS]: fetchSuccess,
  [ClassListTypes.LIST_CLASS_FETCH_FAILURE]: fetchFailure,
  [ClassListTypes.LIST_CLASS_RESET_REQUEST]: resetRequest
};

export const classList = createReducer(INITIAL_STATE, HANDLERS);

const persistConfig = {
  keyPrefix: 'sdq-',
  key: 'classList',
  storage
};

export default persistReducer(persistConfig, classList);
