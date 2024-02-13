import { Router } from "express";
import {
  validateCarRequestInput,
  validateUpdateCarRequestInput,
  validateDeterminePriceInput,
  validateCarRequestCheckoutSessionInput
} from "../middleware/validationMiddleware.js";
import {
  createCarRequest,
  updateCarRequestStatus,
  cancelCarRequest,
  determinePrice,
  createPaymentcheckoutSession,
  getCarRequestById,
  getCarRequestsFiltered,
  updateCarRequest
} from "../controllers/carRequestController.js";

const router = Router();


router.post("/getCarRequestsFiltered", getCarRequestsFiltered);
router.get("/:_id", getCarRequestById)
router.post("/createRequest", validateCarRequestInput, validateCarRequestCheckoutSessionInput, createCarRequest);
router.post(
  "/updateRequestStatus",
  validateUpdateCarRequestInput,
  updateCarRequestStatus
);
router.post(
  "/updateRequest",
  validateUpdateCarRequestInput,
  updateCarRequest
);
router.get("/cancelRequest/:_id", cancelCarRequest);
router.post("/create-checkout-session", validateCarRequestInput, createPaymentcheckoutSession);
router.post("/determinePrice", validateDeterminePriceInput, determinePrice);

export default router;
