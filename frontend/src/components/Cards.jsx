const toneClasses = {
  sky: 'bg-sky-100 text-sky-700 dark:bg-slate-800 dark:text-sky-300',
  emerald: 'bg-emerald-100 text-emerald-700 dark:bg-slate-800 dark:text-emerald-300',
  amber: 'bg-amber-100 text-amber-700 dark:bg-slate-800 dark:text-amber-300',
  red: 'bg-red-100 text-red-700 dark:bg-slate-800 dark:text-red-300'
};

export function StatCard({ title, value, subtitle, icon: Icon, tone = 'sky' }) {
  return <div className="glass-card p-5">
    <div className="flex items-center justify-between"><div><p className="text-sm text-slate-500 dark:text-slate-400">{title}</p><h3 className="mt-2 text-3xl font-black">{value}</h3></div>{Icon && <div className={`rounded-2xl p-3 ${toneClasses[tone] || toneClasses.sky}`}><Icon /></div>}</div>
    {subtitle && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
  </div>;
}

export function StatusBadge({ status }) {
  const map = { active: 'bg-emerald-100 text-emerald-700', scheduled: 'bg-sky-100 text-sky-700', delayed: 'bg-amber-100 text-amber-700', high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-emerald-100 text-emerald-700', critical: 'bg-red-100 text-red-700', emergency: 'bg-red-100 text-red-700', warning: 'bg-amber-100 text-amber-700', info: 'bg-sky-100 text-sky-700' };
  return <span className={`badge ${map[status] || 'bg-slate-100 text-slate-700'}`}>{status?.replace('_', ' ')}</span>;
}
