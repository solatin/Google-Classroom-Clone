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

export const loginRequest = (form) => async (dispatch) => {
  dispatch({ type: AuthTypes.LOGIN_REQUEST });
  const rs = await axios.post('/auth/login', form);
  localStorage.setItem('access-token', rs.jwtAccessToken);
  localStorage.setItem('refresh-token', rs.jwtRefreshToken);
  dispatch(loginSuccess(rs));
};

export const logoutRequest = () => ({ type: AuthTypes.LOGOUT_REQUEST });
