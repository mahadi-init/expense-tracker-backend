import { NextFunction, Response } from "express";
import { ExtendedRequest } from "../types/extended-request";

export const adminAccess = async (req: ExtendedRequest, res: Response, next: NextFunction) => {
  try {
    if (req.role === "ADMIN") {
      next()
    }

    throw new Error("Unauthorized access");
  } catch (err: any) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};