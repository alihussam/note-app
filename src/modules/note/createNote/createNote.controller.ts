import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { CreateNoteRequest } from "./createNote.types";
import { Note, NoteModel } from "../../../models/note.model";

/**
 * Create note controller
 *
 * @param req - Request
 * @param res - Response
 * @param next - Next middlewarw
 */
export const createNoteController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // notice how this is not a custom error this is because this controller
    // is supposed to be unaccessible without an auth
    // this will trigger an unkown exception to user
    if (!req.userId) {
      throw new Error("User id not present in context");
    }

    // get body
    const { title, text } = req.body as unknown as CreateNoteRequest;

    // create note payload
    const payload: Omit<Note, "id"> = {
      title,
      text,
      ownerId: req.userId,
    };

    // create note
    const result = await NoteModel.create(payload);

    // plain
    const plain = result.toJSON() as Note;

    sendSuccessResponse({
      res,
      data: {
        note: plain,
      },
    });
  } catch (error) {
    next(error);
  }
};
