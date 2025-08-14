import { Router } from "express";
import { StatusCodes } from "http-status-codes";
import { Dashboard } from "../models/dashboard";
import { Income } from "../models/income";
import { Expenses } from "../models/expense";
import { getDateRange } from "../utils/get-date-range";

const dashboard = Router();

dashboard.get("/info", async (_, res, next) => {
  try {
    const dashboard = await Dashboard.findOne({});

    return res.status(StatusCodes.OK).json({
      success: true,
      data: dashboard,
    });
  } catch (err: any) {
    next(err);
  }
});

dashboard.get("/stats", async (_, res, next) => {
  try {
    const { start: monthStart, end: monthEnd } = getDateRange("month");
    const { start: dayStart, end: dayEnd } = getDateRange("day");

    const [monthlyIncome, monthlyExpenses, dailyIncome, dailyExpenses, total] =
      await Promise.all([
        Income.aggregate([
          { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Expenses.aggregate([
          { $match: { createdAt: { $gte: monthStart, $lte: monthEnd } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Income.aggregate([
          { $match: { createdAt: { $gte: dayStart, $lte: dayEnd } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        Expenses.aggregate([
          { $match: { createdAt: { $gte: dayStart, $lte: dayEnd } } },
          { $group: { _id: null, total: { $sum: "$amount" } } },
        ]),
        await Dashboard.findOne({}),
      ]);

    const monthlyIncomeTotal = monthlyIncome[0]?.total || 0;
    const monthlyExpensesTotal = monthlyExpenses[0]?.total || 0;
    const dailyIncomeTotal = dailyIncome[0]?.total || 0;
    const dailyExpensesTotal = dailyExpenses[0]?.total || 0;

    const data = {
      month: monthStart?.toLocaleString("default", { month: "long" }),
      day: dayStart?.toISOString().split("T")[0],

      monthlyDashboard: {
        income: monthlyIncomeTotal,
        expenses: monthlyExpensesTotal,
        net: monthlyIncomeTotal - monthlyExpensesTotal,
      },

      dailyDashboard: {
        income: dailyIncomeTotal,
        expenses: dailyExpensesTotal,
        net: dailyIncomeTotal - dailyExpensesTotal,
      },

      monthlyCost: monthlyExpensesTotal,
      dailyCost: dailyExpensesTotal,
      total: total,
    };

    res.status(StatusCodes.OK).json({
      success: true,
      data: data,
    });
  } catch (error) {
    next(error);
  }
});

export default dashboard;
