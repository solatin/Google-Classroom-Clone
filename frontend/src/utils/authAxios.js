import axios from 'axios';
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

let refreshTokenRequesting = null;

const destroyToken = () => {
	localStorage.removeItem('access-token');
	localStorage.removeItem('refresh-token');
};

const refreshToken = async () => {
	const res = await authAxios.post('/auth/refresh-token', {
		accessToken: localStorage.getItem('access-token'),
		refreshToken: localStorage.getItem('refresh-token')
	});
	localStorage.setItem('access-token', res.access_token);
	localStorage.setItem('refresh-token', res.refresh_token);
};

authAxios.interceptors.response.use(
	(res) => res.data,
	async (err) => {
		const { status, data, config } = err.response;
		const { message } = data;

		if (status === 401 && message === 'jwt expired') {
			if (!refreshTokenRequesting) {
				refreshTokenRequesting = refreshToken();
			}
			await refreshTokenRequesting;
			refreshTokenRequesting = null;
			config.headers.Authorization = `Bearer ${localStorage.getItem('access-token')}`;
			return authAxios.request(config);
		}

		if (status === 401 && message === 'error refresh') {
			refreshTokenRequesting = null;
			destroyToken();
			store.dispatch(logoutRequest());
		}

		return Promise.reject(err.response.data);
	}
);

export default authAxios;
