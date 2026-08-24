const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const hospitalService = require('../services/hospital.service.js');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await hospitalService.getProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, profile, 'Profile retrieved'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await hospitalService.updateProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, profile, 'Profile updated'));
});

const getRequests = asyncHandler(async (req, res) => {
  const requests = await hospitalService.getRequests(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, requests, 'Requests retrieved'));
});

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await hospitalService.getDashboard(req.user.id);
  res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard retrieved'));
});

module.exports = {
  getProfile,
  updateProfile,
  getRequests,
  getDashboard
};
