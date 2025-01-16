import mongoose from 'mongoose';

const generalInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  BMI: { type: Number },
});

const GeneralInfo = mongoose.model('GeneralInfo', generalInfoSchema);
export default GeneralInfo;
