const router = require('express').Router();
const svc = require('../services/weatherService');

router.get('/current', async (req, res) => {
  try {
    const { city, units='metric' } = req.query;
    if (!city) return res.status(400).json({ error: 'City required' });
    res.json(await svc.getCurrent(city, units));
  } catch(e) {
    if (e.response?.status===404) return res.status(404).json({ error: 'City not found' });
    res.status(500).json({ error: 'Weather fetch failed' });
  }
});

router.get('/forecast', async (req, res) => {
  try {
    const { city, units='metric' } = req.query;
    if (!city) return res.status(400).json({ error: 'City required' });
    res.json(await svc.getForecast(city, units));
  } catch(e) {
    if (e.response?.status===404) return res.status(404).json({ error: 'City not found' });
    res.status(500).json({ error: 'Forecast fetch failed' });
  }
});

router.get('/air-quality', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'lat/lon required' });
    res.json(await svc.getAirQuality(parseFloat(lat), parseFloat(lon)));
  } catch(e) { res.status(500).json({ error: 'Air quality fetch failed' }); }
});

router.get('/cities', async (req, res) => {
  try {
    res.json(await svc.getCities(req.query.units || 'metric'));
  } catch(e) { res.status(500).json({ error: 'Cities fetch failed' }); }
});

module.exports = router;
