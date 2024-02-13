import mongoose from 'mongoose';

const Schema = mongoose.Schema;    

const insuranceSchema = new Schema(
  {
    packageName: {type: String, required: true},
    packageCoverage: {type: String, required: true},
    packagePrice: {type: Number, required: true}
  },
  {timestamps: true}
);

insuranceSchema.methods.toJSON = function () {
  var obj = this.toObject();
  return obj;
};

export default mongoose.model('Insurance', insuranceSchema);