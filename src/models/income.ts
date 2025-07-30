import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    amount: Number,
    source: String,
    date: String,
    note: String,
  },
  {
    timestamps: true,
  },
);

export const Income = mongoose.model("Income", schema);
