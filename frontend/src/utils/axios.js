import axios from 'axios';

const config = {
  baseURL: process.env.REACT_APP_BASE_URL || '/',
  timeout: 30000
};

const axiosClient = axios.create(config);

axiosClient.interceptors.request.use(
  (req) => req,
  (err) => Promise.reject(err)
);

axiosClient.interceptors.response.use(
  (res) => res.data,
  (err) => Promise.reject(err.response.data)
);

export default axiosClient;
