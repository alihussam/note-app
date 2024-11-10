import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "./libs/customError.lib";

const router = Router();

/**
 * Check health of server
 *
 * Route: /heath-check
 */
router.get("/health-check", (req, res) => {
  res.sendStatus(StatusCodes.OK);
});

/**
 * Check how server will respond in case of error
 *
 * Route: /check-error
 */
router.get("/check-error", (req, res, next) => {
  try {
    throw new CustomError({
      message: "This is how error response looks like",
      statusCode: StatusCodes.BAD_REQUEST,
    });
  } catch (error) {
    next(error);
  }
});

export default router;