import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Income } from "../models/income";
import { validateData } from "../utils/zod-validator";
import { incomeZod } from "../types/income-zod";

const income = Router();

income.get("/get-all", async (_, res, next) => {
  try {
    const incomes = await Income.find({});

    return res.status(StatusCodes.OK).json({
      success: true,
      data: incomes,
    });
  } catch (err: any) {
    next(err);
  }
});

income.get("/get-by-id/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const income = await Income.findById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: income,
    });
  } catch (err: any) {
    next(err);
  }
});

income.post("/add", validateData(incomeZod), async (req, res, next) => {
  try {
    const payload = req.body;
    const income = await Income.create(payload);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: income,
    });
  } catch (err: any) {
    next(err);
  }
});

income.patch(
  "/edit/:id",
  validateData(incomeZod.partial()),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const payload = req.body;
      const income = await Income.findByIdAndUpdate(id, payload);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: income,
      });
    } catch (err: any) {
      next(err);
    }
  },
);

income.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const income = await Income.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: income,
    });
  } catch (err: any) {
    next(err);
  }
});

export default income;
