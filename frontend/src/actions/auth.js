import { createTypes } from 'reduxsauce';
import axios from 'src/utils/axios';

export const AuthTypes = createTypes(`
  LOGIN_REQUEST
  LOGIN_SUCCESS
  LOGIN_FAILURE

  LOGOUT_REQUEST
  LOGOUT_SUCCESS
  LOGOUT_FAILURE
`);

export const loginSuccess = (user) => ({ type: AuthTypes.LOGIN_SUCCESS, user });

export const loginFailure = (error) => ({
  type: AuthTypes.LOGIN_FAILURE,
  error
});

export const loginRequest = () => async (dispatch) => {
  dispatch({ type: AuthTypes.LOGIN_REQUEST });
  return axios.get('/mock-server/user.json').then(({ data }) => data);
};

export const logoutRequest = () => ({ type: AuthTypes.LOGOUT_REQUEST });
