import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().not(Joi.string().empty()),
  JWT_SECRET: Joi.string().not(Joi.string().empty()),
  JWT_REFRESH_SECRET: Joi.string().not(Joi.string().empty()),
  GOOGLE_CLIENT_ID: Joi.string().not(Joi.string().empty()),
  MICROSOFT_CLIENT_ID: Joi.string().not(Joi.string().empty()),
});
