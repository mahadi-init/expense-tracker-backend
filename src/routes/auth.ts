import { Router } from "express";
import { userZod } from "../types/user-zod";
import { validateData } from "../utils/zod-validator";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../types/app-error";

const auth = Router();
const saltRounds = 10;

auth.post("/signup", validateData(userZod), async (req, res, next) => {
  try {
    const { username, password, email } = req.body;

    const ifUserExist = await User.findOne({ email: email });
    if (ifUserExist) {
      throw new AppError("Email already exists", StatusCodes.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username: username,
      password: hashedPassword,
      email: email,
    });

    res.status(StatusCodes.CREATED).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    next(err);
  }
});

auth.post(
  "/signin",
  validateData(userZod.pick({ email: true, password: true })),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email });
      console.log("user", user);

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        user?.password as string,
      );

      if (isPasswordValid) {
        res.status(StatusCodes.CREATED).json({
          success: true,
          data: user,
        });
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (err: any) {
      next(err);
    }
  },
);

export default auth;
