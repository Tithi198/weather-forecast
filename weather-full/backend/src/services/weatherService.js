require('dotenv').config();
const axios = require('axios');
const cache = require('../utils/cache');

// FIXED: read key at call-time so dotenv is always loaded first
const getKey  = () => process.env.OPENWEATHER_API_KEY;
const hasKey  = () => { const k = getKey(); return k && k !== 'your_openweathermap_api_key_here' && k.length > 10; };
const BASE    = 'https://api.openweathermap.org/data/2.5';

const emojiMap = (code) => {
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 300 && code < 400) return '🌦️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  if (code === 800) return '☀️';
  if (code === 801) return '🌤️';
  if (code === 802) return '⛅';
  if (code >= 803) return '☁️';
  return '🌡️';
};
const windDir = (deg) => ['N','N-E','E','S-E','S','S-W','W','N-W'][Math.round((deg||0)/45)%8];
const fmtTime = (ts, tz) => {
  const d = new Date((ts+tz)*1000);
  let h = d.getUTCHours(), m = d.getUTCMinutes();
  const ap = h>=12?'PM':'AM'; h=h%12||12;
  return `${h}:${String(m).padStart(2,'0')} ${ap}`;
};

async function getCurrent(city, units='metric') {
  const key = `cur_${city.toLowerCase()}_${units}`;
  const hit = cache.get(key); if (hit) return hit;
  if (!hasKey()) { console.log('[weather] mock →', city); return mockCurrent(city, units); }
  console.log('[weather] live →', city, '| key:', getKey().slice(0,8)+'...');
  const r = await axios.get(`${BASE}/weather`, { params:{ q:city, appid:getKey(), units } });
  const d = r.data;
  const result = {
    city:d.name, country:d.sys.country,
    temp:Math.round(d.main.temp), feelsLike:Math.round(d.main.feels_like),
    humidity:d.main.humidity, pressure:d.main.pressure,
    windSpeed:Math.round((d.wind.speed||0)*(units==='metric'?3.6:2.237)),
    windDir:windDir(d.wind.deg),
    visibility:Math.round((d.visibility||10000)/1000),
    condition:d.weather[0].main, conditionDesc:d.weather[0].description,
    conditionCode:d.weather[0].id, emoji:emojiMap(d.weather[0].id),
    sunrise:fmtTime(d.sys.sunrise,d.timezone), sunset:fmtTime(d.sys.sunset,d.timezone),
    lat:d.coord.lat, lon:d.coord.lon, timezone:d.timezone,
    timestamp:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
  };
  cache.set(key, result, 600);
  return result;
}

async function getForecast(city, units='metric') {
  const key = `fc_${city.toLowerCase()}_${units}`;
  const hit = cache.get(key); if (hit) return hit;
  if (!hasKey()) return mockForecast(city, units);
  // cnt:56 gives ~7 days of 3-hourly data (8 slots/day × 7 days)
  const r = await axios.get(`${BASE}/forecast`, { params:{ q:city, appid:getKey(), units, cnt:56 } });
  const days = {};
  r.data.list.forEach(item => {
    const d = new Date(item.dt*1000);
    const dk = d.toDateString();
    if (!days[dk]) days[dk] = { day:d.toLocaleDateString('en-US',{weekday:'long'}), temps:[], codes:[], hourly:[] };
    days[dk].temps.push(Math.round(item.main.temp));
    days[dk].codes.push(item.weather[0].id);
    days[dk].hourly.push({
      time:d.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'}),
      temp:Math.round(item.main.temp), emoji:emojiMap(item.weather[0].id),
      rain:Math.round((item.pop||0)*100), humidity:item.main.humidity,
      wind:Math.round((item.wind?.speed||0)*3.6)
    });
  });

  const dayValues = Object.values(days).slice(0, 8);

  // Pad today's hourly to always have 8 points by prepending interpolated slots
  // (API only returns future 3-hr slots, so early in the day you get fewer)
  const padHourly = (hourly, targetCount = 8) => {
    if (hourly.length >= targetCount) return hourly;
    const first = hourly[0];
    const extras = [];
    for (let i = targetCount - hourly.length; i > 0; i--) {
      extras.push({
        time: `${String(i * 3).padStart(2,'0')}:00 AM`,
        temp: first.temp - Math.round(i * 0.5),
        emoji: first.emoji, rain: first.rain,
        humidity: first.humidity, wind: first.wind
      });
    }
    return [...extras, ...hourly];
  };

  const result = dayValues.map((d, idx) => {
    const sorted = [...d.codes].sort((a,b) =>
      d.codes.filter(v=>v===b).length - d.codes.filter(v=>v===a).length);
    return {
      day: d.day,
      temp: Math.round(d.temps.reduce((a,b)=>a+b,0)/d.temps.length),
      minTemp: Math.min(...d.temps),
      maxTemp: Math.max(...d.temps),
      emoji: emojiMap(sorted[0]),
      conditionCode: sorted[0],
      hourly: idx === 0 ? padHourly(d.hourly) : d.hourly
    };
  });
  cache.set(key, result, 600);
  return result;
}

async function getAirQuality(lat, lon) {
  const key = `aq_${Math.round(lat*10)}_${Math.round(lon*10)}`;
  const hit = cache.get(key); if (hit) return hit;
  if (!hasKey()) return mockAQ();
  const r = await axios.get(`${BASE}/air_pollution`, { params:{ lat, lon, appid:getKey() } });
  const c = r.data.list[0].components, aqi = r.data.list[0].main.aqi;
  const labels=['','Good','Fair','Moderate','Poor','Very Poor'];
  const colors=['','#22c55e','#84cc16','#eab308','#f97316','#ef4444'];
  const result = { aqi, aqiLabel:labels[aqi], aqiColor:colors[aqi],
    co:c.co.toFixed(1), no2:c.no2.toFixed(1), o3:c.o3.toFixed(1),
    pm25:c.pm2_5.toFixed(1), pm10:c.pm10.toFixed(1), so2:c.so2.toFixed(1) };
  cache.set(key, result, 600);
  return result;
}

async function getCities(units='metric') {
  const key = `cities_${units}`;
  const hit = cache.get(key); if (hit) return hit;
  const list = [
    { city:'New York', country:'US' },{ city:'Beijing', country:'CN' },
    { city:'Jerusalem', country:'IL' },{ city:'Tokyo', country:'JP' },
    { city:'London', country:'GB' },{ city:'Dubai', country:'AE' },
  ];
  const result = await Promise.all(list.map(async ({city,country})=>{
    try {
      if (!hasKey()) return mockCity(city, country);
      const w = await getCurrent(city, units);
      return { city:w.city, country:w.country, temp:w.temp, condition:w.condition, emoji:w.emoji };
    } catch(e) { return mockCity(city, country); }
  }));
  cache.set(key, result, 300);
  return result;
}

// ── Mock helpers ────────────────────────────────────────────────
function hash(s){ return [...(s||'').toLowerCase()].reduce((a,c)=>a+c.charCodeAt(0),0); }
const CONDS  = ['Clear','Clouds','Rain','Thunderstorm','Snow','Mist'];
const EMOJIS = ['☀️','⛅','🌧️','⛈️','❄️','🌫️'];
const CODES  = [800,802,500,200,600,701];

function mockCurrent(city, units) {
  const h=hash(city), temp=5+(h%33), ci=h%6;
  return {
    city:city.charAt(0).toUpperCase()+city.slice(1), country:'XX',
    temp, feelsLike:temp+2, humidity:40+(h%50), pressure:990+(h%30),
    windSpeed:5+(h%35), windDir:['N','N-E','E','S-E','S','S-W','W','N-W'][h%8],
    visibility:5+(h%15), condition:CONDS[ci], conditionDesc:CONDS[ci].toLowerCase(),
    conditionCode:CODES[ci], emoji:EMOJIS[ci],
    sunrise:'06:02 AM', sunset:'07:18 PM',
    lat:-33.87+(h%10), lon:151.21+(h%10), timezone:36000,
    timestamp:new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})
  };
}
function mockForecast(city) {
  const h = hash(city);
  const today = new Date();
  const DAY_NAMES = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return Array.from({ length: 8 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i);
    const day = DAY_NAMES[d.getDay()];
    const base = 20 + ((h + i * 3) % 18);
    const ci = (h + i) % 6;
    const hourTimes = ['12:00 AM','03:00 AM','06:00 AM','09:00 AM','12:00 PM','03:00 PM','06:00 PM','09:00 PM'];
    return {
      day, temp: base, minTemp: base - 3, maxTemp: base + 5,
      emoji: EMOJIS[ci], conditionCode: CODES[ci],
      hourly: hourTimes.map((time, j) => ({
        time, temp: base - 4 + j + Math.round(Math.sin(j) * 2),
        emoji: EMOJIS[(ci + j) % 6],
        rain: 10 + ((h + i + j) % 70),
        humidity: 55 + ((h + j) % 35),
        wind: 5 + ((h + j) % 25)
      }))
    };
  });
}
function mockAQ() {
  return { aqi:2, aqiLabel:'Fair', aqiColor:'#84cc16',
    co:'233.6', no2:'12.4', o3:'48.9', pm25:'8.3', pm10:'15.2', so2:'3.1' };
}
function mockCity(city, country) {
  const h=hash(city), ci=h%6;
  return { city, country, temp:10+(h%30), condition:CONDS[ci], emoji:EMOJIS[ci] };
}

module.exports = { getCurrent, getForecast, getAirQuality, getCities };
