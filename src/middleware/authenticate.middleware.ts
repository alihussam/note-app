import { NextFunction, Request, Response } from "express";
import { CustomError } from "../libs/customError.lib";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { getEnvConfig } from "../utils/env.utils";
import { TokenPayload } from "../types/jwt.type";
import Logger from "../libs/logger.lib";

/**
 * Auth middleware
 *
 * @param secret - Secret to use
 */
const authenticateMiddleware =
  (secret: string) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req?.headers?.["authorization"]?.split(" ")[1]; // Get token from Bearer scheme

      if (!token) {
        throw new CustomError({
          message: "User not authorized",
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }

      const decoded = jwt.verify(token, secret) as TokenPayload;
      if (!decoded?.userId) {
        throw new CustomError({
          message: "User not authorized",
          statusCode: StatusCodes.UNAUTHORIZED,
        });
      }

      req.userId = decoded.userId; // Add user id to request object

      next();
    } catch (error) {
      if (error instanceof CustomError) {
        next(error);
      }

      // log and return unauth
      Logger.getInstance().error("Exception at auth", error);

      next(
        new CustomError({
          message: "User not authorized",
          statusCode: StatusCodes.UNAUTHORIZED,
        })
      );
    }
  };

/**
 * Access token middleware
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function handler
 */
export const accessTokenMiddleware = authenticateMiddleware(
  getEnvConfig().ACCESS_TOKEN_SECRET
);

/**
 * Refresh token middleware
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function handler
 */
export const refreshTokenMiddleware = authenticateMiddleware(
  getEnvConfig().REFRESH_TOKEN_SECRET
);
