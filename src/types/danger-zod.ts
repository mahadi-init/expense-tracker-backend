import z from "zod";

export const deleteZod = z.object({
  deletes: z.array(z.string()),
});

export type DeleteType = z.infer<typeof deleteZod>;
