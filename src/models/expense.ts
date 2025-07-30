import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    amount: Number,
    category: String,
    date: String,
    note: String,
  },
  {
    timestamps: true,
  },
);

export const Expense = mongoose.model("Expense", schema);
