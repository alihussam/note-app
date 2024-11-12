import { UserModel } from "../models/user.model";

/**
 * Check if user with email exists
 *
 * @param email - Email to check
 * @returns True/false
 */
export const checkIfEmailExists = async (email: string): Promise<boolean> => {
  const user = await UserModel.findOne({ where: { email } });
  // Returns true if user exists, false otherwise
  // != checks both null and undefined
  return user != null;
};
