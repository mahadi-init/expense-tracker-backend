import { Router } from "express";
import { StatusCodes } from "http-status-codes";

const auth = Router();

auth.get("/hello", async (req, res, next) => {
  res.status(StatusCodes.OK).json({ message: "nice" });
});

export default auth;
