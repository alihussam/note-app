import { Joi, schema } from "express-validation";

export const getNoteRequestValidation: schema = {
  params: Joi.object({ noteId: Joi.string().required() }),
};
