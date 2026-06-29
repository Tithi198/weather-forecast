import React, { useState, useMemo } from 'react';
import { getIconFromEmoji, getWeatherIcon } from './WeatherIcons';
import './WeatherCard.css';

/* ── Pure SVG chart — no refs, no innerHTML, no stale closures ── */
function WeatherChart({ hourSlots, tab, unit }) {
  const toF  = c => Math.round(c * 9 / 5 + 32);
  const disp = c => (c == null ? 0 : (unit === 'C' ? Math.round(c) : toF(c)));

  const W = 700, H = 130, px = 44, py = 30;

  let data, color, fmt;
  if (tab === 'temp') {
    data  = hourSlots.map(h => disp(h.temp));
    color = '#f9a825';
    fmt   = v => `${v}°`;
  } else if (tab === 'precip') {
    data  = hourSlots.map(h => h.rain ?? 0);
    color = '#4285f4';
    fmt   = v => `${v}%`;
  } else {
    data  = hourSlots.map(h => h.wind ?? 0);
    color = '#34a853';
    fmt   = v => `${v}`;
  }

  if (!data.length) return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}
         xmlns="http://www.w3.org/2000/svg" className="wc-svg"/>
  );

  const n   = data.length;
  const mn  = Math.min(...data);
  const mx  = Math.max(...data);
  const sp  = mx - mn || 1;
  // For single point or flat data, render centered horizontally
  const xSt = n > 1 ? (W - px * 2) / (n - 1) : 0;
  // Keep chart vertically centered when all values are equal
  const yOf = v => sp === 1
    ? (H / 2)  // flat line in the middle
    : py + (H - py * 2) * (1 - (v - mn) / sp);
  // For single point, center it horizontally
  const pts = data.map((v, i) => ({
    x: n === 1 ? W / 2 : px + i * xSt,
    y: yOf(v),
    v
  }));

  // Smooth bezier path
  let linePath = `M${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const cp = (pts[i-1].x + pts[i].x) / 2;
    linePath += ` C${cp.toFixed(1)},${pts[i-1].y.toFixed(1)} ${cp.toFixed(1)},${pts[i].y.toFixed(1)} ${pts[i].x.toFixed(1)},${pts[i].y.toFixed(1)}`;
  }
  const areaPath = linePath
    + ` L${pts[n-1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`;

  const gradId = `wc-grad-${tab}`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H}
         xmlns="http://www.w3.org/2000/svg" className="wc-svg">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={color} stopOpacity="0.55"/>
          <stop offset="100%" stopColor={color} stopOpacity="0.04"/>
        </linearGradient>
      </defs>
      {/* Area fill */}
      <path d={areaPath} fill={`url(#${gradId})`}/>
      {/* Line */}
      <path d={linePath} fill="none" stroke={color}
            strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Value labels */}
      {pts.map((p, i) => (
        <text key={i}
          x={p.x.toFixed(1)} y={(p.y - 10).toFixed(1)}
          textAnchor="middle" fontSize="12" fontWeight="500"
          fill="#e8eaed" fontFamily="Inter,sans-serif">
          {fmt(p.v)}
        </text>
      ))}
    </svg>
  );
}

/* ── Main WeatherCard ─────────────────────────────────────────── */
export default function WeatherCard({ current, forecast, loading, settings }) {
  const [unit,   setUnitState] = useState(settings?.unit === 'imperial' ? 'F' : 'C');
  const [tab,    setTab]       = useState('temp');
  const [selDay, setSelDay]    = useState(0);

  // Sync unit with parent settings
  React.useEffect(() => {
    setUnitState(settings?.unit === 'imperial' ? 'F' : 'C');
  }, [settings?.unit]);

  const toF  = c => Math.round(c * 9 / 5 + 32);
  const disp = c => (c == null ? '--' : (unit === 'C' ? Math.round(c) : toF(c)));
  const uLabel = unit === 'C' ? '°C' : '°F';

  // Derive hourly from selected forecast day — keep everything inside useMemo
  const hourSlots = useMemo(() => {
    const day = forecast[selDay] || forecast[0] || {};
    return (day.hourly || []).slice(0, 8);
  }, [selDay, forecast]);
  const hourLabels = hourSlots.map(h => h.time);

  if (loading) return <div className="wc-skeleton" aria-busy="true"/>;
  if (!current && !forecast.length) return null;

  // Date/time string
  const now   = new Date();
  const DAYS  = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const hr    = now.getHours();
  const mn2   = String(now.getMinutes()).padStart(2,'0');
  const ap    = hr >= 12 ? 'PM' : 'AM';
  const hr12  = hr % 12 || 12;
  const dtStr = `${DAYS[now.getDay()]} ${hr12}:${mn2} ${ap}`;

  const precipPct   = current?.precipitation ?? (current?.humidity > 70 ? 60 : 3);
  const weekDays    = forecast.slice(0, 8);
  const currentIcon = current?.condition
    ? getWeatherIcon(current.condition, 72)
    : getIconFromEmoji(current?.emoji || '', 72);

  return (
    <div className="wc fade-up">

      {/* ── Top row ── */}
      <div className="wc-top">
        <div className="wc-left">
          <div className="wc-icon-wrap" aria-hidden="true">{currentIcon}</div>
          <div>
            <div className="wc-temp-row">
              <span className="wc-temp">{disp(current?.temp)}</span>
              <div className="wc-unit-toggle">
                <button className={`wc-ubtn${unit==='C'?' active':''}`}
                  onClick={() => setUnitState('C')} aria-pressed={unit==='C'}>°C</button>
                <span className="wc-usep"> | </span>
                <button className={`wc-ubtn${unit==='F'?' active':''}`}
                  onClick={() => setUnitState('F')} aria-pressed={unit==='F'}>°F</button>
              </div>
            </div>
            <div className="wc-meta">
              <span>Precipitation: {precipPct}%</span>
              <span>Humidity: {current?.humidity ?? '--'}%</span>
              <span>Wind: {current?.windSpeed ?? '--'} km/h</span>
            </div>
          </div>
        </div>

        <div className="wc-right">
          <div className="wc-city-label">Weather</div>
          <div className="wc-dt">{dtStr}</div>
          <div className="wc-desc">{current?.conditionDesc || current?.condition || 'Partly sunny'}</div>
        </div>
      </div>

      {/* ── Chart tabs ── */}
      <div className="wc-tabs" role="tablist">
        {[['temp','Temperature'],['precip','Precipitation'],['wind','Wind']].map(([k,l]) => (
          <button key={k} role="tab" aria-selected={tab===k}
            className={`wc-tab${tab===k?' active':''}`}
            onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* ── Chart ── */}
      <div className="wc-chart">
        <WeatherChart hourSlots={hourSlots} tab={tab} unit={unit}/>
        {hourLabels.length > 0 ? (
          <div className="wc-hour-labels" aria-hidden="true">
            {hourLabels.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        ) : (
          <div className="wc-no-data">No hourly data available</div>
        )}
      </div>

      {/* ── 7-day forecast row ── */}
      <div className="wc-week" role="list">
        {weekDays.map((d, i) => {
          const dayIcon = d.condition
            ? getWeatherIcon(d.condition, 32)
            : getIconFromEmoji(d.emoji || '', 32);
          const dayLabel = i === 0 ? 'Today' : (d.day?.slice(0, 3) || d.day || '');
          return (
            <div key={i} role="listitem"
              className={`wc-day${selDay===i?' sel':''}`}
              onClick={() => setSelDay(i)} tabIndex={0}
              onKeyDown={e => e.key==='Enter' && setSelDay(i)}
              aria-label={`${d.day}: high ${disp(d.maxTemp)}${uLabel}, low ${disp(d.minTemp)}${uLabel}`}
            >
              <div className="wc-dn">{dayLabel}</div>
              <div className="wc-di" aria-hidden="true">{dayIcon}</div>
              <div className="wc-dt2">
                <span className="hi">{disp(d.maxTemp)}°</span>{' '}
                <span className="lo">{disp(d.minTemp)}°</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
