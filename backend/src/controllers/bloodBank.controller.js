const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const bloodBankService = require('../services/bloodBank.service.js');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await bloodBankService.getProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, profile, 'Profile retrieved'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await bloodBankService.updateProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, profile, 'Profile updated'));
});

const getDashboard = asyncHandler(async (req, res) => {
  const dashboard = await bloodBankService.getDashboard(req.user.id);
  res.status(200).json(new ApiResponse(200, dashboard, 'Dashboard retrieved'));
});

const updateConfig = asyncHandler(async (req, res) => {
  const config = await bloodBankService.updateConfig(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, config, 'Config updated'));
});

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  updateConfig
};
