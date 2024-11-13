import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { Note, NoteModel } from "../../../models/note.model";
import { UpdateNoteRequest } from "./updateNote.types";
import { CustomError } from "../../../libs/customError.lib";
import { StatusCodes } from "http-status-codes";
import { deleteRedisCacheByPattern } from "../../../libs/redis.lib";
import Logger from "../../../libs/logger.lib";

/**
 * Update note controller
 *
 * @param req - Request
 * @param res - Response
 * @param next - Next middlewarw
 */
export const updateNoteController = async (
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

    // get body
    const { title, text } = req.body as unknown as UpdateNoteRequest;

    // create note payload
    const payload: Partial<Note> = {
      ...(title ? { title } : {}),
      ...(text ? { text } : {}),
    };

    // if payload has anything to update, only then update
    if (Object.keys(payload).length) {
      /**
       * update note
       * NOTE: I can use returning:true here to return the updated note
       * but this is known to cause issues with some SQL databases like mySQL
       *
       * Additional: Also note how user id is part of query, this is to ensure that user is not updating not from
       * some other user
       */
      await NoteModel.update(payload, {
        where: { id: req.params.noteId, ownerId: req.userId },
        returning: true,
      });
    }

    // get note
    const result = await NoteModel.findOne({
      where: { id: req.params.noteId, ownerId: req.userId },
    });
    if (!result) {
      throw new CustomError({
        message: "Note not found",
        statusCode: StatusCodes.NOT_FOUND,
      });
    }

    // try to invalidatate cache
    try {
      await deleteRedisCacheByPattern(`notes:${req.userId}:*`);
    } catch (error) {
      Logger.getInstance().error("Error invalidating cache", error);
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
