export default function MapPanel({ tankers = [] }) {
  const center = tankers[0]?.currentLocation || { lat: 28.65, lng: 77.23 };
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${center.lng - 0.08}%2C${center.lat - 0.05}%2C${center.lng + 0.08}%2C${center.lat + 0.05}&layer=mapnik&marker=${center.lat}%2C${center.lng}`;
  return <div className="glass-card overflow-hidden">
    <iframe title="OpenStreetMap tanker tracking" src={url} className="h-80 w-full border-0" loading="lazy" />
    <div className="grid gap-3 p-4 md:grid-cols-3">{tankers.map((t) => <div key={t._id} className="rounded-2xl bg-sky-50 p-3 dark:bg-slate-800"><p className="font-bold">{t.vehicleNumber}</p><p className="text-sm text-slate-500">ETA {t.etaMinutes} min · {t.capacityKL} KL</p></div>)}</div>
  </div>;
}
