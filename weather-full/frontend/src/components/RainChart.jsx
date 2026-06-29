import React, { useState } from 'react';
import './RainChart.css';

const DEFAULT = [
  {time:'10AM',rain:45},{time:'11AM',rain:85},{time:'12PM',rain:70},
  {time:'1PM', rain:60},{time:'2PM', rain:50},{time:'3PM', rain:38}
];

export default function RainChart({ hourly, loading }) {
  const [active, setActive] = useState(1);
  if (loading) return (<div className="rc-wrap"><div className="section-title">Chance of rain</div><div className="skeleton" style={{height:160,borderRadius:10}}/></div>);

  const data = (hourly||[]).slice(0,6).map(h=>({time:h.time,rain:h.rain??50}));
  const bars = data.length ? data : DEFAULT;
  const max  = Math.max(...bars.map(b=>b.rain), 1);

  return (
    <div className="rc-wrap">
      <div className="section-title">Chance of rain</div>
      <div className="rc-chart" role="img" aria-label="Hourly rain chart">
        <div className="rc-ylabels">
          <span>Rainy</span><span>Sunny</span><span>Heavy</span>
        </div>
        <div className="rc-bars-area">
          <div className="rc-gridline" style={{top:'10%'}}/>
          <div className="rc-gridline" style={{top:'40%'}}/>
          <div className="rc-gridline" style={{top:'70%'}}/>
          <div className="rc-bars">
            {bars.map((b,i) => (
              <div key={i} className="rc-col" onClick={()=>setActive(i)}>
                <div className={`rc-bar${active===i?' active':''}`} style={{height:`${(b.rain/max)*100}%`}} title={`${b.time}: ${b.rain}%`}/>
                <span className="rc-label">{b.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {bars[active] && (
        <div className="rc-tooltip slide-down">
          <span className="rc-tt-time">{bars[active].time}</span>
          <span className="rc-tt-val">{bars[active].rain}% rain</span>
        </div>
      )}
    </div>
  );
}
