import { Request } from "express";
import jwt from "jsonwebtoken";
import secrets from "../lib/secret";
import { AppError } from "../types/app-error";
import { StatusCodes } from "http-status-codes";

interface User {
  id: string;
  role?: string;
}

export const generateToken = (user: User) => {
  const payload = {
    id: user.id,
    role: user.role,
  };

  if (!secrets.jwt_secret) {
    throw new AppError("JWT token not found!!", StatusCodes.UNAUTHORIZED);
  }

  const token = jwt.sign(payload, secrets.jwt_secret, { expiresIn: "7d" });
  return token;
};

export const getBearerToken = async (req: Request) => {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearer = bearerHeader.split(" ");
      const bearerToken = bearer[1];
      return bearerToken;
    } else {
      return null;
    }
  } catch (err) {
    return null;
  }
};
