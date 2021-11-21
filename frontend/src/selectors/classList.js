import { createSelector } from 'reselect';

const classListState = (state) => state.classList;

export const getLoading = createSelector(classListState, (classList) => classList.loading);

export const getError = createSelector(classListState, (classList) => classList.error);

export const getList = createSelector(classListState, (classList) => classList.list);
