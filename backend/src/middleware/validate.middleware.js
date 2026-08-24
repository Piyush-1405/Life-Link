/**
 * LifeLink - Blood Donation Management System
 * Request Validation Middleware (Joi)
 */

const Joi = require('joi');
const ApiError = require('../utils/ApiError');

/**
 * Validates request payload against a Joi schema.
 * Supports both standalone body schemas and composite schemas containing { body, params, query }.
 *
 * @param {import('joi').Schema | { body?: import('joi').Schema, params?: import('joi').Schema, query?: import('joi').Schema }} schema
 * @returns {import('express').RequestHandler}
 */
const validate = (schema) => {
  return (req, _res, next) => {
    // Check if the provided schema is a composite schema (containing body, query, or params)
    const isCompositeSchema =
      schema &&
      typeof schema === 'object' &&
      !Joi.isSchema(schema) &&
      (schema.body || schema.params || schema.query);

    const validationTargets = isCompositeSchema
      ? ['params', 'query', 'body'].filter((key) => Boolean(schema[key]))
      : ['body'];

    const validationErrors = [];

    for (const target of validationTargets) {
      const targetSchema = isCompositeSchema ? schema[target] : schema;
      const targetData = req[target];

      if (!targetSchema) continue;

      const compiledSchema = Joi.isSchema(targetSchema)
        ? targetSchema
        : Joi.object(targetSchema);

      const { error, value } = compiledSchema.validate(targetData, {
        abortEarly: false,
        stripUnknown: true,
        allowUnknown: false,
        errors: {
          wrap: {
            label: ''
          }
        }
      });

      if (error) {
        const errors = error.details.map((detail) => ({
          field: `${target}.${detail.path.join('.')}`,
          message: detail.message.replace(/['"]/g, '')
        }));
        validationErrors.push(...errors);
      } else {
        // Assign cleaned and sanitized values back to request object
        req[target] = value;
      }
    }

    if (validationErrors.length > 0) {
      const errorMessages = validationErrors.map((e) => `${e.field}: ${e.message}`);
      return next(
        new ApiError(400, 'Validation failed for request data', errorMessages)
      );
    }

    return next();
  };
};

module.exports = validate;
module.exports.validate = validate;
