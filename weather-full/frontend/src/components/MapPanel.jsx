import React, { useEffect, useRef, useState } from 'react';
import './MapPanel.css';

const WEATHER_PINS = [
  { lat:40.7, lon:-74.0, emoji:'⛅', city:'New York' },
  { lat:51.5, lon:-0.1,  emoji:'🌧️',city:'London' },
  { lat:48.8, lon:2.35,  emoji:'🌤️',city:'Paris' },
  { lat:55.7, lon:37.6,  emoji:'❄️', city:'Moscow' },
  { lat:35.6, lon:139.7, emoji:'⛈️',city:'Tokyo' },
  { lat:31.2, lon:121.5, emoji:'☁️', city:'Shanghai' },
  { lat:19.0, lon:72.8,  emoji:'☀️', city:'Mumbai' },
  { lat:-33.9,lon:151.2, emoji:'🌤️',city:'Sydney' },
  { lat:25.2, lon:55.3,  emoji:'☀️', city:'Dubai' },
  { lat:-1.3, lon:36.8,  emoji:'🌦️',city:'Nairobi' },
];

export default function MapPanel({ city, lat, lon, weather }) {
  const mapRef  = useRef(null);
  const mapInst = useRef(null);
  const [layer, setLayer] = useState('standard');
  const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    if (!window.L) return;
    const L = window.L;
    if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; }

    const map = L.map(mapRef.current, { zoomControl:false, attributionControl:false }).setView([lat||35, lon||35], 2);
    mapInst.current = map;

    // Tile layer
    const tileUrl = layer === 'satellite'
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, { maxZoom:18 }).addTo(map);

    // Weather pins
    WEATHER_PINS.forEach(p => {
      const el = document.createElement('div');
      el.className = 'map-weather-pin';
      el.innerHTML = `<span class="pin-emoji">${p.emoji}</span>`;
      el.title = p.city;
      L.marker([p.lat, p.lon], {
        icon: L.divIcon({ html:el, className:'', iconSize:[32,32], iconAnchor:[16,16] })
      }).addTo(map).bindPopup(`<b>${p.city}</b>`);
    });

    // Current city pin
    if (lat && lon) {
      const el2 = document.createElement('div');
      el2.className = 'map-city-pin';
      el2.innerHTML = `<span class="pin-emoji">${weather?.emoji||'📍'}</span><span class="pin-label">${city||''}</span>`;
      const marker = L.marker([lat, lon], {
        icon: L.divIcon({ html:el2, className:'', iconSize:[60,40], iconAnchor:[30,20] })
      }).addTo(map);
      marker.bindPopup(`<b>${city}</b><br>${weather?.temp??''}° — ${weather?.condition||''}`).openPopup();
      map.setView([lat, lon], 6);
    }

    L.control.zoom({ position:'bottomright' }).addTo(map);
    return () => { if (mapInst.current) { mapInst.current.remove(); mapInst.current = null; } };
  }, [lat, lon, layer]);

  return (
    <div className="map-card">
      <div className="map-header">
        <span className="map-title">Global map</span>
        <div className="map-controls">
          <button className={`map-layer-btn${layer==='standard'?' active':''}`} onClick={()=>setLayer('standard')}>Default</button>
          <button className={`map-layer-btn${layer==='satellite'?' active':''}`} onClick={()=>setLayer('satellite')}>Satellite</button>
        </div>
      </div>
      <div className="map-body">
        <div ref={mapRef} className="leaflet-container-inner"/>
        {showPopup && (
          <div className="map-popup-card fade-in">
            <div className="mpc-label">Global map</div>
            <div className="mpc-desc">Explore wind, weather and ocean conditions worldwide.</div>
            <div className="mpc-icon">🌀</div>
            <button className="mpc-btn" onClick={()=>setShowPopup(false)}>Get started</button>
          </div>
        )}
      </div>
    </div>
  );
}
