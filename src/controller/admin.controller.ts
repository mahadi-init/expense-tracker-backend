import { Request, Response } from "express";
import mongoose from "mongoose";
import { SharedRequest } from "../helpers/SharedRequest";

export class AdminRequest extends SharedRequest {
  constructor(model: typeof mongoose.Model) {
    super(model);
  }
}
