import { Router } from "express";

import {
  reviewUser,
  updateUserReview,
  deleteUserReview,
  getAllUserReviews,
  getAllUserReviewsByUserId,
  getAllCarReviewsByCarId,
} from "../controllers/userReviewController.js";
import {
  reviewCar,
  updateCarReview,
  deleteCarReview,
  getAllCarReviews
} from "../controllers/carReviewController.js";
import {
  validateReviewInput,
  validateUpdateReviewInput,
} from "../middleware/validationMiddleware.js";

const router = Router();

//user review routes
router.post("/reviewUser", validateReviewInput, reviewUser);
router.patch("/updateUserReview", validateUpdateReviewInput, updateUserReview);
router.get("/deleteUserReview", deleteUserReview);
router.get("/getAllUserReviews/:userID", getAllUserReviews);
router.get("/getAllUserReviewsByUserID/:userID", getAllUserReviewsByUserId);
router.get("/getAllUserReviewsByCarID/:carID", getAllCarReviewsByCarId);

//car review routes
router.post("/reviewCar", validateReviewInput, reviewCar);
router.patch("/updateCarReview", validateUpdateReviewInput, updateCarReview);
router.get("/getAllCarReviews/:carID", getAllCarReviews); //use delete instead of get
router.get("/deleteCarReview", deleteCarReview); //use delete instead of get

export default router;
