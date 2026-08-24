const Joi = require('joi');

const objectIdSchema = Joi.string().regex(/^[0-9a-fA-F]{24}$/).message('Invalid ObjectId format');

const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20)
});

const locationUpdateSchema = Joi.object({
  coordinates: Joi.array().items(Joi.number()).length(2).required().messages({
    'array.length': 'Coordinates must contain exactly [longitude, latitude]',
    'any.required': 'Coordinates are required'
  })
});

module.exports = {
  objectIdSchema,
  paginationSchema,
  locationUpdateSchema
};
