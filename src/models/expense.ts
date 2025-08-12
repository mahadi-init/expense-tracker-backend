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

export const Expenses = mongoose.model("Expenses", schema);
