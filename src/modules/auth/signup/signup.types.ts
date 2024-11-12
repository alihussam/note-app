import { Joi, schema } from "express-validation";
import { User } from "../../../models/user.model";

export type SignupRequest = Omit<User, "id">;

export const signupRequestValidation: schema = {
  body: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8).max(60),
  }),
};
