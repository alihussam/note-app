import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { Note, NoteModel } from "../../../models/note.model";
import { CustomError } from "../../../libs/customError.lib";
import { StatusCodes } from "http-status-codes";

/**
 * Update note controller
 *
 * @param req - Request
 * @param res - Response
 * @param next - Next middlewarw
 */
export const deleteNoteController = async (
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

    // if request has no note id then this is not expected since validation and api matching should cover it
    // its an error too
    if (!req.params.noteId) {
      throw new Error("Note id not present in context");
    }

    // get note
    const result = await NoteModel.destroy({
      where: { id: req.params.noteId, ownerId: req.userId },
    });
    // if no rows deleted, then note was not present
    if (!result) {
      throw new CustomError({
        message: "Note not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    sendSuccessResponse({
      res,
      data: "Note deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
