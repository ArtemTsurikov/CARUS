import { StatusCodes } from "http-status-codes";

import User from "../models/userModel.js";
import Car from "../models/carModel.js";
import CarReview from "../models/carReviewModel.js";
import Rental from "../models/rentalModel.js";
import { updateCarRatingInternal } from "../controllers/carController.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
import HttpError from "../errors/HttpError.js";
import { RENTAL_STATUS } from "../utils/constants.js";

//create a review for a car
const reviewCar = errorMiddleware.asyncErrorHandler(async (req, res, next) =>  {
  const reviewingUser = await User.findById(req.body.reviewingUser);       //Person writing review
  const reviewedCar = await Car.findById(req.body.car);  //Car being reviewed
  const rental = await Rental.findById(req.body.rental);          //Rental being reviewed
  //check if user has not already written a review for this rental
  const reviewExists =
    (
      await reviewingUser.populate({
        path: "writtenCarReviews",
        match: { rental: { $eq: req.body.rental } },
      })
    ).writtenCarReviews.length > 0;
  if (reviewExists) {
    next(
      new HttpError(
        `User with ID: ${req.user.userID} has already written a review for this car.`,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  //check if user has rented the car and the rental is finished
  if (
    reviewingUser &&
    reviewedCar &&
    rental.rentalStatus == RENTAL_STATUS.FINISHED &&
    rental.car.toString() === reviewedCar._id.toString() &&
    rental.borrowingUser.toString() === reviewingUser._id.toString()
  ) {
    req.body.reviewingUser = req.user.userID;
    const review = await CarReview.create(req.body);
    await User.findByIdAndUpdate(reviewingUser._id, {
      $push: { writtenCarReviews: review._id },
    });
    await Car.findByIdAndUpdate(reviewedCar._id, {
      $push: { carReviews: review._id },
    });
    await updateCarRatingInternal(reviewedCar._id, review.rating, 1);
    res
      .status(StatusCodes.CREATED)
      .json({ reviewID: review._id, msg: "Car Review added" });
  } else {
    next(
      new HttpError(
        `Car with ID: ${req.body.car} not found.`,
        StatusCodes.NOT_FOUND
      )
    );
  }
});

//update a review for a car with title and content
const updateCarReview = errorMiddleware.asyncErrorHandler(async (req, res, next) =>  {
  const review  = await CarReview.findById(req.body.reviewID);
  if(review && review.reviewingUser == req.user.userID){
    review.title = req.body.title;
    review.content = req.body.content;
    review.save();
    res.status(StatusCodes.CREATED).json({ msg: 'Car Review added' });
  }
  else{
    next(new HttpError(`Review with ID: ${req.body.reviewID} not found.`, StatusCodes.NOT_FOUND));
  }
});

//delete a review for a car
const deleteCarReview = errorMiddleware.asyncErrorHandler(async (req, res, next) =>  {
  const review  = await CarReview.findById(req.body.reviewID);
  if(review && review.reviewingUser == req.user.userID){
    await User.findByIdAndUpdate(review.reviewingUser, { $pull: { writtenCarReviews: review._id } });
    await Car.findByIdAndUpdate(review.car, { $pull: { carReviews: review._id  } });
    await updateCarRatingInternal(review.car, -review.rating, -1); //delete car rating from car, as if it was never added
    await CarReview.findByIdAndDelete(review._id);
    res.status(StatusCodes.OK).json({ msg: 'Car Review deleted' });
  }
});

const getAllCarReviews = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const car = await Car.find({ _id: req.params.carID });
    const reviews = await CarReview.find({ car: car });

    if (reviews) {
      res.status(StatusCodes.OK).json({ reviews });
    } else {
      next(
        new HttpError(
          `Not found reviews for user with ID: ${req.user.UserID}.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

export { reviewCar, updateCarReview, deleteCarReview, getAllCarReviews };
