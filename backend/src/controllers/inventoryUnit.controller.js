const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const inventoryService = require('../services/inventory.service.js');

const addUnit = asyncHandler(async (req, res) => {
  const unit = await inventoryService.addUnit(req.user.id, req.body);
  res.status(201).json(new ApiResponse(201, unit, 'Unit added'));
});

const getUnits = asyncHandler(async (req, res) => {
  const units = await inventoryService.getUnits(req.user.id, req.query);
  res.status(200).json(new ApiResponse(200, units, 'Units retrieved'));
});

const getUnit = asyncHandler(async (req, res) => {
  const unit = await inventoryService.getUnitById(req.params.id);
  res.status(200).json(new ApiResponse(200, unit, 'Unit retrieved'));
});

const updateUnit = asyncHandler(async (req, res) => {
  const unit = await inventoryService.updateUnit(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, unit, 'Unit updated'));
});

const deleteUnit = asyncHandler(async (req, res) => {
  await inventoryService.deleteUnit(req.params.id);
  res.status(200).json(new ApiResponse(200, null, 'Unit deleted'));
});

const searchCompatible = asyncHandler(async (req, res) => {
  const units = await inventoryService.searchCompatible(req.body);
  res.status(200).json(new ApiResponse(200, units, 'Compatible units found'));
});

const reserveUnits = asyncHandler(async (req, res) => {
  const reservation = await inventoryService.reserveUnits(req.body);
  res.status(200).json(new ApiResponse(200, reservation, 'Units reserved'));
});

const releaseReservation = asyncHandler(async (req, res) => {
  await inventoryService.releaseReservation(req.params.reservationId);
  res.status(200).json(new ApiResponse(200, null, 'Reservation released'));
});

const getStats = asyncHandler(async (req, res) => {
  const stats = await inventoryService.getStats(req.user.id);
  res.status(200).json(new ApiResponse(200, stats, 'Stats retrieved'));
});

const getExpiringUnits = asyncHandler(async (req, res) => {
  const units = await inventoryService.getExpiringUnits(req.user.id);
  res.status(200).json(new ApiResponse(200, units, 'Expiring units retrieved'));
});

module.exports = {
  addUnit,
  getUnits,
  getUnit,
  updateUnit,
  deleteUnit,
  searchCompatible,
  reserveUnits,
  releaseReservation,
  getStats,
  getExpiringUnits
};
