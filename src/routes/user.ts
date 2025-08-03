import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { User } from "../models/user";

const user = Router();

user.get("/get-all", async (_, res, next) => {
  try {
    const users = await User.find({});

    return res.status(StatusCodes.OK).json({
      success: true,
      data: users,
    });
  } catch (err: any) {
    next(err);
  }
});

export default user;
