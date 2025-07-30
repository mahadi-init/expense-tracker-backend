import { Request, Response } from "express";
import { Seller } from "../model/seller.model";
import { Admin } from "../model/admin.model";
import { generateToken } from "../utils/token";

export class AuthRequest {
  signup = async (req: Request, res: Response) => {
    try {
      const data = await Seller.create(req.body);

      res.status(200).json({
        success: true,
        data: data
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  login = async (req: Request, res: Response) => {
    try {
      let data;
      let role

      try {
        data = await Seller.findOne({ phone: req.body.phone });
        role = "SELLER"

        if (!data) {
          throw new Error("No seller found")
        }
      } catch (err: any) {
        data = await Admin.findOne({ phone: req.body.phone });
        role = "ADMIN"
      }

      if (!data) {
        throw new Error("No account found");
      }

      if (req.body.password === data.password) {
        const token = generateToken({
          id: data._id.toString(),
          role: role
        });

        return res.status(200).json({
          success: true,
          data: data,
          token: token,
          role: role
        });
      } else {
        throw new Error("Wrong password");
      }

    } catch (err: any) {
      res.status(400).json({
        success: false,
        message: err.message
      });
    }
  };
}