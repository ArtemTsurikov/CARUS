import { Router } from "express";

import {
  createPackage,
  deletePackage,
  getInsuranceByName,
  getInsuranceById
} from "../controllers/insuranceController.js";
import { validateInsuranceInput } from "../middleware/validationMiddleware.js";

const router = Router();

//user review routes
router.post("/createPackage", validateInsuranceInput, createPackage);
router.get("/deletePackage", deletePackage);
router.get("/:_id", getInsuranceById)
router.get("/byName/:name", getInsuranceByName);


export default router;
