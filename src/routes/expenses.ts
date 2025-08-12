import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { validateData } from "../utils/zod-validator";
import { Expenses } from "../models/expense";
import { expensesZod } from "../types/expenses-zod";

const expenses = Router();

expenses.get("/get-all", async (_, res, next) => {
  try {
    const expenses = await Expenses.find({});

    return res.status(StatusCodes.OK).json({
      success: true,
      data: expenses,
    });
  } catch (err: any) {
    next(err);
  }
});

expenses.get("/get-by-id/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const expense = await Expenses.findById(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: expense,
    });
  } catch (err: any) {
    next(err);
  }
});

expenses.post("/add", validateData(expensesZod), async (req, res, next) => {
  try {
    const payload = req.body;
    const expense = await Expenses.create(payload);

    return res.status(StatusCodes.CREATED).json({
      success: true,
      data: expense,
    });
  } catch (err: any) {
    next(err);
  }
});

expenses.patch(
  "/edit/:id",
  validateData(expensesZod.partial()),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const payload = req.body;
      const expense = await Expenses.findByIdAndUpdate(id, payload);

      return res.status(StatusCodes.CREATED).json({
        success: true,
        data: expense,
      });
    } catch (err: any) {
      next(err);
    }
  },
);

expenses.delete("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const expense = await Expenses.findByIdAndDelete(id);

    return res.status(StatusCodes.OK).json({
      success: true,
      data: expense,
    });
  } catch (err: any) {
    next(err);
  }
});

export default expenses;
