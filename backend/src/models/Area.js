import mongoose from 'mongoose';

const areaSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  ward: { type: String, required: true },
  zone: String,
  population: { type: Number, default: 0 },
  households: { type: Number, default: 0 },
  coordinates: { lat: Number, lng: Number },
  waterSource: String,
  storageCapacityKL: Number,
  currentAvailabilityPercent: { type: Number, default: 70 },
  shortageRisk: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
}, { timestamps: true });

export const Area = mongoose.model('Area', areaSchema);
