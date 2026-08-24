const Joi = require('joi');
const { objectIdSchema } = require('./common.validator.js');

const createDonationSchema = Joi.object({
  donorId: objectIdSchema.required(),
  bloodBankId: objectIdSchema.required(),
  bloodRequestId: objectIdSchema.optional(),
  bloodGroup: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
  component: Joi.string().valid('WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS').required(),
  scheduledDate: Joi.date().iso().required()
});

const transitionSchema = Joi.object({
  status: Joi.string().valid('SCHEDULED', 'SCREENING', 'COLLECTING', 'TESTING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'CANCELLED').required(),
  note: Joi.string().optional()
});

const completeSchema = Joi.object({
  volume: Joi.number().required(),
  unitData: Joi.array().items(
    Joi.object({
      unitNumber: Joi.string().required(),
      component: Joi.string().valid('WHOLE_BLOOD', 'RBC', 'PLASMA', 'PLATELETS').required(),
      volume: Joi.number().required()
    })
  ).required()
});

module.exports = {
  createDonationSchema,
  transitionSchema,
  completeSchema
};
