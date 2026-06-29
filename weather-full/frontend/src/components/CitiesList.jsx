import React from 'react';
import './CitiesList.css';

const FALLBACK = [
  { city:'California', country:'US', temp:29, condition:'Mostly Sunny', emoji:'🌤️' },
  { city:'Beijing',    country:'CN', temp:19, condition:'Cloudy',       emoji:'🌧️' },
  { city:'Jerusalem',  country:'IL', temp:31, condition:'Sunny',        emoji:'☀️' },
  { city:'Tokyo',      country:'JP', temp:24, condition:'Partly Cloudy',emoji:'⛅' },
  { city:'London',     country:'GB', temp:14, condition:'Rainy',        emoji:'🌧️' },
  { city:'Dubai',      country:'AE', temp:38, condition:'Sunny',        emoji:'☀️' },
];

export default function CitiesList({ cities, onCityClick, unitLabel='°C' }) {
  const list = cities?.length ? cities : FALLBACK;
  return (
    <div className="cl-wrap">
      <div className="cl-header">
        <span className="section-title" style={{marginBottom:0}}>Other large cities</span>
        <button className="cl-show-all">Show All ›</button>
      </div>
      <div className="cl-list">
        {list.map((c,i) => (
          <button key={i} className="cl-row fade-up" style={{animationDelay:`${i*0.06}s`}} onClick={()=>onCityClick(c.city)}>
            <div className="cl-info">
              <div className="cl-country">{c.country}</div>
              <div className="cl-city">{c.city}</div>
              <div className="cl-cond">{c.condition}</div>
            </div>
            <div className="cl-right">
              <span className="cl-emoji">{c.emoji}</span>
              <span className="cl-temp">{c.temp}{unitLabel}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
