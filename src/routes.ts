import { Router } from "express";
import auth from "./routes/auth";
import user from "./routes/user";
import dashboard from "./routes/dashboard";
import income from "./routes/income";
import { jwtAuthorization } from "./utils/jwt-auth";
import expenses from "./routes/expenses";

const router = Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/dashboard", jwtAuthorization, dashboard);
router.use("/income", jwtAuthorization, income);
router.use("/expenses", jwtAuthorization, expenses);

// Handle not found
router.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});

export default router;
