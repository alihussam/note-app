import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "./libs/customError.lib";
import validateMiddleware from "./middleware/validate.middleware";
import { signupRequestValidation } from "./modules/auth/signup/signup.types";
import { signupController } from "./modules/auth/signup/signup.controller";
import { loginRequestValidation } from "./modules/auth/login/login.types";
import { loginController } from "./modules/auth/login/login.controller";
import { refreshTokenMiddleware } from "./middleware/authenticate.middleware";
import { refreshTokenController } from "./modules/auth/refreshToken/refreshToken.controller";

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

/**
 * Signup user
 */
router.post(
  "/signup",
  validateMiddleware(signupRequestValidation),
  signupController
);

/**
 * Login user
 */
router.post(
  "/login",
  validateMiddleware(loginRequestValidation),
  loginController
);

/**
 * Refresh token user
 */
router.get("/refreshToken", refreshTokenMiddleware, refreshTokenController);

export default router;
