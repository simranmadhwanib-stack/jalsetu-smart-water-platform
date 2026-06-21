import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../utils/api.js';

const translations = {
  en: { dashboard: 'Dashboard', schedules: 'Schedules', tankers: 'Tankers', complaints: 'Complaints', analytics: 'Analytics', notifications: 'Notifications', profile: 'Profile', login: 'Login', logout: 'Logout' },
  hi: { dashboard: 'डैशबोर्ड', schedules: 'समय-सारणी', tankers: 'टैंकर', complaints: 'शिकायतें', analytics: 'विश्लेषण', notifications: 'सूचनाएं', profile: 'प्रोफ़ाइल', login: 'लॉगिन', logout: 'लॉगआउट' }
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('jalsetu_user') || 'null'));
  const [language, setLanguage] = useState(() => localStorage.getItem('jalsetu_lang') || user?.language || 'en');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('jalsetu_dark') === 'true');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('jalsetu_dark', String(darkMode));
  }, [darkMode]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('jalsetu_token', data.token);
    localStorage.setItem('jalsetu_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('jalsetu_token', data.token);
    localStorage.setItem('jalsetu_user', JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('jalsetu_token');
    localStorage.removeItem('jalsetu_user');
    setUser(null);
  };

  const t = (key) => translations[language]?.[key] || translations.en[key] || key;
  const changeLanguage = (lang) => { setLanguage(lang); localStorage.setItem('jalsetu_lang', lang); };

  const value = useMemo(() => ({ user, setUser, login, register, logout, language, setLanguage: changeLanguage, darkMode, setDarkMode, t }), [user, language, darkMode]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
