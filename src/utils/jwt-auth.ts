import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import secrets from "../config/secret";
import { getBearerToken } from "./token";

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
        throw new Error();
      }
    } else {
      throw new Error();
    }

    next();
  } catch (error: any) {
    res.status(401).json({
      success: false,
      message: "Unauthorized access",
    });
  }
}

