import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import connectDB from "./lib/db";

const app = express();

//middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    allowedHeaders: [
      "Content-Type",
      "Origin",
      "Authorization",
      "Accept",
      "X-Requested-With",
      "Access-Control-Allow-Origin",
    ],
  }),
);
app.use(cookieParser());
app.use(express.json());
app.use(morgan(":method :url"));

// reconnect database
app.use((_, res, next) => {
  try {
    const mongoStatus = mongoose.connection.readyState;

    switch (mongoStatus) {
      case 0:
        connectDB();
        throw new Error("database connection failed. Reconnecting...");
      default:
        next();
    }
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

export default app;
