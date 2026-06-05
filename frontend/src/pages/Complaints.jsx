import { useEffect, useState } from 'react';
import { Camera, Megaphone } from 'lucide-react';
import { api } from '../utils/api.js';
import { complaints } from '../data/mockData.js';
import { StatusBadge } from '../components/Cards.jsx';

export default function Complaints() {
  const [items, setItems] = useState(complaints);
  const [form, setForm] = useState({ title: '', description: '', area: '' });
  useEffect(() => { api.get('/complaints').then((r) => setItems(r.data)).catch(() => {}); }, []);
  const submit = async (e) => { e.preventDefault(); const fd = new FormData(); Object.entries(form).forEach(([k, v]) => fd.append(k, v)); try { const { data } = await api.post('/complaints', fd); setItems([data, ...items]); setForm({ title: '', description: '', area: '' }); } catch { setItems([{ _id: Date.now(), ...form, category: 'other', priority: 'medium', status: 'submitted' }, ...items]); } };
  return <div className="grid gap-6 lg:grid-cols-3"><form onSubmit={submit} className="glass-card p-5"><h1 className="mb-4 flex items-center gap-2 text-2xl font-black"><Megaphone className="text-jal-600" /> Complaint Portal</h1><input className="input mb-3" placeholder="Complaint title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /><textarea className="input mb-3 min-h-32" placeholder="Describe the issue" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /><label className="mb-3 flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed border-sky-300 p-4 text-sm"><Camera /> Upload photo<input type="file" className="hidden" onChange={(e) => setForm({ ...form, image: e.target.files[0] })} /></label><button className="btn-primary w-full">Submit complaint</button></form><div className="space-y-4 lg:col-span-2">{items.map((c) => <div key={c._id} className="glass-card p-5"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="text-xl font-black">{c.title}</h3><div className="flex gap-2"><StatusBadge status={c.priority} /><StatusBadge status={c.status} /></div></div><p className="mt-2 text-slate-500">AI category: {c.category?.replace('_', ' ')} · Area: {c.area?.name || 'Selected ward'}</p></div>)}</div></div>;
}
