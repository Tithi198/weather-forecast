const router = require('express').Router();
const auth = require('../middleware/auth');
const db = require('../utils/db');

// Get settings
router.get('/settings', auth, (req, res) => {
  res.json(req.user.settings);
});

// Update settings
router.put('/settings', auth, (req, res) => {
  const updated = db.updateUser(req.user.id, { settings: { ...req.user.settings, ...req.body } });
  res.json(updated.settings);
});

// Update profile
router.put('/profile', auth, (req, res) => {
  const { name, avatar } = req.body;
  const updated = db.updateUser(req.user.id, { name, avatar });
  res.json({ id: updated.id, name: updated.name, email: updated.email, avatar: updated.avatar, settings: updated.settings });
});

// Notifications
router.get('/notifications', auth, (req, res) => {
  res.json(db.getUserNotifications(req.user.id));
});

router.post('/notifications/read', auth, (req, res) => {
  db.markAllRead(req.user.id);
  res.json({ ok: true });
});

// Trigger test notification
router.post('/notifications/test', auth, (req, res) => {
  const notif = db.addNotification(req.user.id, {
    title: '🌧️ Rain Alert',
    body: `Heavy rain expected in ${req.user.settings?.defaultCity || 'your city'} in the next 2 hours.`,
    type: 'warning'
  });
  res.json(notif);
});

module.exports = router;
