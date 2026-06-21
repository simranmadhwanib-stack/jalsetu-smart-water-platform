import mongoose from 'mongoose';

const waterScheduleSchema = new mongoose.Schema({
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area', required: true },
  date: { type: Date, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  durationMinutes: Number,
  status: { type: String, enum: ['scheduled', 'active', 'delayed', 'completed', 'cancelled'], default: 'scheduled' },
  waterAllocatedKL: { type: Number, default: 0 },
  waterDeliveredKL: { type: Number, default: 0 },
  pressureLevel: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  notes: String,
  delayReason: String
}, { timestamps: true });

export const WaterSchedule = mongoose.model('WaterSchedule', waterScheduleSchema);
