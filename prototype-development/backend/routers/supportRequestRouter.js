import { Router } from "express";
import { contactSupport } from "../controllers/supportController.js";
import { validateInputSupport } from "../middleware/validationMiddleware.js";

const router = Router();

//user review routes
router.post("/contact", validateInputSupport, contactSupport);

export default router;
