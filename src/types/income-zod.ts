import z from "zod";

export const incomeZod = z.object({
  amount: z.number().min(1, "Invalid input"),
  source: z.string(),
  date: z.string().optional(),
  note: z.string().optional(),
});

export type IncomeType = z.infer<typeof incomeZod>;
