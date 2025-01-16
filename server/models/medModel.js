import mongoose from 'mongoose';

const medSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  medName: { type: String, required: true }, 
  purpose: { type: String }, 
  dosage: { type: String, required: true }, 
  type: { type: String, enum: ['Pill', 'Dissolvable', 'Other'], default: 'Other' }, 
  frequency: { type: String, required: true }, 
  startDate: { type: Date, required: true }, 
  endDate: { type: Date }, 
  notes: { type: String }, 
});

const Med = mongoose.model('Med', medSchema);
export default Med;
