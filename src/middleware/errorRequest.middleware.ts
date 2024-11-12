import { NextFunction, Request, Response } from "express";
import { ValidationError as ExpressValidationError } from 'express-validation';
import { CustomError } from "../libs/customError.lib";
import { StatusCodes } from "http-status-codes";
import { getEnvConfig, isDevMode } from "../utils/env.utils";

/**
 * Global express error request handler
 *
 * this is a global error handler to catch all request errors, format and respond to request
 * to pass a custom error to this handler from any route call next(error)
 */
export const errorRequestMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { NODE_ENV } = getEnvConfig();
  let finalError = err;

  /* Validation Error */
  if (finalError instanceof ExpressValidationError) {
    /**
     * Handling on flattened validation error
     * make sure to use custom validation middleware in middleware dir
     * or to set keyByField to true if using validate middleware directly
     * or change this handling to handle detailed Validation error
     * See: https://www.npmjs.com/package/express-validation
     */
    // deep clone whole error
    finalError = new CustomError({
      message: "API validation failed",
      statusCode: StatusCodes.BAD_REQUEST,
      meta: finalError.details,
    });
  }

  /* Unexpected Error */
  if (!(finalError instanceof CustomError)) {
    // creating API error with no params create unkown error and hides the details
    finalError = new CustomError({
      message: "Unkown problem occured",
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }

  /**
   * Send error
   *
   * stack trace is sent only when the system is running in development mode
   */
  res.status(finalError.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
    // error message
    error: finalError.message,
    errorKey: finalError.errorKey,
    meta: finalError.meta,
    stack: isDevMode(NODE_ENV) ? finalError.stack : undefined,
  });
};
