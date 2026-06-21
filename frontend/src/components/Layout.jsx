import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, Bell, CalendarClock, Droplets, Home, LogOut, MapPin, Megaphone, Moon, Shield, Sun, UserCircle } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

const nav = [
  { to: '/citizen', label: 'dashboard', icon: Home, roles: ['citizen'] },
  { to: '/admin', label: 'dashboard', icon: Shield, roles: ['admin'] },
  { to: '/schedule', label: 'schedules', icon: CalendarClock },
  { to: '/tankers', label: 'tankers', icon: MapPin },
  { to: '/complaints', label: 'complaints', icon: Megaphone },
  { to: '/analytics', label: 'analytics', icon: BarChart3 },
  { to: '/notifications', label: 'notifications', icon: Bell },
  { to: '/profile', label: 'profile', icon: UserCircle }
];

export default function Layout() {
  const { user, logout, t, language, setLanguage, darkMode, setDarkMode } = useApp();
  const location = useLocation();
  const visible = nav.filter((item) => !item.roles || item.roles.includes(user?.role || 'citizen'));
  return <div className="min-h-screen">
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-3 font-black text-xl text-jal-700 dark:text-sky-300"><span className="rounded-2xl bg-gradient-to-br from-sky-400 to-blue-700 p-2 text-white"><Droplets /></span> JalSetu</Link>
        <div className="flex items-center gap-2">
          <button onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="btn-secondary !px-3 !py-2">{language === 'en' ? 'हिंदी' : 'EN'}</button>
          <button onClick={() => setDarkMode(!darkMode)} className="btn-secondary !px-3 !py-2">{darkMode ? <Sun size={18} /> : <Moon size={18} />}</button>
          {user ? <button onClick={logout} className="hidden items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-white md:flex dark:bg-white dark:text-slate-900"><LogOut size={16} />{t('logout')}</button> : <Link className="btn-primary !py-2" to="/login">{t('login')}</Link>}
        </div>
      </div>
    </header>
    {user && <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-sky-100 bg-white/95 p-2 dark:border-slate-800 dark:bg-slate-950/95 md:left-0 md:top-[65px] md:right-auto md:w-24 md:border-r md:border-t-0">
      <div className="flex justify-around md:flex-col md:items-center md:gap-3">
        {visible.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} className={({ isActive }) => `flex flex-col items-center gap-1 rounded-2xl px-3 py-2 text-xs ${isActive || location.pathname === to ? 'bg-sky-100 text-jal-700 dark:bg-sky-950 dark:text-sky-200' : 'text-slate-500'}`}><Icon size={20} /><span className="hidden lg:block">{t(label)}</span></NavLink>)}
      </div>
    </nav>}
    <main className={user ? 'mx-auto max-w-7xl px-4 pb-24 pt-6 md:pl-28' : ''}><Outlet /></main>
  </div>;
}
