import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { validate } from "../utils/zod-validator";
import { Expenses } from "../models/expense";
import { ExpensesType, expensesZod } from "../types/expenses-zod";
import { Dashboard } from "../models/dashboard";

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

expenses.post("/add", validate(expensesZod), async (req, res, next) => {
  try {
    const payload: ExpensesType = req.body;
    const expense = await Expenses.create(payload);

    if (expense) {
      const dashboard = await Dashboard.findOne({});

      if (!dashboard) {
        await Dashboard.create({
          total_expense: expense.amount,
          total_income: 0,
        });
      } else {
        await Dashboard.findOneAndUpdate(
          {},
          {
            $inc: { total_expense: expense.amount },
          },
        );
      }
    }

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
  validate(expensesZod.partial()),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const payload: Partial<ExpensesType> = req.body;
      const expense = await Expenses.findByIdAndUpdate(id, payload);

      if (expense) {
        await Dashboard.findOneAndUpdate(
          {},
          {
            $inc: {
              total_expense:
                (payload.amount as number) - (expense.amount as number),
            },
          },
        );
      }

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

    if (expense) {
      await Dashboard.findOneAndUpdate(
        {},
        {
          $inc: {
            total_expense: -(expense.amount as number),
          },
        },
      );
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: expense,
    });
  } catch (err: any) {
    next(err);
  }
});

export default expenses;
