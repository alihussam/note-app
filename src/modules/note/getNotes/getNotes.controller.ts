import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { NoteModel } from "../../../models/note.model";
import { DEFAULT_PAGE_LIMIT, GetNotesQuery } from "./getNotes.types";
import { redis } from "../../../libs/redis.lib";
import Logger from "@/src/libs/logger.lib";

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

    // create a cache key
    const cacheKey = `notes:${req.userId}:${offset}:${limit}`; // Key for caching
    const cacheResult = await redis.get(cacheKey);

    // if cached notes found
    if (cacheResult) {
      Logger.getInstance().log("Cache hit with key", cacheKey);
      sendSuccessResponse({
        res,
        data: JSON.parse(cacheResult),
      });
      return;
    }

    // get paginated notes
    const { count, rows } = await NoteModel.findAndCountAll({
      where: { ownerId: req.userId },
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit); // Calculate total pages

    const response = {
      // sending model since it will auto call models toJSON when sending in response
      docs: rows,
      limit,
      page,
      totalPages,
    };

    // cache response
    await redis.set(cacheKey, JSON.stringify(response), "EX", 3600); // Cache for 1 hour

    sendSuccessResponse({
      res,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};
