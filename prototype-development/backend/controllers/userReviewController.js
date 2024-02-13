import { StatusCodes } from "http-status-codes";

import User from "../models/userModel.js";
import UserReview from "../models/userReviewModel.js";
import Car from "../models/carModel.js";
import CarReview from "../models/carReviewModel.js";
import Rental from "../models/rentalModel.js";
import CarRequest from "../models/carRequestModel.js"
import { updateRatingInternal } from "../controllers/userController.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
import HttpError from "../errors/HttpError.js";
import { RENTAL_STATUS } from "../utils/constants.js";

const reviewUser = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  const reviewingUser = await User.findById(req.body.reviewingUser); //Person writing review
  const reviewedUser = await User.findById(req.body.reviewedUser); //Person being reviewed
  const rental = await Rental.findById(req.body.rental); //Rental being reviewed
  //check if user has not already written a review for this rental
  const reviewExists =
    (
      await reviewingUser.populate({
        path: "writtenUserReviews",
        match: { rental: { $eq: req.body.rental } },
      })
    ).writtenUserReviews.length > 0;
  if (reviewExists) {
    return next(
      new HttpError(
        `User with ID: ${req.user.userID} has already written a review for this user.`,
        StatusCodes.BAD_REQUEST
      )
    );
  }
  //check if user has been involved in this rental
  if (
    reviewingUser &&
    reviewedUser &&
    rental.rentalStatus == RENTAL_STATUS.FINISHED &&
    (rental.sharingUser.toString() === reviewingUser._id.toString() ||
      rental.borrowingUser.toString() === reviewingUser._id.toString())
  ) {
    const review = await UserReview.create(req.body);
    
    await User.findByIdAndUpdate(reviewingUser._id, {
      $push: { writtenUserReviews: review._id },
    });
    await User.findByIdAndUpdate(reviewedUser._id, {
      $push: { receivedUserReviews: review._id },
    });
    await updateRatingInternal(reviewedUser._id, review.rating, 1);
    
    //Determine wheter Sharer or renter has reviewed
    const rentalRequest = await CarRequest.findById(rental.carRequest);

    if(req.body.reviewingUser.toString() === rentalRequest.requestingUser.toString()){
      await Rental.findByIdAndUpdate(req.body.rental, {reviewedByRenter: true})
    }
    else{
      await Rental.findByIdAndUpdate(req.body.rental, {reviewedBySharer: true})
    }

    res
      .status(StatusCodes.CREATED)
      .json({ reviewID: review._id, msg: "User Review added" });
  } else {
    next(
      new HttpError(
        `User with ID: ${req.body.reviewedUser} not found.`,
        StatusCodes.NOT_FOUND
      )
    );
  }
});

const updateUserReview = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const review = await UserReview.findById(req.body.reviewID);
    if (review && review.reviewingUser == req.user.userID) {
      review.title = req.body.title;
      review.content = req.body.content;
      review.save();
      res.status(StatusCodes.CREATED).json({ msg: "User Review updated" });
    } else {
      next(
        new HttpError(
          `Review with ID: ${req.body.reviewID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

const deleteUserReview = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const review = await UserReview.findById(req.body.reviewID);
    if (review && review.reviewingUser == req.user.userID) {
      await User.findByIdAndUpdate(review.reviewingUser, {
        $pull: { writtenUserReviews: review._id },
      });
      await User.findByIdAndUpdate(review.reviewedUser, {
        $pull: { receivedUserReviews: review._id },
      });
      await updateRatingInternal(review.reviewedUser, -review.rating, -1); //delete user rating from user, as if it never existed
      await UserReview.findByIdAndDelete(review._id);
      res.status(StatusCodes.OK).json({ msg: "User Review deleted" });
    } else {
      next(
        new HttpError(
          `Review with ID: ${req.body.reviewID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

const getAllUserReviews = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const reviews = await UserReview.find({ reviewedUser: req.params.userID });

    if (reviews) {
      res.status(StatusCodes.OK).json({ reviews });
    } else {
      next(
        new HttpError(
          `Not found reviews for user with ID: ${req.params.UserID}.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

const getAllUserReviewsByUserId = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const reviews = await UserReview.find({ reviewedUser: req.params.userID });

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

const getAllCarReviewsByCarId = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const car = await Car.find({ _id });
    const reviews = await CarReview.find({ car });

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

export {
  reviewUser,
  updateUserReview,
  deleteUserReview,
  getAllUserReviews,
  getAllUserReviewsByUserId,
  getAllCarReviewsByCarId,
};
