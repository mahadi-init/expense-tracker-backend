import z from "zod";

export const userZod = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string(),
});
