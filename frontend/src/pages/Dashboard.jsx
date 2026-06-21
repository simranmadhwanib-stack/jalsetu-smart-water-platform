import { useEffect, useState } from 'react';
import { AlertTriangle, Clock, Droplets, Megaphone, Truck } from 'lucide-react';
import { api } from '../utils/api.js';
import { announcements, complaints, schedules, tankers } from '../data/mockData.js';
import { StatCard, StatusBadge } from '../components/Cards.jsx';
import MapPanel from '../components/MapPanel.jsx';
import Chatbot from '../components/Chatbot.jsx';

export default function Dashboard({ admin = false }) {
  const [data, setData] = useState({ todaySchedule: schedules[0], nextSchedule: schedules[1], announcements, tankers, complaints });
  useEffect(() => { api.get('/dashboard').then((res) => setData(res.data)).catch(() => {}); }, []);
  return <div className="space-y-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm font-bold uppercase text-jal-600">{admin ? 'Government command center' : 'Citizen water dashboard'}</p><h1 className="text-4xl font-black">{admin ? 'Admin Dashboard' : 'Welcome to JalSetu'}</h1></div><button className="btn-primary">Emergency SOS Water</button></div>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"><StatCard title="Today timing" value={`${data.todaySchedule?.startTime || '06:30'}-${data.todaySchedule?.endTime || '08:00'}`} subtitle="Reminder enabled" icon={Clock} /><StatCard title="Duration" value={`${data.todaySchedule?.durationMinutes || 90} min`} subtitle="Expected pressure normal" icon={Droplets} /><StatCard title="Active tankers" value={data.tankers?.length || 3} subtitle="QR verified delivery" icon={Truck} /><StatCard title="Alerts" value={data.announcements?.length || 2} subtitle="Maintenance and delays" icon={AlertTriangle} /></div>
    <div className="grid gap-6 lg:grid-cols-3"><div className="glass-card p-5 lg:col-span-2"><h2 className="mb-4 text-2xl font-black">Supply overview</h2><div className="space-y-3">{[data.todaySchedule, data.nextSchedule].filter(Boolean).map((s, i) => <div key={s._id || i} className="flex items-center justify-between rounded-2xl bg-sky-50 p-4 dark:bg-slate-800"><div><p className="font-bold">{s.area?.name || 'Selected ward'}</p><p className="text-sm text-slate-500">{s.startTime} to {s.endTime} · {s.waterAllocatedKL} KL allocated</p></div><StatusBadge status={s.status} /></div>)}</div></div><Chatbot /></div>
    <div className="grid gap-6 lg:grid-cols-2"><MapPanel tankers={data.tankers?.length ? data.tankers : tankers} /><div className="glass-card p-5"><h2 className="mb-4 flex items-center gap-2 text-2xl font-black"><Megaphone className="text-jal-600" /> Announcements</h2><div className="space-y-3">{(data.announcements?.length ? data.announcements : announcements).map((a) => <div key={a._id} className="rounded-2xl border border-sky-100 p-4 dark:border-slate-800"><StatusBadge status={a.severity} /><h3 className="mt-2 font-bold">{a.title}</h3><p className="text-sm text-slate-500">{a.body}</p></div>)}</div></div></div>
  </div>;
}
