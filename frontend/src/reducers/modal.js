import { createReducer } from 'reduxsauce';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { ModalTypes } from 'src/actions';

const INITIAL_STATE = {
  current: 0,
  modal: 'login',
  showModal: false,
  newsletterModal: true
};

const onModalShow = (state = INITIAL_STATE, action) => ({
  ...state,
  showModal: true,
  modal: action.modal
});

const onModalClose = (state = INITIAL_STATE, action) => ({
  ...state,
  showModal: false,
  modal: action.modal
});

const onModalRefresh = (state = INITIAL_STATE, action) => ({
  ...state,
  current: action.current
});

export const HANDLERS = {
  [ModalTypes.MODAL_SHOW]: onModalShow,
  [ModalTypes.MODAL_CLOSE]: onModalClose,
  [ModalTypes.MODAL_REFRESH]: onModalRefresh
};

export const modal = createReducer(INITIAL_STATE, HANDLERS);

const persistConfig = {
  keyPrefix: 'sdq-',
  key: 'modal',
  storage
};

export default persistReducer(persistConfig, modal);
