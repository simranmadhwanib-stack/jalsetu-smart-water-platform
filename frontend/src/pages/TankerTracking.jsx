import { useEffect, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Truck } from 'lucide-react';
import MapPanel from '../components/MapPanel.jsx';
import { StatusBadge } from '../components/Cards.jsx';
import { api } from '../utils/api.js';
import { tankers } from '../data/mockData.js';

export default function TankerTracking() {
  const [items, setItems] = useState(tankers);
  useEffect(() => { api.get('/tankers').then((r) => setItems(r.data)).catch(() => {}); }, []);
  return <div className="space-y-6"><h1 className="flex items-center gap-3 text-4xl font-black"><Truck className="text-jal-600" /> Real-Time Tanker Tracking</h1><MapPanel tankers={items} /><div className="grid gap-4 md:grid-cols-3">{items.map((t) => <div key={t._id} className="glass-card p-5"><div className="flex justify-between"><div><h3 className="text-xl font-black">{t.vehicleNumber}</h3><p className="text-sm text-slate-500">Driver: {t.driverName}</p></div><StatusBadge status={t.status} /></div><p className="mt-3">ETA: <b>{t.etaMinutes} min</b> · Capacity: <b>{t.capacityKL} KL</b></p><div className="mt-4 inline-block rounded-2xl bg-white p-3"><QRCodeCanvas value={t.qrCode || t.vehicleNumber} size={96} /></div><p className="mt-2 text-xs text-slate-500">Scan for QR-based tanker verification</p></div>)}</div></div>;
}
