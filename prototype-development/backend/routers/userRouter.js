import express from "express";
import multer from "multer";
import * as fs from "fs";

import "../errors/customErrors.js";
import {
  logout,
  updateUser,
  updatePassword,
  updatePaymentDetails,
  updateProfilePicture,
  updateTitlePicture,
  updateIDPicture,
  deleteProfilePicture,
  deleteTitlePicture,
  deleteUser,
  getOneUserById,
  getProfilePicture,
  getTitlePicture,
  updateDrivingLicensePicture,
  updateDrivingLicenseStatus,
  updateIdentityCardStatus,
  getUserNameById,
  getUserRatingScore,
} from "../controllers/userController.js";
import {
  validateUpdateUserInput,
  validateUpdateEmailInput,
  validateUpdatePasswordInput,
  validateUpdateDrivingLicenseStatus,
  validateUpdateIdentityCardStatus,
} from "../middleware/validationMiddleware.js";
import { BadRequestError } from "../errors/customErrors.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const Id = req.user.userID;
    const dest = `public/images/${Id}`;
    fs.mkdirSync(dest, { recursive: true });
    cb(null, dest);
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
router.get("/getUserNameById/:userID", getUserNameById);
router.get("/getUserRatingScore/:userID", getUserRatingScore);
router.get("/logout", logout);
router.get("/getProfilePicture/:userID", getProfilePicture);
router.get("/getTitlePicture/:userID", getTitlePicture);
router.get("/getUser/:userID", getOneUserById);
router.post("/update", [validateUpdateUserInput, updateUser]);
router.post("/updatePassword", [validateUpdatePasswordInput, updatePassword]);
router.post("/updatePayment", updatePaymentDetails);
router.post("/uploadProfilePicture", [
  upload.single("profilePicture"),
  updateProfilePicture,
]);
router.post("/uploadTitlePicture", [
  upload.single("titlePicture"),
  updateTitlePicture,
]);

router.post("/uploadIdentityCardPictures", [
  upload.array("identityCardPicture"),
  updateIDPicture,
]);
router.post("/uploadDrivingLicencePictures", [
  upload.array("drivingLicensePicture"),
  updateDrivingLicensePicture,
]);
router.get("/deleteProfilePicture", deleteProfilePicture);
router.get("/deleteTitlePicture", deleteTitlePicture);
router.get("/deleteUser", deleteUser);
router.patch("/updateDrivingLicenseStatus", [
  validateUpdateDrivingLicenseStatus,
  updateDrivingLicenseStatus,
]);
router.patch("/updateIdentityCardStatus", [
  validateUpdateIdentityCardStatus,
  updateIdentityCardStatus,
]);

export default router;
