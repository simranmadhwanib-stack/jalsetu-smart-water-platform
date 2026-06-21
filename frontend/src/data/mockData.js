export const areas = [
  { _id: 'a1', name: 'Ward 12 - Civil Lines', ward: '12', currentAvailabilityPercent: 82, shortageRisk: 'low', coordinates: { lat: 28.6768, lng: 77.2257 } },
  { _id: 'a2', name: 'Ward 18 - Shakti Nagar', ward: '18', currentAvailabilityPercent: 58, shortageRisk: 'medium', coordinates: { lat: 28.6796, lng: 77.1954 } },
  { _id: 'a3', name: 'Ward 33 - Laxmi Nagar', ward: '33', currentAvailabilityPercent: 42, shortageRisk: 'high', coordinates: { lat: 28.6304, lng: 77.2777 } }
];

export const schedules = [
  { _id: 's1', area: areas[0], date: new Date().toISOString(), startTime: '06:30', endTime: '08:00', durationMinutes: 90, status: 'scheduled', waterAllocatedKL: 650, pressureLevel: 'normal' },
  { _id: 's2', area: areas[1], date: new Date().toISOString(), startTime: '07:00', endTime: '08:30', durationMinutes: 90, status: 'active', waterAllocatedKL: 780, pressureLevel: 'normal' },
  { _id: 's3', area: areas[2], date: new Date().toISOString(), startTime: '18:00', endTime: '19:15', durationMinutes: 75, status: 'delayed', waterAllocatedKL: 920, pressureLevel: 'low' }
];

export const tankers = [
  { _id: 't1', vehicleNumber: 'DL-01-JS-1200', driverName: 'Ravi Kumar', capacityKL: 12, assignedArea: areas[0], status: 'delivering', etaMinutes: 12, qrCode: 'JALSETU-DEMO-1200', currentLocation: { lat: 28.6868, lng: 77.2157 } },
  { _id: 't2', vehicleNumber: 'DL-01-JS-1201', driverName: 'Imran Khan', capacityKL: 16, assignedArea: areas[1], status: 'in_transit', etaMinutes: 20, qrCode: 'JALSETU-DEMO-1201', currentLocation: { lat: 28.6896, lng: 77.1854 } },
  { _id: 't3', vehicleNumber: 'DL-01-JS-1202', driverName: 'Suresh Pal', capacityKL: 20, assignedArea: areas[2], status: 'assigned', etaMinutes: 28, qrCode: 'JALSETU-DEMO-1202', currentLocation: { lat: 28.6404, lng: 77.2677 } }
];

export const analyticsSeries = Array.from({ length: 14 }).map((_, i) => ({
  day: `D-${13 - i}`,
  delivered: 1800 + i * 45 + (i % 3) * 90,
  allocated: 2100 + i * 35,
  complaints: 18 - (i % 7),
  efficiency: 82 + (i % 9),
  tankers: 12 + (i % 5)
}));

export const complaints = [
  { _id: 'c1', title: 'Low pressure in lane 4', category: 'low_pressure', priority: 'medium', status: 'acknowledged', area: areas[1] },
  { _id: 'c2', title: 'Tanker delayed near school', category: 'tanker_delay', priority: 'high', status: 'assigned', area: areas[2] }
];

export const announcements = [
  { _id: 'n1', title: 'Pipeline maintenance notice', body: 'North zone supply may be delayed by 30 minutes today.', severity: 'warning' },
  { _id: 'n2', title: 'Water saving drive', body: 'Citizens saved 1.2 ML this week through responsible storage.', severity: 'info' }
];
