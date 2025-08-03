import z from "zod";

export const userZod = z.object({
  username: z.string(),
  email: z.email(),
  password: z.string().min(6, "minimum 6 characters required"),
});
