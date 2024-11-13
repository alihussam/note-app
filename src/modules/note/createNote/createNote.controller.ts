import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { CreateNoteRequest } from "./createNote.types";
import { deleteRedisCacheByPattern } from "../../../libs/redis.lib";
import Logger from "../../../libs/logger.lib";
import { NoteFactory } from "../../../factories/note.factory";
import { NoteType } from "../../../models/note.model";

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
    const {
      title,
      text,
      type = NoteType.WORK,
    } = req.body as unknown as CreateNoteRequest;

    // create note using factor
    const result = await NoteFactory.createNote({
      type,
      title,
      text,
      ownerId: req.userId,
    });

    // try to invalidatate cache
    try {
      await deleteRedisCacheByPattern(`notes:${req.userId}:*`);
    } catch (error) {
      Logger.getInstance().error("Error invalidating cache", error);
    }

    sendSuccessResponse({
      res,
      data: {
        note: result,
      },
    });
  } catch (error) {
    next(error);
  }
};
