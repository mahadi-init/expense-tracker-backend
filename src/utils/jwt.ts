import jwt from "jsonwebtoken";
import secrets from "../lib/secret";
import { AppError } from "../types/app-error";
import { StatusCodes } from "http-status-codes";

interface UserTokenType {
  id: string;
  username?: string | null;
  email?: string | null;
}

export const generateJwtToken = (user: UserTokenType): string => {
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  if (!secrets.jwt_secret) {
    throw new AppError("JWT token not found!!", StatusCodes.NOT_FOUND);
  }

  const token = jwt.sign(payload, secrets.jwt_secret, { expiresIn: "7d" });
  return token;
};
