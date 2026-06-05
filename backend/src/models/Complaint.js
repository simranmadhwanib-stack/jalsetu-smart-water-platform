import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  citizen: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ['no_supply', 'low_pressure', 'quality', 'leakage', 'tanker_delay', 'billing', 'other'], default: 'other' },
  priority: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
  status: { type: String, enum: ['submitted', 'acknowledged', 'assigned', 'in_progress', 'resolved', 'closed'], default: 'submitted' },
  imageUrl: String,
  assignedTo: String,
  resolutionNote: String,
  location: { lat: Number, lng: Number }
}, { timestamps: true });

export const Complaint = mongoose.model('Complaint', complaintSchema);
