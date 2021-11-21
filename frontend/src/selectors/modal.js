import { createSelector } from 'reselect';

const modalState = (state) => state.modal;

export const getStatus = createSelector(modalState, (modal) => modal.showModal);

export const getModal = createSelector(modalState, (modal) => modal.modal);

export const getData = createSelector(modalState, (modal) => modal.data);
