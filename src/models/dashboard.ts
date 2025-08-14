import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    total_income: Number,
    total_expense: Number,
  },
  {
    timestamps: true,
  },
);

export const Dashboard = mongoose.model("Dashboard", schema);
