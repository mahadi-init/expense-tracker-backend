import { Router } from "express";
import { userZod } from "../types/user-zod";
import { validateData } from "../utils/zod-validator";
import bcrypt from "bcrypt";
import { User } from "../models/user";
import { StatusCodes } from "http-status-codes";
import { AppError } from "../types/app-error";
import { generateJwtToken } from "../utils/jwt";
import { authenticate } from "../middlewares/authenticate";

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

      if (!user) {
        throw new AppError("User not found", StatusCodes.NO_CONTENT);
      }

      const isPasswordValid = bcrypt.compareSync(
        password,
        user?.password as string,
      );

      if (isPasswordValid) {
        res.status(StatusCodes.OK).json({
          success: true,
          data: user,
          token: generateJwtToken({
            id: user.id,
            username: user.username,
            email: user.email,
          }),
        });
      } else {
        throw new AppError("Invalid email or password", StatusCodes.NO_CONTENT);
      }
    } catch (err: any) {
      next(err);
    }
  },
);

auth.get("/current-user", authenticate, async (req, res, next) => {
  try {
    const userID = req.userID;

    const user = await User.findById(userID);
    res.status(StatusCodes.OK).json({
      success: true,
      data: user,
    });
  } catch (err: any) {
    next(err);
  }
});

export default auth;
