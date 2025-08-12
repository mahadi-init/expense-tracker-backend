import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Dashboard } from "../models/dashboard";

const dashboard = Router();

dashboard.get("/info", async (_, res, next) => {
  try {
    const dashboard = await Dashboard.findOne();

    return res.status(StatusCodes.OK).json({
      success: true,
      data: dashboard,
    });
  } catch (err: any) {
    next(err);
  }
});

export default dashboard;
