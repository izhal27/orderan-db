import * as Joi from "joi";

export default () => ({
  validationSchema: Joi.object({
    NODE_ENV: Joi.string()
      .valid('development', 'production', 'test')
      .required()
      .default('development'),
    JWT_SECRET: Joi.string().required(),
  }),
  validationOptions: {
    abortEarly: true,
  },
  envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
  isGlobal: true
});