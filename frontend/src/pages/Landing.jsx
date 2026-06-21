import { Link } from 'react-router-dom';
import { Activity, BellRing, Bot, Droplets, MapPin, ShieldCheck } from 'lucide-react';

export default function Landing() {
  const features = [
    ['Transparent schedules', Droplets, 'Live supply timings, duration, emergency alerts, and ward-wise availability.'],
    ['Real-time tanker tracking', MapPin, 'OpenStreetMap ETA, QR verification, capacity, and delivery status.'],
    ['AI governance', Bot, 'Demand prediction, shortage alerts, smart complaint categorization, and JalMitra chatbot.'],
    ['Citizen trust', ShieldCheck, 'Daily allocation, delivery, reports, complaints, and public announcements.']
  ];
  return <div className="overflow-hidden">
    <section className="relative bg-gradient-to-br from-sky-50 via-white to-blue-100 px-4 py-20 dark:from-slate-950 dark:via-slate-900 dark:to-sky-950">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div><span className="badge bg-sky-100 text-jal-700">Government-grade water transparency</span><h1 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">JalSetu connects citizens, tankers, schedules, and AI insights.</h1><p className="mt-6 text-lg text-slate-600 dark:text-slate-300">A hackathon-ready smart water distribution platform for reliable communication, faster complaint resolution, shortage prediction, and transparent delivery reporting.</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/login" className="btn-primary">Launch Platform</Link><a href="#features" className="btn-secondary">Explore Features</a></div></div>
        <div className="glass-card p-6"><div className="rounded-3xl bg-gradient-to-br from-jal-600 to-blue-900 p-6 text-white"><div className="flex items-center justify-between"><Droplets size={44} /><BellRing /></div><p className="mt-8 text-sm text-sky-100">Today · Ward 18</p><h2 className="text-4xl font-black">Supply starts in 24 min</h2><div className="mt-6 grid grid-cols-2 gap-4"><div className="rounded-2xl bg-white/15 p-4"><p>Allocated</p><b className="text-2xl">780 KL</b></div><div className="rounded-2xl bg-white/15 p-4"><p>Tanker ETA</p><b className="text-2xl">12 min</b></div></div></div></div>
      </div>
    </section>
    <section id="features" className="mx-auto grid max-w-7xl gap-5 px-4 py-16 md:grid-cols-2 lg:grid-cols-4">{features.map(([title, Icon, text]) => <div key={title} className="glass-card p-6"><Icon className="text-jal-600" /><h3 className="mt-4 text-xl font-black">{title}</h3><p className="mt-2 text-slate-500 dark:text-slate-400">{text}</p></div>)}</section>
    <section className="mx-auto max-w-7xl px-4 pb-16"><div className="glass-card grid gap-6 p-8 md:grid-cols-3"><div><Activity className="text-jal-600" /><h3 className="mt-3 text-2xl font-black">Production-ready modules</h3></div><p className="text-slate-500 dark:text-slate-400 md:col-span-2">Includes JWT auth, MongoDB schemas, Express APIs, React dashboards, Tailwind mobile-first UI, i18n, dark mode, Firebase notification hooks, SOS water requests, and deployment docs.</p></div></section>
  </div>;
}
