const Joi = require('joi');
const { locationUpdateSchema } = require('./common.validator.js');

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/).message('Password must contain at least one uppercase letter, one lowercase letter, and one number').required(),
  role: Joi.string().valid('PATIENT', 'DONOR', 'HOSPITAL', 'BLOOD_BANK', 'ADMIN').required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().optional(),
  bloodGroup: Joi.alternatives().conditional('role', {
    is: Joi.string().valid('PATIENT', 'DONOR'),
    then: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-').required(),
    otherwise: Joi.optional()
  }),
  location: locationUpdateSchema.optional(),
  hospitalDetails: Joi.alternatives().conditional('role', {
    is: 'HOSPITAL',
    then: Joi.object({
      name: Joi.string().required(),
      licenseNumber: Joi.string().required()
    }).required(),
    otherwise: Joi.forbidden()
  }),
  bloodBankDetails: Joi.alternatives().conditional('role', {
    is: 'BLOOD_BANK',
    then: Joi.object({
      name: Joi.string().required(),
      licenseNumber: Joi.string().required()
    }).required(),
    otherwise: Joi.forbidden()
  })
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().min(8).required()
});

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema
};
