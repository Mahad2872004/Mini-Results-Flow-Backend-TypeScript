import Joi from 'joi';
import createError from 'http-errors';

export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(createError(400, error.details.map((d) => d.message).join(', ')));
    }

    req.body = value;
    next();
  };
}
