import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secrets from "../lib/secret";
import { getBearerToken } from "./token";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../types/app-error";

export async function jwtAuthorization(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const bearerToken = await getBearerToken(req);

    if (bearerToken) {
      const data = jwt.verify(bearerToken, secrets.jwt_secret);

      if (!data) {
        throw new AppError("Invalid JWT", StatusCodes.UNAUTHORIZED);
      }
    } else {
      throw new AppError("Jwt Not found", StatusCodes.UNAUTHORIZED);
    }

    next();
  } catch (error: any) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: "Unauthorized access",
    });
  }
}
