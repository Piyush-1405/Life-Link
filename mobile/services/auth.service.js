import api from './api';
import { setToken, setUser, clearAll } from '../utils/storage';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;
  await setToken(token);
  await setUser(user);
  return { token, user };
};

export const register = async (data) => {
  const response = await api.post('/auth/register', data);
  const { token, user } = response.data;
  await setToken(token);
  await setUser(user);
  return { token, user };
};

export const logout = async () => {
  await clearAll();
};

export const refreshToken = async () => {
  const response = await api.post('/auth/refresh');
  const { token, user } = response.data;
  if(token) await setToken(token);
  if(user) await setUser(user);
  return { token, user };
};
