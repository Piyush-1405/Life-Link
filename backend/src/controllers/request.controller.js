const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const requestService = require('../services/request.service.js');

const createRequest = asyncHandler(async (req, res) => {
  const request = await requestService.createRequest(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, request, 'Request created'));
});

const getRequest = asyncHandler(async (req, res) => {
  const request = await requestService.getRequestById(req.params.id);
  res.status(200).json(new ApiResponse(200, request, 'Request retrieved'));
});

const getRequests = asyncHandler(async (req, res) => {
  const requests = await requestService.getRequests(req.query);
  res.status(200).json(new ApiResponse(200, requests, 'Requests retrieved'));
});

const cancelRequest = asyncHandler(async (req, res) => {
  const request = await requestService.cancelRequest(req.params.id, req.user.id);
  res.status(200).json(new ApiResponse(200, request, 'Request cancelled'));
});

const assignHospital = asyncHandler(async (req, res) => {
  const request = await requestService.assignHospital(req.params.id, req.body.hospitalId);
  res.status(200).json(new ApiResponse(200, request, 'Hospital assigned'));
});

const transitionStatus = asyncHandler(async (req, res) => {
  const request = await requestService.transitionStatus(req.params.id, req.body, req.user.id);
  res.status(200).json(new ApiResponse(200, request, 'Status transitioned'));
});

const getTimeline = asyncHandler(async (req, res) => {
  const timeline = await requestService.getTimeline(req.params.id);
  res.status(200).json(new ApiResponse(200, timeline, 'Timeline retrieved'));
});

module.exports = {
  createRequest,
  getRequest,
  getRequests,
  cancelRequest,
  assignHospital,
  transitionStatus,
  getTimeline
};
