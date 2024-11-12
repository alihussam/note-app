import { Joi, schema } from "express-validation";
import { Note } from "../../../models/note.model";

export type CreateNoteRequest = Omit<Note, "id">;

export const createNoteRequestValidation: schema = {
  body: Joi.object({
    text: Joi.string().required().max(128),
    title: Joi.string().required(),
  }),
};
