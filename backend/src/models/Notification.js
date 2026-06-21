import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['supply_reminder', 'delay_alert', 'emergency', 'maintenance', 'complaint_update'], default: 'supply_reminder' },
  recipients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  area: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  channel: { type: String, enum: ['app', 'sms', 'push', 'email'], default: 'app' },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  scheduledFor: Date,
  sentAt: Date
}, { timestamps: true });

export const Notification = mongoose.model('Notification', notificationSchema);
