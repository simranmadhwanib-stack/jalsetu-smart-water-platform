import dotenv from 'dotenv';
import { nanoid } from 'nanoid';
import { connectDB } from './config/db.js';
import { Area } from './models/Area.js';
import { User } from './models/User.js';
import { WaterSchedule } from './models/WaterSchedule.js';
import { Tanker } from './models/Tanker.js';
import { Complaint } from './models/Complaint.js';
import { Notification } from './models/Notification.js';
import { Announcement } from './models/Announcement.js';
import { Analytics } from './models/Analytics.js';

dotenv.config();

const daysFromNow = (days) => new Date(Date.now() + days * 24 * 60 * 60 * 1000);

async function seed() {
  await connectDB(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jalsetu');
  await Promise.all([Area.deleteMany(), User.deleteMany(), WaterSchedule.deleteMany(), Tanker.deleteMany(), Complaint.deleteMany(), Notification.deleteMany(), Announcement.deleteMany(), Analytics.deleteMany()]);

  const areas = await Area.insertMany([
    { name: 'Ward 12 - Civil Lines', ward: '12', zone: 'North', population: 18400, households: 3900, coordinates: { lat: 28.6768, lng: 77.2257 }, waterSource: 'Yamuna WTP', storageCapacityKL: 3200, currentAvailabilityPercent: 82, shortageRisk: 'low' },
    { name: 'Ward 18 - Shakti Nagar', ward: '18', zone: 'North', population: 22100, households: 4600, coordinates: { lat: 28.6796, lng: 77.1954 }, waterSource: 'Sonia Vihar WTP', storageCapacityKL: 2800, currentAvailabilityPercent: 58, shortageRisk: 'medium' },
    { name: 'Ward 33 - Laxmi Nagar', ward: '33', zone: 'East', population: 30500, households: 6500, coordinates: { lat: 28.6304, lng: 77.2777 }, waterSource: 'Bhagirathi WTP', storageCapacityKL: 3500, currentAvailabilityPercent: 42, shortageRisk: 'high' }
  ]);

  const admin = await User.create({ name: 'JalSetu Admin', email: 'admin@jalsetu.gov', phone: '9999999999', password: 'Admin@123', role: 'admin', area: areas[0]._id, ward: 'HQ' });
  const citizen = await User.create({ name: 'Asha Verma', email: 'citizen@jalsetu.gov', phone: '8888888888', password: 'Citizen@123', role: 'citizen', area: areas[1]._id, ward: '18', language: 'hi' });

  await WaterSchedule.insertMany(areas.flatMap((area, index) => [
    { area: area._id, date: daysFromNow(0), startTime: index === 2 ? '18:00' : '06:30', endTime: index === 2 ? '19:15' : '08:00', durationMinutes: index === 2 ? 75 : 90, status: index === 2 ? 'delayed' : 'scheduled', waterAllocatedKL: 650 + index * 120, waterDeliveredKL: 0, notes: index === 2 ? 'Booster pump maintenance may affect pressure.' : 'Normal supply window.' },
    { area: area._id, date: daysFromNow(1), startTime: '06:30', endTime: '08:00', durationMinutes: 90, status: 'scheduled', waterAllocatedKL: 700 + index * 100 }
  ]));

  await Tanker.insertMany(areas.map((area, index) => ({ vehicleNumber: `DL-01-JS-${1200 + index}`, driverName: ['Ravi Kumar', 'Imran Khan', 'Suresh Pal'][index], driverPhone: `900000000${index}`, capacityKL: [12, 16, 20][index], assignedArea: area._id, currentLocation: { lat: area.coordinates.lat + 0.01, lng: area.coordinates.lng - 0.01, updatedAt: new Date() }, status: index === 0 ? 'delivering' : 'in_transit', etaMinutes: 12 + index * 8, deliveryStatus: 'On route', qrCode: `JALSETU-${nanoid(10)}` })));

  await Complaint.create({ citizen: citizen._id, area: areas[1]._id, title: 'Low pressure since morning', description: 'Water pressure is very low in lane 4.', category: 'low_pressure', priority: 'medium', status: 'acknowledged', assignedTo: 'Zone Engineer North' });
  await Announcement.create({ title: 'Pipeline maintenance notice', body: 'Supply in selected north wards may be delayed by 30 minutes today due to preventive maintenance.', severity: 'warning', areas: [areas[1]._id], publishedBy: admin._id });
  await Notification.create({ title: 'Supply starts soon', message: 'Water supply in Ward 18 starts at 6:30 AM. Please store responsibly.', type: 'supply_reminder', area: areas[1]._id, recipients: [citizen._id], sentAt: new Date() });

  const analytics = [];
  for (let d = 13; d >= 0; d -= 1) {
    areas.forEach((area, index) => analytics.push({ area: area._id, date: daysFromNow(-d), waterAllocatedKL: 620 + index * 130, waterDeliveredKL: 590 + index * 115 + (d % 4) * 14, tankersDispatched: 4 + index, complaintsReceived: (d + index) % 6, complaintsResolved: (d + index) % 4, supplyEfficiencyPercent: 86 + (d % 8), demandForecastKL: 690 + index * 140, shortageProbability: index === 2 ? 0.72 : 0.2 + index * 0.14, tankerUtilizationPercent: 70 + index * 8 }));
  }
  await Analytics.insertMany(analytics);
  console.log('Seeded JalSetu sample data');
  console.log('Admin: admin@jalsetu.gov / Admin@123');
  console.log('Citizen: citizen@jalsetu.gov / Citizen@123');
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
