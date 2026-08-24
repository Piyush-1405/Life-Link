const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const patientService = require('../services/patient.service.js');
const requestService = require('../services/request.service.js');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await patientService.getProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, profile, 'Profile retrieved'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await patientService.updateProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, profile, 'Profile updated'));
});

const getMyRequests = asyncHandler(async (req, res) => {
  const requests = await requestService.getRequestsByPatient(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, requests, 'Requests retrieved'));
});

module.exports = {
  getProfile,
  updateProfile,
  getMyRequests
};
