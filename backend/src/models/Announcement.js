import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  severity: { type: String, enum: ['info', 'warning', 'emergency'], default: 'info' },
  areas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  publishedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: Date,
  isPublished: { type: Boolean, default: true }
}, { timestamps: true });

export const Announcement = mongoose.model('Announcement', announcementSchema);
