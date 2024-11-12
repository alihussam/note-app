import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { TokenPayload } from "../types/jwt.type";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // Access token valid for 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // Refresh token valid for 7 days

/**
 * Access and refresh token
 *
 * @param param0 - Function params
 * @param param0.userId - User id
 * @param param0.accessSecret - Access secret
 * @param param0.refreshSecret - Refresh secret
 * @returns Access and refresh token
 */
export const generateTokenSet = ({
  accessSecret,
  refreshSecret,
  userId,
}: {
  userId: number;
  accessSecret: string;
  refreshSecret: string;
}): { accessToken: string; refreshToken: string } => {
  // create token payload
  const tokenPayload: TokenPayload = {
    userId,
  };

  // Generate access token
  const accessToken = jwt.sign(tokenPayload, accessSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  // Generate refresh token
  const refreshToken = jwt.sign(tokenPayload, refreshSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};
