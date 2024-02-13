import mongoose from 'mongoose';
import { CAR_REQUEST_STATUS } from "../utils/constants.js";

const Schema = mongoose.Schema;    

const carRequestSchema = new Schema(
  {
    requestStartDateTime: {type: Date, required: true},
    requestEndDateTime: {type: Date, required: true},
    rentalFee: {type: Number, required: true},
    totalRentalAmount: {type: Number, required: true,},
    carRequestStatus: { 
      type: String,
      enum: Object.values(CAR_REQUEST_STATUS),
      default: CAR_REQUEST_STATUS.PENDING,
      required: true
    },
    additionalInformation: {type:String, required: false},
    checkoutSession: {type: String, required: true},
    car: {type: mongoose.Types.ObjectId, ref: 'Car', required: true},
    carOffer: {type: mongoose.Types.ObjectId, ref: 'CarOffer', required: true},
    insurance: {type: mongoose.Types.ObjectId, ref: 'Insurance', required: true},
    requestingUser: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    receivingUser: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    rental: {type: mongoose.Types.ObjectId, ref:'Rental', required: false}
  },
  {timestamps: true}
);

carRequestSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

export default mongoose.model('CarRequest', carRequestSchema);