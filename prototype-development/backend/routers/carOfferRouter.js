import { Router } from "express";
import {
  validateCreateCarOfferInput,
  validateUpdateCarOfferInput,
  validateDeleteCarOfferInput,
} from "../middleware/validationMiddleware.js";
import {
  getOneCarOfferById,
  createCarOffer,
  updatedcarOffer,
  getMyCarOffersByUserAndCar,
  getMyCarOffersByUser,
  deleteCarOffer,
  getMyCarOffersByCar,
  getMyCarOffersSearch,
} from "../controllers/carOfferController.js";

const router = Router();

router.post("/getMyCarOffersSearch", getMyCarOffersSearch);
router.post("/getMyCarOffersByUserAndCar", getMyCarOffersByUserAndCar);
router.post("/getMyCarOffersByUser", getMyCarOffersByUser);
router.post("/createOffer", validateCreateCarOfferInput, createCarOffer);
router.post("/updateOffer/:_id", validateUpdateCarOfferInput, updatedcarOffer);
router.post("/getCarOffersByCar", getMyCarOffersByCar);
router.delete("/:_id", validateDeleteCarOfferInput, deleteCarOffer);
router.get("/:_id", getOneCarOfferById);

export default router;