import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Income } from "../models/income";
import { validate } from "../utils/zod-validator";
import { IncomeType, incomeZod } from "../types/income-zod";
import { Dashboard } from "../models/dashboard";

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

income.post("/add", validate(incomeZod), async (req, res, next) => {
  try {
    const payload: IncomeType = req.body;
    const income = await Income.create(payload);

    if (income) {
      const dashboard = await Dashboard.findOne({});

      if (!dashboard) {
        await Dashboard.create({
          total_income: income.amount,
          total_expense: 0,
        });
      } else {
        await Dashboard.findOneAndUpdate(
          {},
          {
            $inc: { total_income: income.amount },
          },
        );
      }
    }

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
  validate(incomeZod.partial()),
  async (req, res, next) => {
    try {
      const id = req.params.id;
      const payload: Partial<IncomeType> = req.body;
      const income = await Income.findByIdAndUpdate(id, payload);

      if (income) {
        await Dashboard.findOneAndUpdate(
          {},
          {
            $inc: {
              total_income:
                (payload.amount as number) - (income.amount as number),
            },
          },
        );
      }

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

    if (income) {
      await Dashboard.findOneAndUpdate(
        {},
        {
          $inc: {
            total_income: -(income.amount as number),
          },
        },
      );
    }

    return res.status(StatusCodes.OK).json({
      success: true,
      data: income,
    });
  } catch (err: any) {
    next(err);
  }
});

export default income;
