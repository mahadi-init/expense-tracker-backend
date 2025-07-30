import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    total_income: Number,
    total_expense: Number,
    current_balance: Number,
  },
  {
    timestamps: true,
  },
);

export const Dashboard = mongoose.model("Dashboard", schema);
