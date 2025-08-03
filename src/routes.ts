import { Router } from "express";
import auth from "./routes/auth";
import user from "./routes/user";

const router = Router();

router.use("/auth", auth);
router.use("/user", user);

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
