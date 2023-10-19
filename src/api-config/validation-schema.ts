import * as Joi from 'joi';

export const validationSchema = Joi.object({
  DATABASE_URL: Joi.string().not(Joi.string().empty()),
  JWT_SECRET: Joi.string().not(Joi.string().empty()),
  JWT_REFRESH_SECRET: Joi.string().not(Joi.string().empty()),
  GOOGLE_CLIENT_ID: Joi.string().not(Joi.string().empty()),
  MICROSOFT_CLIENT_ID: Joi.string().not(Joi.string().empty()),
  TMDB_API_KEY: Joi.string().not(Joi.string().empty()),
  TMDB_URL: Joi.string().not(Joi.string().empty()),
  TMDB_URL_IMAGE_BASE: Joi.string().not(Joi.string().empty()),
  CLOUDINARY_NAME: Joi.string().not(Joi.string().empty()),
  CLOUDINARY_API_KEY: Joi.string().not(Joi.string().empty()),
  CLOUDINARY_API_SECRET: Joi.string().not(Joi.string().empty()),
  STRIPE_API_KEY: Joi.string().not(Joi.string().empty()),
  MAILGUN_NAME: Joi.string().not(Joi.string().empty()),
  MAILGUN_API_KEY: Joi.string().not(Joi.string().empty()),
  MAILGUN_DOMAIN: Joi.string().not(Joi.string().empty()),
});
