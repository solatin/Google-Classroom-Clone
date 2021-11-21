import axios from 'axios';
import _get from 'lodash/get';
import { logoutRequest } from 'src/actions/auth';
import store from 'src/reducers/store';

const config = {
  baseURL: process.env.REACT_APP_BASE_URL || '/',
  // timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
};

const authAxios = axios.create(config);

authAxios.interceptors.request.use(
  (req) => {
    req.headers.Authorization = `Bearer ${localStorage.getItem('access-token')}`;
    return req;
  },
  (err) => Promise.reject(err)
);

authAxios.interceptors.response.use(
  (res) => res.data,
  (err) => {
    if (_get(err, 'response.status') === 401) {
      store.dispatch(logoutRequest());
    }

    return Promise.reject(err.response?.data);
  }
);

export default authAxios;
