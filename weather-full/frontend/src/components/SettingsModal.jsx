import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import './SettingsModal.css';

export default function SettingsModal({ onClose }) {
  const { settings, saveSettings, theme, toggleTheme, user, testNotif } = useApp();
  const [local, setLocal] = useState({ ...settings });
  const [saved, setSaved] = useState(false);

  const set = (k, v) => setLocal(s => ({ ...s, [k]: v }));

  const save = async () => {
    await saveSettings(local);
    setSaved(true);
    setTimeout(() => { setSaved(false); onClose(); }, 800);
  };

  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal-box settings-box">
        <div className="settings-header">
          <span className="settings-title">⚙️ Settings</span>
          <button className="auth-close" onClick={onClose}>✕</button>
        </div>

        <div className="settings-body">
          {/* Appearance */}
          <div className="settings-section">
            <div className="settings-section-title">Appearance</div>
            <div className="settings-row">
              <div className="settings-row-info"><div className="sr-label">Theme</div><div className="sr-desc">Toggle day / night mode</div></div>
              <div className="theme-toggle-wrap">
                <button className={`tt-opt${theme==='light'?' active':''}`} onClick={()=>{ if(theme!=='light') toggleTheme(); }}>☀️ Light</button>
                <button className={`tt-opt${theme==='dark'?' active':''}`}  onClick={()=>{ if(theme!=='dark')  toggleTheme(); }}>🌙 Dark</button>
              </div>
            </div>
          </div>

          {/* Units */}
          <div className="settings-section">
            <div className="settings-section-title">Units & Location</div>
            <div className="settings-row">
              <div className="settings-row-info"><div className="sr-label">Temperature unit</div></div>
              <div className="theme-toggle-wrap">
                <button className={`tt-opt${local.unit==='metric'?' active':''}`} onClick={()=>set('unit','metric')}>°C Metric</button>
                <button className={`tt-opt${local.unit==='imperial'?' active':''}`} onClick={()=>set('unit','imperial')}>°F Imperial</button>
              </div>
            </div>
            <div className="settings-row">
              <div className="settings-row-info"><div className="sr-label">Default city</div></div>
              <input className="settings-input" value={local.defaultCity||''} onChange={e=>set('defaultCity',e.target.value)} placeholder="e.g. London"/>
            </div>
          </div>

          {/* Notifications */}
          <div className="settings-section">
            <div className="settings-section-title">Notifications</div>
            <div className="settings-row">
              <div className="settings-row-info"><div className="sr-label">Weather alerts</div><div className="sr-desc">Receive rain and storm alerts</div></div>
              <button className={`toggle${local.notifications?' on':''}`} onClick={()=>set('notifications',!local.notifications)}>
                <span className="toggle-knob"/>
              </button>
            </div>
            {user && (
              <button className="test-notif-btn" onClick={()=>{testNotif();onClose();}}>
                🔔 Send test notification
              </button>
            )}
          </div>
        </div>

        <div className="settings-footer">
          <button className="settings-cancel" onClick={onClose}>Cancel</button>
          <button className="settings-save" onClick={save}>{saved ? '✓ Saved!' : 'Save Changes'}</button>
        </div>
      </div>
    </div>
  );
}
