// SVG Weather Icons matching the Google Weather style from the screenshot
import React from 'react';

const SUN = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="32" cy="32" r="13" fill="#f9a825"/>
    {[0,45,90,135,180,225,270,315].map((deg,i)=>(
      <line key={i}
        x1={32+Math.cos(deg*Math.PI/180)*17} y1={32+Math.sin(deg*Math.PI/180)*17}
        x2={32+Math.cos(deg*Math.PI/180)*22} y2={32+Math.sin(deg*Math.PI/180)*22}
        stroke="#f9a825" strokeWidth="3" strokeLinecap="round"/>
    ))}
  </svg>
);

const PARTLY_CLOUDY = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun */}
    <circle cx="24" cy="22" r="9" fill="#f9a825"/>
    {[0,60,120,180,240,300].map((deg,i)=>(
      <line key={i}
        x1={24+Math.cos(deg*Math.PI/180)*12} y1={22+Math.sin(deg*Math.PI/180)*12}
        x2={24+Math.cos(deg*Math.PI/180)*16} y2={22+Math.sin(deg*Math.PI/180)*16}
        stroke="#f9a825" strokeWidth="2.5" strokeLinecap="round"/>
    ))}
    {/* Cloud */}
    <ellipse cx="36" cy="40" rx="16" ry="10" fill="#9aa0a6"/>
    <ellipse cx="26" cy="42" rx="10" ry="8" fill="#9aa0a6"/>
    <circle cx="30" cy="37" r="8" fill="#9aa0a6"/>
    <circle cx="40" cy="36" r="7" fill="#9aa0a6"/>
    <rect x="20" y="38" width="32" height="10" fill="#9aa0a6" rx="3"/>
  </svg>
);

const CLOUDY = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="36" cy="38" rx="18" ry="11" fill="#9aa0a6"/>
    <ellipse cx="22" cy="41" rx="12" ry="9" fill="#9aa0a6"/>
    <circle cx="28" cy="34" r="10" fill="#9aa0a6"/>
    <circle cx="40" cy="32" r="9" fill="#9aa0a6"/>
    <rect x="16" y="36" width="36" height="13" fill="#9aa0a6" rx="4"/>
  </svg>
);

const THUNDERSTORM = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Sun behind */}
    <circle cx="22" cy="16" r="8" fill="#f9a825" opacity="0.85"/>
    {[0,60,120,180,240,300].map((deg,i)=>(
      <line key={i}
        x1={22+Math.cos(deg*Math.PI/180)*11} y1={16+Math.sin(deg*Math.PI/180)*11}
        x2={22+Math.cos(deg*Math.PI/180)*14} y2={16+Math.sin(deg*Math.PI/180)*14}
        stroke="#f9a825" strokeWidth="2" strokeLinecap="round"/>
    ))}
    {/* Dark cloud */}
    <ellipse cx="36" cy="30" rx="18" ry="11" fill="#5f6368"/>
    <ellipse cx="22" cy="33" rx="12" ry="9" fill="#5f6368"/>
    <circle cx="28" cy="26" r="10" fill="#5f6368"/>
    <circle cx="40" cy="24" r="9" fill="#5f6368"/>
    <rect x="16" y="28" width="36" height="13" fill="#5f6368" rx="4"/>
    {/* Lightning */}
    <polyline points="30,38 26,48 31,48 27,58" stroke="#f9a825" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <polyline points="38,38 34,48 39,48 35,58" stroke="#f9a825" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    {/* Rain drops */}
    <circle cx="22" cy="52" r="2" fill="#4285f4"/>
    <circle cx="44" cy="54" r="2" fill="#4285f4"/>
  </svg>
);

const RAIN = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="36" cy="26" rx="18" ry="11" fill="#9aa0a6"/>
    <ellipse cx="22" cy="29" rx="12" ry="9" fill="#9aa0a6"/>
    <circle cx="28" cy="22" r="10" fill="#9aa0a6"/>
    <circle cx="40" cy="20" r="9" fill="#9aa0a6"/>
    <rect x="16" y="24" width="36" height="13" fill="#9aa0a6" rx="4"/>
    {/* Rain drops */}
    <line x1="24" y1="42" x2="22" y2="52" stroke="#4285f4" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="33" y1="42" x2="31" y2="52" stroke="#4285f4" strokeWidth="2.5" strokeLinecap="round"/>
    <line x1="42" y1="42" x2="40" y2="52" stroke="#4285f4" strokeWidth="2.5" strokeLinecap="round"/>
  </svg>
);

const DRIZZLE = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="36" cy="26" rx="18" ry="11" fill="#9aa0a6"/>
    <ellipse cx="22" cy="29" rx="12" ry="9" fill="#9aa0a6"/>
    <circle cx="28" cy="22" r="10" fill="#9aa0a6"/>
    <circle cx="40" cy="20" r="9" fill="#9aa0a6"/>
    <rect x="16" y="24" width="36" height="13" fill="#9aa0a6" rx="4"/>
    <circle cx="25" cy="48" r="2.5" fill="#4285f4"/>
    <circle cx="34" cy="53" r="2.5" fill="#4285f4"/>
    <circle cx="43" cy="48" r="2.5" fill="#4285f4"/>
  </svg>
);

const SNOW = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="36" cy="26" rx="18" ry="11" fill="#9aa0a6"/>
    <ellipse cx="22" cy="29" rx="12" ry="9" fill="#9aa0a6"/>
    <circle cx="28" cy="22" r="10" fill="#9aa0a6"/>
    <circle cx="40" cy="20" r="9" fill="#9aa0a6"/>
    <rect x="16" y="24" width="36" height="13" fill="#9aa0a6" rx="4"/>
    <text x="20" y="58" fontSize="18" fill="white">❄</text>
    <text x="36" y="55" fontSize="14" fill="white">❄</text>
  </svg>
);

const FOG = (
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
    <line x1="12" y1="22" x2="52" y2="22" stroke="#9aa0a6" strokeWidth="4" strokeLinecap="round"/>
    <line x1="16" y1="32" x2="48" y2="32" stroke="#9aa0a6" strokeWidth="4" strokeLinecap="round"/>
    <line x1="12" y1="42" x2="52" y2="42" stroke="#9aa0a6" strokeWidth="4" strokeLinecap="round"/>
    <line x1="18" y1="52" x2="46" y2="52" stroke="#9aa0a6" strokeWidth="4" strokeLinecap="round"/>
  </svg>
);

// Map condition strings/codes to icon components
export function getWeatherIcon(condition, size = 48) {
  const c = (condition || '').toLowerCase();
  let icon;
  if (c.includes('thunder') || c.includes('storm') || c.includes('⛈') || c.includes('🌩')) {
    icon = THUNDERSTORM;
  } else if (c.includes('snow') || c.includes('sleet') || c.includes('❄') || c.includes('🌨')) {
    icon = SNOW;
  } else if (c.includes('fog') || c.includes('mist') || c.includes('haze') || c.includes('🌫')) {
    icon = FOG;
  } else if (c.includes('drizzle') || c.includes('shower')) {
    icon = DRIZZLE;
  } else if (c.includes('rain') || c.includes('🌧') || c.includes('☔')) {
    icon = RAIN;
  } else if (c.includes('partly') || c.includes('⛅') || c.includes('🌤') || c.includes('🌥')) {
    icon = PARTLY_CLOUDY;
  } else if (c.includes('cloud') || c.includes('overcast') || c.includes('☁')) {
    icon = CLOUDY;
  } else if (c.includes('sun') || c.includes('clear') || c.includes('☀') || c.includes('🌞')) {
    icon = SUN;
  } else {
    // Emoji fallback mapping
    if (c.includes('🌤') || c.includes('⛅')) icon = PARTLY_CLOUDY;
    else if (c.includes('☁') || c.includes('🌥')) icon = CLOUDY;
    else if (c.includes('🌦') || c.includes('🌧')) icon = RAIN;
    else if (c.includes('⛈') || c.includes('🌩')) icon = THUNDERSTORM;
    else icon = PARTLY_CLOUDY;
  }

  return (
    <span style={{ display:'inline-flex', width: size, height: size, flexShrink: 0 }}>
      {icon}
    </span>
  );
}

// Map emoji directly
export function getIconFromEmoji(emoji, size = 48) {
  const e = (emoji || '');
  let icon;
  if (['⛈','🌩','🌪','🌀'].some(x => e.includes(x))) icon = THUNDERSTORM;
  else if (['❄','🌨','🌬'].some(x => e.includes(x))) icon = SNOW;
  else if (['🌫','🌁'].some(x => e.includes(x))) icon = FOG;
  else if (['🌦'].some(x => e.includes(x))) icon = THUNDERSTORM; // shower with sun
  else if (['🌧','☔','💧'].some(x => e.includes(x))) icon = RAIN;
  else if (['🌤','⛅','🌥'].some(x => e.includes(x))) icon = PARTLY_CLOUDY;
  else if (['☁','🌫'].some(x => e.includes(x))) icon = CLOUDY;
  else if (['☀','🌞','🌣'].some(x => e.includes(x))) icon = SUN;
  else icon = PARTLY_CLOUDY;

  return (
    <span style={{ display:'inline-flex', width: size, height: size, flexShrink: 0 }}>
      {icon}
    </span>
  );
}
