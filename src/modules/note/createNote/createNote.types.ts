import { Joi, schema } from "express-validation";
import { Note, NoteType } from "../../../models/note.model";

export type CreateNoteRequest = Omit<Note, "id" | "shouldTrack">;

export const createNoteRequestValidation: schema = {
  body: Joi.object({
    text: Joi.string().required().max(128),
    title: Joi.string().required(),
    type: Joi.string()
      .valid(...Object.values(NoteType))
      .default(NoteType.WORK)
      .optional(),
  }),
};
