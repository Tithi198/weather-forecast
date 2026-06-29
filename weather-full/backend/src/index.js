require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const net = require('net');

const app = express();
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use('/api/', rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/weather', require('./routes/weather'));
app.use('/api/user',    require('./routes/user'));
app.get('/api/health',  (req, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
app.use((err, req, res, next) => { console.error(err.message); res.status(500).json({ error: 'Server error' }); });

function isPortFree(port) {
  return new Promise(resolve => {
    const s = net.createServer();
    s.once('error', () => resolve(false));
    s.once('listening', () => s.close(() => resolve(true)));
    s.listen(port, '0.0.0.0');
  });
}

(async () => {
  const preferred = parseInt(process.env.PORT || '5000', 10);
  let PORT = preferred;
  for (let p = preferred; p < preferred + 20; p++) {
    if (await isPortFree(p)) { PORT = p; break; }
  }
  if (PORT !== preferred) console.warn(`⚠️  Port ${preferred} busy — using ${PORT}`);
  app.listen(PORT, () => console.log(`✅ Backend → http://localhost:${PORT}`));
})();
