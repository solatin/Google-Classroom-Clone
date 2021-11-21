import { createActions } from 'reduxsauce';

export const { Types: ModalTypes, Creators: ModalCreators } = createActions(
  {
    modalShow: ['modal'],
    modalClose: ['modal'],
    modalRefresh: ['current']
  },
  {}
);
