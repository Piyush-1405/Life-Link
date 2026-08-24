import axiosInstance from './axiosInstance';

export const getProfile = () => axiosInstance.get('/blood-banks/profile');
export const updateProfile = (data) => axiosInstance.put('/blood-banks/profile', data);
export const getDashboard = () => axiosInstance.get('/blood-banks/dashboard');
export const updateConfig = (data) => axiosInstance.put('/blood-banks/config', data);
