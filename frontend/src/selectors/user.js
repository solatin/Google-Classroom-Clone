import { createSelector } from 'reselect';

const userState = (state) => state.currentUser;

export const getAuthLoading = createSelector(userState, (user) => user.loading);

export const getAuthError = createSelector(userState, (user) => user.error);

export const getAuthUser = createSelector(userState, (user) => user.node);
