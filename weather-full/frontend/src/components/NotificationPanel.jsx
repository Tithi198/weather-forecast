import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import './NotificationPanel.css';

const typeIcon = (t) => ({ info:'ℹ️', warning:'⚠️', alert:'🚨', success:'✅' }[t] || '🔔');

export default function NotificationPanel({ onClose }) {
  const { notifications, markAllRead, fetchNotifs } = useApp();

  useEffect(() => { fetchNotifs(); markAllRead(); }, []);

  return (
    <div className="notif-panel slide-down">
      <div className="notif-header">
        <span className="notif-title">🔔 Notifications</span>
        <button className="notif-close" onClick={onClose}>✕</button>
      </div>
      <div className="notif-list">
        {notifications.length === 0
          ? <div className="notif-empty">No notifications yet</div>
          : notifications.map(n => (
            <div key={n.id} className={`notif-item${n.read?'':' unread'}`}>
              <span className="notif-icon">{typeIcon(n.type)}</span>
              <div className="notif-content">
                <div className="notif-item-title">{n.title}</div>
                <div className="notif-item-body">{n.body}</div>
                <div className="notif-time">{new Date(n.createdAt).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}</div>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}
