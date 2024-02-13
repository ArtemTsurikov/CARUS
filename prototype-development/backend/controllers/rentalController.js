import User from "../models/userModel.js";
import Car from "../models/carModel.js";
import Rental from "../models/rentalModel.js";
import CarRequest from "../models/carRequestModel.js"
import { RENTAL_STATUS } from "../utils/constants.js";
import { getAllUserIdsByName } from "./userController.js"

import { StatusCodes } from "http-status-codes";

import HttpError from "../errors/HttpError.js";
import errorMiddleware from "../middleware/errorMiddleware.js";


const getOneRentalById = errorMiddleware.asyncErrorHandler(
    async (req, res, next) => {
        const rental = await Rental.findById(req.params._id);

        if (rental) {
            res.status(200).json({ rental });
        } else {
            next(new HttpError(`Rental with ID: ${req.params._id} not found.`, 404));
        }
    }
);


const getCarRentalsFiltered = errorMiddleware.asyncErrorHandler(
    async (req, res, next) => {
        console.log(2, "Start");

        if (req.body.page === "AsRequester") {
            var carRentalsFiltered = [];
            if (req.body.receivingUser !== "") {
                const users = getAllUserIdsByName(req.body.receivingUser);
                var carRentalA = [];
                var carRentals;
                console.log(3, users);
                for (var i = 0; i < users.length; i++) {
                    console.log(4, users[i]);
                    carRentals = await Rental.find({
                        sharingUser: users[i],
                        borrowingUser: req.user.userID,
                        rentalStatus: "Finished",
                        requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
                        requestEndDateTime: { $lte: new Date(req.body.endDateTime) },

                    });
                    carRentalA.push(carRentals);

                }
                carRentalsFiltered = carRentalA;
                console.log(5, carRentalsFiltered);
            } else {

                carRentalsFiltered = await Rental.find({
                    borrowingUser: req.user.userID,
                    rentalStatus: "Finished",
                    requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
                    requestEndDateTime: { $lte: new Date(req.body.endDateTime) },
                });
            }
            console.log(1, carRentalsFiltered);
            if (req.body.carType !== "") {

                var car;
                var zA = [];
                for (var i = 0; i < carRentalsFiltered.length; i++) {
                    car = await Car.findById(carRentalsFiltered[i].car);
                    if (car.carType === req.body.carType) {
                        zA.push(carRentalsFiltered[i]);
                    }
                }
                carRentalsFiltered = zA;
            }



            if (carRentalsFiltered) {
                res.status(StatusCodes.OK).json({ carRentalsFiltered });
            } else {
                next(
                    new HttpError(
                        `No car rentals found.`,
                        StatusCodes.NOT_FOUND
                    )
                );
            }
        } else {

            //This part is for the sharing Page
            var carRentalsFiltered = [];
            if (req.body.requestingUser !== "") {

                if (req.body.car === "") {
                    const users = getAllUserIdsByName(req.body.requestingUser);

                    var carRentalA = [];
                    var carRentals;

                    for (var i = 0; i < users.length; i++) {
                        carRentals = await Rental.find({
                            sharingUser: users[i],
                            borrowingUser: req.user.userID,
                            rentalStatus: "Finished",
                            requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
                            requestEndDateTime: { $lte: new Date(req.body.endDateTime) },
                        });
                        carRentalA.push(carRentals);

                    }
                    carRentalsFiltered = carRentalA;
                } else {
                    const users = getAllUserIdsByName(req.body.requestingUser);

                    var carRentalA = [];
                    var carRentals;

                    for (var i = 0; i < users.length; i++) {
                        carRentals = await Rental.find({
                            sharingUser: users[i],
                            borrowingUser: req.user.userID,
                            car: req.body.car,
                            rentalStatus: "Finished",
                            requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
                            requestEndDateTime: { $lte: new Date(req.body.endDateTime) },
                        });
                        carRentalA.push(carRentals);

                    }
                    carRentalsFiltered = carRentalA;
                }


            } else {

                if (req.body.car === "") {
                    carRentalsFiltered = await Rental.find({
                        sharingUser: req.user.userID,
                        rentalStatus: "Finished",
                        requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
                        requestEndDateTime: { $lte: new Date(req.body.endDateTime) },
                    });
                } else {
                    carRentalsFiltered = await Rental.find({
                        sharingUser: req.user.userID,
                        rentalStatus: "Finished",
                        car: req.body.car,
                        requestStartDateTime: { $gte: new Date(req.body.startDateTime) },
                        requestEndDateTime: { $lte: new Date(req.body.endDateTime) },
                    });
                }

            }



            if (carRentalsFiltered) {
                res.status(StatusCodes.OK).json({ carRentalsFiltered });
            } else {
                next(
                    new HttpError(
                        `No car rentals found.`,
                        StatusCodes.NOT_FOUND
                    )
                );
            }
        }

    }
);

//INTERNAL FUNCTIONS
//create rental
async function createRental(acceptedCarRequest) {
    console.log(acceptedCarRequest)
    //create rental
    const rental = await Rental.create({
        rentalStatus: RENTAL_STATUS.STARTED,
        car: acceptedCarRequest.car,
        sharingUser: acceptedCarRequest.receivingUser,
        borrowingUser: acceptedCarRequest.requestingUser,
        requestStartDateTime: acceptedCarRequest.requestStartDateTime,
        requestEndDateTime: acceptedCarRequest.requestEndDateTime,
        rentalFee: acceptedCarRequest.rentalFee,
        totalRentalAmount: acceptedCarRequest.totalRentalAmount,
        insurance: acceptedCarRequest.insurance,
        carRequest: acceptedCarRequest._id,
    });
    //update user - sharer
    const sharer = await User.findById(acceptedCarRequest.receivingUser);
    sharer.rentalsAsSharer.push(rental._id);
    sharer.numberOfRentals += 1; //might want to differentiate between sharer and borrower
    await sharer.save();
    //update user - borrower
    const borrower = await User.findById(acceptedCarRequest.requestingUser);
    borrower.rentalsAsBorrower.push(rental._id);
    borrower.numberOfRentals += 1; //might want to differentiate between sharer and borrower
    await borrower.save();
    //update car
    const car = await Car.findById(acceptedCarRequest.car);
    car.carRentals.push(rental._id);
    car.numberOfRentals += 1;
    await car.save();
    await CarRequest.findByIdAndUpdate(acceptedCarRequest._id, {
        $push: { rental: rental._id },
    });
    finishRental(rental._id, acceptedCarRequest.requestEndDateTime); //finish rental when it is ending until end date
    console.log("Rental created");
    return rental;
}

//set rental status to finished when rental ends
function finishRental(rentalID, rentalEndDateTime) {
    //set rental status to finished when rental ends
    setTimeout(async function () {

        const rental = await Rental.findByIdAndUpdate(rentalID, {
            rentalStatus: RENTAL_STATUS.FINISHED,
        });

        const sharingUser = await User.findById(rental.sharingUser);
        const borrowingUser = await User.findById(rental.borrowingUser);

        const reviewLinkSharer = `http://localhost:3000/profile/${sharingUser._id}/rentalRequest/${rental.carRequest}`;
        const reviewLinkBorrower = `http://localhost:3000/profile/${borrowingUser._id}/rentalRequest/${rental.carRequest}`;

        //Send email to sharing user and aks for a review
        await emailMiddleware.handleMail(
            sharingUser.email,
            "Rate your rental",
            `<p>Dear ${sharingUser.firstName},<br><br>
        Thank you for using our service!<br><br>
        Please follow <a href=${reviewLinkSharer}>this link</a> and rate your rental experience.<br><br>
        Best regards,<br>
        Your CARUS team</p>`
        );

        //Send email to renting user and aks for a review
        await emailMiddleware.handleMail(
            borrowingUser.email,
            "Rate your rental",
            `<p>Dear ${borrowingUser.firstName},<br><br>
        Thank you for using our service!<br><br>
        Please follow <a href=${reviewLinkBorrower}>this link</a> and rate your rental experience.<br><br>
        Best regards,<br>
        Your CARUS team</p>`
        );
    }, rentalEndDateTime - Date.now());
}

//rentals will not be deleted, only updated to finished, as they are needed for the history

export { getCarRentalsFiltered, createRental, getOneRentalById };
