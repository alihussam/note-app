import { NextFunction, Request, Response } from "express";

/**
 * Request logging middleware
 *
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Next function handler
 */
export const requestLoggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const requestTime = new Date(Date.now()).toString();
  console.log(req.method, req.hostname, req.path, requestTime);
  next();
};
