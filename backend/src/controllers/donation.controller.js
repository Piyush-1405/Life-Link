const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const donationService = require('../services/donation.service.js');

const createDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.createDonation(req.body);
  res.status(201).json(new ApiResponse(201, donation, 'Donation created'));
});

const getDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.getDonationById(req.params.id);
  res.status(200).json(new ApiResponse(200, donation, 'Donation retrieved'));
});

const getDonations = asyncHandler(async (req, res) => {
  const donations = await donationService.getDonations(req.query);
  res.status(200).json(new ApiResponse(200, donations, 'Donations retrieved'));
});

const transitionStatus = asyncHandler(async (req, res) => {
  const donation = await donationService.transitionStatus(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, donation, 'Status transitioned'));
});

const completeDonation = asyncHandler(async (req, res) => {
  const donation = await donationService.completeDonation(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, donation, 'Donation completed'));
});

module.exports = {
  createDonation,
  getDonation,
  getDonations,
  transitionStatus,
  completeDonation
};
