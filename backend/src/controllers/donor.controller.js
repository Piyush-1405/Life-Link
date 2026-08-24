const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const donorService = require('../services/donor.service.js');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await donorService.getProfile(req.user.id);
  res.status(200).json(new ApiResponse(200, profile, 'Profile retrieved'));
});

const updateProfile = asyncHandler(async (req, res) => {
  const profile = await donorService.updateProfile(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, profile, 'Profile updated'));
});

const toggleAvailability = asyncHandler(async (req, res) => {
  const profile = await donorService.toggleAvailability(req.user.id);
  res.status(200).json(new ApiResponse(200, profile, 'Availability toggled'));
});

const getEligibleRequests = asyncHandler(async (req, res) => {
  const requests = await donorService.getEligibleRequests(req.user.id);
  res.status(200).json(new ApiResponse(200, requests, 'Eligible requests retrieved'));
});

const respondToRequest = asyncHandler(async (req, res) => {
  const result = await donorService.respondToRequest(req.user.id, req.params.requestId, req.body.response);
  res.status(200).json(new ApiResponse(200, result, 'Response recorded'));
});

const getDonationHistory = asyncHandler(async (req, res) => {
  const history = await donorService.getDonationHistory(req.user.id);
  res.status(200).json(new ApiResponse(200, history, 'History retrieved'));
});

module.exports = {
  getProfile,
  updateProfile,
  toggleAvailability,
  getEligibleRequests,
  respondToRequest,
  getDonationHistory
};
