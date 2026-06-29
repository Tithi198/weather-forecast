import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './AuthModal.css';

export default function AuthModal({ onClose }) {
  const { login, register } = useApp();
  const [mode, setMode]     = useState('login');
  const [form, setForm]     = useState({ name:'', email:'', password:'' });
  const [err,  setErr]      = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setErr(''); setLoading(true);
    try {
      if (mode === 'login') await login(form.email, form.password);
      else await register(form.name, form.email, form.password);
      onClose();
    } catch(ex) {
      setErr(ex.response?.data?.error || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box">
        <div className="auth-header">
          <div className="auth-logo">🌤️ Weather AI</div>
          <button className="auth-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <div className="auth-tabs">
          <button className={`auth-tab${mode==='login'?' active':''}`} onClick={()=>{setMode('login');setErr('');}}>Sign In</button>
          <button className={`auth-tab${mode==='register'?' active':''}`} onClick={()=>{setMode('register');setErr('');}}>Create Account</button>
        </div>

        <form onSubmit={submit} className="auth-form">
          {mode === 'register' && (
            <div className="field">
              <label>Full Name</label>
              <input type="text" value={form.name} onChange={set('name')} placeholder="John Doe" required autoFocus/>
            </div>
          )}
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" required autoFocus={mode==='login'}/>
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password} onChange={set('password')} placeholder="••••••••" required minLength={6}/>
          </div>
          {err && <div className="auth-error">{err}</div>}
          <button type="submit" className="auth-submit" disabled={loading}>
            {loading ? 'Please wait…' : mode==='login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          {mode==='login' ? "Don't have an account? " : "Already have an account? "}
          <button className="auth-switch" onClick={()=>{setMode(m=>m==='login'?'register':'login');setErr('');}}>
            {mode==='login' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
