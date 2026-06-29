import React from 'react';
import { getIconFromEmoji, getWeatherIcon } from './WeatherIcons';
import './ForecastSection.css';

export default function ForecastSection({ current, forecast, loading, unitLabel='°C' }) {
  if (loading) return (
    <div className="forecast-row">
      <div className="skeleton" style={{height:200,borderRadius:16}}/>
      {[...Array(6)].map((_,i) => <div key={i} className="skeleton" style={{height:200,borderRadius:14}}/>)}
    </div>
  );

  const today = forecast[0];
  const rest  = forecast.slice(1);

  const getIcon = (day, size=40) => day.condition
    ? getWeatherIcon(day.condition, size)
    : getIconFromEmoji(day.emoji || '', size);

  return (
    <div className="forecast-row fade-up">
      {today && (
        <div className="today-card">
          <div className="today-top">
            <span className="today-day">{today.day || 'Today'}</span>
            <span className="today-time">{current?.timestamp || ''}</span>
          </div>
          <div className="today-main">
            <div className="today-temp">{current?.temp ?? today.temp}<span className="today-unit">{unitLabel}</span></div>
            <div className="today-emoji">{getIcon(today, 56)}</div>
          </div>
          <div className="today-cond">{current?.conditionDesc || current?.condition || ''}</div>
          <div className="today-meta">
            <div className="meta-item"><span className="meta-l">Real Feel</span><span className="meta-v">{current?.feelsLike ?? today.temp+2}{unitLabel}</span></div>
            <div className="meta-item"><span className="meta-l">Wind</span><span className="meta-v">{current?.windDir||'N-E'} {current?.windSpeed||8} km/h</span></div>
            <div className="meta-item"><span className="meta-l">Pressure</span><span className="meta-v">{current?.pressure||1000} MB</span></div>
            <div className="meta-item"><span className="meta-l">Humidity</span><span className="meta-v">{current?.humidity||51}%</span></div>
            <div className="meta-item"><span className="meta-l">Sunrise</span><span className="meta-v">{current?.sunrise||'6:02 AM'}</span></div>
            <div className="meta-item"><span className="meta-l">Sunset</span><span className="meta-v">{current?.sunset||'9:18 PM'}</span></div>
          </div>
        </div>
      )}
      {rest.map((day, i) => (
        <div key={i} className="day-card" style={{animationDelay:`${i*0.05}s`}}>
          <div className="day-label">{day.day}</div>
          <div className="day-emoji">{getIcon(day, 36)}</div>
          <div className="day-temp">{day.temp}<sup>{unitLabel}</sup></div>
          <div className="day-range">{day.minTemp}° / {day.maxTemp}°</div>
        </div>
      ))}
    </div>
  );
}
