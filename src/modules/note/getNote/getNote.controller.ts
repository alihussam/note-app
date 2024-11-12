import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { Note, NoteModel } from "../../../models/note.model";
import { CustomError } from "../../../libs/customError.lib";
import { StatusCodes } from "http-status-codes";

/**
 * Get note controller
 *
 * @param req - Request
 * @param res - Response
 * @param next - Next middlewarw
 */
export const getNoteController = async (
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

    /**
     * Get note using id and owner, note how user id is part of query,
     * this is to ensure that user is not updating note from
     * some other user
     */
    const result = await NoteModel.findOne({
      where: { id: req.params.noteId, ownerId: req.userId },
    });
    if (!result) {
      throw new CustomError({
        message: "Note not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

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
