import mongoose from 'mongoose';

const tankerSchema = new mongoose.Schema({
  vehicleNumber: { type: String, required: true, unique: true },
  driverName: String,
  driverPhone: String,
  capacityKL: { type: Number, required: true },
  assignedArea: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  currentLocation: { lat: Number, lng: Number, updatedAt: Date },
  status: { type: String, enum: ['idle', 'assigned', 'in_transit', 'delivering', 'completed', 'maintenance'], default: 'idle' },
  etaMinutes: Number,
  deliveryStatus: String,
  qrCode: { type: String, unique: true },
  lastVerifiedAt: Date
}, { timestamps: true });

export const Tanker = mongoose.model('Tanker', tankerSchema);
