import { User, UserModel } from "../models/user.model";

/**
 * Check if user with email exists
 *
 * @param email - Email to check
 * @returns True/false
 */
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  // Returns true if user exists, false otherwise
  // != checks both null and undefined
  return user != null;
};

/**
 * Get user by email
 *
 * @param email - Email to check
 * @returns True/false
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await UserModel.findOne({ where: { email } });

  return user?.toJSON() as User | null;
};
