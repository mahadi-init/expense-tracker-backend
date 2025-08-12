import z from "zod";

export const expensesZod = z.object({
  amount: z.number(),
  category: z.string(),
  date: z.string().optional(),
  note: z.string().optional(),
});
