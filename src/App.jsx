import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v9.9.15 Pro Find My ---
const APP_VERSION = 'v9.9.15';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WAZE_SVG = (
  <svg viewBox="0 0 512 512" width="13" height="13" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="90" fill="currentColor"/>
    <path d="M375.4 233.5c-3.7-31.8-29.3-56.7-61.6-59.5-35.3-3.1-66.5 19.3-73.8 53.6-1.5 7-1.4 14.3.4 21.2-22.1 4.7-38.6 24.1-38.6 47.3 0 17.5 9.7 32.7 24.1 40.5l-10.7 33.3c-2.4 7.4 2.8 15 10.6 15 3.3 0 6.4-1.4 8.6-3.8l21.9-23.7c13.7 4.9 28.7 7.5 44.1 7.5 70.7 0 128-50.5 128-112.7 0-11.8-1.8-23.3-5.2-34.4zm-146 5.3c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm112 40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-56 22c-29.8 0-54-15.6-54-35 0-3.3 2.7-6 6-6h96c3.3 0 6 2.7 6 6 0 19.4-24.2 35-54 35z" fill="#fff"/>
    <path d="M220.5 240c-1.2 5.5-6.2 9.5-12 9.5s-10.8-4-12-9.5-2.8-12.7-14.2-22-27.5-22-15.5 0-28 12.5-28 28s12.5 28 28 28c4.4 0 8 3.6 8 8s-3.6 8-8 8c-24.3 0-44-19.7-44-44s19.7-44 44-44c21.2 0 39.1 14.7 43.5 34.5z" fill="#18181b"/>
    <circle cx="178" cy="246" r="10" fill="#18181b"/>
    <circle cx="282" cy="216" r="10" fill="#18181b"/>
    <circle cx="338" cy="216" r="10" fill="#18181b"/>
  </svg>
);

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="13" height="13" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="90" fill="currentColor"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#fff"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#aaa"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#000"/>
  </svg>
);

const HOTEL_ADDRESS = "Bio Agriturismo Vojon, Ponti sul Mincio, Italy";

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30", label: "רביעי · 30/09", title: "נחיתה והגעה למלון", icon: "✈️",
    stops: [
      { time: "16:00", name: "נחיתה בנמל התעופה وרונה", dest: "Verona Villafranca Airport", lat: 45.3957, lng: 10.8885, note: "איסוף מזוודות וקבלת הרכב השכור בשדה התעופה." },
      { time: "18:00", name: "נסיעה למלון והתארגנות", dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", lat: 45.4192, lng: 10.6908, note: "צ׳ק-אין במלון ומנוחה קצרה לפני היציאה לארוחת ערב." }
    ]
  },
  {
    date: "2026-10-01", label: "חמישי · 01/10", title: "Gardaland – יום פארק מלא", icon: "🎢",
    stops: [
      { time: "08:30", name: "יציאה מהמלון לגארדלנד", dest: "Gardaland Resort, Castelnuovo del Garda", lat: 45.4526, lng: 10.7153, note: "הגעה מוקדמת לפני פתיחת השערים." },
      { time: "13:00", name: "אקשן ומתקנים בגארדלנד", dest: "Gardaland Resort", lat: 45.4526, lng: 10.7153, note: "בילוי בכל מתקני הפארק והופעות." }
    ]
  },
  {
    date: "2026-10-02", label: "שישי · 02/10", title: "מונטה באלדו + סירמיונה", icon: "🚠",
    stops: [
      { time: "08:30", name: "רכבל מונטה באלדו", dest: "Funivia Malcesine-Monte Baldo", lat: 45.7797, lng: 10.8105, note: "עלייה ברכבל אל פסגת ההר." },
      { time: "13:00", name: "סירמיונה וחצי האי", dest: "Sirmione, Italy", lat: 45.4925, lng: 10.6053, note: "שיטוט בסמטאות עיירת ימי הביניים." }
    ]
  },
  {
    date: "2026-10-03", label: "שבת · 03/10", title: "Movieland + Medieval Times", icon: "🎬",
    stops: [
      { time: "09:00", name: "Movieland The Hollywood Park", dest: "Movieland The Hollywood Park, Lazise", lat: 45.4745, lng: 10.7291, note: "יום הרפתקאות ופעלולים הוליוודיים." },
      { time: "19:30", name: "Medieval Times – מופע האבירים", dest: "Medieval Times, Lazise", lat: 45.4745, lng: 10.7291, note: "טורניר אבירים סוער וארוחת ערב מלכותית." }
    ]
  },
  {
    date: "2026-10-04", label: "ראשון · 04/10", title: "ונציה – עיר המים", icon: "🛶",
    stops: [
      { time: "07:30", name: "יציאה וחניה בוונציה (Tronchetto)", dest: "Venezia Tronchetto Parking", lat: 45.4384, lng: 12.3167, note: "חניה ומעבר בסירה למרכז העיר." },
      { time: "09:30", name: "כיכר סן מרקו וסמטאות ונציה", dest: "St. Mark's Square, Venice", lat: 45.4343, lng: 12.3388, note: "הלב הפועם של ונציה." }
    ]
  },
  {
    date: "2026-10-05", label: "שני · 05/10", title: "לימונה + אגם טנו", icon: "🍋",
    stops: [
      { time: "08:30", name: "לימונה סול גארדה", dest: "Limone sul Garda Parking, Italy", lat: 45.8143, lng: 10.7932, note: "סיור בטיילת התלויה ובסמטאות עצי הלימון." },
      { time: "11:30", name: "אגם טנו", dest: "Lago di Tenno, Italy", lat: 45.9221, lng: 10.8405, note: "מים בצבע טורקיז מרהיב." }
    ]
  },
  {
    date: "2026-10-06", label: "שלישי · 06/10", title: "ורונה + חזרה לישראל", icon: "❤️",
    stops: [
      { time: "09:00", name: "סיור בוורונה", dest: "Piazza Cittadella, Verona", lat: 45.4384, lng: 10.9916, note: "הארנה של وרונה והמרפסת של יוליה." },
      { time: "18:30", name: "שדה התעופה وרונה", dest: "Verona Villafranca Airport", lat: 45.3957, lng: 10.8885, note: "טיסה חזרה לישראל." }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🎬 Movieland', '🚤 ונציה'];
const DEFAULT_DOCUMENTS = [
  { id: 'flight-arik', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - אריק כהן (8180011314102)', passenger: 'COHEN/ARIK MR', ticketNo: '8180011314102' },
  { id: 'flight-amit', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - עמית כהן (8180011314103)', passenger: 'COHEN/AMIT MS', ticketNo: '8180011314103' },
  { id: 'flight-yuly', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - יולי כהן (8180011314104)', passenger: 'COHEN/YULY MS', ticketNo: '8180011314104' },
  { id: 'flight-lian', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - ליאן כהן (8180011314105)', passenger: 'COHEN/LIAN CHD', ticketNo: '8180011314105' },
  { id: 'flight-harel', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - הראל כהן (8180011314106)', passenger: 'VILNAI COHEN/HAREL MR', ticketNo: '8180011314106' }
];

const ROAD_TRIVIA_QUESTIONS = Array.from({ length: 100 }, (_, i) => ({
  q: `שאלה #${i + 1}: באיזו מדינה באירופה נמצא אגם גארדה?`,
  options: ["צרפת", "ספרד", "איטליה", "אוסטריה"],
  correct: 2
}));

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

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(() => {
    try { return localStorage.getItem('garda-current-user') || 'אריק'; } catch (e) { return 'אריק'; }
  });

  const [themeMode, setThemeMode] = useState(() => {
    try { return localStorage.getItem('garda-theme-mode') || 'dark'; } catch (e) { return 'dark'; }
  });

  useEffect(() => {
    try { localStorage.setItem('garda-current-user', currentUser); } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try { localStorage.setItem('garda-theme-mode', themeMode); } catch (e) {}
  }, [themeMode]);

  const [viewerItem, setViewerItem] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [familyLocations, setFamilyLocations] = useState({
    'אריק': { name: 'אריק', lat: 32.1093, lng: 34.8555, updated_at: 'עכשיו', battery: 95, lastSeen: 'ראש העין' },
    'סיגל': { name: 'סיגל', lat: 32.1150, lng: 34.8170, updated_at: 'לפני דקה', battery: 90, lastSeen: 'השרון' },
    'עמית': { name: 'עמית', lat: 32.3250, lng: 35.0150, updated_at: 'לפני 2 דקות', battery: 88, lastSeen: 'בת חפר' },
    'יולי': { name: 'יולי', lat: 32.3220, lng: 35.0120, updated_at: 'לפני 5 דקות', battery: 92, lastSeen: 'בת חפר' },
    'ליאן': { name: 'ליאן', lat: 32.3300, lng: 35.0200, updated_at: 'עכשיו', battery: 64, lastSeen: 'בת חפר' },
    'הראל': { name: 'הראל', lat: 32.1200, lng: 34.8200, updated_at: 'עכשיו', battery: 99, lastSeen: 'ישראל' }
  });

  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [activeSoundAlert, setActiveSoundAlert] = useState(null);

  // GPS חי מתמשך למכשיר המקומי
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locObj = {
            name: currentUser,
            lat: latitude,
            lng: longitude,
            updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
            is_sos: false,
            battery: 92,
            lastSeen: 'בדרכים (GPS חי)'
          };
          setMyLocation({ lat: latitude, lng: longitude });
          setFamilyLocations(prev => ({ ...prev, [currentUser]: locObj }));
          try {
            await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' });
          } catch (e) {}
        },
        (err) => console.error("GPS Watch Error:", err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [currentUser]);

  // סנכרון Realtime מול Supabase
  useEffect(() => {
    const channel = supabase.channel('find_my_family_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new) {
          setFamilyLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.is_sos) {
            setActiveSosAlert(payload.new);
          }
          if (payload.new.is_sound_alert && payload.new.name === currentUser) {
            setActiveSoundAlert(payload.new);
            playChimeSound();
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const playChimeSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  const sendSoundPing = async (targetName) => {
    playChimeSound();
    const payload = {
      name: targetName,
      sound_msg: `פינג איתור נשלח אלייך מ-${currentUser}!`,
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      is_sound_alert: true
    };
    try {
      await supabase.from('family_radar').upsert([payload], { onConflict: 'name' });
      alert(`🔔 נשלח פינג קולי אל ${targetName} בהצלחה!`);
    } catch (e) {
      alert(`🔔 נשלח פינג קולי מקומי אל ${targetName}!`);
    }
  };

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#111111' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#a3a3a3' : '#64748b';
  const borderColor = isDark ? '#333333' : '#cbd5e1';

  const radarMapHTML = useMemo(() => {
    let centerLat = myLocation?.lat || 32.1093;
    let centerLng = myLocation?.lng || 34.8555;

    let markersJS = '';
    Object.values(familyLocations).forEach(loc => {
      if (loc && loc.lat) {
        markersJS += `L.marker([${loc.lat}, ${loc.lng}]).addTo(map).bindPopup('<b>${loc.name}</b><br>🔋 סוללה: ${loc.battery || 90}%<br>📍 ${loc.lastSeen || 'מחובר'}');\n`;
      }
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: ${isDark ? '#000' : '#fff'}; }</style>
      </head>
      <body>
        <div id="map" style="width:100%;height:100%;"></div>
        <script>
          const map = L.map('map').setView([${centerLat}, ${centerLng}], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
          ${markersJS}
        </script>
      </body>
      </html>
    `;
  }, [familyLocations, myLocation, isDark]);

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {/* סרגל עליון בסגנון iOS Find My */}
      <header style={{ background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${borderColor}`, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '900', fontSize: '16px' }}>Find My Family ({currentUser})</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setModalType('radar')} style={{ background: '#007aff', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            🛰️ רדאר חי
          </button>
          <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ background: isDark ? '#222' : '#f1f5f9', border: `1px solid ${borderColor}`, color: textColor, width: '36px', height: '36px', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>
            {isDark ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>ברוך הבא, {currentUser} 👑</h2>
        
        {/* כרטיסיית גישה מהירה לרדאר */}
        <div onClick={() => setModalType('radar')} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, borderRadius: '20px', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '32px' }}>🛰️</span>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '900' }}>הצג מפת Find My חיה</h3>
              <p style={{ margin: 0, fontSize: '12px', color: textSub }}>עקוב אחר אריק, סיגל, עמית, יולי, ליאן והראל בזמן אמת</p>
            </div>
          </div>
          <span style={{ fontSize: '18px' }}>➔</span>
        </div>
      </main>

      {/* מודל רדאר Find My מלא */}
      {modalType === 'radar' && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bgMain, color: textColor, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: isDark ? '#000' : '#
