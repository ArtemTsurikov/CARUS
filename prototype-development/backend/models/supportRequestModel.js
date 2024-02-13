import mongoose from 'mongoose';

const Schema = mongoose.Schema;    

const supportRequestSchema = new Schema(
  {
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    email: {type: String, required: true},
    message: {type: String, required: true}
  },
  {timestamps: true}
);

supportRequestSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

export default mongoose.model('SupportRequest', supportRequestSchema);