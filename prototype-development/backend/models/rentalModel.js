import mongoose from 'mongoose';
import { RENTAL_STATUS } from "../utils/constants.js";

const Schema = mongoose.Schema;  

const rentalSchema = new Schema(
  {
    rentalStatus: { 
      type: String,
      enum: Object.values(RENTAL_STATUS),
      required: true},
    car: {type: Schema.Types.ObjectId, ref: 'Car', required: true},
    sharingUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    borrowingUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    requestStartDateTime: {type: Date, required: true},
    requestEndDateTime: {type: Date, required: true},
    rentalFee: {type: Number, required: true},
    totalRentalAmount: {type: Number, required: true,},
    insurance: {type: mongoose.Types.ObjectId, ref: 'Insurance', required: true},
    carRequest: {type: Schema.Types.ObjectId, ref: 'CarRequest', required: true},
    reviewedByRenter: {type: Boolean, default: false, required: true},
    reviewedBySharer: {type: Boolean, default: false, required: true}
  },
  {timestamps: true}
);

rentalSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

export default mongoose.model('Rental', rentalSchema);