import axios from 'axios';
import { API_URL } from '../utils/constants';
import { getToken, removeToken } from '../utils/storage';
import { router } from 'expo-router';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      await removeToken();
      router.replace('/(auth)/login');
    }
    return Promise.reject(error);
  }
);

export default api;
