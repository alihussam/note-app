import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { Note, NoteModel } from "../../../models/note.model";
import { CustomError } from "../../../libs/customError.lib";
import { StatusCodes } from "http-status-codes";
import { DEFAULT_PAGE_LIMIT, GetNotesQuery } from "./getNotes.types";

/**
 * Get notes controller
 *
 * @param req - Request
 * @param res - Response
 * @param next - Next middlewarw
 */
export const getNotesController = async (
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

    const { page = 1, limit = DEFAULT_PAGE_LIMIT } = (req.query ||
      {}) as GetNotesQuery;

    const offset: number = (Number(page) - 1) * Number(limit); // Calculate offset

    // get paginated notes
    const { count, rows } = await NoteModel.findAndCountAll({
      where: { ownerId: req.userId },
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit); // Calculate total pages

    sendSuccessResponse({
      res,
      data: {
        // sending model since it will auto call models toJSON when sending in response
        docs: rows,
        limit,
        page,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};
