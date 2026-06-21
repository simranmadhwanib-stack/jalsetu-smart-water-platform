import { useEffect, useState } from 'react';
import { CalendarClock } from 'lucide-react';
import { api } from '../utils/api.js';
import { schedules } from '../data/mockData.js';
import { StatusBadge } from '../components/Cards.jsx';

export default function Schedule() {
  const [items, setItems] = useState(schedules);
  useEffect(() => { api.get('/schedules').then((r) => setItems(r.data)).catch(() => {}); }, []);
  return <div className="space-y-5"><h1 className="flex items-center gap-3 text-4xl font-black"><CalendarClock className="text-jal-600" /> Water Schedule</h1><div className="grid gap-4">{items.map((s) => <div key={s._id} className="glass-card grid gap-4 p-5 md:grid-cols-5 md:items-center"><div className="md:col-span-2"><h3 className="text-xl font-black">{s.area?.name}</h3><p className="text-slate-500">Ward {s.area?.ward} · {new Date(s.date).toLocaleDateString()}</p></div><b>{s.startTime} - {s.endTime}</b><p>{s.durationMinutes} minutes</p><StatusBadge status={s.status} /></div>)}</div></div>;
}
