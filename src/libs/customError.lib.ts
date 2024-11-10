/**
 * Custom error names
 */
export const CUSTOM_ERROR_NAME = "CustomError";

/**
 * Custom error params
 */
export interface CustomErrorParams {
  message?: string;
  errorKey?: string;
  statusCode?: number;
  meta?: any;
}

/**
 * Custom Error
 *
 * @augments Error
 */
export class CustomError extends Error {
  /**
   * Error key
   */
  errorKey?: string;

  /**
   * Http status code (if any)
   */
  statusCode?: number;

  /**
   * Error additional meta (if any)
   */
  meta?: any;

  /**
   * Error constructor
   *
   * @param params - Custom error params
   * @param params.message - Error message
   * @param params.errorKey - Error key
   * @param params.statusCode - Status code
   * @param params.meta - Error meta
   */
  constructor({ message, errorKey, statusCode, meta = {} }: CustomErrorParams) {
    super(message || "Some error occured");
    this.name = CUSTOM_ERROR_NAME;
    this.errorKey = errorKey;
    this.statusCode = statusCode;
    this.meta = meta;
    // capture current stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}
