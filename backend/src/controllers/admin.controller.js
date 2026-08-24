const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const adminService = require('../services/admin.service.js');

const getUsers = asyncHandler(async (req, res) => {
  const users = await adminService.getUsers(req.query);
  res.status(200).json(new ApiResponse(200, users, 'Users retrieved'));
});

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await adminService.toggleUserStatus(req.params.id);
  res.status(200).json(new ApiResponse(200, user, 'User status toggled'));
});

const verifyEntity = asyncHandler(async (req, res) => {
  const entity = await adminService.verifyEntity(req.params.id);
  res.status(200).json(new ApiResponse(200, entity, 'Entity verified'));
});

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await adminService.getDashboard();
  res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard retrieved'));
});

const getAnalytics = asyncHandler(async (req, res) => {
  const analytics = await adminService.getAnalytics(req.query);
  res.status(200).json(new ApiResponse(200, analytics, 'Analytics retrieved'));
});

const getAuditLogs = asyncHandler(async (req, res) => {
  const logs = await adminService.getAuditLogs(req.query);
  res.status(200).json(new ApiResponse(200, logs, 'Audit logs retrieved'));
});

const createHospital = asyncHandler(async (req, res) => {
  const hospital = await adminService.createHospital(req.body);
  res.status(201).json(new ApiResponse(201, hospital, 'Hospital created'));
});

const createBloodBank = asyncHandler(async (req, res) => {
  const bloodBank = await adminService.createBloodBank(req.body);
  res.status(201).json(new ApiResponse(201, bloodBank, 'Blood bank created'));
});

module.exports = {
  getUsers,
  toggleUserStatus,
  verifyEntity,
  getDashboard,
  getAnalytics,
  getAuditLogs,
  createHospital,
  createBloodBank
};
