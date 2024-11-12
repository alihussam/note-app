import { NextFunction, Request, Response } from "express";
import { SignupRequest } from "./signup.types";
import { User, UserModel } from "../../../models/user.model";
import { generateTokenSet } from "../../../utils/jwt.utils";
import { getEnvConfig } from "../../../utils/env.utils";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { checkIfEmailExists } from "../../../services/user.services";
import { CustomError } from "../../../libs/customError.lib";
import { StatusCodes } from "http-status-codes";

/**
 * Signup controller
 *
 * @param req - Request
 * @param res - Response
 * @param next - Next middlewarw
 */
export const signupController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get secrets
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = getEnvConfig();

    // get body
    const { name, email, password } = req.body as unknown as SignupRequest;

    // before creating check if user exists
    const isExistingUser = await checkIfEmailExists(email);
    if (isExistingUser) {
      throw new CustomError({
        message: "User with this email already exists",
        statusCode: StatusCodes.BAD_REQUEST,
      });
    }

    // create user
    const user = await UserModel.create({ name, email, password });

    const userPlain = user.toJSON() as User; // convert to plain object

    // generate access and refresh JWT tokens
    const { accessToken, refreshToken } = generateTokenSet({
      user: userPlain,
      accessSecret: ACCESS_TOKEN_SECRET,
      refreshSecret: REFRESH_TOKEN_SECRET,
    });

    sendSuccessResponse({
      res,
      data: {
        accessToken,
        refreshToken,
        user: userPlain,
      },
    });
  } catch (error) {
    next(error);
  }
};
