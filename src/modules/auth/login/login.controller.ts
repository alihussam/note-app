import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import { cloneDeep } from "lodash";
import { LoginRequest } from "./login.types";
import { User } from "../../../models/user.model";
import { generateTokenSet } from "../../../utils/jwt.utils";
import { getEnvConfig } from "../../../utils/env.utils";
import { sendSuccessResponse } from "../../../utils/response.utils";
import { getUserByEmail } from "../../../services/user.services";
import { CustomError } from "../../../libs/customError.lib";
import { StatusCodes } from "http-status-codes";

/**
 * Login controller
 *
 * @param req - Request
 * @param res - Response
 * @param next - Next middlewarw
 */
export const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // get secrets
    const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = getEnvConfig();

    // get body
    const { email, password } = req.body as unknown as LoginRequest;

    // get user
    const user = await getUserByEmail(email);

    // if user is not found, throw error
    if (!user) {
      throw new CustomError({
        message: "Invalid login credentials",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    // compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new CustomError({
        message: "Invalid login credentials",
        statusCode: StatusCodes.UNAUTHORIZED,
      });
    }

    const userPlain = cloneDeep(user) as Omit<User, "password"> & {
      password?: string;
    };

    // delete user password
    delete userPlain.password;

    // generate access and refresh JWT tokens
    const { accessToken, refreshToken } = generateTokenSet({
      userId: user.id,
      accessSecret: ACCESS_TOKEN_SECRET,
      refreshSecret: REFRESH_TOKEN_SECRET,
    });

    sendSuccessResponse({
      res,
      data: {
        accessToken,
        refreshToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};
