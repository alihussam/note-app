import { Response } from "express";

interface SuccessResponse {
  res: Response;
  data: unknown;
  meta?: unknown;
}

/**
 * Send success API response
 *
 * @param param0 - Function params
 * @param param0.res - Express response object
 * @param param0.data - Data
 * @param param0.meta - Meta data
 */
export function sendSuccessResponse({ res, data, meta }: SuccessResponse) {
  res.send({
    meta,
    data,
  });
}
