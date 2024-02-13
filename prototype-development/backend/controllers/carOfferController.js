import { StatusCodes } from "http-status-codes";

import CarOffer from "../models/carOfferModel.js";
import User from "../models/userModel.js";
import Car from "../models/carModel.js";

import errorMiddleware from "../middleware/errorMiddleware.js";
import HttpError from "../errors/HttpError.js";
import { cancelCarRequestInternal } from "./carRequestController.js";

//get one car offer by id
const getOneCarOfferById = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const carOffer = await CarOffer.findById(req.params._id);

    if (carOffer) {
      res.status(200).json({ carOffer });
    } else {
      next(
        new HttpError(`Car Offer with ID: ${req.params._id} not found.`, 404)
      );
    }
  }
);

//get car offers of user by car
const getMyCarOffersByUserAndCar = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {

    const carOffers = await CarOffer.find({
      user: req.user.userID,
      car: req.body.car,
      offerStartDateTime: { $gte: new Date(req.body.offerStartDateTime) },
      offerEndDateTime: { $lte: new Date(req.body.offerEndDateTime) },
    });

    if (carOffers) {
      res.status(StatusCodes.OK).json({ carOffers });
    } else {
      next(
        new HttpError(
          `CarOffer with ID: ${req.params._id} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//get car offers of user
const getMyCarOffersByUser = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {


    const carOffers = await CarOffer.find({
      user: req.user.userID,
      offerStartDateTime: { $gte: new Date(req.body.offerStartDateTime) },
      offerEndDateTime: { $lte: new Date(req.body.offerEndDateTime) },
    });


    if (carOffers) {
      res.status(StatusCodes.OK).json({ carOffers });
    } else {
      next(
        new HttpError(
          `CarOffer with ID: ${req.params._id} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//car offer search
const getMyCarOffersSearch = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {

    var carOffers = await CarOffer.find({
      offerStartDateTime: { $gte: new Date(req.body.startDateTime) },
      offerEndDateTime: { $lte: new Date(req.body.endDateTime) },
      pricePerHour: { $gte: req.body.priceLow, $lte: req.body.priceHigh },
      user: { $ne: req.user.userID },
      available: true,
    });


    var car;
    var zwArray = [];
    if (req.body.carType !== "") {
      for (var i = 0; i < carOffers.length; i++) {
        car = await Car.findById(carOffers[i].car);
        if (car) {
          if (car.carType === req.body.carType) {
            zwArray.push(carOffers[i]);
          }

        }
      }
      carOffers = zwArray;
    }
    zwArray = [];
    if (req.body.carModel !== "") {
      for (var i = 0; i < carOffers.length; i++) {
        car = await Car.findById(carOffers[i].car);
        if (car) {
          if (car.carModel === req.body.carModel) {
            var co = (carOffers[i]);
            zwArray.push(co);
          }
        }
      }
      carOffers = zwArray;
    }

    zwArray = [];
    var user;
    if (req.body.lat) {
      if (req.body.distance !== 0) {
        for (var i = 0; i < carOffers.length; i++) {
          user = await User.findById(carOffers[i].user);
          if (user) {
            var dist = getDistanceFromLatLonInKm(user.address.latitude, user.address.longitude, req.body.lat, req.body.lng);
            if (dist <= req.body.distance) {
              var co = (carOffers[i]);
              co["__v"] = dist;
              zwArray.push(co);
            }
          }
        }
        carOffers = zwArray;
      }
    }


    if (carOffers) {
      res.status(StatusCodes.OK).json({ carOffers });
    } else {
      next(
        new HttpError(
          `CarOffer with ID: ${req.params._id} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);


function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1);  // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}


//ROUTE POST - Create a new carOffer
const createCarOffer = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const car = await Car.findById(req.body.car);
    const user = await User.findById(req.user.userID);
    if (car && user) {
      req.body.user = req.user.userID;
      const carOffer = await CarOffer.create(req.body);
      const updatedUser = await User.findByIdAndUpdate(req.user.userID, {
        $push: { carOffers: carOffer._id },
      });
      const updatedCar = await Car.findByIdAndUpdate(req.body.car, {
        $push: { carOffers: carOffer._id },
      });
      res
        .status(StatusCodes.CREATED)
        .json({ carOfferID: carOffer._id, msg: "Car offer created" });
    } else {
      next(
        new HttpError(
          `User with ID: ${req.user.userID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//ROUTE PUT - Update carOffer
//only pricePerHour and Description can be updated
const updatedcarOffer = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    let updatedCarOffer = null;
    const user = await User.findById(req.user.userID);
    if (user.carOffers.includes(req.params._id)) {
      //check if user owns carOffer
      updatedCarOffer = await CarOffer.findByIdAndUpdate(
        req.params._id,
        req.body
      );
    }
    if (updatedCarOffer) {
      res.status(StatusCodes.OK).json({ msg: "Car offer updated" });
    } else {
      next(
        new HttpError(
          `Car offer with ID: ${req.params._id} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//ROUTE DELETE - Delete carOffer by ID
const deleteCarOffer = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const carOffer = await CarOffer.findByIdAndDelete(req.params._id);
    if (carOffer) {
      //canel all requests for this carOffer
      for (let i = 0; i < carOffer.carRequests.length; i++) {
        await cancelCarRequestInternal(carOffer.carRequests[i]);
      }
      await Car.findByIdAndUpdate(carOffer.car, {
        $pull: { carOffers: carOffer._id },
      });
      await User.findByIdAndUpdate(carOffer.user, {
        $pull: { carOffers: carOffer._id },
      });
      res.status(StatusCodes.OK).json({
        message: `Car Offer with ID: ${req.params._id} has been deleted`,
      });
    } else {
      next(
        new HttpError(
          `CarOffer with ID: ${req.params._id} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//ROUTE GET - Get all carOffers by car
const getCarOffersByCar = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const carOffers = await CarOffer.find({ car: req.body.car });

    if (carOffers) {
      res.status(StatusCodes.OK).json({ carOffers });
    } else {
      next(
        new HttpError(
          `CarOffer with ID: ${req.params._id} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

export {
  getOneCarOfferById,
  createCarOffer,
  updatedcarOffer,
  deleteCarOffer,
  getMyCarOffersByUserAndCar,
  getMyCarOffersByUser,
  getCarOffersByCar as getMyCarOffersByCar,
  getMyCarOffersSearch,
};

//INTERNAL FUNCTIONS
export async function deleteCarOfferInternal(carOfferID) {
  const carOffer = await CarOffer.findByIdAndDelete(carOfferID);
  if (carOffer) {
    //cancel all requests for this carOffer
    for (let i = 0; i < carOffer.carRequests.length; i++) {
      await cancelCarRequestInternal(carOffer.carRequests[i]);
    }
    await Car.findByIdAndUpdate(carOffer.car, {
      $pull: { carOffers: carOffer._id },
    });
    await User.findByIdAndUpdate(carOffer.user, {
      $pull: { carOffers: carOffer._id },
    });
  }
}
