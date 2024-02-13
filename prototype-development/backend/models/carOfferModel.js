import mongoose from "mongoose";

const Schema = mongoose.Schema; 

const carOfferSchema = new Schema(
  {
    creationDate: {type: Date,  default: Date.now, required: true},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    car: {type: Schema.Types.ObjectId, ref: 'Car', required: true},
    available: {type: Boolean, default: true, required: true},
    pricePerHour: {type: Number, required: true},
    offerStartDateTime: {type: Date, required: true},
    offerEndDateTime: {type: Date, required: true},
    additionalInformation: {type: String},
    termsAccepted: {type: Boolean, required:true},
    carRequests: [{type: Schema.Types.ObjectId, ref: 'CarRequest'}]
  },
  {timestamps: true}
);

carOfferSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

export default mongoose.model('CarOffer', carOfferSchema);
