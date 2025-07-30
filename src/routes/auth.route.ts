import { Router } from "express";
import { AuthRequest } from "../controller/auth.contoller";

const router = Router()
const handler = new AuthRequest()

router.post("/seller/signup", handler.signup)

router.post("/login", handler.login)

export default router