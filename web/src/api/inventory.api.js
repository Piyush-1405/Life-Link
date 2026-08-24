import axiosInstance from './axiosInstance';

export const getUnits = (params) => axiosInstance.get('/inventory', { params });
export const getUnit = (id) => axiosInstance.get(`/inventory/${id}`);
export const addUnit = (data) => axiosInstance.post('/inventory', data);
export const updateUnit = (id, data) => axiosInstance.put(`/inventory/${id}`, data);
export const deleteUnit = (id) => axiosInstance.delete(`/inventory/${id}`);
export const searchCompatible = (data) => axiosInstance.post('/inventory/search', data);
export const reserveUnits = (data) => axiosInstance.post('/inventory/reserve', data);
export const releaseReservation = (id) => axiosInstance.post(`/inventory/reserve/${id}/release`);
export const getStats = () => axiosInstance.get('/inventory/stats');
export const getExpiringUnits = () => axiosInstance.get('/inventory/expiring');
