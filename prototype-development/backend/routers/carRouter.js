import express from "express";
import multer from "multer";
import * as fs from "fs";

import "../errors/customErrors.js";
import {
  addCar,
  updateCarPicture,
  updateCar,
  deleteCarPicture,
  updateCarTitlePicture,
  getCarTitlePicture,
  deleteCarTitlePicture,
  deleteCar,
  fetchCars,
  fetchCarAttributes,
  getOneCarById,
  fetchCarTypes,
  updateCarOwnershipVerification,
  getAllUserCars,
  updateCarOwnership,
  getCarPictures,
  getAllCarsByUserId,
} from "../controllers/carController.js";
import {
  validateAddCarInput,
  validateUpdateCarInput,
  validateInputCarOwnership,
} from "../middleware/validationMiddleware.js";
import { BadRequestError } from "../errors/customErrors.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const UserId = req.user.userID;
    const CarId = req.body.carID;
    if (CarId) {
      const dest = `public/images/${UserId}/Cars/${CarId}`;
      fs.mkdirSync(dest, { recursive: true });
      cb(null, dest);
    } else {
      return cb(new BadRequestError("Car ID not found"));
    }
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new BadRequestError("File not accepted"));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
    files: 10, //max ten files can be uploaded at the same time
  },
  storage: storage,
});
router.get("/getCarAttributes", fetchCarAttributes);
router.get("/getCarTypes", fetchCarTypes);
router.get("/getCarsForUserID/:_id", fetchCars);
router.get("/getCar/:_id", getOneCarById);
router.get("/getAllUserCars", getAllUserCars);
router.get("/getCarPictures/:carID/:pictureIndex", getCarPictures);
router.get("/getCarTitlePicture/:carID", getCarTitlePicture);
router.get("/getAllCarsByUserId/:userID", getAllCarsByUserId);
router.post("/addCar", [validateAddCarInput, addCar]);
router.post("/uploadCarTitlePicture", [
  upload.single("carTitlePicture"),
  updateCarTitlePicture,
]);
router.post("/uploadCarPictures", [
  upload.array("carPictures"),
  updateCarPicture,
]);
router.post("/updateCar", [validateUpdateCarInput, updateCar]);
router.post("/updateCarVerification", [
  upload.array("carOwnership"),
  updateCarOwnershipVerification,
]);
router.patch("/validateCarOwnership", [
  validateInputCarOwnership,
  updateCarOwnership,
]);
router.delete("/deleteCarTitlePicture/:carID", deleteCarTitlePicture);
router.delete("/deleteCarPicture/:carID/:index", deleteCarPicture);
router.delete("/deleteCar/:carID", deleteCar);

export default router;
