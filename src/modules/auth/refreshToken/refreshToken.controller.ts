import { NextFunction, Request, Response } from "express";
import {
  ACCESS_TOKEN_EXPIRY,
  generateAuthToken,
} from "../../../utils/jwt.utils";
import { getEnvConfig } from "../../../utils/env.utils";
import { sendSuccessResponse } from "../../../utils/response.utils";

/**
 * Refresh token controller
 *
 * @param req - Request
 * @param res - Response
 * @param next - Next middlewarw
 */
export const refreshTokenController = async (
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

    // generate an access token
    const accessToken = generateAuthToken({
      payload: {
        userId: req.userId,
      },
      secret: getEnvConfig().ACCESS_TOKEN_SECRET,
      expiry: ACCESS_TOKEN_EXPIRY,
    });

    sendSuccessResponse({
      res,
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};
