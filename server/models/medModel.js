import mongoose from 'mongoose';

const medSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
});

const Med = mongoose.model('Med', medSchema);
export default Med;
