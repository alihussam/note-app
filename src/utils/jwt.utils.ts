import jwt from "jsonwebtoken";
import { User } from "../models/user.model";
import { TokenPayload } from "../types/jwt.type";

// Token expiration times
export const ACCESS_TOKEN_EXPIRY = "15m"; // Access token valid for 15 minutes
const REFRESH_TOKEN_EXPIRY = "7d"; // Refresh token valid for 7 days

/**
 * Generate user token
 *
 * @param param0 - Function params
 * @param param0.payload - Token payload
 * @param param0.secret - Secret to use
 * @param param0.expiry - Token expiry
 * @returns Tokens
 */
export const generateAuthToken = ({
  payload,
  secret,
  expiry,
}: {
  payload: TokenPayload;
  secret: string;
  expiry: string;
}) =>
  jwt.sign(payload, secret, {
    expiresIn: expiry,
  });

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
  const accessToken = generateAuthToken({
    payload: tokenPayload,
    secret: accessSecret,
    expiry: ACCESS_TOKEN_EXPIRY,
  });

  // Generate refresh token
  const refreshToken = generateAuthToken({
    payload: tokenPayload,
    secret: refreshSecret,
    expiry: REFRESH_TOKEN_EXPIRY,
  });

  return { accessToken, refreshToken };
};
