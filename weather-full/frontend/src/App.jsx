import React, { useState, useEffect, useRef } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { useWeather } from './hooks/useWeather';
import TopBar from './components/TopBar';
import WeatherCard from './components/WeatherCard';
import AirQuality from './components/AirQuality';
import RainChart from './components/RainChart';
import MapPanel from './components/MapPanel';
import CitiesList from './components/CitiesList';
import AuthModal from './components/AuthModal';
import SettingsModal from './components/SettingsModal';
import NotificationPanel from './components/NotificationPanel';
import './styles/app.css';

function Dashboard() {
  const { settings, authLoading } = useApp();
  const {
    current, forecast, airQuality, cities,
    loading, error, fetchWeather, fetchCities
  } = useWeather();

  const [activeView,   setActiveView]   = useState('forecast');
  const [showAuth,     setShowAuth]     = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifs,   setShowNotifs]   = useState(false);
  const [city,         setCity]         = useState(settings.defaultCity || 'Seattle');

  const initialDone = useRef(false);
  const prevUnit    = useRef(settings.unit);

  // Initial load once auth resolves
  useEffect(() => {
    if (authLoading || initialDone.current) return;
    initialDone.current = true;
    const c = settings.defaultCity || city;
    setCity(c);
    fetchWeather(c, settings.unit);
    fetchCities(settings.unit);
  }, [authLoading]);

  // Re-fetch when unit changes
  useEffect(() => {
    if (!initialDone.current) return;
    if (settings.unit !== prevUnit.current) {
      prevUnit.current = settings.unit;
      fetchWeather(city, settings.unit);
      fetchCities(settings.unit);
    }
  }, [settings.unit]);

  const handleSearch = (q) => {
    if (!q.trim()) return;
    setCity(q);
    fetchWeather(q, settings.unit);
  };

  const handleCityClick = (c) => {
    setCity(c);
    fetchWeather(c, settings.unit);
  };

  return (
    <div className="app-wrap">
      <div className="dashboard">
        <TopBar
          city={current?.city || city}
          country={current?.country}
          onSearch={handleSearch}
          onAuthClick={() => setShowAuth(true)}
          onSettingsClick={() => setShowSettings(true)}
          onNotifsClick={() => setShowNotifs(v => !v)}
          showNotifs={showNotifs}
        />

        {showNotifs && (
          <NotificationPanel onClose={() => setShowNotifs(false)} />
        )}

        <div className="dashboard-body">
          <main className="main-panel">

            {/* View toggle: Forecast vs Air Quality */}
            <div className="tab-row">
              <div className="view-pills">
                {[['forecast','Forecast'],['air','Air quality']].map(([k, l]) => (
                  <button
                    key={k}
                    className={`view-pill${activeView === k ? ' active' : ''}`}
                    onClick={() => setActiveView(k)}
                  >{l}</button>
                ))}
              </div>
            </div>

            {error && (
              <div className="error-bar">
                ⚠️ {error}
                <button
                  onClick={() => fetchWeather(city, settings.unit)}
                  style={{
                    marginLeft: 12, background: 'none',
                    border: '1px solid #fca5a5', color: '#fca5a5',
                    borderRadius: 6, padding: '2px 10px',
                    cursor: 'pointer', fontSize: 11
                  }}
                >Retry</button>
              </div>
            )}

            {/* Main weather display */}
            {activeView === 'forecast' ? (
              <WeatherCard
                current={current}
                forecast={forecast}
                loading={loading}
                settings={settings}
              />
            ) : (
              <AirQuality airQuality={airQuality} loading={loading} />
            )}

            {/* Map */}
            <div className="map-wrap">
              <MapPanel
                city={current?.city || city}
                lat={current?.lat}
                lon={current?.lon}
                weather={current}
              />
            </div>
          </main>

          <aside className="sidebar">
            <RainChart hourly={forecast[0]?.hourly || []} loading={loading} />
            <CitiesList
              cities={cities}
              onCityClick={handleCityClick}
              unitLabel={settings.unit === 'metric' ? '°C' : '°F'}
            />
          </aside>
        </div>
      </div>

      {showAuth     && <AuthModal     onClose={() => setShowAuth(false)} />}
      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}

export default function App() {
  return <AppProvider><Dashboard /></AppProvider>;
}
