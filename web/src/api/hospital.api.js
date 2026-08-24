import axiosInstance from './axiosInstance';

export const getProfile = () => axiosInstance.get('/hospitals/profile');
export const updateProfile = (data) => axiosInstance.put('/hospitals/profile', data);
export const getRequests = (params) => axiosInstance.get('/hospitals/requests', { params });
export const getDashboard = () => axiosInstance.get('/hospitals/dashboard');
