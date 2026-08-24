const Joi = require('joi');
const { locationUpdateSchema } = require('./common.validator.js');

const createRequestSchema = Joi.object({
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
  component: Joi.string().valid('WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS').required(),
  quantity: Joi.number().integer().min(1).required(),
  urgency: Joi.string().valid('NORMAL', 'HIGH', 'CRITICAL').optional(),
  searchRadiusKm: Joi.number().valid(5, 10, 20, 50).optional(),
  location: locationUpdateSchema.required(),
  notes: Joi.string().optional()
});

const transitionSchema = Joi.object({
  status: Joi.string().valid('PENDING', 'INVENTORY_SEARCH', 'BLOOD_RESERVED', 'DONOR_SEARCH', 'DONOR_ACCEPTED', 'DONATION_SCHEDULED', 'DONATION_COMPLETED', 'FULFILLED', 'CANCELLED', 'EXPIRED').required(),
  note: Joi.string().optional()
});

module.exports = {
  createRequestSchema,
  transitionSchema
};
