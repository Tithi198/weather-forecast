import { useState, useCallback } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '';

export function useWeather() {
  const [current,    setCurrent]    = useState(null);
  const [forecast,   setForecast]   = useState([]);
  const [airQuality, setAirQuality] = useState(null);
  const [cities,     setCities]     = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState(null);

  const fetchWeather = useCallback(async (city, units = 'metric') => {
    if (!city?.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const [cur, fc] = await Promise.all([
        axios.get(`${API}/api/weather/current?city=${encodeURIComponent(city)}&units=${units}`),
        axios.get(`${API}/api/weather/forecast?city=${encodeURIComponent(city)}&units=${units}`)
      ]);
      setCurrent(cur.data);
      setForecast(fc.data);
      const { lat, lon } = cur.data;
      if (lat && lon) {
        const aq = await axios.get(`${API}/api/weather/air-quality?lat=${lat}&lon=${lon}`);
        setAirQuality(aq.data);
      }
    } catch (e) {
      const msg = e.response?.data?.error || e.message || 'Failed to fetch weather';
      setError(msg);
      console.error('[useWeather]', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCities = useCallback(async (units = 'metric') => {
    try {
      const r = await axios.get(`${API}/api/weather/cities?units=${units}`);
      setCities(r.data);
    } catch (e) {
      console.error('[fetchCities]', e.message);
    }
  }, []);

  return { current, forecast, airQuality, cities, loading, error, fetchWeather, fetchCities };
}
