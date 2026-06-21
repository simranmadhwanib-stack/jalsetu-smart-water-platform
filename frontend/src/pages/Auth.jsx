import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext.jsx';

export default function Auth() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'citizen@jalsetu.gov', phone: '', password: 'Citizen@123', role: 'citizen' });
  const [error, setError] = useState('');
  const { login, register } = useApp();
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault(); setError('');
    try {
      const user = mode === 'login' ? await login(form.email, form.password) : await register(form);
      navigate(user.role === 'admin' ? '/admin' : '/citizen');
    } catch (err) { setError(err.response?.data?.message || 'Demo tip: use admin@jalsetu.gov/Admin@123 or citizen@jalsetu.gov/Citizen@123 after seeding.'); }
  };
  return <div className="grid min-h-[calc(100vh-65px)] place-items-center bg-gradient-to-br from-sky-50 to-blue-100 p-4 dark:from-slate-950 dark:to-sky-950">
    <form onSubmit={submit} className="glass-card w-full max-w-md p-6"><div className="mb-6 flex items-center gap-3"><span className="rounded-2xl bg-jal-600 p-3 text-white"><Droplets /></span><div><h1 className="text-2xl font-black">{mode === 'login' ? 'Login to JalSetu' : 'Create citizen account'}</h1><p className="text-sm text-slate-500">Secure JWT authentication</p></div></div>
      {mode === 'register' && <><input className="input mb-3" placeholder="Full name" onChange={(e) => setForm({ ...form, name: e.target.value })} /><input className="input mb-3" placeholder="Phone" onChange={(e) => setForm({ ...form, phone: e.target.value })} /></>}
      <input className="input mb-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="input mb-3" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      {error && <p className="mb-3 rounded-2xl bg-amber-50 p-3 text-sm text-amber-700">{error}</p>}
      <button className="btn-primary w-full">{mode === 'login' ? 'Login' : 'Register'}</button>
      <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="mt-3 w-full text-sm font-semibold text-jal-700">{mode === 'login' ? 'Need an account?' : 'Already registered?'}</button>
      <div className="mt-4 rounded-2xl bg-sky-50 p-3 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">Demo credentials: admin@jalsetu.gov / Admin@123 · citizen@jalsetu.gov / Citizen@123</div>
    </form>
  </div>;
}
