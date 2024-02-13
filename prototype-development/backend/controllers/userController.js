import { StatusCodes } from "http-status-codes";
import * as fs from "fs";

import User from "../models/userModel.js";
import { deleteCarInternal } from "../controllers/carController.js";
import { hashPassword } from "../utils/passwordUtils.js";
import HttpError from "../errors/HttpError.js";
import errorMiddleware from "../middleware/errorMiddleware.js";
import { VERIFICATION_STATUS } from "../utils/constants.js";
import { getGeoCode } from "../utils/geocoder.js";
import emailMiddleware from "../middleware/emailMiddleware.js";
import dotenv from "dotenv";
dotenv.config();
import stripe from "stripe";
const stripeInstance = stripe(process.env.STRIPE_PRIVATE_KEY);

const logout = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged out!" });
});

const updateUser = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    { _id: req.user.userID },
    req.body
  );
  if (updatedUser) {
    const location = await getGeoCode(updatedUser.address);
    updatedUser.address.latitude = location[0];
    updatedUser.address.longitude = location[1];
    updatedUser.save();

    res.status(StatusCodes.OK).json({ msg: "User updated" });
  } else {
    next(
      new HttpError(
        `User with ID: ${req.user.userID} not found.`,
        StatusCodes.NOT_FOUND
      )
    );
  }
});

const updatePassword = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const hashedPassword = await hashPassword(req.body.password);
    req.body.password = hashedPassword;
    const updatedPassword = await User.findByIdAndUpdate(
      { _id: req.user.userID },
      { password: req.body.password }
    );
    if (updatedPassword) {
      res.cookie("token", "logout", {
        httpOnly: true,
        expires: new Date(Date.now()),
      });
      res.status(StatusCodes.OK).json({ msg: "Password updated" });
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

const updatePaymentDetails = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    //Check whether the customer exist
    const user = await User.findById(req.body.user);

    if(user){
      const stripeCustomer = await stripeInstance.customers.list({
        email: user.email,
      });
  
      let customer;
  
      if (stripeCustomer.data.length === 0) {
        customer = await stripeInstance.customers.create({
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          address: {
            city: user.address.city,
            line1: user.address.street,
            line2: user.address.houseNumber,
            postal_code: user.address.zipCode,
            country: user.address.country,
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
        success_url: `http://localhost:3000/profile/${req.body.user}`,
        cancel_url: `http://localhost:3000/profile/${req.body.user}`,
        client_reference_id: customer.id,
      });

      await User.findByIdAndUpdate(req.body.user, {paymentDetails: true});
      res.status(StatusCodes.OK).json({ url: session.url });
    } else{
      next(
        new HttpError(
          `User with ID: ${req.body.user} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

const updateProfilePicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const newAvatar = req.file;
    if (newAvatar) {
      req.body.profilePicture = `/images/${req.user.userID}/${newAvatar.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user.userID },
      { profilePicture: req.body.profilePicture }
    );
    if (newAvatar && updatedUser.profilePicture) {
      try {
        await fs.promises.access(`public${updatedUser.profilePicture}`);
        await fs.promises.unlink(`public${updatedUser.profilePicture}`);
      } catch (error) {
        console.log("Failed to delete local image");
      }
    }
    res.status(StatusCodes.OK).json({ msg: "Profile Picture updated" });
  }
);

const updateTitlePicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const newAvatar = req.file;
    if (newAvatar) {
      req.body.titlePicture = `/images/${req.user.userID}/${newAvatar.filename}`;
    }
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user.userID },
      { titlePicture: req.body.titlePicture }
    );

    if (newAvatar && updatedUser.titlePicture) {
      try {
        await fs.promises.access(`public${updatedUser.titlePicture}`);
        await fs.promises.unlink(`public${updatedUser.titlePicture}`);
      } catch (error) {
        console.log("Failed to delete local image");
      }
    }
    res.status(StatusCodes.OK).json({ msg: "Title Picture updated" });
  }
);

const updateIDPicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const newAvatars = req.files;
    if (newAvatars) {
      const pictureArray = [];
      for (let i = 0; i < newAvatars.length; i++) {
        pictureArray[
          i
        ] = `/images/${req.user.userID}/${newAvatars[i].filename}`;
      }
      req.body.identityCardPictures = pictureArray;
    }
    //entire array gets updated at once, as this is only a one time upload
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user.userID },
      {
        identityCardPictures: req.body.identityCardPictures,
        identityCardStatus: VERIFICATION_STATUS.PENDING,
      }
    );
    //email to admin, that new validation request is pending
    await emailMiddleware.handleMail(
      process.env.EMAIL_ADMIN,
      `New Identity Card Validation - USER: ${updatedUser._id}`,
      `<p>Dear Carus Team,<br><br>
      ${updatedUser.firstName} ${updatedUser.lastName} has uploaded identity card pictures<br><br>
      USER: ${updatedUser._id}<br><br>
      Please check the documents and verify or reject the onwership.<br><br>
      Best regards,<br>
      Your Carus Team Bot</p>`
    );

    // No deletion of old pictures is needed as you only upload ID pictures once

    res.status(StatusCodes.OK).json({ msg: "ID pictures updated" });
  }
);

const updateDrivingLicensePicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const newAvatars = req.files;
    if (newAvatars) {
      const pictureArray = [];
      for (let i = 0; i < newAvatars.length; i++) {
        pictureArray[
          i
        ] = `/images/${req.user.userID}/${newAvatars[i].filename}`;
      }
      req.body.drivingLicencePicture = pictureArray;
    }
    //entire array gets updated at once, as this is only a one time upload
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user.userID },
      {
        drivingLicensePictures: req.body.drivingLicencePicture,
        drivingLicenseStatus: VERIFICATION_STATUS.PENDING,
      }
    );
    //email to admin, that new validation request is pending
    await emailMiddleware.handleMail(
      process.env.EMAIL_ADMIN,
      `New Driving License Validation - USER: ${updatedUser._id}`,
      `<p>Dear Carus Team,<br><br>
      ${updatedUser.firstName} ${updatedUser.lastName} has uploaded driving license pictures<br><br>
      USER: ${updatedUser._id}<br><br>
      Please check the documents and verify or reject the onwership.<br><br>
      Best regards,<br>
      Your Carus Team Bot</p>`
    );
    // No deletion of old pictures is needed as you only upload ID pictures once

    res.status(StatusCodes.OK).json({ msg: "ID pictures updated" });
  }
);

const deleteProfilePicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user.userID },
      { $unset: { profilePicture: 1 } }
    );
    if (updatedUser) {
      try {
        await fs.promises.access(`public${updatedUser.profilePicture}`);
        await fs.promises.unlink(`public${updatedUser.profilePicture}`);
      } catch (error) {
        console.log("Failed to delete local image");
      }
    }
    res.status(StatusCodes.OK).json({ msg: "Profile Picture deleted" });
  }
);

const deleteTitlePicture = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: req.user.userID },
      { $unset: { titlePicture: 1 } }
    );
    if (updatedUser) {
      try {
        await fs.promises.access(`public${updatedUser.titlePicture}`);
        await fs.promises.unlink(`public${updatedUser.titlePicture}`);
      } catch (error) {
        console.log("Failed to delete local image");
      }
    }
    res.status(StatusCodes.OK).json({ msg: "Title Picture deleted" });
  }
);

const deleteUser = errorMiddleware.asyncErrorHandler(async (req, res, next) => {
  //delete cars, offers, reviews, renatals

  let deletionUser = await User.findById({ _id: req.user.userID });
  if (deletionUser) {
    for (let i = 0; i < deletionUser.ownedCars.length; i++) {
      await deleteCarInternal(req.user.userID, deletionUser.ownedCars[i]);
    }
    //delete picture folder
    try {
      await fs.promises.access(`public/images/${deletionUser._id}`);
      await fs.promises.rm(`public/images/${deletionUser._id}`, {
        recursive: true,
        force: true,
      });
    } catch (error) {
      console.log("Failed to delete local user image folder");
    }
    deletionUser = await User.findByIdAndDelete({ _id: req.user.userID });
    res.status(StatusCodes.OK).json({
      msg: "User was secessfully deleted. We are sorry to see you leave.",
    });
  } else {
    next(
      new HttpError(
        `User with ID: ${req.user.userID} not found.`,
        StatusCodes.NOT_FOUND
      )
    );
  }
});

const getProfilePicture = async (req, res) => {
  const __dirname = process.cwd();
  const user = await User.findById(req.params.userID);

  res.status(200);
  if (user.profilePicture) {
    res.sendFile(__dirname + `/public/${user.profilePicture}`);
  }
};

const getTitlePicture = async (req, res) => {
  const __dirname = process.cwd();
  const user = await User.findById(req.params.userID);

  res.status(200);
  if (user.titlePicture) {
    res.sendFile(__dirname + `/public/${user.titlePicture}`);
  }
};

//ROUTE GET - Get user by ID //TODO: Select only the properties that should be returned
const getOneUserById = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const user = await User.findById(req.params.userID);

    if (user) {
      res.status(200).json({ user });
    } else {
      next(new HttpError(`User with ID: ${req.params.userID} not found.`, 404));
    }
  }
);

//update user driving license
const updateDrivingLicenseStatus = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      { _id: req.body.userID },
      {
        drivingLicenseClasses: req.body.drivingLicenseClasses,
        drivingLicenseStatus: req.body.drivingLicenseStatus,
      }
    );
    if (user) {
      res
        .status(StatusCodes.OK)
        .json({ msg: "Driving license status updated" });
    } else {
      next(
        new HttpError(
          `User with ID: ${req.body.userID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

//update user identity card
const updateIdentityCardStatus = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
      { _id: req.body.userID },
      { identityCardStatus: req.body.identityCardStatus }
    );
    if (user) {
      res.status(StatusCodes.OK).json({ msg: "Identity card status updated" });
    } else {
      next(
        new HttpError(
          `User with ID: ${req.body.userID} not found.`,
          StatusCodes.NOT_FOUND
        )
      );
    }
  }
);

const getUserNameById = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const user = await User.findById(req.params.userID);

    if (user) {
      res.status(200).json({ fullName: user.firstName + " " + user.lastName });
    } else {
      next(new HttpError(`User with ID: ${req.params.userID} not found.`, 404));
    }
  }
);

const getUserRatingScore = errorMiddleware.asyncErrorHandler(
  async (req, res, next) => {
    const user = await User.findById(req.params.userID);

    if (user) {
      res.status(200).json({ rating: user.rating });
    } else {
      next(new HttpError(`User with ID: ${req.params.userID} not found.`, 404));
    }
  }
);

export {
  logout,
  updateUser,
  updatePassword,
  updatePaymentDetails,
  updateProfilePicture,
  updateTitlePicture,
  updateIDPicture,
  updateDrivingLicensePicture,
  deleteProfilePicture,
  deleteTitlePicture,
  deleteUser,
  getOneUserById,
  getProfilePicture,
  getTitlePicture,
  updateDrivingLicenseStatus,
  updateIdentityCardStatus,
  getUserNameById,
  getUserRatingScore,
};

//internal methods, should not be exposed to outside
//is called after car or user review was written
export async function updateRatingInternal(userID, rating, factor) {
  const user = await User.findById(userID);
  if (user) {
    user.ratingSum = user.ratingSum + rating;
    user.numberOfRatings = user.numberOfRatings + factor;
    if (user.numberOfRatings === 0) {
      user.rating = 0;
    } else {
      user.rating = user.ratingSum / user.numberOfRatings;
    }
    user.save();
    return true;
  } else {
    return false;
  }
}
export async function getAllUserIdsByName(lastName) {
  const users = await User.find({ lastName: lastName });
  return users;
}
