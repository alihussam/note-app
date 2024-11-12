import { Joi, schema } from "express-validation";

export type LoginRequest = { email: string; password: string };

export const loginRequestValidation: schema = {
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(60),
  }),
};
