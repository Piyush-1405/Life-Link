import axiosInstance from './axiosInstance';

export const login = (email, password) => axiosInstance.post('/auth/login', { email, password });
export const register = (data) => axiosInstance.post('/auth/register', data);
export const refreshToken = () => axiosInstance.post('/auth/refresh-token');
export const logout = () => axiosInstance.post('/auth/logout');
export const changePassword = (oldPassword, newPassword) => axiosInstance.post('/auth/change-password', { oldPassword, newPassword });
