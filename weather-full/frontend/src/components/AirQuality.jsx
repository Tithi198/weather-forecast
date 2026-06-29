import React from 'react';
import './AirQuality.css';

const METRICS = [
  { key:'pm25', label:'PM2.5', max:50  },
  { key:'pm10', label:'PM10',  max:100 },
  { key:'o3',   label:'O₃',   max:180 },
  { key:'no2',  label:'NO₂',  max:100 },
  { key:'so2',  label:'SO₂',  max:80  },
  { key:'co',   label:'CO',   max:1000},
];

const DEFAULT = { aqi:2, aqiLabel:'Fair', aqiColor:'#84cc16', co:'233.6', no2:'12.4', o3:'48.9', pm25:'8.3', pm10:'15.2', so2:'3.1' };

export default function AirQuality({ airQuality, loading }) {
  if (loading) return <div className="skeleton" style={{height:220,borderRadius:14}}/>;
  const aq = airQuality || DEFAULT;

  return (
    <div className="aq-wrap fade-up">
      <div className="aq-top">
        <div>
          <div className="aq-label-big" style={{color:aq.aqiColor}}>{aq.aqiLabel}</div>
          <div className="aq-sub">Air Quality Index: {aq.aqi} / 5</div>
        </div>
        <div className="aq-badge" style={{background:aq.aqiColor+'22',color:aq.aqiColor}}>AQI {aq.aqi}</div>
      </div>
      <div className="aq-grid">
        {METRICS.map(m => {
          const val = parseFloat(aq[m.key]) || 0;
          const pct = Math.min((val/m.max)*100,100);
          return (
            <div key={m.key} className="aq-item">
              <div className="aq-item-top">
                <span className="aq-m-label">{m.label}</span>
                <span className="aq-m-val">{val.toFixed(1)}</span>
              </div>
              <div className="aq-track"><div className="aq-fill" style={{width:`${pct}%`,background:aq.aqiColor}}/></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
