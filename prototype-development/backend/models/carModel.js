import mongoose from "mongoose";
import {
  COUNTRY,
  CAR_TYPE,
  FUEL_TYPE,
  TRANSMISSION_TYPE,
  CAR_EQUIPMENT,
  DRIVINGLICENSE,
  CAR_BRAND,
  AVERAGE_RANGES,
  VERIFICATION_STATUS,
} from "../utils/constants.js";

const Schema = mongoose.Schema;

const carSchema = new Schema(
  {
    carBrand: { type: String, enum: Object.values(CAR_BRAND), required: true },
    carModel: { type: String, required: true },
    averageRange: {
      type: String,
      enum: Object.values(AVERAGE_RANGES),
      required: true,
    },
    description: { type: String },
    maxNumberPassengers: { type: Number, default: 0, required: true },
    numberOfRentals: { type: Number, default: 0, required: true },
    location: {
      zipCode: { type: Number },
      city: { type: String },
      country: {
        type: String,
        enum: Object.values(COUNTRY),
        default: COUNTRY.GERMANY,
      },
    },
    rating: { type: Number, default: 0, required: true },
    ratingSum: { type: Number, default: 0, required: true },
    numberOfRatings: { type: Number, default: 0, required: true },
    carTitlePicture: { type: String },
    carPictures: { type: [String] },
    petFriendly: { type: Boolean },
    smokingFriendly: { type: Boolean },
    carType: {
      type: String,
      enum: Object.values(CAR_TYPE),
      required: true,
    },
    fuelType: {
      type: String,
      enum: Object.values(FUEL_TYPE),
      required: true,
    },
    transmissionType: {
      type: String,
      enum: Object.values(TRANSMISSION_TYPE),
      required: true,
    },
    carEquipement: {
      type: [String],
      enum: Object.values(CAR_EQUIPMENT),
    },
    drivingLicense: {
      type: String,
      enum: Object.values(DRIVINGLICENSE),
      required: true,
    },
    carOwnerships: { type: [String] },
    licensePlateNumber: { type: String }, //proof of car ownership, can only be set by admin, internal variable, set after car ownership document is approved
    carOwenrshipVerificationStatus: { type: String, 
      enum: Object.values(VERIFICATION_STATUS), 
      default: VERIFICATION_STATUS.EMPTY,
      required: true}, //proof of car ownership, can only be set by admin, internal variable, set after car ownership document is approved
    owner: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    carReviews: [{ type: mongoose.Types.ObjectId, ref: 'CarReview' }],
    //rental: {type: Schema.Types.ObjectId, ref: 'Rental'},
    carOffers: [{ type: mongoose.Types.ObjectId, ref: "CarOffer" }],
    carRequests: [{ type: mongoose.Types.ObjectId, ref: "CarRequest" }],
    carRentals: [{ type: mongoose.Types.ObjectId, ref: "Rental" }],
  },
  { timestamps: true }
);

carSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.ratingSum;
  delete obj.licensePlateNumber; //internal variable, only for admin
  return obj;
};

export default mongoose.model("Car", carSchema);
