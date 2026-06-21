import { Area } from '../models/Area.js';
import { WaterSchedule } from '../models/WaterSchedule.js';
import { Tanker } from '../models/Tanker.js';
import { Complaint } from '../models/Complaint.js';
import { Notification } from '../models/Notification.js';
import { Announcement } from '../models/Announcement.js';
import { Analytics } from '../models/Analytics.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { categorizeComplaint, chatbotReply, predictAreaDemand } from '../services/aiService.js';

export const listAreas = asyncHandler(async (_req, res) => res.json(await Area.find().sort('name')));

export const getDashboard = asyncHandler(async (req, res) => {
  const area = req.query.area || req.user.area;
  const filter = area ? { area } : {};
  const [todaySchedule, nextSchedule, announcements, notifications, tankers, complaints] = await Promise.all([
    WaterSchedule.findOne({ ...filter, date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } }).populate('area'),
    WaterSchedule.findOne({ ...filter, date: { $gte: new Date() } }).sort('date startTime').populate('area'),
    Announcement.find({ isPublished: true }).sort('-createdAt').limit(5).populate('areas'),
    Notification.find(area ? { $or: [{ area }, { recipients: req.user._id }] } : {}).sort('-createdAt').limit(8),
    Tanker.find(area ? { assignedArea: area } : {}).populate('assignedArea').limit(6),
    Complaint.find(req.user.role === 'admin' ? filter : { citizen: req.user._id }).sort('-createdAt').limit(6).populate('area')
  ]);
  res.json({ todaySchedule, nextSchedule, announcements, notifications, tankers, complaints });
});

export const listSchedules = asyncHandler(async (req, res) => {
  const filter = req.query.area ? { area: req.query.area } : {};
  res.json(await WaterSchedule.find(filter).sort('date startTime').populate('area'));
});

export const upsertSchedule = asyncHandler(async (req, res) => {
  const schedule = req.params.id ? await WaterSchedule.findByIdAndUpdate(req.params.id, req.body, { new: true }) : await WaterSchedule.create(req.body);
  res.status(req.params.id ? 200 : 201).json(schedule);
});

export const listTankers = asyncHandler(async (_req, res) => res.json(await Tanker.find().populate('assignedArea').sort('vehicleNumber')));

export const upsertTanker = asyncHandler(async (req, res) => {
  const payload = req.body;
  const tanker = req.params.id ? await Tanker.findByIdAndUpdate(req.params.id, payload, { new: true }) : await Tanker.create(payload);
  res.status(req.params.id ? 200 : 201).json(tanker);
});

export const verifyTanker = asyncHandler(async (req, res) => {
  const tanker = await Tanker.findOneAndUpdate({ qrCode: req.params.code }, { lastVerifiedAt: new Date() }, { new: true }).populate('assignedArea');
  if (!tanker) return res.status(404).json({ message: 'Invalid tanker QR code' });
  res.json({ verified: true, tanker });
});

export const createComplaint = asyncHandler(async (req, res) => {
  const ai = categorizeComplaint(`${req.body.title} ${req.body.description}`);
  const complaint = await Complaint.create({ ...req.body, ...ai, citizen: req.user._id, area: req.body.area || req.user.area, imageUrl: req.file ? `/uploads/${req.file.filename}` : undefined });
  res.status(201).json(complaint);
});

export const listComplaints = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { citizen: req.user._id };
  res.json(await Complaint.find(filter).populate('citizen area').sort('-createdAt'));
});

export const updateComplaint = asyncHandler(async (req, res) => res.json(await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true })));

export const publishAnnouncement = asyncHandler(async (req, res) => res.status(201).json(await Announcement.create({ ...req.body, publishedBy: req.user._id })));
export const listAnnouncements = asyncHandler(async (_req, res) => res.json(await Announcement.find({ isPublished: true }).populate('areas').sort('-createdAt')));

export const listNotifications = asyncHandler(async (req, res) => {
  const query = { $or: [{ recipients: req.user._id }, { area: req.user.area }, { recipients: { $size: 0 } }] };
  res.json(await Notification.find(query).sort('-createdAt').limit(50));
});

export const analytics = asyncHandler(async (_req, res) => {
  const [series, areas, tankers, complaints] = await Promise.all([
    Analytics.find().sort('date').populate('area').limit(60),
    Area.find(),
    Tanker.find(),
    Complaint.find()
  ]);
  const totals = {
    totalWaterAllocated: series.reduce((sum, item) => sum + (item.waterAllocatedKL || 0), 0),
    totalWaterDelivered: series.reduce((sum, item) => sum + (item.waterDeliveredKL || 0), 0),
    tankersDispatched: series.reduce((sum, item) => sum + (item.tankersDispatched || 0), 0),
    areasServed: areas.length,
    openComplaints: complaints.filter((c) => !['resolved', 'closed'].includes(c.status)).length,
    activeTankers: tankers.filter((t) => ['assigned', 'in_transit', 'delivering'].includes(t.status)).length
  };
  res.json({ totals, series });
});

export const aiForecast = asyncHandler(async (_req, res) => {
  const areas = await Area.find();
  const forecasts = await Promise.all(areas.map(async (area) => {
    const history = await Analytics.find({ area: area._id }).sort('-date').limit(7);
    return { area, ...predictAreaDemand(area, history) };
  }));
  res.json(forecasts);
});

export const chat = asyncHandler(async (req, res) => res.json({ answer: chatbotReply(req.body.question, req.body.context) }));

export const sos = asyncHandler(async (req, res) => {
  const complaint = await Complaint.create({ citizen: req.user._id, area: req.body.area || req.user.area, title: 'Emergency SOS Water Request', description: req.body.description || 'Urgent water support requested', category: 'no_supply', priority: 'critical', status: 'submitted', location: req.body.location });
  res.status(201).json({ message: 'Emergency water request registered and escalated', complaint });
});

export const adminUsers = asyncHandler(async (_req, res) => res.json(await User.find().select('-password').populate('area').sort('-createdAt')));
