import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

// Token expiration times
const ACCESS_TOKEN_EXPIRY = "15m"; // Access token valid for 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // Refresh token valid for 7 days

/**
 * Access and refresh token
 *
 * @param param0 - Function params
 * @param param0.accessSecret - Access secret
 * @param param0.refreshSecret - Refresh secret
 * @returns Access and refresh token
 */
export const generateTokenSet = ({
  accessSecret,
  refreshSecret,
  user,
}: {
  user: User;
  accessSecret: string;
  refreshSecret: string;
}): { accessToken: string; refreshToken: string } => {
  // Generate access token
  const accessToken = jwt.sign(user, accessSecret, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
  });

  // Generate refresh token
  const refreshToken = jwt.sign(user, refreshSecret, {
    expiresIn: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};
