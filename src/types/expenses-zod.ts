import z from "zod";

export const expensesZod = z.object({
  amount: z.number(),
  source: z.string(),
  date: z.string().optional(),
  note: z.string().optional(),
});

export type ExpensesType = z.infer<typeof expensesZod>;
