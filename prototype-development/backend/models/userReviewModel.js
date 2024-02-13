import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userReviewSchema = new Schema(
  {
    creationDate: {type: Date,  default: Date.now, required: true},
    title: {type: String},
    content: {type: String},
    rating: {type: Number, required: true},
    reviewedUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    reviewingUser: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    rental: {type: Schema.Types.ObjectId, ref: 'Rental', required: true},
  },
  {timestamps: true}
);

userReviewSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

export default mongoose.model('UserReview', userReviewSchema);