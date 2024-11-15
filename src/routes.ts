import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { CustomError } from "./libs/customError.lib";
import validateMiddleware from "./middleware/validate.middleware";
import { signupRequestValidation } from "./modules/auth/signup/signup.types";
import { signupController } from "./modules/auth/signup/signup.controller";
import { loginRequestValidation } from "./modules/auth/login/login.types";
import { loginController } from "./modules/auth/login/login.controller";
import {
  accessTokenMiddleware,
  refreshTokenMiddleware,
} from "./middleware/authenticate.middleware";
import { refreshTokenController } from "./modules/auth/refreshToken/refreshToken.controller";
import { createNoteRequestValidation } from "./modules/note/createNote/createNote.types";
import { createNoteController } from "./modules/note/createNote/createNote.controller";
import { updateNoteRequestValidation } from "./modules/note/updateNote/updateNote.types";
import { updateNoteController } from "./modules/note/updateNote/updateNote.controller";
import { getNoteRequestValidation } from "./modules/note/getNote/getNote.types";
import { getNoteController } from "./modules/note/getNote/getNote.controller";
import { getNotesRequestValidation } from "./modules/note/getNotes/getNotes.types";
import { getNotesController } from "./modules/note/getNotes/getNotes.controller";
import { deleteNoteRequestValidation } from "./modules/note/deleteNote/deleteNote.types";
import { deleteNoteController } from "./modules/note/deleteNote/deleteNote.controller";

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

/**
 * Create note controller
 */
router.post(
  "/note",
  accessTokenMiddleware,
  validateMiddleware(createNoteRequestValidation),
  createNoteController
);

/**
 * get notes controller
 */
router.get(
  "/notes",
  accessTokenMiddleware,
  validateMiddleware(getNotesRequestValidation),
  getNotesController
);

/**
 * get note controller
 */
router.get(
  "/note/:noteId",
  accessTokenMiddleware,
  validateMiddleware(getNoteRequestValidation),
  getNoteController
);

/**
 * Update note controller
 */
router.put(
  "/note/:noteId",
  accessTokenMiddleware,
  validateMiddleware(updateNoteRequestValidation),
  updateNoteController
);

/**
 * Delete note controller
 */
router.delete(
  "/note/:noteId",
  accessTokenMiddleware,
  validateMiddleware(deleteNoteRequestValidation),
  deleteNoteController
);

export default router;
