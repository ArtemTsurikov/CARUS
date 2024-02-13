import { StatusCodes } from "http-status-codes";
import * as fs from "fs";
import { VERIFICATION_STATUS } from "../utils/constants.js";
import User from "../models/userModel.js";
import Car from "../models/carModel.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
import HttpError from "../errors/HttpError.js";
import emailMiddleware from '../middleware/emailMiddleware.js';
import { deleteCarOfferInternal } from "../controllers/carOfferController.js";
import {
  AVERAGE_RANGES,
  CAR_TYPE,
  FUEL_TYPE,
  TRANSMISSION_TYPE,
  DRIVINGLICENSE,
  CAR_BRAND,
  CAR_EQUIPMENT,
  RENTAL_STATUS,
} from "../utils/constants.js";

const fetchCars = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  const owner = await User.findById(req.user.userID);
  if (owner) {
    req.body.owner = req.user.userID;
    const cars = await Car.find({ owner: req.user.userID });

    res.status(StatusCodes.OK).json({ cars });
  } else {
    next(
      new HttpError(
        `User with ID: ${req.user.userID} not found.`,
        StatusCodes.NOT_FOUND
      )
    );
  }
});

const fetchCarAttributes = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    res.status(StatusCodes.OK).json({
      AVERAGE_RANGES,
      CAR_TYPE,
      FUEL_TYPE,
      TRANSMISSION_TYPE,
      DRIVINGLICENSE,
      CAR_BRAND,
      CAR_EQUIPMENT,
    });
  }
);

const fetchCarTypes = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    res.status(StatusCodes.OK).json({ CAR_TYPE });
  }
);


//add car to database
const addCar = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  const owner = await User.findById(req.user.userID);
  if (owner) {
    req.body.owner = req.user.userID;
    const car = await Car.create(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.user.userID, {
      $push: { ownedCars: car._id },
    }); //{ "new": true, "upsert": true });
    res.status(StatusCodes.CREATED).json({ carId: car._id, msg: "Car added" });
  } else {
    next(
      new HttpError(
        `User with ID: ${req.user.userID} not found.`,
        StatusCodes.NOT_FOUND
      )
    );
  }
});

//upload car details
const updateCar = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  let updatedCar = null;
  const user = await User.findById(req.user.userID);
  if (user.ownedCars.includes(req.body.carID)) {
    //check if user owns car
    updatedCar = await Car.findByIdAndUpdate(req.body.carID, req.body);
  }
  if (updatedCar) {
    res.status(StatusCodes.OK).json({ msg: "Car updated" });
  } else {
    next(
      new HttpError(
        `Car with ID: ${req.body.carID} not found.`,
        StatusCodes.NOT_FOUND
      )
    );
  }
});

//upload car pictures
const updateCarPicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    let newPictures = null;
    const user = await User.findById(req.user.userID);
    if (user.ownedCars.includes(req.body.carID)) {
      //check if user owns car
      newPictures = req.files;
    }
    if (newPictures) {
      const pictureArray = [];
      for (let i = 0; i < newPictures.length; i++) {
        pictureArray[
          i
        ] = `/images/${req.user.userID}/Cars/${req.body.carID}/${newPictures[i].filename}`;
      }
      req.params.carPictures = pictureArray;

      //add new pictures to car
      const updatedCar = await Car.findByIdAndUpdate(req.body.carID, {
        $push: { carPictures: { $each: pictureArray } },
      });
      // No deletion of old pictures is needed as you should delete old pictures in separate route
      res.status(StatusCodes.OK).json({ msg: "Car pictures updated" });
    } else {
      next(
        new HttpError(
          `Car with ID: ${req.body.carID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);


//get car pictures
const getCarPictures = async (req, res) => {
  const __dirname = process.cwd();
  const car = await Car.findById(req.params.carID);

  if (car.carPictures) {
    res.sendFile(
      __dirname + `/public${car.carPictures[req.params.pictureIndex]}`
    );
  }
};


//update car title picture
const updateCarTitlePicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    let newPicture = null;
    const user = await User.findById(req.user.userID);
    if (user.ownedCars.includes(req.body.carID)) {
      //check if user owns car
      newPicture = req.file;
    }
    if (newPicture) {
      req.body.titlePicture = `/images/${req.user.userID}/Cars/${req.body.carID}/${newPicture.filename}`;
    }
    const updatedCar = await Car.findByIdAndUpdate(
      { _id: req.body.carID },
      { carTitlePicture: req.body.titlePicture }
    );
    if (newPicture && updatedCar.carTitlePicture) {
      try {
        await fs.promises.access(`public${updatedCar.carTitlePicture}`);
        await fs.promises.unlink(`public${updatedCar.carTitlePicture}`);
      } catch (error) {
        console.log("Failed to delete local image");
      }
    }
    res.status(StatusCodes.OK).json({ msg: "Title Picture updated" });
  }
);


//get car title picture
const getCarTitlePicture = async (req, res) => {
  const __dirname = process.cwd();
  const car = await Car.findById(req.params.carID);

  res.status(200);
  if (car.carTitlePicture) {
    res.sendFile(__dirname + `/public/${car.carTitlePicture}`);
  }
};


//delete one car picture
const deleteCarPicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    let updatedCar = null;
    const user = await User.findById(req.user.userID);
    if (user.ownedCars.includes(req.params.carID)) {
      //check if user owns car
      const carID = req.params.carID;
      let car = await Car.findById(carID);
      let carPicture = car.carPictures[req.params.index];

      updatedCar = await Car.findByIdAndUpdate(
        { _id: carID },
        { $pull: { carPictures: carPicture } }
      );
    }
    if (updatedCar) {
      try {
        await fs.promises.access(
          `public${updatedCar.carPictures[req.params.index]}`
        );
        await fs.promises.unlink(
          `public${updatedCar.carPictures[req.params.index]}`
        );
      } catch (error) {
        console.log("Failed to delete local image");
      }
      res.status(StatusCodes.OK).json({ msg: "Car Picture deleted" });
    } else {
      next(
        new HttpError(
          `Car with ID: ${req.body.carID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//delete car title picture
const deleteCarTitlePicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    let updatedCar = null;
    const user = await User.findById(req.user.userID);
    if (user.ownedCars.includes(req.params.carID)) {
      //check if user owns car
      let car = await Car.findById(req.params.carID);
      updatedCar = await Car.findByIdAndUpdate(
        { _id: req.params.carID },
        { $unset: { carTitlePicture: 1 } }
      );
      if (updatedCar) {
        try {
          await fs.promises.access(`public${updatedCar.carTitlePicture}`);
          await fs.promises.unlink(`public${updatedCar.carTitlePicture}`);
        } catch (error) {
          console.log("Failed to delete local image");
        }
      }
      res.status(StatusCodes.OK).json({ msg: "Title Picture deleted" });
    } else {
      next(
        new HttpError(
          `Car with ID: ${req.params.carID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);


//update car ownership verification
//send mail to admin to verify car ownership
const updateCarOwnershipVerification = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    //fahrzeugschein
    let newPictures = null;
    const user = await User.findById(req.user.userID);
    if (user.ownedCars.includes(req.body.carID)) {
      //check if user owns car
      newPictures = req.files;
    }
    if (newPictures) {
      const pictureArray = [];
      for (let i = 0; i < newPictures.length; i++) {
        pictureArray[
          i
        ] = `/images/${req.user.userID}/Cars/${req.body.carID}/${newPictures[i].filename}`;
      }
      req.body.carOwnership = pictureArray;

      //add new pictures to car
      const updatedCar = await Car.findByIdAndUpdate(
        { _id: req.body.carID },
        {
          carOwnerships: pictureArray,
          carOwenrshipVerificationStatus: VERIFICATION_STATUS.PENDING,
        }
      );
      //email to admin, that new validation request is pending
      await emailMiddleware.handleMail(
        process.env.EMAIL_ADMIN,    
        `New Car Ownership Validation - CAR: ${req.body.carID}`,
        `<p>Dear Carus Team,<br><br>
        ${user.firstName} ${user.lastName} has uploaded car ownership documents for car ${updatedCar._id}<br><br>
        Please check the documents and verify or reject the onwership.<br><br>
        For verification, please also update the car's license plate number, as well as the car's driving license class.<br><br>
        Best regards,<br>
        Your Carus Team Bot</p>`
    );

      // No deletion of old pictures is needed as you should delete old pictures in separate route
      res
        .status(StatusCodes.OK)
        .json({ msg: "Car ownership verification updated" });
    } else {
      next(
        new HttpError(
          `Car with ID: ${req.body.carID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);


//delete car
const deleteCar = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  let deletionCar = null;
  let updatedUser = null;
  const user = await User.findById(req.user.userID);
  //check if user owns car
  if (user.ownedCars.includes(req.params.carID)) {
    //check if this car has started rentals
    const carRentals = await Car.findById(req.params.carID).populate(
      "carRentals"
    );
    if (carRentals) {
      for (let i = 0; i < carRentals.carRentals.length; i++) {
        if (carRentals.carRentals[i].rentalStatus === RENTAL_STATUS.STARTED) {
          next(
            new HttpError(
              `Car with ID: ${req.params.carID} has started rentals. You cannot delete your Car, if your rental is still ongoing`,
              StatusCodes.BAD_REQUEST
            )
          );
        }
      }
    }
    //delete all offers for car
    const carOffers = await Car.findById(req.params.carID).populate(
      "carOffers"
    );
    if (carOffers) {
      for (let i = 0; i < carOffers.carOffers.length; i++) {
        await deleteCarOfferInternal(carOffers.carOffers[i]);
      }
    }
    //delete car from database
    deletionCar = await Car.findByIdAndDelete({ _id: req.params.carID });
    //delete car from owner
    updatedUser = await User.findByIdAndUpdate(req.user.userID, {
      $pull: { ownedCars: req.params.carID },
    });
  }
  if (deletionCar && updatedUser) {
    //delete picture folder
    try {
      await fs.promises.access(
        `public/images/${updatedUser._id}/Cars/${deletionCar._id}`
      );
      await fs.promises.rm(
        `public/images/${updatedUser._id}/Cars/${deletionCar._id}`,
        { recursive: true, force: true }
      );
    } catch (error) {
      console.log("Failed to delete local user image folder");
    }
    res.status(StatusCodes.OK).json({ msg: "Car was secessfully deleted" });
  } else {
    next(
      new HttpError(
        `Car with ID: ${req.body.carID} not found.`,
        StatusCodes.NOT_FOUND
      )
    );
  }
});


//get one car by id
const getOneCarById = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const car = await Car.findById(req.params._id);
    if (car) {
      res.status(200).json({ car });
    } else {
      next(new HttpError(`Car with ID: ${req.user._id} not found.`, 404));
    }
  }
);


//get all cars of currently logged in user
const getAllUserCars = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const cars = await Car.find({ owner: req.user.userID });

    if (cars) {
      res.status(StatusCodes.OK).json({ cars });
    } else {
      next(
        new HttpError(
          `Not found cars for user with ID: ${req.user.UserID}.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);


//get all cars of one user by user id
const getAllCarsByUserId = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const cars = await Car.find({ owner: req.params.userID });

    if (cars) {
      res.status(StatusCodes.OK).json({ cars });
    } else {
      next(
        new HttpError(
          `Not found cars for user with ID: ${req.user.UserID}.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//admin method to validate car ownership
const updateCarOwnership = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const car = await Car.findByIdAndUpdate(
      { _id: req.body.carID },
      {
        carOwenrshipVerificationStatus: req.body.carOwenrshipVerificationStatus,
        licensePlateNumber: req.body.licensePlateNumber,
        drivingLicense: req.body.drivingLicense,
      }
    );
    if (car) {
      res.status(StatusCodes.OK).json({ msg: "Car ownership status updated" });
    } else {
      next(
        new HttpError(
          `Car with ID: ${req.body.carID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

export {
  addCar,
  updateCarPicture,
  updateCar,
  deleteCarPicture,
  updateCarTitlePicture,
  getCarTitlePicture,
  deleteCarTitlePicture,
  updateCarOwnershipVerification,
  deleteCar,
  fetchCars,
  fetchCarAttributes,
  fetchCarTypes,
  getCarPictures,
  getOneCarById,
  getAllUserCars,
  getAllCarsByUserId,
  updateCarOwnership,
};

//internal methods, should not be exposed to outside

//is called when user is deleted
export async function deleteCarInternal(userID, carID) {
  const carOffers = await Car.findById(carID).populate("carOffers");
  if (carOffers) {
    for (let i = 0; i < carOffers.carOffers.length; i++) {
      await deleteCarOfferInternal(carOffers.carOffers[i]);
    }
  }
  const deletionCar = await Car.findByIdAndDelete({ _id: carID });
  if (deletionCar) {
    try {
      await fs.promises.access(`public/images/${userID}/Cars/${carID}`);
      await fs.promises.rm(`public/images/${userID}/Cars/${carID}`, {
        recursive: true,
        force: true,
      });
    } catch (error) {
      console.log("Failed to delete local user image folder");
    }
    return true;
  } else {
    return false;
  }
}

//is called after car review was written
export async function updateCarRatingInternal(carID, rating, factor) {
  const car = await Car.findById(carID);
  if (car) {
    car.ratingSum = car.ratingSum + rating;
    car.numberOfRatings = car.numberOfRatings + factor;
    if (car.numberOfRatings === 0) {
      car.rating = 0;
    } else {
      car.rating = car.ratingSum / car.numberOfRatings;
    }
    car.save();
    return true;
  } else {
    return false;
  }
}
