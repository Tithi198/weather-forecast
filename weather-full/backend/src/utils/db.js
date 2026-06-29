const users = new Map();
const notifications = new Map();
let notifId = 1;

module.exports = {
  findUserByEmail: (email) => [...users.values()].find(u => u.email === email),
  findUserById: (id) => users.get(id),
  createUser: (user) => { users.set(user.id, user); return user; },
  updateUser: (id, data) => {
    const u = users.get(id);
    if (!u) return null;
    const updated = { ...u, ...data };
    users.set(id, updated);
    return updated;
  },
  getUserNotifications: (userId) => [...(notifications.get(userId) || [])],
  addNotification: (userId, notif) => {
    const list = notifications.get(userId) || [];
    const item = { id: notifId++, ...notif, read: false, createdAt: new Date().toISOString() };
    list.unshift(item);
    notifications.set(userId, list.slice(0, 20));
    return item;
  },
  markAllRead: (userId) => {
    const list = notifications.get(userId) || [];
    notifications.set(userId, list.map(n => ({ ...n, read: true })));
  }
};
