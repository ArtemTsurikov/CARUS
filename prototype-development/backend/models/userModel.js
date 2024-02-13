import mongoose from "mongoose";
import { COUNTRY, DRIVINGLICENSE, ROLE, VERIFICATION_STATUS } from "../utils/constants.js";

const Schema = mongoose.Schema;


const userSchema = new Schema(
  {
    creationDate: {type: Date,  
      default: Date.now, 
      required: true, 
      immutable: true},
    role: {type: String, enum: 
      Object.values(ROLE), 
      default: ROLE.USER, 
      required: true}, //role can only be set by admin, internal variable
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {street: {type: String},
      houseNumber: {type: String},
      zipCode: {type: Number},
      city: {type: String},
      country: {
        type: String,
        enum: Object.values(COUNTRY),
        default: COUNTRY.GERMANY},
      latitude: {type: Number},
      longitude: {type: Number}},
    phoneNumber: {type: String},
    paymentDetails: {type: Boolean, default: false, required: true},
    profilePicture: {type: String},
    titlePicture: {type: String},
    description: {type: String},
    rating: {type: Number, default: 0, required: true},
    ratingSum: {type: Number, default: 0, required: true},
    numberOfRatings: {type: Number, default: 0, required: true},
    numberOfRentals: {type: Number, default: 0, required: true}, //number of rentals as borrower and as sharer
    identityCardPictures: [{type: String}],
    identityCardStatus: {type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.EMPTY,
      required: true},//variable is set by admin after identity card is approved
    drivingLicensePictures: [{type: String}],
    drivingLicenseClasses: {
      type: [String],
      enum: Object.values(DRIVINGLICENSE)},//variable is set by admin after driving license is approved
    drivingLicenseStatus: {type: String,
      enum: Object.values(VERIFICATION_STATUS),
      default: VERIFICATION_STATUS.EMPTY,
      required: true},//variable is set by admin after driving license is approved
    ownedCars: [{type: mongoose.Types.ObjectId, ref: 'Car'}],
    writtenUserReviews: [{ type: mongoose.Types.ObjectId, ref: 'UserReview'}],
    receivedUserReviews: [{ type: mongoose.Types.ObjectId, ref: 'UserReview'}],
    writtenCarReviews: [{ type: mongoose.Types.ObjectId, ref: 'CarReview'}],
    rentalsAsSharer: [{type: mongoose.Types.ObjectId, ref: 'Rental'}],
    rentalsAsBorrower: [{type: mongoose.Types.ObjectId, ref: 'Rental'}],
    carOffers: [{type: mongoose.Types.ObjectId, ref: 'CarOffer'}],
    createdCarRequests: [{type: mongoose.Types.ObjectId, ref: 'CarRequest'}],
    receivedCarRequests: [{type: mongoose.Types.ObjectId, ref: 'CarRequest'}]
  },
  {timestamps: true}
);

userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.role;
  delete obj.password;
  delete obj.ratingSum;
  delete obj.identityCardPictures;
  delete obj.drivingLicensePictures;
  return obj;
};

export default mongoose.model('User', userSchema);