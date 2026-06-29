import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const Ctx = createContext(null);
export const useApp = () => useContext(Ctx);

export function AppProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [token, setToken]       = useState(() => localStorage.getItem('wai_token'));
  const [theme, setThemeState]  = useState(() => localStorage.getItem('wai_theme') || 'dark');
  const [settings, setSettings] = useState({ unit:'metric', notifications:true, defaultCity:'Seattle', autoLocation:false });
  const [notifications, setNotifs] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => { document.body.className = theme; localStorage.setItem('wai_theme', theme); }, [theme]);

  const authHeaders = useCallback(() => token ? { Authorization: `Bearer ${token}` } : {}, [token]);
  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setThemeState(next);
    if (token) axios.put('/api/user/settings', { theme: next }, { headers: { Authorization: `Bearer ${token}` } }).catch(()=>{});
  };

  useEffect(() => {
    if (!token) { setAuthLoading(false); return; }
    axios.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => { setUser(r.data); if (r.data.settings) { setSettings(r.data.settings); setThemeState(r.data.settings.theme || 'dark'); } })
      .catch(() => { setToken(null); localStorage.removeItem('wai_token'); })
      .finally(() => setAuthLoading(false));
  }, []);

  const fetchNotifs = useCallback(async () => {
    if (!token) return;
    try { const r = await axios.get('/api/user/notifications', { headers: authHeaders() }); setNotifs(r.data); } catch(e){}
  }, [token, authHeaders]);

  useEffect(() => { if (user) fetchNotifs(); }, [user]);

  const login = async (email, password) => {
    const r = await axios.post('/api/auth/login', { email, password });
    setToken(r.data.token); setUser(r.data.user);
    localStorage.setItem('wai_token', r.data.token);
    if (r.data.user.settings) { setSettings(r.data.user.settings); setThemeState(r.data.user.settings.theme || 'dark'); }
    setTimeout(() => axios.get('/api/user/notifications', { headers: { Authorization: `Bearer ${r.data.token}` } }).then(nr => setNotifs(nr.data)).catch(()=>{}), 100);
    return r.data;
  };

  const register = async (name, email, password) => {
    const r = await axios.post('/api/auth/register', { name, email, password });
    setToken(r.data.token); setUser(r.data.user);
    localStorage.setItem('wai_token', r.data.token);
    setTimeout(() => axios.get('/api/user/notifications', { headers: { Authorization: `Bearer ${r.data.token}` } }).then(nr => setNotifs(nr.data)).catch(()=>{}), 100);
    return r.data;
  };

  const logout = () => { setUser(null); setToken(null); setNotifs([]); localStorage.removeItem('wai_token'); };

  const saveSettings = async (patch) => {
    const merged = { ...settings, ...patch }; setSettings(merged);
    if (token) try { await axios.put('/api/user/settings', patch, { headers: authHeaders() }); } catch(e){}
  };

  const markAllRead = async () => {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    if (token) try { await axios.post('/api/user/notifications/read', {}, { headers: authHeaders() }); } catch(e){}
  };

  const testNotif = async () => {
    if (!token) return;
    try { const r = await axios.post('/api/user/notifications/test', {}, { headers: authHeaders() }); setNotifs(n => [r.data, ...n]); } catch(e){}
  };

  return (
    <Ctx.Provider value={{ user, token, theme, settings, notifications, unreadCount: notifications.filter(n=>!n.read).length,
      authLoading, login, register, logout, toggleTheme, saveSettings, markAllRead, testNotif, authHeaders, fetchNotifs }}>
      {children}
    </Ctx.Provider>
  );
}
