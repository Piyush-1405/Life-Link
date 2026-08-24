const Joi = require('joi');

const addUnitSchema = Joi.object({
  unitNumber: Joi.string().required(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
  component: Joi.string().valid('WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS').required(),
  volume: Joi.number().optional(),
  collectionDate: Joi.date().iso().required(),
  expiryDate: Joi.date().iso().required(),
  testResults: Joi.object().optional()
});

const updateUnitSchema = Joi.object({
  status: Joi.string().valid('AVAILABLE', 'RESERVED', 'USED', 'EXPIRED', 'QUARANTINE', 'DISCARDED').optional(),
  testResults: Joi.object().optional(),
  volume: Joi.number().optional()
});

const searchSchema = Joi.object({
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
  component: Joi.string().valid('WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS').required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  radiusKm: Joi.number().required(),
  quantity: Joi.number().integer().min(1).required()
});

module.exports = {
  addUnitSchema,
  updateUnitSchema,
  searchSchema
};
