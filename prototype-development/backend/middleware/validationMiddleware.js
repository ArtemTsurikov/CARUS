import { body, param, validationResult } from "express-validator";

import {
  PAYMENT,
  CAR_TYPE,
  FUEL_TYPE,
  TRANSMISSION_TYPE,
  DRIVINGLICENSE,
  CAR_BRAND,
  COUNTRY,
  BROKER_COMMISSION,
  CAR_REQUEST_STATUS,
  AVERAGE_RANGES,
  ROLE,
  VERIFICATION_STATUS,
} from "../utils/constants.js";
import { BadRequestError } from "../errors/customErrors.js";
import User from "../models/userModel.js";
import Car from "../models/carModel.js";
import CarOffer from "../models/carOfferModel.js";
import CarRequest from "../models/carRequestModel.js";
import Insurance from "../models/insuranceModel.js";

const withValidationErrors = (validateFn) => {
  return [
    validateFn,
    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        throw new BadRequestError(errorMessages);
      }
      next();
    },
  ];
};

//AUTHENTICATION:

const validateRegisterInput = withValidationErrors([
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters long")
    .trim(),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters long")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("address.street")
    .notEmpty()
    .withMessage("Street name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Street must be between 2 and 50 characters long")
    .trim(),
  body("address.houseNumber")
    .notEmpty()
    .withMessage("Housenumber is required")
    .isLength({ max: 10 })
    .withMessage("Housenumber must be between 2 and 10 characters long")
    .trim(),
  body("address.zipCode")
    .notEmpty()
    .withMessage("ZIP code is required")
    .isNumeric()
    .withMessage("ZIP code must be a number")
    .isLength({ min: 5, max: 5 }) //might have to change when using other countries zip codes
    .withMessage("ZIP code must be 5 characters long")
    .trim(),
  body("address.city")
    .notEmpty()
    .withMessage("City is required")
    .isLength({ max: 50 })
    .withMessage("City must be not linger as 50 characters")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        throw new Error("Email already exists");
      }
      return true;
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 12 })
    .withMessage("Password must be at least 8 characters long"),
  //check input for for unallowed values
  body("creationDate")
    .optional()
    .isEmpty()
    .withMessage("Creation date is not allowed to be set manually"),
  body("address.country")
    .optional()
    .isEmpty()
    .withMessage("Country is not allowed to be set manually"), // can be changed once other courntires will be added
  body("address.latitude")
    .optional()
    .isEmpty()
    .withMessage("Latitude is not allowed to be set manually"),
  body("address.longitude")
    .optional()
    .isEmpty()
    .withMessage("Longitude is not allowed to be set manually"),
  body("phoneNumber")
    .optional()
    .isEmpty()
    .withMessage("Phone number can be added once profile is created"),
  body("paymentDetails")
    .optional()
    .isEmpty()
    .withMessage("Payment details can be added once profile is created"),
  body("profilePicture")
    .optional()
    .isEmpty()
    .withMessage("Profile picture can be added once profile is created"),
  body("titlePicture")
    .optional()
    .isEmpty()
    .withMessage("Title picture can be added once profile is created"),
  body("description")
    .optional()
    .isEmpty()
    .withMessage("Description can be added once profile is created"),
  body("rating")
    .optional()
    .isEmpty()
    .withMessage("Rating cannot be set manually"),
  body("ratingSum")
    .optional()
    .isEmpty()
    .withMessage("Rating sum cannot be set manually"),
  body("numberOfRatings")
    .optional()
    .isEmpty()
    .withMessage("Number of ratings cannot be set manually"),
  body("numberOfRentals")
    .optional()
    .isEmpty()
    .withMessage("Number of rentals cannot be set manually"),
  body("identityCardPictures")
    .optional()
    .isEmpty()
    .withMessage("Identity card pictures can be added once profile is created"),
  body("drivingLicensePictures")
    .optional()
    .isEmpty()
    .withMessage(
      "Driving license pictures can be added once profile is created"
    ),
  body("drivingLicenseClasses")
    .optional()
    .isEmpty()
    .withMessage("Driving license classes cannot be set manually"),
  body("ownedCars")
    .optional()
    .isEmpty()
    .withMessage("Owned cars cannot be set manually"),
  body("writtenUserReviews")
    .optional()
    .isEmpty()
    .withMessage("Written user reviews cannot be set manually"),
  body("receivedUserReviews")
    .optional()
    .isEmpty()
    .withMessage("Received user reviews cannot be set manually"),
  body("writtenCarReviews")
    .optional()
    .isEmpty()
    .withMessage("Written car reviews cannot be set manually"),
  body("rentalsAsSharer")
    .optional()
    .isEmpty()
    .withMessage("Rentals as sharer cannot be set manually"),
  body("rentalsAsBorrower")
    .optional()
    .isEmpty()
    .withMessage("Rentals as borrower cannot be set manually"),
  body("carOffers")
    .optional()
    .isEmpty()
    .withMessage("Car offers cannot be set manually"),
  body("createdCarRequests")
    .optional()
    .isEmpty()
    .withMessage("Created car requests cannot be set manually"),
  body("receivedCarRequests")
    .optional()
    .isEmpty()
    .withMessage("Received car requests cannot be set manually"),
  body("role").optional().isEmpty().withMessage("Role cannot be set manually"),
  body("identityCardStatus")
    .optional()
    .isEmpty()
    .withMessage("Identity card status cannot be set manually"),
  body("drivingLicenseStatus")
    .optional()
    .isEmpty()
    .withMessage("Driving license status cannot be set manually"),
]);

const validateLoginInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
]); // no other validation needed, because no record is created or updated

const validatePasswordResetInput = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
]);

//USER

const validateUpdateUserInput = withValidationErrors([
  //TODO: add param validation
  body("firstName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters long")
    .trim(),
  body("lastName")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters long")
    .trim(),
  body("address.street")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Street must be between 2 and 50 characters long")
    .trim(),
  body("address.houseNumber")
    .optional()
    .isLength({ max: 10 })
    .withMessage("Housenumber must be between 2 and 10 characters long")
    .trim(),
  body("address.zipCode")
    .optional() //check is isPostalCode() accepts german zip codes
    .isNumeric()
    .withMessage("ZIP code must be a number")
    .isLength({ min: 5, max: 5 }) //might have to change when using other countries zip codes
    .withMessage("ZIP code must be 5 characters long")
    .trim(),
  body("address.city")
    .optional()
    .isLength({ max: 50 })
    .withMessage("City must be not longer as 50 characters")
    .trim(),
  body("phoneNumber")
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage("This is not a phone number"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be not linger as 500 characters")
    .trim(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error("email already exists");
      }
      return true;
    }),
  //check input for for unallowed values
  body("creaationDate")
    .optional()
    .isEmpty()
    .withMessage("Creation date is not allowed to be set manually"),
  body("password")
    .optional()
    .isEmpty()
    .withMessage("Password can be changed in different method"),
  body("address.country")
    .optional()
    .isEmpty()
    .withMessage("Country is not allowed to be set manually"), // can be change once other courntires will be added
  body("address.latitude")
    .optional()
    .isEmpty()
    .withMessage("Latitude is not allowed to be set manually"),
  body("address.longitude")
    .optional()
    .isEmpty()
    .withMessage("Longitude is not allowed to be set manually"),
  body("paymentDetails")
    .optional()
    .isEmpty()
    .withMessage("Payment details can be added once profile is created"),
  body("profilePicture")
    .optional()
    .isEmpty()
    .withMessage("Profile picture can be added once profile is created"),
  body("titlePicture")
    .optional()
    .isEmpty()
    .withMessage("Title picture can be added once profile is created"),
  body("rating")
    .optional()
    .isEmpty()
    .withMessage("Rating cannot be set manually"),
  body("ratingSum")
    .optional()
    .isEmpty()
    .withMessage("Rating sum cannot be set manually"),
  body("numberOfRatings")
    .optional()
    .isEmpty()
    .withMessage("Number of ratings cannot be set manually"),
  body("numberOfRentals")
    .optional()
    .isEmpty()
    .withMessage("Number of rentals cannot be set manually"),
  body("identityCardPictures")
    .optional()
    .isEmpty()
    .withMessage("Identity card pictures can be added once profile is created"),
  body("drivingLicensePictures")
    .optional()
    .isEmpty()
    .withMessage(
      "Driving license pictures can be added once profile is created"
    ),
  body("drivingLicenseClasses") //will be set by admin after verification of identity card and driving license
    .optional()
    .isEmpty()
    .withMessage("Driving license classes cannot be set manually"),
  body("ownedCars")
    .optional()
    .isEmpty()
    .withMessage("Owned cars cannot be set manually"),
  body("writtenUserReviews")
    .optional()
    .isEmpty()
    .withMessage("Written user reviews cannot be set manually"),
  body("receivedUserReviews")
    .optional()
    .isEmpty()
    .withMessage("Received user reviews cannot be set manually"),
  body("writtenCarReviews")
    .optional()
    .isEmpty()
    .withMessage("Written car reviews cannot be set manually"),
  body("rentalsAsSharer")
    .optional()
    .isEmpty()
    .withMessage("Rentals as sharer cannot be set manually"),
  body("rentalsAsBorrower")
    .optional()
    .isEmpty()
    .withMessage("Rentals as borrower cannot be set manually"),
  body("carOffers")
    .optional()
    .isEmpty()
    .withMessage("Car offers cannot be set manually"),
  body("createdCarRequests")
    .optional()
    .isEmpty()
    .withMessage("Created car requests cannot be set manually"),
  body("receivedCarRequests")
    .optional()
    .isEmpty()
    .withMessage("Received car requests cannot be set manually"),
  body("role").optional().isEmpty().withMessage("Role cannot be set manually"),
  body("identityCardStatus")
    .optional()
    .isEmpty()
    .withMessage("Identity card status cannot be set manually"),
  body("drivingLicenseStatus")
    .optional()
    .isEmpty()
    .withMessage("Driving license status cannot be set manually"),
]);

const validateUpdateEmailInput = withValidationErrors([
  //TODO: add param validation
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("invalid email format")
    .custom(async (email, { req }) => {
      const user = await User.findOne({ email });
      if (user && user._id.toString() !== req.user.userId) {
        throw new Error("email already exists");
      }
      return true;
    }),
  // no other validation needed as only email is updated
]);

const validateUpdatePasswordInput = withValidationErrors([
  //TODO: add param validation
  //here an password API might help to validate the input e.g., zxcvbn
  //also a confirmation password field might be added
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .trim()
    .isLength({ min: 12 })
    .withMessage("Password must be at least 8 characters long"),
  // no other validation needed as only password is updated
]);

const validateUpdateDrivingLicenseStatus = withValidationErrors([
  body("userID")
    .notEmpty()
    .withMessage("User ID is required")
    .custom(async (value, { req }) => {
      //check if user exists
      const user = await User.findById(value);
      if (!user) {
        throw new Error("User does not exist");
      }
      //check if req.user is admin
      const admin = await User.findById(req.user.userID);
      if (admin.role !== ROLE.ADMIN) {
        throw new Error("Only admins can update driving license");
      }
      return true;
    }),
  body("drivingLicenseClasses")
    .notEmpty()
    .withMessage("Driving license classes are required")
    .isArray()
    .withMessage("Driving license classes must be an array")
    .custom((classes) => {
      if (classes.length === 0) {
        throw new Error("Driving license classes must not be empty");
      }
      return true;
    })
    .custom((classes) => {
      const invalidClasses = classes.filter(
        (c) => !Object.values(DRIVINGLICENSE).includes(c)
      );
      if (invalidClasses.length > 0) {
        throw new Error(
          `Invalid driving license classes: ${invalidClasses.join(", ")}`
        );
      }
      return true;
    }),
  body("drivingLicenseStatus")
    .notEmpty()
    .withMessage("Driving license status is required")
    .isIn(Object.values(VERIFICATION_STATUS))
    .withMessage("Invalid driving license status"),
]);

const validateUpdateIdentityCardStatus = withValidationErrors([
  body("userID")
    .notEmpty()
    .withMessage("User ID is required")
    .custom(async (value, { req }) => {
      //check if user exists
      const user = await User.findById(value);
      if (!user) {
        throw new Error("User does not exist");
      }
      //check if req.user is admin
      const admin = await User.findById(req.user.userID);
      if (admin.role !== ROLE.ADMIN) {
        throw new Error("Only admins can update identity card");
      }
      return true;
    }),
  body("identityCardStatus")
    .notEmpty()
    .withMessage("Identity card status is required")
    .isIn(Object.values(VERIFICATION_STATUS))
    .withMessage("Invalid identity card status"),
]);

//CAR:

const validateAddCarInput = withValidationErrors([
  //TODO: add param validation
  body("carBrand")
    .notEmpty()
    .withMessage("Car brand is required")
    .isIn(Object.values(CAR_BRAND))
    .withMessage("Invalid car brand"),
  body("carModel")
    .notEmpty()
    .withMessage("Car model is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Car model must be between 2 and 50 characters long")
    .trim(),
  body("averageRange") //Why is this important?
    .notEmpty()
    .withMessage("Average range is required")
    .isIn(Object.values(AVERAGE_RANGES))
    .withMessage("Invalid average range"),
  body("maxNumberPassengers")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Max number of passengers must be between 1 and 20"),
  body("carType")
    .notEmpty()
    .withMessage("Car type is required")
    .isIn(Object.values(CAR_TYPE))
    .withMessage("Invalid car type"),
  body("fuelType")
    .notEmpty()
    .withMessage("Fuel type is required")
    .isIn(Object.values(FUEL_TYPE))
    .withMessage("Invalid fuel type"),
  body("transmissionType")
    .notEmpty()
    .withMessage("Transmission type is required")
    .isIn(Object.values(TRANSMISSION_TYPE))
    .withMessage("Invalid transmission type"),
  body("drivingLicense")
    .notEmpty()
    .withMessage("Driving license is required")
    .isIn(Object.values(DRIVINGLICENSE))
    .withMessage("Invalid driving license"),
  //reject all other values
  body("description")
    .optional()
    .isEmpty()
    .withMessage("Description can be set set once the car is added"),
  body("numberOfRentals")
    .optional()
    .isEmpty()
    .withMessage("Number of rentals cannot be set manually"),
  body("location.zipCode")
    .optional()
    .isEmpty()
    .withMessage("Zip code can be set set once the car is addedy"),
  body("location.city")
    .optional()
    .isEmpty()
    .withMessage("City can be set set once the car is added"),
  body("location.street")
    .optional()
    .isEmpty()
    .withMessage("Street can be set set once the car is added"),
  body("rating")
    .optional()
    .isEmpty()
    .withMessage("Rating cannot be set manually"),
  body("ratingSum")
    .optional()
    .isEmpty()
    .withMessage("Rating sum cannot be set manually"),
  body("numberOfRatings")
    .optional()
    .isEmpty()
    .withMessage("Number of ratings cannot be set manually"),
  body("carTitlePicture")
    .optional()
    .isEmpty()
    .withMessage("Car title picture can be set set once the car is added"),
  body("carPictures")
    .optional()
    .isEmpty()
    .withMessage("Car pictures can be added once car is created"),
  body("petFriendly")
    .optional()
    .isEmpty()
    .withMessage("Pet friendly can be set once car is created"),
  body("smokingFriendly")
    .optional()
    .isEmpty()
    .withMessage("Smoking friendly can be set once car is created"),
  body("carEquipment")
    .optional()
    .isEmpty()
    .withMessage("Car equipment can be set once car is created"),
  body("carOwnerships")
    .optional()
    .isEmpty()
    .withMessage("Car ownerships cannot be set manually"),
  body("licensePlateNumber")
    .optional()
    .isEmpty()
    .withMessage(
      "License plate number cannot be set manually. After you upload your documents, it will be set automatically"
    ),
  body("carOwenrshipVerificationStatus")
    .optional()
    .isEmpty()
    .withMessage("Car ownership verification status cannot be set manually"),
  body("owner")
    .optional()
    .isEmpty()
    .withMessage("Owner cannot be set manually"),
  body("carReviews")
    .optional()
    .isEmpty()
    .withMessage("Car reviews cannot be set manually"),
  body("carOffers")
    .optional()
    .isEmpty()
    .withMessage("Car offers cannot be set manually"),
  body("carRequests")
    .optional()
    .isEmpty()
    .withMessage("Car requests cannot be set manually"),
  body("carRentals")
    .optional()
    .isEmpty()
    .withMessage("Car rentals cannot be set manually"),
]);

const validateUpdateCarInput = withValidationErrors([
  //TODO: add param validation
  body("carModel")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Car model must be between 2 and 50 characters long")
    .trim(),
  body("carType")
    .optional()
    .isIn(Object.values(CAR_TYPE))
    .withMessage("Invalid car type"),
  body("fuelType")
    .optional()
    .isIn(Object.values(FUEL_TYPE))
    .withMessage("Invalid fuel type"),
  body("transmissionType")
    .optional()
    .isIn(Object.values(TRANSMISSION_TYPE))
    .withMessage("Invalid transmission type"),
  body("averageRange")
    .optional()
    .isIn(Object.values(AVERAGE_RANGES))
    .withMessage("Invalid average range"),
  body("description")
    .optional()
    .isLength({ max: 500 })
    .withMessage("Description must be not linger as 500 characters")
    .trim(),
  body("maxNumberPassengers")
    .optional()
    .isInt({ min: 1, max: 20 })
    .withMessage("Max number of passengers must be between 1 and 20"),
  body("petFriendly")
    .optional()
    .isBoolean()
    .withMessage("Pet friendly must be a boolean"),
  body("smokingFriendly")
    .optional()
    .isBoolean()
    .withMessage("Smoking friendly must be a boolean"),
  body("location.zipCode")
    .optional()
    .isNumeric()
    .withMessage("ZIP code must be a number")
    .isLength({ min: 5, max: 5 })
    .withMessage("ZIP code must be 5 characters long")
    .trim(),
  body("location.city")
    .optional()
    .isLength({ max: 50 })
    .withMessage("City must be not longer as 50 characters")
    .trim(),
  body("location.country")
    .optional()
    .isIn(Object.values(COUNTRY))
    .withMessage("Invalid country"),
  body("carEquipment")
    .optional()
    .isArray()
    .withMessage("Car equipment must be an array")
    .custom((value, { req }) => {
      const allowedValues = Object.values(CAR_EQUIPMENT);
      const invalidValues = value.filter(
        (item) => !allowedValues.includes(item)
      );
      if (invalidValues.length > 0) {
        throw new Error("Invalid car equipment");
      }
      return true;
    }),
  //reject invalid values
  body("carBrand")
    .optional()
    .isEmpty()
    .withMessage("Car brand cannot change once car is created"),
  body("numberOfRentals")
    .optional()
    .isEmpty()
    .withMessage("Number of rentals cannot be set manually"),
  body("rating")
    .optional()
    .isEmpty()
    .withMessage("Rating cannot be set manually"),
  body("ratingSum")
    .optional()
    .isEmpty()
    .withMessage("Rating sum cannot be set manually"),
  body("numberOfRatings")
    .optional()
    .isEmpty()
    .withMessage("Number of ratings cannot be set manually"),
  body("carTitlePicture")
    .optional()
    .isEmpty()
    .withMessage("Car title picture cannot be set manually"),
  body("carPictures")
    .optional()
    .isEmpty()
    .withMessage("Car pictures can be added once car is created"),
  body("drivingLicense")
    .optional()
    .isEmpty()
    .withMessage("Driving license cannot be set after car is created"),
  body("carOwnerships")
    .optional()
    .isEmpty()
    .withMessage("Car ownerships cannot be set manually"),
  body("licensePlateNumber")
    .optional()
    .isEmpty()
    .withMessage(
      "License plate number cannot be set manually. After you upload your documents, it will be set automatically"
    ),
  body("carOwenrshipVerificationStatus")
    .optional()
    .isEmpty()
    .withMessage("Car ownership verification status cannot be set manually"),
  body("owner")
    .optional()
    .isEmpty()
    .withMessage("Owner cannot be set manually"),
  body("carReviews")
    .optional()
    .isEmpty()
    .withMessage("Car reviews cannot be set manually"),
  body("carOffers")
    .optional()
    .isEmpty()
    .withMessage("Car offers cannot be set manually"),
  body("carRequests")
    .optional()
    .isEmpty()
    .withMessage("Car requests cannot be set manually"),
  body("carRentals")
    .optional()
    .isEmpty()
    .withMessage("Car rentals cannot be set manually"),
]);

const validateInputCarOwnership = withValidationErrors([
  body("carID")
    .notEmpty()
    .withMessage("Car ID is required")
    .isMongoId()
    .withMessage("Invalid car ID")
    .custom(async (value, { req }) => {
      //check if car exists
      const car = await Car.findById(value);
      if (!car) {
        throw new Error("Car not found");
      }
      //check if user is admin
      const admin = await User.findById(req.user.userID);
      if (admin.role !== ROLE.ADMIN) {
        throw new Error("Only admin can change car ownership");
      }
      return true;
    }),
  body("licensePlateNumber")
    .notEmpty()
    .withMessage("License plate number is required")
    .isLength({ min: 2, max: 10 })
    .withMessage(
      "License plate number must be between 2 and 10 characters long"
    )
    .trim(),
  body("carOwenrshipVerificationStatus")
    .notEmpty()
    .withMessage("Car ownership verification status is required")
    .isIn(Object.values(VERIFICATION_STATUS))
    .withMessage("Invalid car ownership verification status"),
  body("drivingLicense")
    .notEmpty()
    .withMessage("Driving license is required")
    .isIn(Object.values(DRIVINGLICENSE))
    .withMessage("Invalid driving license"),
]);

//REVIEW:

const validateReviewInput = withValidationErrors([
  body("title")
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage("Title must be between 2 and 50 characters long")
    .trim(),
  body("content")
    .optional()
    .isLength({ min: 2, max: 500 })
    .withMessage("Content must be between 2 and 500 characters long")
    .trim(),
  body("rating")
    .notEmpty()
    .withMessage("Rating is required")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
]);

const validateUpdateReviewInput = withValidationErrors([
  //TODO: add param check for review ID
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Title must be between 2 and 50 characters long")
    .trim(),
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 2, max: 500 })
    .withMessage("Content must be between 2 and 500 characters long")
    .trim(),
  body("rating").optional().isEmpty().withMessage("Rating cannot be changed"),
]);

//INSURANCE:

const validateInsuranceInput = withValidationErrors([
  body("packageName")
    .notEmpty()
    .withMessage("Package name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Package name must be between 2 and 50 characters long")
    .trim(),
  body("packageCoverage")
    .notEmpty()
    .withMessage("Package coverage is required")
    .isLength({ min: 2, max: 500 })
    .withMessage("Coverage must be between 2 and 500 characters long")
    .trim(),
  body("packagePrice")
    .notEmpty()
    .withMessage("Package price is required")
    .isFloat()
    .withMessage("Package price must be a number")
    .trim(),
]);

//CAR_OFFER:

const validateCreateCarOfferInput = withValidationErrors([
  body("car")
    .notEmpty()
    .withMessage("Car is required")
    .isMongoId() //isMongoId() checks if the value is a valid MongoDB ID
    .withMessage("Car must be a valid MongoDB ID")
    .custom(async (value, { req }) => {
      // Check if car exists and user owns the car
      const car = await Car.findById(value);
      if (!car) {
        throw new Error("Car does not exist");
      }
      if (car.owner.toString() !== req.user.userID) {
        throw new Error("You do not own this car");
      }
      //check if license plate is set, as this is required for car offers and is set when car ownership is validated
      if (
        !car.licensePlateNumber ||
        car.carOwenrshipVerificationStatus !== VERIFICATION_STATUS.VERIFIED
      ) {
        throw new Error(
          "Your ownership of this car is not yet verified. Please upload the documents and if you have done it already, try again later"
        );
      }
      return true;
    }),
  body("pricePerHour")
    .notEmpty()
    .withMessage("Price per hour is required")
    .isFloat({ min: 0 })
    .withMessage("Price per hour must be a number greater equal 0")
    .trim(),
  body("offerStartDateTime")
    .notEmpty()
    .withMessage("A start date and time is required")
    .isISO8601()
    .withMessage(
      "Invalid date-time format. Expected format: 'YYYY-MM-DDTHH:MM:SS.MSZ'"
    )
    .custom((value) => {
      // Check if date is in the future and not other car offers exist for this car at this time
      if (new Date(value) < new Date()) {
        throw new Error("Start date and time must be in the future");
      }
      return true;
    }),
  body("offerEndDateTime")
    .notEmpty()
    .withMessage("A end date and time is required")
    .isISO8601()
    .withMessage(
      "Invalid date-time format. Expected format: 'YYYY-MM-DDTHH:MM:SS.MSZ'"
    )
    .custom((value, { req }) => {
      // Check if end date is after start date
      if (new Date(value) < new Date(req.body.offerStartDateTime)) {
        throw new Error("End date must be after start date");
      }
      return true;
    })
    .custom(async (value, { req }) => {
      const start = new Date(req.body.offerStartDateTime); //start date of new car offer
      const end = new Date(value); //end date of new car offer
      const minEndTime = new Date(start.setHours(start.getHours() + 1));

      if (!(end >= minEndTime)) {
        throw new Error("The minimum rental length is one hour");
      }

      // Check if other car offers exist for this car at this time
      const existingCarOffers = await Car.findById(req.body.car).select(
        "carOffers"
      );

      if (existingCarOffers) {
        for (let i = 0; i < existingCarOffers.carOffers.length; i++) {
          const carOffer = await CarOffer.findById(
            existingCarOffers.carOffers[i]
          );
          const existingStart = new Date(carOffer.offerStartDateTime);
          const existingEnd = new Date(carOffer.offerEndDateTime);
          if (
            (start >= existingStart && start <= existingEnd) ||
            (end >= existingStart && end <= existingEnd) ||
            (start <= existingStart && end >= existingEnd)
          ) {
            throw new Error(
              "Another car offer already exists for this car at this time"
            );
          }
        }
      }
      return true;
    }),
  body("additionalInformation")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Additional information must not exceed 300 characters")
    .trim(),
  body("termsAccepted")
    .notEmpty()
    .withMessage("Terms are not accepted")
    .isBoolean()
    .isIn([true])
    .withMessage("Terms must be accepted"),
  //reject all other fields
  body("creationDate")
    .optional()
    .isEmpty()
    .withMessage("Creation date cannot be set"),
  body("carRequests")
    .optional()
    .isEmpty()
    .withMessage("Car requests cannot be set"),
]);

const validateUpdateCarOfferInput = withValidationErrors([
  //only update of pricePerHour and additionalInformation is allowed - for new times, a new car offer must be created
  //TODO: add param validation for _id
  body("pricePerHour")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price per hour must be a number greater equal 0")
    .trim(),
  body("additionalInformation")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Additional information should not exceed 300 characters")
    .trim(),
  body("car").optional().isEmpty().withMessage("Car cannot be changed"),
  body("offerStartDateTime")
    .optional()
    .isEmpty()
    .withMessage("Offer start date and time cannot be changed"),
  body("offerEndDateTime")
    .optional()
    .isEmpty()
    .withMessage("Offer end date and time cannot be changed"),
  body("termsAccepted")
    .optional()
    .isEmpty()
    .withMessage("Terms cannot be changed"),
  body("carRequests")
    .optional()
    .isEmpty()
    .withMessage("Car requests cannot be changed"),
]);

const validateDeleteCarOfferInput = withValidationErrors([
  param("_id")
    .notEmpty()
    .withMessage("Car offer is required")
    .isMongoId()
    .withMessage("Car offer must be a valid MongoDB ID")
    .custom(async (value, { req }) => {
      // Check if car offer exists and user owns the car
      const carOffer = await CarOffer.findById(value);
      if (!carOffer) {
        throw new Error("Car offer does not exist");
      }
      if (carOffer.user.toString() !== req.user.userID) {
        throw new Error("You do not own this car");
      }
      return true;
    }),
]);

//CAR REQUEST:

const validateCarRequestInput = withValidationErrors([
  //checking IDs explicitly because they could lead to expenses of the user
  body("car")
    .notEmpty()
    .withMessage("Car is required")
    .isMongoId()
    .withMessage("Invalid car id")
    .custom(async (value, { req }) => {
      const car = await Car.findById(value);
      if (!car) {
        throw new Error("Car not found");
      }
      //check if user has driving license for car
      const user = await User.findById(req.user.userID);
      if (!user.drivingLicenseClasses.includes(car.drivingLicense)) {
        throw new Error("You do not have a driving license for this car");
      }
      return true;
    }),
  body("carOffer")
    .notEmpty()
    .withMessage("Car offer is required")
    .isMongoId()
    .withMessage("Invalid car offer id")
    .custom(async (value) => {
      const carOffer = await CarOffer.findById(value);
      if (!carOffer) {
        throw new Error("Car offer not found");
      }
      return true;
    }),
  body("insurance")
    .notEmpty()
    .withMessage("Insurance is required")
    .isMongoId()
    .withMessage("Invalid insurance id")
    .custom(async (value) => {
      const insurance = await Insurance.findById(value);
      if (!insurance) {
        throw new Error("Insurance not found");
      }
      return true;
    }),
  body("receivingUser")
    .notEmpty()
    .withMessage("Receiving user is required")
    .isMongoId()
    .withMessage("Invalid receiving user id")
    .custom(async (value, { req }) => {
      // check if receiving user exists and owns car
      const reveivingUser = await User.findById(value);
      if (!reveivingUser) {
        throw new Error("Receiving user not found");
      }
      if (!reveivingUser.ownedCars.includes(req.body.car)) {
        throw new Error("Receiving user does not own car");
      }
      return true;
    }),
  body("requestingUser")
    .notEmpty()
    .withMessage("Requesting user is required")
    .isMongoId()
    .withMessage("Invalid requesting user id")
    .custom(async (value, { req }) => {
      // check if requesting user exists
      const requestingUser = await User.findById(value);
      if (!requestingUser) {
        throw new Error("Requesting user not found");
      }
      // check if requesting user is not the same as receiving user
      if (value === req.body.receivingUser) {
        throw new Error("Sorry, you cannot rent your own car");
      }
      return true;
    }),
  body("requestStartDateTime")
    .notEmpty()
    .withMessage("Request start date and time is required")
    .isISO8601()
    .withMessage(
      "Invalid date-time format. Expected format: 'YYYY-MM-DDTHH:MM:SS.MSZ'"
    )
    .custom(async (value) => {
      // check if request start date is after current date
      //TODO: check if we can only allow start dates in the future with at least 1hr+ buffer to give car owner time to accept or decline
      if (new Date(value) < new Date()) {
        throw new Error(
          "Request start date and time must be after current date and time"
        );
      }
      return true;
    })
    .custom(async (value, { req }) => {
      // check if request start date is after car offer start date
      const carOffer = await CarOffer.findById(req.body.carOffer);
      if (new Date(value) < new Date(carOffer.offerStartDateTime)) {
        throw new Error(
          "Request start date and time must be after car offer start date and time"
        );
      }
      return true;
    })
    .custom(async (value, { req }) => {
      if (new Date(value) > new Date(req.body.requestEndDateTime)) {
        throw new Error(
          "Request start date and time must be after request end date and time"
        );
      }
      return true;
    }),
  body("requestEndDateTime")
    .notEmpty()
    .withMessage("Request end date and time is required")
    .isISO8601()
    .withMessage(
      "Invalid date-time format. Expected format: 'YYYY-MM-DDTHH:MM:SS.MSZ'"
    )
    .custom(async (value, { req }) => {
      // check if request end date is after request start date and is at least 1 hour after request start date
      const requestStartDateTime = new Date(req.body.requestStartDateTime);
      const requestEndDateTime = new Date(value);
      const diffInHours =
        (requestEndDateTime - requestStartDateTime) / (1000 * 60 * 60);
      if (diffInHours < 1) {
        throw new Error(
          "Request end date and time must be at least 1 hours after request start date and time"
        );
      }
      // check if request start date is before car offer start date
      const carOffer = await CarOffer.findById(req.body.carOffer);
      if (new Date(value) > new Date(carOffer.offerEndDateTime)) {
        throw new Error(
          "Request end date and time must be before car offer start date and time"
        );
      }
      return true;
    })
    .custom(async (value, { req }) => {
      // check if requests exists for car offer in given time period
      const carRequest = await CarOffer.findById(req.body.carOffer).populate({
        path: "carRequests",
        match: {
          carRequestStatus: {
            $in: [CAR_REQUEST_STATUS.ACCEPTED],
          },
        },
      }); //select only car requests that are not declined
      const requestStartDateTime = new Date(req.body.requestStartDateTime);
      const requestEndDateTime = new Date(value);
      const carRequests = carRequest.carRequests;
      for (let i = 0; i < carRequests.length; i++) {
        const carRequestStartDateTime = new Date(
          carRequests[i].requestStartDateTime
        );
        const carRequestEndDateTime = new Date(
          carRequests[i].requestEndDateTime
        );
        if (
          (requestStartDateTime >= carRequestStartDateTime &&
            requestStartDateTime <= carRequestEndDateTime) ||
          (requestEndDateTime >= carRequestStartDateTime &&
            requestEndDateTime <= carRequestEndDateTime) ||
          (requestStartDateTime <= carRequestStartDateTime &&
            requestEndDateTime >= carRequestEndDateTime)
        ) {
          throw new Error("Car request already exists for given time period");
        }
      }
      return true;
    }),
]);

const validateCarRequestCheckoutSessionInput = withValidationErrors([
  body("checkoutSession").notEmpty().withMessage("CheckoutSession is required"),
]);

const validateUpdateCarRequestInput = withValidationErrors([
  body("carRequestID")
    .notEmpty()
    .withMessage("Car request ID is required")
    .isMongoId()
    .withMessage("Invalid car request ID")
    .custom(async (value) => {
      // check if car request exists and if it is still pending
      const carRequest = await CarRequest.findById(value);
      if (!carRequest) {
        throw new Error("Car request does not exist");
      }
      if (carRequest.carRequestStatus !== CAR_REQUEST_STATUS.PENDING) {
        throw new Error("Car request is not pending. It cannot be updated");
      }
      return true;
    }),
  body("carRequestStatus")
    .optional()
    .isIn(Object.values(CAR_REQUEST_STATUS))
    .withMessage("Invalid status"),
  body("requestStartDateTime")
    .optional()
    .isEmpty()
    .withMessage("Request start date and time cannot be updated"),
  body("requestEndDateTime")
    .optional()
    .isEmpty()
    .withMessage("Request end date and time cannot be updated"),
  body("rentalFee")
    .optional()
    .isEmpty()
    .withMessage("Rental fee cannot be updated"),
  body("brokerCommission")
    .optional()
    .isEmpty()
    .withMessage("Broker commission cannot be updated"),
  body("totalRentalAmount")
    .optional()
    .isEmpty()
    .withMessage("Total rental amount cannot be updated"),
  body("car").optional().isEmpty().withMessage("Car cannot be updated"),
  body("carOffer")
    .optional()
    .isEmpty()
    .withMessage("Car offer cannot be updated"),
  body("insurance")
    .optional()
    .isEmpty()
    .withMessage("Insurance cannot be updated"),
  body("requestingUser")
    .optional()
    .isEmpty()
    .withMessage("Requesting user cannot be updated"),
  body("receivingUser")
    .optional()
    .isEmpty()
    .withMessage("Receiving user cannot be updated"),
]);

const validateDeleteCarRequestInput = withValidationErrors([
  body("carRequestID")
    .notEmpty()
    .withMessage("Car request is required")
    .isMongoId()
    .withMessage("Car request must be a valid MongoDB ID")
    .custom(async (value, { req }) => {
      // Check if car offer exists and user owns the car
      const carRequest = await CarRequest.findById(value);
      if (!carRequest) {
        throw new Error("Car request does not exist");
      }
      if (carRequest.requestingUser.toString() !== req.user.userID) {
        throw new Error("You did not make this car request");
      }
      return true;
    }),
]);

const validateDeterminePriceInput = withValidationErrors([
  body("carOffer").custom(async (value) => {
    const carOffer = await CarOffer.findById(value);
    if (!carOffer) {
      throw new Error("Car offer not found");
    }
    return true;
  }),
  body("insurance").custom(async (value) => {
    const insurance = await Insurance.findById(value);
    if (!insurance) {
      throw new Error("Insurance not found");
    }
    return true;
  }),
  body("requestStartDateTime")
    .custom(async (value) => {
      // check if request start date is after current date
      if (new Date(value) < new Date()) {
        throw new Error(
          "Request start date and time must be after current date and time"
        );
      }
      return true;
    })
    .custom(async (value, { req }) => {
      // check if request start date is after car offer start date
      const carOffer = await CarOffer.findById(req.body.carOffer);
      if (new Date(value) < new Date(carOffer.offerStartDateTime)) {
        throw new Error(
          "Request start date and time must be after car offer start date and time"
        );
      }
      return true;
    }),
  body("requestEndDateTime").custom(async (value, { req }) => {
    // check if request end date is after request start date and is at least 1 hour after request start date
    const requestStartDateTime = new Date(req.body.requestStartDateTime);
    const requestEndDateTime = new Date(value);
    const diffInHours =
      (requestEndDateTime - requestStartDateTime) / (1000 * 60 * 60);
    if (diffInHours < 1) {
      throw new Error(
        "Request end date and time must be at least 1 hours after request start date and time"
      );
    }
    const carOffer = await CarOffer.findById(req.body.carOffer);
    if (new Date(value) > new Date(carOffer.offerEndDateTime)) {
      throw new Error(
        "Request end date and time must be before car offer start date and time"
      );
    }
    return true;
  }),
  body("additionalInformation")
    .optional()
    .isLength({ max: 300 })
    .withMessage("Additional information must not exceed 300 characters")
    .trim(),
]);

// SUPPORT

const validateInputSupport = withValidationErrors([
  body("firstName")
    .notEmpty()
    .withMessage("First name is required")
    .isLength({ max: 50 })
    .withMessage("First name must not exceed 50 characters")
    .trim(),
  body("lastName")
    .notEmpty()
    .withMessage("Last name is required")
    .isLength({ max: 50 })
    .withMessage("Last name must not exceed 50 characters")
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .isLength({ max: 50 })
    .withMessage("Email must not exceed 50 characters")
    .trim(),
  body("message")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ max: 2000 })
    .withMessage("Message must not exceed 2000 characters")
    .trim(),
]);

export {
  validateRegisterInput,
  validateLoginInput,
  validateUpdateUserInput,
  validateUpdateEmailInput,
  validateUpdatePasswordInput,
  validateAddCarInput,
  validateUpdateCarInput,
  validateCreateCarOfferInput,
  validateUpdateCarOfferInput,
  validateReviewInput,
  validateUpdateReviewInput,
  validateInsuranceInput,
  validateCarRequestInput,
  validateUpdateCarRequestInput,
  validateDeleteCarOfferInput,
  validateDeleteCarRequestInput,
  validateDeterminePriceInput,
  validateCarRequestCheckoutSessionInput,
  validateInputCarOwnership,
  validateUpdateDrivingLicenseStatus,
  validateUpdateIdentityCardStatus,
  validatePasswordResetInput,
  validateInputSupport,
};
