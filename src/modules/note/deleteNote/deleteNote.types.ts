import { Joi, schema } from "express-validation";

export const deleteNoteRequestValidation: schema = {
  params: Joi.object({ noteId: Joi.number().required() }),
};
