import axiosInstance from './axiosInstance';

export const getUsers = (params) => axiosInstance.get('/admin/users', { params });
export const toggleUserStatus = (id, isActive) => axiosInstance.post(`/admin/users/${id}/status`, { isActive });
export const verifyEntity = (id) => axiosInstance.post(`/admin/verify/${id}`);
export const getDashboard = () => axiosInstance.get('/admin/dashboard');
export const getAnalytics = () => axiosInstance.get('/admin/analytics');
export const getAuditLogs = (params) => axiosInstance.get('/admin/audit-logs', { params });
export const createHospital = (data) => axiosInstance.post('/admin/hospitals', data);
export const createBloodBank = (data) => axiosInstance.post('/admin/blood-banks', data);
