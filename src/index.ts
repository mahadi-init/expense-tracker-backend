import "dotenv/config";
import express from "express";
import connectDB from "./lib/db";
import secrets from "./lib/secret";
import middleware from "./middleware";
import routes from "./routes";
import { Request, Response, NextFunction } from "express";
import { AppError } from "./types/app-error";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { formatErrorMessage } from "./utils/formatted-errors";

const app = express();

// port
const PORT = secrets.port;

// root route
app.get("/", (_, res, next) => {
  res.json({
    success: true,
    message: "Welcome To The API",
  });

  next();
});

// connect to database
connectDB();

// implement middleware
app.use(middleware);

// define routes
app.use("/api", routes);

// Global Error Handler Middleware
app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  // zod error catch
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: formatErrorMessage(err.message),
    });
  }

  // Determine status code
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message: message,
  });
});

// listen to port
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

export default app;
