import express from 'express';
import { adminUsers, aiForecast, analytics, chat, createComplaint, getDashboard, listAnnouncements, listAreas, listComplaints, listNotifications, listSchedules, listTankers, publishAnnouncement, sos, updateComplaint, upsertSchedule, upsertTanker, verifyTanker } from '../controllers/platformController.js';
import { authorize, protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

export const platformRouter = express.Router();
platformRouter.get('/areas', listAreas);
platformRouter.post('/chat', chat);
platformRouter.get('/tanker/verify/:code', verifyTanker);

platformRouter.use(protect);
platformRouter.get('/dashboard', getDashboard);
platformRouter.get('/schedules', listSchedules);
platformRouter.get('/tankers', listTankers);
platformRouter.get('/complaints', listComplaints);
platformRouter.post('/complaints', upload.single('image'), createComplaint);
platformRouter.get('/announcements', listAnnouncements);
platformRouter.get('/notifications', listNotifications);
platformRouter.get('/analytics', analytics);
platformRouter.get('/ai/forecast', aiForecast);
platformRouter.post('/sos', sos);

platformRouter.use(authorize('admin'));
platformRouter.post('/schedules', upsertSchedule);
platformRouter.put('/schedules/:id', upsertSchedule);
platformRouter.post('/tankers', upsertTanker);
platformRouter.put('/tankers/:id', upsertTanker);
platformRouter.patch('/complaints/:id', updateComplaint);
platformRouter.post('/announcements', publishAnnouncement);
platformRouter.get('/admin/users', adminUsers);
