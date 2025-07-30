import { Router } from "express";
import { Admin } from "../model/admin.model";
import { AdminRequest } from "../controller/admin.controller";

const router = Router();
const handler = new AdminRequest(Admin);

router.get("/all", handler.getAllData);

router.get("/get/:id", handler.getSingleData);

router.post("/add", handler.addData);

router.patch("/edit/:id", handler.updateData);

router.delete("/delete/:id", handler.deleteData);

export default router;
