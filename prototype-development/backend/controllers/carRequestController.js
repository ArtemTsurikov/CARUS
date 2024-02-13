import { StatusCodes } from "http-status-codes";
import User from "../models/userModel.js";
import Car from "../models/carModel.js";
import CarRequest from "../models/carRequestModel.js";
import CarOffer from "../models/carOfferModel.js";
import Insurance from "../models/insuranceModel.js";
import { createRental } from "./rentalController.js";
import { CAR_REQUEST_STATUS, BROKER_COMMISSION } from "../utils/constants.js";
import dotenv from "dotenv";
import HttpError from "../errors/HttpError.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
import emailMiddleware from "../middleware/emailMiddleware.js";
import stripe from "stripe";
import dayjs from "dayjs";
dotenv.config();

const stripeInstance = stripe(process.env.STRIPE_PRIVATE_KEY);

//get one car request by id
const getCarRequestById = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const carRequest = await CarRequest.findById(req.params._id);

    if (carRequest) {
      res.status(200).json({ carRequest });
    } else {
      next(
        new HttpError(`Car Request with ID: ${req.params._id} not found.`, 404)
      );
    }
  }
);

//filter car requests
const getCarRequestsFiltered = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    var carRequestFiltered = [];

    if (req.body.page === "AsSharer") {
      if (req.body.car !== "") {
        carRequestFiltered = await CarRequest.find({
          car: req.body.car,
          requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
          requestEndDateTime: { $lte: new Date(req.body.endDateTime) },
          receivingUser: req.user.userID,
          carRequestStatus: req.body.status,
        });
      } else {
        carRequestFiltered = await CarRequest.find({
          requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
          requestEndDateTime: { $lte: new Date(req.body.endDateTime) },
          receivingUser: req.user.userID,
          carRequestStatus: req.body.status,
        });
      }

      if (req.body.requestingUser !== "") {
        var user;
        var zA = [];
        for (var i = 0; i < carRequestFiltered.length; i++) {
          user = await User.findById(carRequestFiltered[i].requestingUser);
          if (user.lastName === req.body.requestingUser) {
            zA.push(carRequestFiltered[i]);
          }
        }
        carRequestFiltered = zA;
      }

      if (carRequestFiltered) {
        res.status(StatusCodes.OK).json({ carRequestFiltered });
      } else {
        next(new HttpError(`No car requests found.`, StatusCodes.NOT_FOUND));
      }
    } else {
      //As requestor
      carRequestFiltered = await CarRequest.find({
        requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
        requestEndDateTime: { $lte: new Date(req.body.endDateTime) },
        requestingUser: req.user.userID,
        carRequestStatus: req.body.status,
      });

      if (req.body.carType !== "") {
        var car;
        var zA = [];
        for (var i = 0; i < carRequestFiltered.length; i++) {
          car = await Car.findById(carRequestFiltered[i].car);
          if (car.carType === req.body.carType) {
            zA.push(carRequestFiltered[i]);
          }
        }
        carRequestFiltered = zA;
      }

      if (req.body.receivingUser !== "") {
        var user;
        var zA = [];
        for (var i = 0; i < carRequestFiltered.length; i++) {
          user = await User.findById(carRequestFiltered[i].receivingUser);
          if (user.lastName === req.body.receivingUser) {
            zA.push(carRequestFiltered[i]);
          }
        }
        carRequestFiltered = zA;
      }

      if (carRequestFiltered) {
        res.status(StatusCodes.OK).json({ carRequestFiltered });
      } else {
        next(new HttpError(`No car requests found.`, StatusCodes.NOT_FOUND));
      }
    }
  }
);

//create a car request
//send mail to receiver and requesting user
const createCarRequest = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const reqBody = req.body;

    //Calculate Price
    const carOffer = await CarOffer.findById(req.body.carOffer);
    const insurance = await Insurance.findById(req.body.insurance);
    const startTime = new Date(req.body.requestStartDateTime);
    const endTime = new Date(req.body.requestEndDateTime);
    const durationInHours = (endTime.getTime() - startTime.getTime()) / 3600000;
    const totalPriceBeforeTax =
      durationInHours * carOffer.pricePerHour +
      insurance.packagePrice +
      BROKER_COMMISSION.COMMISSION;

    const totalPriceAfterTax = totalPriceBeforeTax + 0.19 * totalPriceBeforeTax;

    //Add prices to body
    reqBody.rentalFee = carOffer.pricePerHour;
    reqBody.totalRentalAmount = Number(totalPriceAfterTax).toFixed(2);

    //Create Rental Request
    const carRequest = await CarRequest.create(reqBody);

    //Update user
    await User.findByIdAndUpdate(req.body.requestingUser, {
      $push: { createdCarRequests: carRequest._id },
    });

    //Update receiver
    await User.findByIdAndUpdate(req.body.receivingUser, {
      $push: { receivedCarRequests: carRequest._id },
    });

    //Update car
    await Car.findByIdAndUpdate(req.body.car, {
      $push: { carRequests: carRequest._id },
    });

    //Update Car Offer
    await CarOffer.findByIdAndUpdate(req.body.carOffer, {
      $push: { carRequests: carRequest._id },
    });

    //Delay update status, so that the user has time to accept the request, but cannot accept it after the request start time has passed
    delayUpdateStatus(
      carRequest.requestStartDateTime - Date.now(),
      carRequest._id
    );

    //Get the receiving / requesting user
    const receivingUser = await User.findById(req.body.receivingUser);
    const requestingUser = await User.findById(req.body.requestingUser);

    //Send email to requesting user
    await emailMiddleware.handleMail(
      requestingUser.email,
      "Rental request confirmation",
      `<p>Dear ${requestingUser.firstName},<br><br>
      We are pleased to inform you that we have received your rental request.<br>
      You will be notified once ${receivingUser.firstName} ${receivingUser.lastName} has declined or accepted the rental.<br><br>
      Thank you for choosing our rental service.<br><br>
      Best regards,<br>
      Your CARUS team</p>`
    );

    //Send email to receiving user
    await emailMiddleware.handleMail(
      receivingUser.email,
      "New rental request",
      `<p>Dear ${receivingUser.firstName},<br><br>
      We are pleased to inform you that you have received a new rental request.<br>
      Please have a look on it in your profile.<br><br>
      Best regards,<br>
      Your CARUS team</p>`
    );

    res
      .status(StatusCodes.CREATED)
      .json({ carRequestID: carRequest._id, msg: "Car request created" });
  }
);

//update a car request (only the requesting user can update the request)
const updateCarRequest = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const updatedCarRequest = await CarRequest.findByIdAndUpdate(
      req.body.carRequestID,
      req.body
    );
    if (updatedCarRequest) {
      res.status(StatusCodes.OK).json({ msg: "Car request updated" });
    } else {
      next(
        new HttpError(
          `Car request with ID: ${req.body.carRequestID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//update a car request status (only the receiving user can update the status)
//send mail to requesting user and receiving user if rental was accepted and send rental details to user
//create stripe instance and charge the user
const updateCarRequestStatus = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    let updatedRequest = null;
    //check if user received car request, as only the receiver can update the status
    const user = await User.findById(req.user.userID);

    if (user.receivedCarRequests.includes(req.body.carRequestID)) {
      //update car request
      updatedRequest = await CarRequest.findByIdAndUpdate(
        req.body.carRequestID,
        req.body
      );
    }

    if (updatedRequest) {
      const requestingUser = await User.findById(updatedRequest.requestingUser);
      const car = await Car.findById(updatedRequest.car);
      const carOffer = await CarOffer.findById(updatedRequest.carOffer);

      //Rental was accepted
      if (req.body.carRequestStatus === CAR_REQUEST_STATUS.ACCEPTED) {
        //Create rental at the start date time
        await createRental(updatedRequest);

        //Decline all the other requests
        for (let id in carOffer.carRequests) {
          if (
            carOffer.carRequests[id].toString() !==
            updatedRequest._id.toString()
          ) {
            await CarRequest.findByIdAndUpdate(carOffer.carRequests[id], {
              carRequestStatus: CAR_REQUEST_STATUS.DECLINED,
            });
          }
        }

        //Mark offer as not available
        await CarOffer.findByIdAndUpdate(updatedRequest.carOffer, {
          available: false,
        });

        /* Stripe paying procedure */

        // Get the Checkout session
        const session = await stripeInstance.checkout.sessions.retrieve(
          updatedRequest.checkoutSession
        );

        //Get the SetupIntent
        const setupIntent = await stripeInstance.setupIntents.retrieve(
          session.setup_intent
        );

        //Get sharer details
        const stripeCustomer = await stripeInstance.customers.list({
          email: user.email,
        });

        //Calculate correct prices
        const durationInHours =
          (updatedRequest.requestEndDateTime.getTime() -
            updatedRequest.requestStartDateTime.getTime()) /
          3600000;
        const totalRentalAmount = updatedRequest.totalRentalAmount * 100;
        const totalSharerEarnings =
          carOffer.pricePerHour * durationInHours * 100;

        //Get the payment intent --> Do the payment
        await stripeInstance.paymentIntents.create({
          payment_method: setupIntent.payment_method,
          customer: setupIntent.customer,
          amount: totalRentalAmount,
          currency: "eur",
          confirm: true,
          metadata: {
            order_id: updatedRequest._id,
          },
        });

        //Inform the receiving user about the acceptance
        await emailMiddleware.handleMail(
          user.email,
          "Rental request accepted",
          `<p>Dear ${user.firstName},<br><br>
          You have accepted a rental request.<br><br>
          Here are some details of your upcoming rental:<br><br>
          <ul>
            <li><b>Renter:</b> ${requestingUser.firstName} ${
            requestingUser.lastName
          }</li>
            <li><b>Car:</b> ${car.carBrand} ${car.carModel}</li>
            <li><b>Rental start:</b> ${dayjs(
              updatedRequest.requestStartDateTime
            ).format("MMMM D, YYYY h:mm A")}</li>
            <li><b>Rental end:</b> ${dayjs(
              updatedRequest.requestEndDateTime
            ).format("MMMM D, YYYY h:mm A")}</li>
          </ul><br><br>
          Thank you for choosing our rental service.<br><br>
          Best regards,<br>
          Your CARUS team</p>`
        );

        //Inform the requesting user about the acceptance
        await emailMiddleware.handleMail(
          requestingUser.email,
          "Rental request accepted",
          `<p>Dear ${requestingUser.firstName},<br><br>
          We are pleased to inform you that ${
            user.firstName
          } has accepted your request.<br><br>
          Here are some details of your upcoming rental:
          <ul>
            <li><b>Sharer:</b> ${user.firstName} ${user.lastName}</li>
            <li><b>Address:</b> ${user.address.street} ${
            user.address.houseNumber
          }, ${user.address.zipCode} ${user.address.city}</li>
            <li><b>Car:</b> ${car.carBrand} ${car.carModel}</li>
            <li><b>Rental start:</b> ${dayjs(
              updatedRequest.requestStartDateTime
            ).format("MMMM D, YYYY h:mm A")}</li>
            <li><b>Rental end:</b> ${dayjs(
              updatedRequest.requestEndDateTime
            ).format("MMMM D, YYYY h:mm A")}</li>
            <li><b>Total price:</b> ${updatedRequest.totalRentalAmount} €</li>
          </ul>
          Your card will be billed in the next few minutes.<br><br>
          Thank you for choosing our rental service.<br><br>
          Best regards,<br>
          Your CARUS team</p>`
        );

        //trigger payment process to requesting user
        res.status(StatusCodes.OK).json({ msg: "Car request accepted" });
      }
      //Rental was declined
      else if (req.body.carRequestStatus === CAR_REQUEST_STATUS.DECLINED) {
        //Inform the requesting user about the acceptance
        await emailMiddleware.handleMail(
          requestingUser.email,
          "Rental request declined",
          `<p>Dear ${requestingUser.firstName},<br><br>
          ${user.firstName} has unfortunately declined your request.<br>
          Keep looking for the perfect car.<br><br>
          Best regards,<br>
          Your CARUS team</p>`
        );
        res.status(StatusCodes.OK).json({ msg: "Car request declined" });
      }
    } else {
      next(
        new HttpError(
          `Car request with ID: ${req.body.carRequestID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//no deletion method of car request, as it also affects other users, so it is cancelleed instead
const cancelCarRequest = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const carRequest = await CarRequest.findById(req.params._id);

    if (carRequest) {
      //check if request has already started and passed
      if (carRequest.requestStartDateTime < Date.now()) {
        throw new HttpError(
          `Car request with ID: ${req.body.carRequestID} cannot be cancelled, as it is already has passed.`,
          StatusCodes.BAD_REQUEST
        );
      }
      //check if request is already been accepted
      if (carRequest.carRequestStatus === CAR_REQUEST_STATUS.ACCEPTED) {
        //debetable if this is necessary, as the rental did not start yet. Should the user be able to deactivate the request, when the car owner already accepted it?
        throw new HttpError(
          `Car request with ID: ${req.body.carRequestID} cannot be cancelled, as it has already been accepted.`,
          StatusCodes.BAD_REQUEST
        );
      } else {
        //cancel car request
        carRequest.carRequestStatus = CAR_REQUEST_STATUS.CANCELLED;
        await carRequest.save();
        res.status(StatusCodes.OK).json({
          message: `Car Request with ID: ${req.body.carRequestID} has been cancelled`,
        });
      }
    } else {
      next(
        new HttpError(
          `Car request with ID: ${req.body.carRequestID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//decline update car request status, if no response was received before the start time
async function delayUpdateStatus(ms, carRequestID) {
  setTimeout(async function () {
    const carRequest = await CarRequest.findById(carRequestID);
    if (carRequest.carRequestStatus === CAR_REQUEST_STATUS.PENDING) {
      carRequest.carRequestStatus = CAR_REQUEST_STATUS.DECLINED;
      await carRequest.save();
      console.log(
        "Car request status updated to declined, as no response was received before the start time."
      );
    }
  }, ms);
}

//TODO: might want to implement a return value for the cancel method, so that the user can see if the request was cancelled or not
export async function cancelCarRequestInternal(carRequestID) {
  const carRequest = await CarRequest.findById(carRequestID);
  //check if request has already started and passed
  if (carRequest && carRequest.requestStartDateTime < Date.now()) {
    console.log(
      `Car request with ID: ${carRequestID} cannot be cancelled, as it is already has passed.`
    );
  }
  //check if request is already been accepted
  if (
    carRequest &&
    carRequest.carRequestStatus === CAR_REQUEST_STATUS.ACCEPTED
  ) {
    //debetable if this is necessary, as the rental did not start yet. Should the user be able to deactivate the request, when the car owner already accepted it?
    console.log(
      `Car request with ID: ${carRequestID} cannot be cancelled, as it has already been accepted.`,
      StatusCodes.BAD_REQUEST
    );
  }
  //cancel car request
  if (carRequest) {
    carRequest.carRequestStatus = CAR_REQUEST_STATUS.CANCELLED;
    await carRequest.save();
  } else {
    console.log(`Car request with ID: ${carRequestID} not found.`);
  }
  console.log(`Car Request with ID: ${carRequestID} has been cancelled`);
}

//calculate the total price of a car request
const determinePrice = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    if (
      "carOffer" in req.body &&
      "insurance" in req.body &&
      "requestStartDateTime" in req.body &&
      "requestEndDateTime" in req.body
    ) {
      //Get the offer
      const carOffer = await CarOffer.findById(req.body.carOffer);
      const insurance = await Insurance.findById(req.body.insurance);
      const startTime = new Date(req.body.requestStartDateTime);
      const endTime = new Date(req.body.requestEndDateTime);
      const durationInHours =
        (endTime.getTime() - startTime.getTime()) / 3600000;
      const totalPriceBeforeTax =
        durationInHours * carOffer.pricePerHour +
        insurance.packagePrice +
        BROKER_COMMISSION.COMMISSION;

      const totalPriceAfterTax =
        totalPriceBeforeTax + 0.19 * totalPriceBeforeTax;

      res
        .status(StatusCodes.OK)
        .json({ totalPrice: Number(totalPriceAfterTax).toFixed(2) });
    }
  }
);

//create stripe checkout session
const createPaymentcheckoutSession = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    //Check whether the customer exist
    const renter = await User.findById(req.body.requestingUser);
    const stripeCustomer = await stripeInstance.customers.list({
      email: renter.email,
    });

    let customer;

    if (stripeCustomer.data.length === 0) {
      customer = await stripeInstance.customers.create({
        email: renter.email,
        name: `${renter.firstName} ${renter.lastName}`,
        address: {
          city: renter.address.city,
          line1: renter.address.street,
          line2: renter.address.houseNumber,
          postal_code: renter.address.zipCode,
          country: renter.address.country,
        },
      });
    } else {
      customer = stripeCustomer.data[0];
    }

    //Create stripe checkout session
    const session = await stripeInstance.checkout.sessions.create({
      customer: customer.id,
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      currency: "eur",
      mode: "setup",
      locale: "en",
      success_url: `http://localhost:3000/requestRental/${req.body.carOffer}/requestDetailsSuccess`,
      cancel_url: `http://localhost:3000/requestRental/${req.body.carOffer}/requestDetailsFailure`,
      client_reference_id: customer.id,
    });

    res.status(StatusCodes.OK).json({ url: session.url });
  }
);

export {
  createCarRequest,
  updateCarRequestStatus,
  cancelCarRequest,
  determinePrice,
  createPaymentcheckoutSession,
  getCarRequestById,
  getCarRequestsFiltered,
  updateCarRequest,
};
