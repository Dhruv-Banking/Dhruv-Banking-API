import bcrypt from "bcrypt";

/**
 * Async function to hash a password with 13 rounds
 * @param password
 * @returns hashed_password
 */
export async function hashPassword(password: string): Promise<string> {
  const SALT_ROUNDS = 13;
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return await bcrypt.hash(password, salt);
}

/**
 * Async function to compare passwords the hashed password to the not hashed password
 * @param normalPassword Not hashed password
 * @param hashedPassword Hashed password
 * @returns boolean true if the passwords are the same, false if they are not the same
 */
export async function comparePassword(
  normalPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(normalPassword, hashedPassword);
}
