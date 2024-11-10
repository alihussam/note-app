import { NextFunction, Request, Response } from "express";
import { CustomError } from "../libs/customError.lib";
import { StatusCodes } from "http-status-codes";

/**
 * Route not found handler
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function handler
 */
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(
    new CustomError({
      message: "Route does not exist",
      statusCode: StatusCodes.NOT_FOUND,
    })
  );
};
