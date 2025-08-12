import { NextFunction, Request, Response } from "express";
import { AppError } from "../types/app-error";
import { StatusCodes } from "http-status-codes";
import secrets from "../lib/secret";
import jwt from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userID: string;
      username?: string | null;
      email?: string | null;
    }
  }
}

export async function authenticate(
  req: Request,
  _: Response,
  next: NextFunction,
) {
  try {
    const bearerToken = await getBearerTokenFromHeader(req);
    if (!bearerToken) {
      throw new AppError("Unauthorized access", StatusCodes.FORBIDDEN);
    }

    const data = jwt.verify(bearerToken, secrets.jwt_secret);

    if (!data || typeof data === "string") {
      throw new AppError("Invalid Token", StatusCodes.BAD_REQUEST);
    }

    // set global user id
    req.userID = data.id;
    req.email = data.email;
    req.username = data.username;

    next();
  } catch (error) {
    next(error);
  }
}

const getBearerTokenFromHeader = async (req: Request) => {
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
