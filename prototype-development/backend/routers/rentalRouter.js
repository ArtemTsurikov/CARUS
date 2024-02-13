import { Router } from "express";
import { getOneRentalById, getCarRentalsFiltered } from "../controllers/rentalController.js";

const router = Router();

//user review routes
router.get("/:_id", getOneRentalById);
//user review routes
router.post("/getCarRentalsFiltered", getCarRentalsFiltered);

export default router;
