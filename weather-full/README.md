# 🌤️ Weather AI — Full Stack

A fully responsive weather dashboard with authentication, real-time weather, interactive map, notifications, settings, and day/night mode.

## ✨ Features
- 🔐 **Auth** — Register / Login / Logout with JWT  
- 🌤️ **Weather** — Current conditions, 7-day forecast, hourly data  
- 🗺️ **Real Map** — Leaflet.js interactive world map with weather pins + satellite toggle  
- 🌫️ **Air Quality** — AQI with per-pollutant breakdown  
- 🔔 **Notifications** — In-app panel with unread badge; test notification button  
- ⚙️ **Settings** — Theme, units (°C/°F), default city, notification toggle  
- 🌙 **Day/Night Mode** — Instant theme switch, persisted per user  
- 📱 **Fully Responsive** — Mobile, tablet, desktop  
- 🎭 **Mock mode** — Works without an API key

## 🚀 Quick Start

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — add OPENWEATHER_API_KEY (optional, mock data works without it)
npm run dev        # → http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev        # → http://localhost:3000
```

Open http://localhost:3000 — it works with mock data out of the box!

## 🌐 API Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register |
| POST | `/api/auth/login` | Login |
| GET  | `/api/auth/me` | Current user |
| GET  | `/api/weather/current?city=London` | Current weather |
| GET  | `/api/weather/forecast?city=London` | 7-day forecast |
| GET  | `/api/weather/air-quality?lat=&lon=` | AQI |
| GET  | `/api/weather/cities` | 6 major cities |
| GET  | `/api/user/settings` | Get settings |
| PUT  | `/api/user/settings` | Update settings |
| GET  | `/api/user/notifications` | Get notifications |
| POST | `/api/user/notifications/test` | Send test alert |

## 🔑 Get a Free API Key
1. Sign up at https://openweathermap.org/api
2. Copy your key into `backend/.env` as `OPENWEATHER_API_KEY`
3. Restart the backend — live data immediately!

## 🏗 Production
- Replace in-memory DB (`src/utils/db.js`) with MongoDB or PostgreSQL
- Set a strong `JWT_SECRET` in `.env`
- Run `npm run build` in `frontend/` and serve `dist/` statically
