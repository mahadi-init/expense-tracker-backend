import { Router } from "express";
import auth from "./routes/auth";
import user from "./routes/user";
import dashboard from "./routes/dashboard";
import income from "./routes/income";
import expenses from "./routes/expenses";
import { validate } from "./utils/zod-validator";
import { DeleteType, deleteZod } from "./types/danger-zod";
import mongoose from "mongoose";
import { StatusCodes } from "http-status-codes";
// import { authenticate } from "./middlewares/authenticate";

const router = Router();

router.use("/auth", auth);
router.use("/user", user);
router.use("/dashboard", dashboard);
router.use("/income", income);
router.use("/expenses", expenses);
router.patch("/delete-all", validate(deleteZod), (req, res, next) => {
  try {
    const payload: Partial<DeleteType> = req.body;

    payload.deletes?.map(async (item) => {
      const Model = mongoose.model(item);
      await Model.deleteMany({});
    });

    return res.status(StatusCodes.OK).json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err: any) {
    next(err);
  }
});

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
