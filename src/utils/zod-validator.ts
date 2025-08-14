import { NextFunction, Request, Response } from "express";
import { z } from "zod";

export function validate(schema: z.ZodObject<any, any>) {
  return (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
}
