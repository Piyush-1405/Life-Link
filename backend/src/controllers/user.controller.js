const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const userService = require('../services/user.service.js');

const getMe = asyncHandler(async (req, res) => {
  const user = await userService.getUserById(req.user.id);
  res.status(200).json(new ApiResponse(200, user, 'User retrieved'));
});

const updateMe = asyncHandler(async (req, res) => {
  const user = await userService.updateUser(req.user.id, req.body);
  res.status(200).json(new ApiResponse(200, user, 'User updated'));
});

const updateLocation = asyncHandler(async (req, res) => {
  const user = await userService.updateLocation(req.user.id, req.body.coordinates);
  res.status(200).json(new ApiResponse(200, user, 'Location updated'));
});

module.exports = {
  getMe,
  updateMe,
  updateLocation
};
