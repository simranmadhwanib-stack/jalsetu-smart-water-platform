import { useEffect, useState } from 'react';
import { BellRing } from 'lucide-react';
import { api } from '../utils/api.js';

export default function Notifications() {
  const [items, setItems] = useState([{ _id: '1', title: 'Supply reminder', message: 'Ward 18 water supply starts at 6:30 AM.', type: 'supply_reminder' }, { _id: '2', title: 'Delay alert', message: 'Laxmi Nagar tanker delayed by 15 minutes.', type: 'delay_alert' }]);
  useEffect(() => { api.get('/notifications').then((r) => setItems(r.data)).catch(() => {}); }, []);
  return <div className="space-y-5"><h1 className="flex items-center gap-3 text-4xl font-black"><BellRing className="text-jal-600" /> Notification Center</h1>{items.map((n) => <div key={n._id} className="glass-card p-5"><p className="text-xs font-bold uppercase text-jal-600">{n.type?.replace('_', ' ')}</p><h3 className="text-xl font-black">{n.title}</h3><p className="text-slate-500">{n.message}</p></div>)}</div>;
}
