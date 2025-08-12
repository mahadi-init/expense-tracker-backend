import z from "zod";

export const incomeZod = z.object({
  amount: z.number(),
  source: z.string(),
  date: z.string().optional(),
  note: z.string().optional(),
});
