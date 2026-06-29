import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './TopBar.css';

export default function TopBar({ city, country, onSearch, onAuthClick, onSettingsClick, onNotifsClick, showNotifs }) {
  const { user, logout, toggleTheme, theme, unreadCount } = useApp();
  const [q,        setQ]        = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);
    return () => { document.removeEventListener('mousedown', handler); document.removeEventListener('touchstart', handler); };
  }, []);

  const submit = (e) => { e.preventDefault(); if (q.trim()) { onSearch(q.trim()); setQ(''); } };

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger */}
        <div className="menu-wrap" ref={menuRef}>
          <button className={`tb-btn${menuOpen?' tb-active':''}`} onClick={()=>setMenuOpen(v=>!v)} aria-label="Menu" aria-expanded={menuOpen}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect y="2" width="16" height="2" rx="1"/><rect y="7" width="16" height="2" rx="1"/><rect y="12" width="16" height="2" rx="1"/>
            </svg>
          </button>
          {menuOpen && (
            <div className="menu-dropdown slide-down">
              <div className="menu-heading">Navigation</div>
              <button className="menu-item" onClick={()=>setMenuOpen(false)}>🏠 Dashboard</button>
              <button className="menu-item" onClick={()=>{onSettingsClick();setMenuOpen(false);}}>⚙️ Settings</button>
              {!user
                ? <button className="menu-item" onClick={()=>{onAuthClick();setMenuOpen(false);}}>🔐 Sign In</button>
                : <button className="menu-item menu-item-danger" onClick={()=>{logout();setMenuOpen(false);}}>🚪 Sign Out</button>
              }
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className={`tb-btn notif-btn${showNotifs?' tb-active':''}`} onClick={onNotifsClick} aria-label="Notifications" aria-pressed={showNotifs}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
        </button>

        {/* Location */}
        <div className="location-display">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
          </svg>
          <span className="loc-city">{city}</span>
          {country && <span className="loc-country">, {country}</span>}
        </div>
      </div>

      {/* Search */}
      <form className="search-bar" onSubmit={submit} role="search">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search city…" aria-label="Search city" autoComplete="off"/>
        {q && <button type="submit" className="search-go" aria-label="Search">↵</button>}
      </form>

      {/* Right */}
      <div className="topbar-right">
        <button className="tb-btn" onClick={onSettingsClick} aria-label="Settings">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </button>

        <button className="tb-btn" onClick={toggleTheme} aria-label="Toggle theme" title={theme==='dark'?'Switch to light mode':'Switch to dark mode'}>
          {theme==='dark'
            ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          }
        </button>

        {user ? (
          <div className="user-menu" ref={userRef}>
            <button className={`avatar${userOpen?' avatar-active':''}`} onClick={()=>setUserOpen(v=>!v)} aria-label="User menu" aria-expanded={userOpen}>
              {user.avatar ? <img src={user.avatar} alt={user.name}/> : <span>{user.name?.[0]?.toUpperCase()}</span>}
            </button>
            {userOpen && (
              <div className="user-dropdown slide-down">
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
                <hr className="user-div"/>
                <button className="user-menu-item" onClick={()=>{onSettingsClick();setUserOpen(false);}}>⚙️ Settings</button>
                <button className="user-menu-item" onClick={()=>{onNotifsClick();setUserOpen(false);}}>🔔 Notifications</button>
                <hr className="user-div"/>
                <button className="user-logout" onClick={()=>{logout();setUserOpen(false);}}>Sign out</button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={onAuthClick}>Sign in</button>
        )}
      </div>
    </header>
  );
}
