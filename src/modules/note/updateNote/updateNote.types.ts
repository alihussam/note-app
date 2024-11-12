import { Joi, schema } from "express-validation";

export type UpdateNoteRequest = { title?: string; text?: string };

export const updateNoteRequestValidation: schema = {
  params: Joi.object({ noteId: Joi.string().required() }),
  body: Joi.object({
    text: Joi.string().optional().max(128),
    title: Joi.string().optional(),
  }),
};
