import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  date: { type: Date, required: true },
  waterAllocatedKL: Number,
  waterDeliveredKL: Number,
  tankersDispatched: Number,
  complaintsReceived: Number,
  complaintsResolved: Number,
  supplyEfficiencyPercent: Number,
  demandForecastKL: Number,
  shortageProbability: Number,
  tankerUtilizationPercent: Number
}, { timestamps: true });

export const Analytics = mongoose.model('Analytics', analyticsSchema);
