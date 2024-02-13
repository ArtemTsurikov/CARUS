import mongoose from "mongoose";

const Schema = mongoose.Schema;

const carReviewSchema = new Schema(
  {
    creationDate: {type: Date,  default: Date.now, required: true},
    title: {type: String},
    content: {type: String},
    rating: {type: Number, required: true},
    car: {type: Schema.Types.ObjectId, ref: 'Car', required: true},
    reviewingUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    rental: {type: Schema.Types.ObjectId, ref: 'Rental', required: true},
  },
  {timestamps: true}
);

carReviewSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

export default mongoose.model('CarReview', carReviewSchema);