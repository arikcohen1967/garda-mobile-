import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v4.7 Pro Find My ---
const APP_VERSION = 'v4.7 Pro Find My';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WAZE_SVG = (
  <svg viewBox="0 0 512 512" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M375.4 233.5c-3.7-31.8-29.3-56.7-61.6-59.5-35.3-3.1-66.5 19.3-73.8 53.6-1.5 7-1.4 14.3.4 21.2-22.1 4.7-38.6 24.1-38.6 47.3 0 17.5 9.7 32.7 24.1 40.5l-10.7 33.3c-2.4 7.4 2.8 15 10.6 15 3.3 0 6.4-1.4 8.6-3.8l21.9-23.7c13.7 4.9 28.7 7.5 44.1 7.5 70.7 0 128-50.5 128-112.7 0-11.8-1.8-23.3-5.2-34.4zm-146 5.3c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm112 40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-56 22c-29.8 0-54-15.6-54-35 0-3.3 2.7-6 6-6h96c3.3 0 6 2.7 6 6 0 19.4-24.2 35-54 35z" fill="#fff"/>
    <path d="M220.5 240c-1.2 5.5-6.2 9.5-12 9.5s-10.8-4-12-9.5-2.8-12.7-14.2-22-27.5-22-15.5 0-28 12.5-28 28s12.5 28 28 28c4.4 0 8 3.6 8 8s-3.6 8-8 8c-24.3 0-44-19.7-44-44s19.7-44 44-44c21.2 0 39.1 14.7 43.5 34.5z" fill="#18181b"/>
    <circle cx="178" cy="246" r="10" fill="#18181b"/>
    <circle cx="282" cy="216" r="10" fill="#18181b"/>
    <circle cx="338" cy="216" r="10" fill="#18181b"/>
  </svg>
);

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="14" height="14" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#10b981"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#3b82f6"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#2563eb"/>
  </svg>
);

const HOTEL_ADDRESS = "Bio Agriturismo Vojon, Ponti sul Mincio, Italy";

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30", label: "רביעי · 30/09", title: "נחיתה והגעה למלון", icon: "✈️",
    stops: [
      { time: "16:00", name: "נחיתה בנמל התעופה وרונה", dest: "Verona Villafranca Airport", lat: 45.3957, lng: 10.8885, note: "איסוף מזוודות וקבלת הרכב השכור." },
      { time: "18:00", name: "נסיעה למלון והתארגנות", dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", lat: 45.4192, lng: 10.6908, note: "צ׳ק-אין במלון ומנוחה קצרה לפני ארוחת הערב." }
    ],
    culinary: { name: "Pizzeria Trattoria al Ponte (פסקיירה)", dest: "Peschiera del Garda, Italy", desc: "פיצות נפוליטניות מעולות ופסטה קלאסית בפיצריה משפחתית." },
    creative: { name: "נהר המינצ'ו בפסקיירה", dest: "Peschiera del Garda, Italy", desc: "עצירה קצרה ליד גדת הנהר לפתיחת מחברות ציור ותיעוד הנוף הראשון." }
  },
  {
    date: "2026-10-01", label: "חמישי · 01/10", title: "Gardaland – יום פארק מלא", icon: "🎢",
    stops: [
      { time: "08:30", name: "יציאה מהמלון לגארדלנד", dest: "Gardaland Resort, Castelnuovo del Garda", lat: 45.4526, lng: 10.7153, note: "הגעה מוקדמת לפני פתיחת השערים." },
      { time: "13:00", name: "ארוחת צהריים בפארק", dest: "Gardaland Resort", lat: 45.4526, lng: 10.7153, note: "אוכל מהיר והמבורגרים במסעדות הפארק." }
    ],
    culinary: { name: "Roadhouse Restaurant (פסקיירה)", dest: "Peschiera del Garda, Italy", desc: "בורגרים עסיסיים וסטייקים על האש לאחר יום הבילוי." },
    creative: { name: "הכנת סיכות אמיצים", dest: "Gardaland Resort", desc: "הכנת סיכת אמיצים משפחתית מקרטון וטושים." }
  }
];

const TRAVELERS_LIST = ['אריק', 'סיגל', 'עמית', 'יולי', 'ליאן', 'הראל'];

const calculateDistanceAndDuration = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return { dist: '---', duration: '---' };
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = R * c;
  const mins = Math.round((distKm / 70) * 60);
  return { dist: `${distKm.toFixed(1)} ק"מ`, duration: `${mins} דק'` };
};

const generateMapHTML = (familyLocs, myLoc, isDark) => {
  let centerLat = myLocation?.lat || 45.4384;
  let centerLng = myLocation?.lng || 10.6816;

  let markersJS = '';
  Object.values(familyLocs).forEach(loc => {
    if (loc && loc.lat) {
      markersJS += `L.marker([${loc.lat}, ${loc.lng}]).addTo(map).bindPopup('<b>${loc.name}</b><br>🔋 סוללה: ${loc.battery || 90}%<br>📍 עדכון: ${loc.updated_at || 'עכשיו'}');\n`;
    }
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: ${isDark ? '#0b0f19' : '#ffffff'}; } #map { width: 100%; height: 100%; }</style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${centerLat}, ${centerLng}], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        const myLocData = ${JSON.stringify(myLoc)};
        if (myLocData && myLocData.lat) {
          L.marker([myLocData.lat, myLocData.lng]).addTo(map).bindPopup('📍 המיקום שלי');
        }
        ${markersJS}
      </script>
    </body>
    </html>
  `;
};

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(() => {
    try { return localStorage.getItem('garda-current-user') || 'אריק'; } catch (e) { return 'אריק'; }
  });

  const [themeMode, setThemeMode] = useState(() => {
    try { return localStorage.getItem('garda-theme-mode') || 'light'; } catch (e) { return 'light'; }
  });

  useEffect(() => {
    try { localStorage.setItem('garda-current-user', currentUser); } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try { localStorage.setItem('garda-theme-mode', themeMode); } catch (e) {}
  }, [themeMode]);

  const [myLocation, setMyLocation] = useState(null);
  const [familyLocations, setFamilyLocations] = useState({
    'אריק': { name: 'אריק', lat: 45.4384, lng: 10.6816, updated_at: 'לפני דקה', battery: 95 },
    'סיגל': { name: 'סיגל', lat: 45.4150, lng: 10.6500, updated_at: 'לפני דקה', battery: 90 },
    'עמית': { name: 'עמית', lat: 45.4484, lng: 10.6916, updated_at: 'לפני 5 דקות', battery: 88 },
    'יולי': { name: 'יולי', lat: 45.4284, lng: 10.6716, updated_at: 'לפני 10 דקות', battery: 92 },
    'ליאן': { name: 'ליאן', lat: 45.4184, lng: 10.6616, updated_at: 'לפני 12 דקות', battery: 64 },
    'הראל': { name: 'הראל', lat: 45.4584, lng: 10.7016, updated_at: 'עכשיו', battery: 99 }
  });

  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [activeSoundAlert, setActiveSoundAlert] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // מעקב GPS חי למכשיר המקומי ועדכון ל-Supabase
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const locObj = { 
            name: currentUser, 
            lat, 
            lng: lon, 
            updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }), 
            is_sos: false,
            battery: 95 
          };
          setMyLocation({ lat, lng: lon });
          setFamilyLocations(prev => ({ ...prev, [currentUser]: locObj }));
          try {
            await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' });
          } catch (e) {}
        },
        (err) => console.log(err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [currentUser]);

  useEffect(() => {
    const channel = supabase.channel('family_trip_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new) {
          setFamilyLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.is_sos) setActiveSosAlert(payload.new);
          if (payload.new.is_sound_alert && payload.new.name === currentUser) {
            setActiveSoundAlert(payload.new);
            playChime();
          }
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUser]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {}
  };

  const sendSoundAlert = async (targetName) => {
    playChime();
    const payload = {
      name: targetName,
      sound_msg: `פינג איתור נשלח אלייך מ-${currentUser}!`,
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      is_sound_alert: true
    };
    setActiveSoundAlert(payload);
    try {
      await supabase.from('family_radar').upsert([payload], { onConflict: 'name' });
      alert(`🔔 נשלח פינג קולי אל ${targetName} בהצלחה!`);
    } catch (e) {}
  };

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#060913' : '#ffffff';
  const cardBg = isDark ? 'rgba(17, 24, 39, 0.9)' : '#ffffff';
  const textColor = isDark ? '#f3f4f6' : '#0f172a';
  const textSub = isDark ? '#9ca3af' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.15)' : '#cbd5e1';
  const accentGradient = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
  const enhancedCardShadow = isDark ? '0 10px 30px rgba(0, 0, 0, 0.5)' : '0 10px 25px rgba(15, 23, 42, 0.08)';

  const day = INITIAL_TRIP_DAYS[activeDay];

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {/* Header */}
      <header style={{ background: isDark ? 'rgba(11, 15, 25, 0.9)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(20px)', borderBottom: `1.5px solid ${borderColor}`, padding: '12px 16px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: isDark ? '#1e293b' : '#f8fafc', color: textColor, border: `1.5px solid ${borderColor}`, width: '38px', height: '38px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>☰</button>
          <span style={{ fontWeight: '900', fontSize: '15px' }}>Garda-Mobile ({currentUser})</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setModalType('radar')} style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '14px', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}>
            🛰️ רדאר Find My
          </button>
          <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ background: isDark ? '#1e293b' : '#f8fafc', border: `1.5px solid ${borderColor}`, color: textColor, width: '36px', height: '36px', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>
            {isDark ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      {/* Sidebar */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 2500 }} />}
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '300px', background: isDark ? '#0b0f19' : '#ffffff', zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', borderLeft: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>תפריט מערכת</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: textColor, fontSize: '18px', cursor: 'pointer' }}>✕</button>
        </div>
        <div>
          <label style={{ fontSize: '12px', fontWeight: '900', color: '#3b82f6', display: 'block', marginBottom: '6px' }}>👤 בחר משתמש פעיל:</label>
          <select value={currentUser} onChange={e => setCurrentUser(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: isDark ? '#1e293b' : '#fff', color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold' }}>
            {TRAVELERS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>
          🧭 פתח רדאר משפחתי חי
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{ padding: '10px 16px', borderRadius: '16px', background: activeDay === i ? '#0f172a' : cardBg, color: activeDay === i ? '#fff' : textColor, border: `1.5px solid ${borderColor}`, fontWeight: '800', fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {d.label}
            </button>
          ))}
        </div>

        <div style={{ background: cardBg, borderRadius: '20px', padding: '20px', border: `2px solid ${borderColor}`, boxShadow: enhancedCardShadow }}>
          <h2 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: '900' }}>{day.title} {day.icon}</h2>
          <p style={{ margin: '0 0 16px', fontSize: '13px', color: textSub }}>תאריך: {day.date}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {day.stops.map((stop, sIdx) => (
              <div key={sIdx} style={{ background: isDark ? '#1e293b' : '#f8fafc', padding: '14px', borderRadius: '14px', border: `1px solid ${borderColor}` }}>
                <div style={{ fontWeight: '900', fontSize: '14px', marginBottom: '4px' }}>{stop.name} ({stop.time})</div>
                <div style={{ fontSize: '12px', color: textSub, marginBottom: '8px' }}>{stop.note}</div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '8px 12px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>{WAZE_SVG} Waze</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Find My Radar Modal */}
      {modalType === 'radar' && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, backdropFilter: 'blur(10px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bgMain, color: textColor, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: isDark ? '#0b0f19' : '#fff', borderBottom: `1.5px solid ${borderColor}`, zIndex: 100 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>Find My – רדאר משפחתי חי</h3>
              <button onClick={() => setModalType(null)} style={{ background: isDark ? '#1e293b' : '#f1f5f9', border: `1.5px solid ${borderColor}`, color: textColor, width: '38px', height: '38px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ flex: 1, width: '100%', minHeight: '50vh' }}>
              <iframe title="Find My Map" srcDoc={generateMapHTML(familyLocations, myLocation, isDark)} style={{ width: '100%', height: '100%', border: 'none' }} />
