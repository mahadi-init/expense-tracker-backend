import { Router } from "express";
import { userZod } from "../types/user-zod";
import { validateData } from "../utils/zod-validator";

const auth = Router();

auth.post("/signup", validateData(userZod), async (req, res, next) => {
  const { username, password, email } = req.body;
});

export default auth;
