import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.8.2 (Fixed Syntax Edition) ---
const APP_VERSION = 'v1.8.2';
const ADMIN_PIN = '1967';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const S = {
  bg: '#0f172a',
  cardBg: '#1e293b',
  cardBorder: '#334155',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  accent: '#3b82f6',
  accentGradient: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  success: '#10b981',
  danger: '#ef4444',
  radius: '20px'
};

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30", label: "יום 1 · נחיתה", title: "נחיתה והגעה למלון", icon: "✈️",
    stops: [
      { time: "16:00", name: "נחיתה בשדה התעופה وרונה", dest: "Verona Villafranca Airport", lat: 45.3957, lng: 10.8885, note: "איסוף רכב וקבלת פנים ראשונה." },
      { time: "18:00", name: "הגעה למלון Bio Agriturismo Vojon", dest: "Peschiera del Garda, Italy", lat: 45.4192, lng: 10.6908, note: "צ׳ק-אין והתארגנות." }
    ]
  },
  {
    date: "2026-10-01", label: "יום 2 · פארק", title: "Gardaland – יום פארק מלא", icon: "🎢",
    stops: [
      { time: "09:00", name: "Gardaland Resort", dest: "Gardaland Resort, Castelnuovo del Garda", lat: 45.4526, lng: 10.7153, note: "יום מתקנים ואטרקציות בפארק." }
    ]
  }
];

const TRIVIA_BANK = Array.from({ length: 1500 }, (_, i) => {
  const id = i + 1;
  const questionsList = [
    { q: `שאלה #${id}: באיזו מדינה באירופאית נמצא אגם גארדה?`, options: ["צרפת", "ספרד", "איטליה", "אוסטריה"], correct: 2 },
    { q: `שאלה #${id}: מהי בירת איטליה?`, options: ["מילאנו", "ונציה", "רומא", "פדובה"], correct: 2 },
    { q: `שאלה #${id}: איזה פארק שעשועים ענק נמצא בסמוך לדרום אגם גארדה?`, options: ["דיסנילנד", "גארדלנד", "פורט אבנטורה", "אסטריקס"], correct: 1 },
    { q: `שאלה #${id}: מהי העיר המפורסמת ביותר בזכות סיפורם של רומיאו ויוליה?`, options: ["ורונה", "מנטובה", "בולוניה", "גנואה"], correct: 0 },
    { q: `שאלה #${id}: איזה מאכל איטלקי מורכב מבצק, רוטב עגבניות וגבינת מוצרלה?`, options: ["פסטה", "ריזוטו", "פיצה", "לזניה"], correct: 2 }
  ];
  return questionsList[i % questionsList.length];
});

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('trip-user') || '');
  const [loginInput, setLoginInput] = useState('');
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [tripDays, setTripDays] = useState(() => {
    try {
      const saved = localStorage.getItem('trip-custom-days');
      return saved ? JSON.parse(saved) : INITIAL_TRIP_DAYS;
    } catch (e) { return INITIAL_TRIP_DAYS; }
  });

  const [myLocation, setMyLocation] = useState(null);
  const [gpsConnected, setGpsConnected] = useState(false);
  const [allUsersLocations, setAllUsersLocations] = useState({});
  const [currentWeather, setCurrentWeather] = useState({ temp: '... ', icon: '⏳' });
  const [incomingPing, setIncomingPing] = useState(null);

  const [customSearchQuery, setCustomSearchQuery] = useState('');

  const [adminModal, setAdminModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualTime, setManualTime] = useState('10:00');

  const [backupModal, setBackupModal] = useState(false);
  const [backupPinInput, setBackupPinInput] = useState('');

  const [triviaState, setTriviaState] = useState(() => {
    try {
      const saved = localStorage.getItem('trip-trivia-state');
      return saved ? JSON.parse(saved) : { idx: 0, scores: {}, isPaused: false };
    } catch (e) { return { idx: 0, scores: {}, isPaused: false }; }
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [adminTriviaPin, setAdminTriviaPin] = useState('');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const updateTriviaInCloud = async (newState) => {
    setTriviaState(newState);
    localStorage.setItem('trip-trivia-state', JSON.stringify(newState));
    try {
      await supabase.from('family_radar').upsert([{
        name: currentUser,
        lat: myLocation?.lat || 45.43,
        lng: myLocation?.lng || 10.68,
        updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        trivia_state: newState
      }], { onConflict: 'name' });
    } catch (err) {}
  };

  useEffect(() => {
    if (document.getElementById('leaflet-script')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.id = 'leaflet-script';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (activeTab !== 'radar') return;
    const timer = setTimeout(() => {
      if (!window.L || !mapContainerRef.current) return;

      const defaultLat = myLocation?.lat || 45.4384;
      const defaultLng = myLocation?.lng || 10.6816;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = window.L.map(mapContainerRef.current, {
          dragging: true,
          touchZoom: true,
          scrollWheelZoom: true,
          doubleClickZoom: true
        }).setView([defaultLat, defaultLng], 12);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(mapInstanceRef.current);
      } else {
        mapInstanceRef.current.setView([defaultLat, defaultLng], 12);
        mapInstanceRef.current.invalidateSize();
      }

      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      const redPinIcon = window.L.divIcon({
        className: 'custom-red-pin',
        html: `<div style="background-color: #ef4444; width: 24px; height: 24px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 4px 12px rgba(239,68,68,0.5);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      Object.values(allUsersLocations).forEach(loc => {
        if (loc.lat && loc.lng) {
          const marker = window.L.marker([loc.lat, loc.lng], { icon: redPinIcon }).addTo(mapInstanceRef.current);
          marker.bindPopup(`<b>${loc.name}</b><br/>עדכון: ${loc.updated_at || 'לפני רגע'}`);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, allUsersLocations, myLocation]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInitialData = async () => {
      try {
        const { data } = await supabase.from('family_radar').select('*');
        if (data) {
          const map = {};
          data.forEach(item => { 
            map[item.name] = item; 
            if (item.trivia_state && item.name === currentUser) {
              setTriviaState(item.trivia_state);
            }
          });
          setAllUsersLocations(map);
        }
      } catch (err) {}
    };
    fetchInitialData();

    const channel = supabase.channel('trip_sync_v182')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setAllUsersLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.trivia_state) {
            setTriviaState(payload.new.trivia_state);
          }
          if (payload.new.name === currentUser && payload.new.ping_target && payload.new.ping_target === currentUser) {
            setIncomingPing({ from: payload.new.ping_from, msg: payload.new.ping_msg || 'חזור אלי בדחיפות!' });
          }
        }
      })
      .subscribe();

    let watchId = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const timeStr = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const coords = {
          name: currentUser,
          lat: lat,
          lng: lng,
          updated_at: timeStr
        };
        setMyLocation(coords);
        setGpsConnected(true);
        
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
          const weatherData = await res.json();
          if (weatherData && weatherData.current_weather) {
            const tempVal = Math.round(weatherData.current_weather.temperature);
            const code = weatherData.current_weather.weathercode;
            let condIcon = '☀️';
            if (code >= 1 && code <= 3) condIcon = '🌤️';
            else if (code >= 51 && code <= 67) condIcon = '🌧️';
            else if (code >= 71 && code <= 77) condIcon = '❄️';
            else if (code >= 95) condIcon = '⛈️';
            setCurrentWeather({ temp: `${tempVal}°C`, icon: condIcon });
          }
        } catch (e) {
          setCurrentWeather({ temp: '24°C', icon: '☀️' });
        }

        try {
          await supabase.from('family_radar').upsert([coords], { onConflict: 'name' });
        } catch (err) {}
      }, () => {
        setGpsConnected(false);
        setCurrentWeather({ temp: '24°C', icon: '☀️' });
      }, { enableHighAccuracy: true });
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const sendPingToUser = async (targetName) => {
    const customMsg = prompt(`שלח הודעת PING אל ${targetName}:`, "היי, איפה אתה? חזור אלי בבקשה!");
    if (customMsg === null) return;

    try {
      const targetUserObj = allUsersLocations[targetName] || { name: targetName, lat: 45.43, lng: 10.68 };
      await supabase.from('family_radar').upsert([{
        ...targetUserObj,
        ping_target: targetName,
        ping_from: currentUser,
        ping_msg: customMsg
      }], { onConflict: 'name' });

      alert(`✅ ה-PING נשלח בהצלחה אל ${targetName}!`);
    } catch (e) {
      alert('❌ שגיאה בשליחת ה-PING');
    }
  };

  const clearIncomingPing = async () => {
    if (!myLocation) return;
    try {
      await supabase.from('family_radar').upsert([{
        ...myLocation,
        ping_target: null,
        ping_from: null,
        ping_msg: null
      }], { onConflict: 'name' });
      setIncomingPing(null);
    } catch (e) {
      setIncomingPing(null);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginInput.trim()) return;
    const name = loginInput.trim();
    setCurrentUser(name);
    localStorage.setItem('trip-user', name);
  };

  const getSatelliteMapsUrl = (lat, lng, queryName) => {
    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
    if (isApple) {
      if (lat && lng) return `maps://maps.apple.com/?q=${lat},${lng}&t=h`;
      return `maps://maps.apple.com/?q=${encodeURIComponent(queryName)}&t=h`;
    } else {
      if (lat && lng) return `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lng}&zoom=18&basemap=satellite`;
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryName)}`;
    }
  };

  const getMapsUrl = (lat, lng, queryName) => {
    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
    if (isApple) {
      if (lat && lng) return `maps://maps.apple.com/?q=${lat},${lng}`;
      return `maps://maps.apple.com/?q=${encodeURIComponent(queryName)}`;
    } else {
      if (lat && lng) return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryName)}`;
    }
  };

  const openWeatherApp = () => {
    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
    if (isApple) {
      window.location.href = 'weather://';
    } else {
      if (myLocation && myLocation.lat && myLocation.lng) {
        window.open(`https://www.google.com/search?q=weather+${myLocation.lat},${myLocation.lng}`, '_blank');
      } else {
        window.open('https://www.google.com/search?q=weather', '_blank');
      }
    }
  };

  const searchAroundMe = (queryText) => {
    const q = queryText || customSearchQuery;
    if (!q || !q.trim()) return alert('נא להקליד או לבחור קטגוריה לחיפוש');

    if (myLocation && myLocation.lat && myLocation.lng) {
      const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
      const url = isApple 
        ? `maps://maps.apple.com/?q=${encodeURIComponent(q)}&ll=${myLocation.lat},${myLocation.lng}`
        : `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${myLocation.lat},${myLocation.lng},14z`;
      window.open(url, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/${encodeURIComponent(q)}`, '_blank');
    }
  };

  const handleAddManualStop = () => {
    if (adminPinInput !== ADMIN_PIN) return alert('❌ קוד מנהל שגוי!');
    if (!manualTitle.trim()) return alert('נא להזין כותרת לתחנה');

    const updatedDays = [...tripDays];
    if (!updatedDays[activeDay]) return;

    updatedDays[activeDay].stops.push({
      time: manualTime || '12:00',
      name: manualTitle,
      dest: manualTitle,
      lat: myLocation?.lat || 32.0853,
      lng: myLocation?.lng || 34.7818,
      note: manualDesc || 'הוספה ידנית מהמערכת'
    });

    setTripDays(updatedDays);
    setManualTitle('');
    setManualDesc('');
    alert('✅ התחנה נוספה בהצלחה למסלול!');
  };

  const handleFileUpload = (e) => {
    if (adminPinInput !== ADMIN_PIN) {
      alert('❌ נא להזין קוד מנהל תקין (1967) תחילה!');
      e.target.value = '';
      return;
    }
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (parsed.tripDays) {
            setTripDays(parsed.tripDays);
            alert('✅ המסלולים נטענו בהצלחה!');
            setAdminModal(false);
          }
        }
      } catch (err) {
        alert('❌ שגיאה בקריאת הקובץ.');
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadBackup = () => {
    if (backupPinInput !== ADMIN_PIN) return alert('❌ קוד מנהל שגוי!');
    const backupObj = { version: APP_VERSION, date: new Date().toISOString(), tripDays, triviaState };
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trip-navigator-${APP_VERSION}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('💾 גיבוי ירד בהצלחה למכשירך!');
    setBackupModal(false);
  };

  if (!currentUser) {
    return (
      <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', padding: '20px', boxSizing: 'border-box' }}>
        <form onSubmit={handleLogin} style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, padding: '36px 28px', borderRadius: '24px', width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.4)', boxSizing: 'border-box' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🧭</div>
          <h2 style={{ color: S.textPrimary, fontSize: '22px', fontWeight: '900', margin: '0 0 6px', letterSpacing: '-0.5px' }}>Trip-Navigator</h2>
          <p style={{ color: S.textSecondary, fontSize: '13px', marginBottom: '28px' }}>מערכת ניהול טיולים ורדאר משפחתי ({APP_VERSION})</p>
          <input 
            type="text" 
            placeholder="הכנס את שמך המלא (לדוגמה: אריק)" 
            value={loginInput} 
            onChange={e => setLoginInput(e.target.value)}
            style={{ width: '100%', padding: '14px 16px', borderRadius: '14px', border: `1px solid ${S.cardBorder}`, background: '#0f172a', color: S.textPrimary, marginBottom: '18px', fontSize: '15px', boxSizing: 'border-box', textAlign: 'center', outline: 'none' }}
          />
          <button type="submit" style={{ width: '100%', padding: '14px', background: S.accentGradient, color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '800', fontSize: '15px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(59,130,246,0.4)', transition: 'transform 0.1s' }}>
            התחל מסע ➔
          </button>
        </form>
      </div>
    );
  }

  const currentDay = tripDays[activeDay] || tripDays[0];
  const activeQ = TRIVIA_BANK[triviaState.idx % TRIVIA_BANK.length];
  const sortedScores = Object.entries(triviaState.scores || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.textPrimary, fontFamily: 'system-ui, -apple-system, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      
      {incomingPing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(5px)' }}>
          <div style={{ background: S.cardBg, border: '2px solid #ef4444', borderRadius: '24px', padding: '28px', width: '100%', maxWidth: '340px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.6)' }}>
            <div style={{ fontSize: '42px', marginBottom: '10px' }}>🚨</div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#ef4444', margin: '0 0 8px' }}>קיבלת PING דחוף!</h3>
            <p style={{ fontSize: '14px', fontWeight: '700', color: S.textPrimary, margin: '0 0 6px' }}>מאת: {incomingPing.from}</p>
            <div style={{ background: '#7f1d1d', border: '1px solid #991b1b', padding: '12px', borderRadius: '12px', fontSize: '13px', color: '#fca5a5', margin: '14px 0', fontWeight: '600' }}>
              "{incomingPing.msg}"
            </div>
            <button onClick={clearIncomingPing} style={{ width: '100%', padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(239,68,68,0.4)' }}>
              הבנתי, תודה 👍
            </button>
          </div>
        </div>
      )}

      <header style={{ background: S.cardBg, borderBottom: `1px solid ${S.cardBorder}`, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, boxSizing: 'border-box', width: '100%', boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box', minWidth: 0 }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: S.accentGradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', flexShrink: '0', boxShadow: '0 4px 10px rgba(59,130,246,0.3)' }}>🧭</div>
          <h1 style={{ fontSize: '14px', fontWeight: '900', color: S.textPrimary, margin: 0, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>Trip-Nav</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', boxSizing: 'border-box', flexShrink: 0 }}>
          
          <div style={{ background: gpsConnected ? '#064e3b' : '#7f1d1d', border: `1px solid ${gpsConnected ? '#059669' : '#b91c1c'}`, height: '30px', padding: '0 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '800', color: gpsConnected ? '#34d399' : '#fca5a5', boxSizing: 'border-box' }}>
            <span>{gpsConnected ? '🟢' : '🔴'}</span>
            <span>{gpsConnected ? 'GPS' : 'אין GPS'}</span>
          </div>

          <button 
            onClick={openWeatherApp}
            title="פתח אפליקציית מזג אוויר"
            style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, height: '30px', padding: '0 8px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', fontWeight: '800', color: S.textPrimary, boxSizing: 'border-box', cursor: 'pointer' }}
          >
            <span>{currentWeather.icon}</span>
            <span>{currentWeather.temp}</span>
          </button>

          <div style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, height: '30px', padding: '0 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', fontSize: '11px', fontWeight: '700', color: S.textSecondary, boxSizing: 'border-box', whiteSpace: 'nowrap', maxWidth: '85px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            👤 {currentUser}
          </div>

          <button 
            onClick={() => setSidebarOpen(true)} 
            style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, height: '30px', padding: '0 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', color: S.textPrimary, cursor: 'pointer', fontSize: '11px', fontWeight: '700', boxSizing: 'border-box', whiteSpace: 'nowrap' }}
          >
            ⚙️ ניהול
          </button>

        </div>

      </header>

      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box', width: '100%' }}>

        <nav style={{ background: S.cardBg, padding: '6px', borderRadius: '18px', border: `1px solid ${S.cardBorder}`, display: 'flex', gap: '6px', marginBottom: '22px', boxSizing: 'border-box', width: '100%', boxShadow: '0 8px 25px rgba(0,0,0,0.2)' }}>
          {[
            { id: 'itinerary', label: '📅 מסלול' },
            { id: 'radar', label: '📍 מפה ורדאר' },
            { id: 'around', label: '📍 מה סביבי' },
            { id: 'trivia', label: '🎯 טריוויה' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '12px 4px', borderRadius: '14px', border: 'none',
                background: activeTab === tab.id ? S.accentGradient : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : S.textSecondary,
                fontWeight: '800', fontSize: '12px', cursor: 'pointer', boxSizing: 'border-box',
                boxShadow: activeTab === tab.id ? '0 6px 16px rgba(59,130,246,0.4)' : 'none',
                textAlign: 'center', whiteSpace: 'nowrap', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {activeTab === 'itinerary' && (
          <div style={{ boxSizing: 'border-box', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '18px', scrollbarWidth: 'none', boxSizing: 'border-box', width: '100%' }}>
              {tripDays.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  style={{
                    flex: '0 0 auto', padding: '12px 18px', borderRadius: '14px',
                    border: `1px solid ${activeDay === idx ? S.accent : S.cardBorder}`,
                    background: activeDay === idx ? S.accentGradient : S.cardBg,
                    color: activeDay === idx ? '#ffffff' : S.textSecondary,
                    fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxSizing: 'border-box',
                    boxShadow: activeDay === idx ? '0 6px 16px rgba(59,130,246,0.3)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  {d.icon} {d.label}
                </button>
              ))}
            </div>

            <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '22px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.3)', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px', borderBottom: `1px solid ${S.cardBorder}`, paddingBottom: '16px', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '32px', background: '#0f172a', padding: '8px', borderRadius: '14px', border: `1px solid ${S.cardBorder}` }}>{currentDay.icon}</span>
                <div>
                  <h2 style={{ fontSize: '18px', fontWeight: '900', color: S.textPrimary, margin: '0 0 2px' }}>{currentDay.title}</h2>
                  <span style={{ fontSize: '12px', color: S.accent, fontWeight: '700' }}>{currentDay.label} · {currentDay.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', boxSizing: 'border-box', width: '100%' }}>
                {currentDay.stops.map((stop, sIdx) => (
                  <div key={sIdx} style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
                      <strong style={{ fontSize: '14px', color: S.textPrimary, fontWeight: '800' }}>{stop.name}</strong>
                      <span style={{ background: '#1e3a8a', color: '#93c5fd', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800' }}>{stop.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: S.textSecondary, margin: 0, lineHeight: '1.5' }}>{stop.note}</p>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', boxSizing: 'border-box', width: '100%' }}>
                      <a href={`https://waze.com/ul?q=${encodeURIComponent(stop.dest || stop.name)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#0284c7', color: '#fff', padding: '11px', borderRadius: '12px', textDecoration: 'none', fontSize: '12px', fontWeight: '800', textAlign: 'center', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(2,132,199,0.3)' }}>
                        🚗 ניווט ב-Waze
                      </a>
                      <a href={getMapsUrl(stop.lat, stop.lng, stop.dest || stop.name)} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#334155', color: '#fff', padding: '11px', borderRadius: '12px', textDecoration: 'none', fontSize: '12px', fontWeight: '800', textAlign: 'center', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(51,65,85,0.3)' }}>
                        🗺️ מפות (Apple/Google)
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'radar' && (
          <div style={{ background: S.cardBg, color: '#ffffff', border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '22px', textAlign: 'right', boxSizing: 'border-box', width: '100%', boxShadow: '0 15px 35px rgba(0,0,0,0.4)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${S.cardBorder}`, paddingBottom: '12px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '900', margin: '0 0 2px', letterSpacing: '-0.3px' }}>רדאר משפחתי – איתור ברחוב</h2>
                <span style={{ fontSize: '11px', color: S.textSecondary }}>לחץ על הכפתור כדי לפתוח תצוגת לוויין מדויקת</span>
              </div>
              <span style={{ fontSize: '11px', background: '#064e3b', color: '#34d399', padding: '4px 10px', borderRadius: '10px', fontWeight: '800', border: '1px solid #059669' }}>● Live</span>
            </div>

            <div ref={mapContainerRef} style={{ width: '100%', height: '420px', borderRadius: '16px', marginBottom: '16px', zIndex: 1, border: `1px solid ${S.cardBorder}` }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%' }}>
              {Object.keys(allUsersLocations).length === 0 ? (
                <div style={{ padding: '20px', textAlign: 'center', color: S.textSecondary, fontSize: '13px' }}>
                  ממתין לנתוני מיקום מהבנות...
                </div>
              ) : (
                Object.values(allUsersLocations).map((loc, idx) => (
                  <div key={idx} style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, padding: '14px 16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: '#334155', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '15px', border: '2px solid rgba(255,255,255,0.2)' }}>
                          {loc.name ? loc.name[0] : '👤'}
                        </div>
                        <span style={{ position: 'absolute', bottom: '0px', right: '0px', width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', border: '2px solid #0f172a' }}></span>
                      </div>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#ffffff', fontWeight: '800', display: 'inline-block', marginLeft: '6px' }}>
                          {loc.name} {loc.name === currentUser ? '(אתה)' : ''}
                        </strong>
                        {loc.updated_at && (
                          <span style={{ fontSize: '10px', color: S.textSecondary, display: 'block' }}>
                            עודכן לפני: {loc.updated_at}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {loc.name !== currentUser && (
                        <button onClick={() => sendPingToUser(loc.name)} style={{ background: '#d97706', color: '#ffffff', border: 'none', padding: '8px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: '800', cursor: 'pointer', boxShadow: '0 4px 10px rgba(217,119,6,0.3)' }} title="שלח פינג התראה">
                          🔔 PING
                        </button>
                      )}
                      <a href={getSatelliteMapsUrl(loc.lat, loc.lng, loc.name)} target="_blank" rel="noreferrer" style={{ background: S.accentGradient, color: '#ffffff', padding: '9px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: '800', boxSizing: 'border-box', whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
                        🛰️ תצוגת לוויין ➔
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'around' && (
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '22px', textAlign: 'center', boxSizing: 'border-box', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>📍</div>
            <h2 style={{ fontSize: '18px', fontWeight: '900', color: S.textPrimary, marginBottom: '6px' }}>מה יש סביבי?</h2>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '20px' }}>מצא מקומות בקרבת המיקום הנוכחי שלך בלחיצת כפתור:</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px', boxSizing: 'border-box', width: '100%' }}>
              {[{ label: '🍽️ מסעדות', q: 'מסעדות' }, { label: '🏛️ מוזיאונים', q: 'מוזיאונים' }, { label: '🎢 אטרקציות', q: 'אטרקציות תיירותיות' }, { label: '☕ בתי קפה', q: 'בתי קפה' }].map((item, i) => (
                <button key={i} type="button" onClick={() => searchAroundMe(item.q)} style={{ padding: '16px 12px', borderRadius: '14px', border: `1px solid ${S.cardBorder}`, background: '#0f172a', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', transition: 'all 0.2s' }}>
                  {item.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', boxSizing: 'border-box', width: '100%' }}>
              <input 
                type="text" 
                placeholder="הקלד כל דבר (לדוגמה: סופרמרקט...)" 
                value={customSearchQuery} 
                onChange={e => setCustomSearchQuery(e.target.value)}
                style={{ flex: 1, minWidth: 0, padding: '13px 16px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, fontSize: '15px', boxSizing: 'border-box', outline: 'none', background: '#0f172a', color: S.textPrimary }}
              />
              <button type="button" onClick={() => searchAroundMe(customSearchQuery)} style={{ padding: '13px 20px', background: S.accentGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
                חפש 🔍
              </button>
            </div>
          </div>
        )}

        {activeTab === 'trivia' && (
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '22px', textAlign: 'center', boxSizing: 'border-box', width: '100%', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: '900', color: S.textPrimary, margin: 0 }}>🎯 טריוויה משפחתית (1500)</h2>
              <span style={{ background: triviaState.isPaused ? '#7f1d1d' : '#064e3b', color: triviaState.isPaused ? '#fca5a5' : '#34d399', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '800' }}>
                {triviaState.isPaused ? '⏸️ מושהה' : `⏱️ ${timeLeft} שניות`}
              </span>
            </div>

            <div style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, borderRadius: '14px', padding: '14px', marginBottom: '18px', textAlign: 'right' }}>
              <strong style={{ fontSize: '12px', color: S.textPrimary, display: 'block', marginBottom: '8px' }}>🏆 טבלת מובילים:</strong>
              {sortedScores.length === 0 ? (
                <span style={{ fontSize: '11px', color: S.textSecondary }}>עדיין אין ניקוד. התחל לענות!</span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {sortedScores.map(([name, score], sIdx) => (
                    <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                      <span>{sIdx === 0 ? '👑 ' : '👤 '}{name}</span>
                      <strong style={{ color: S.accent }}>{score} נק'</strong>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!triviaState.isPaused ? (
              <>
                <div style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, padding: '20px', borderRadius: '14px', marginBottom: '18px', fontSize: '15px', fontWeight: '800', color: S.textPrimary, lineHeight: '1.5', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                  {activeQ.q}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {activeQ.options.map((opt, oIdx) => (
                    <button
                      key={oIdx}
                      onClick={() => {
                        if (selectedOpt !== null || triviaState.isPaused) return;
                        setSelectedOpt(oIdx);
                        const isCorrect = oIdx === activeQ.correct;
                        if (isCorrect) {
                          const currentScores = triviaState.scores || {};
                          const userScore = (currentScores[currentUser] || 0) + 10;
                          updateTriviaInCloud({
                            ...triviaState,
                            scores: { ...currentScores, [currentUser]: userScore }
                          });
                        }
                        setTimeout(() => {
                          setSelectedOpt(null);
                          setTimeLeft(30);
                          updateTriviaInCloud({ ...triviaState, idx: triviaState.idx + 1 });
                        }, 1200);
                      }}
                      style={{
                        padding: '15px', borderRadius: '14px', border: `1px solid ${S.cardBorder}`,
                        background: selectedOpt === null ? '#0f172a' : (oIdx === activeQ.correct ? S.success : (selectedOpt === oIdx ? S.danger : '#0f172a')),
                        color: selectedOpt !== null && (oIdx === activeQ.correct || selectedOpt === oIdx) ? '#ffffff' : S.textPrimary,
                        fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ padding: '30px', color: '#ef4444', fontWeight: 'bold', fontSize: '14px' }}>
                ⏸️ המשחק מושהה כרגע על ידי מנהל המערכת.
              </div>
            )}

            <div style={{ marginTop: '20px', borderTop: `1px solid ${S.cardBorder}`, paddingTop: '16px', display: 'flex', gap: '8px' }}>
              <input type="password" placeholder="קוד מנהל (1967)" value={adminTriviaPin} onChange={e => setAdminTriviaPin(e.target.value)} style={{ width: '120px', padding: '10px', borderRadius: '10px', border: `1px solid ${S.cardBorder}`, textAlign: 'center', fontSize: '12px', outline: 'none', background: '#0f172a', color: '#fff' }} />
              <button onClick={() => {
                if (adminTriviaPin !== ADMIN_PIN) return alert('❌ קוד מנהל שגוי!');
                updateTriviaInCloud({ ...triviaState, isPaused: !triviaState.isPaused });
                setAdminTriviaPin('');
              }} style={{ flex: 1, padding: '10px', background: triviaState.isPaused ? '#059669' : '#d97706', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                {triviaState.isPaused ? 'הפעל משחק ▶️' : 'השהה משחק ⏸️'}
              </button>
              <button onClick={() => {
                if (adminTriviaPin !== ADMIN_PIN) return alert('❌ קוד מנהל שגוי!');
                updateTriviaInCloud({ idx: 0, scores: {}, isPaused: false });
                setTimeLeft(30);
                setAdminTriviaPin('');
                alert('🔄 המשחק אופס בהצלחה!');
              }} style={{ padding: '10px 14px', background: S.danger, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer' }}>
                איפוס 🔄
              </button>
            </div>

          </div>
        )}

      </main>

      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'flex-start', boxSizing: 'border-box', backdropFilter: 'blur(4px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: S.cardBg, borderLeft: `1px solid ${S.cardBorder}`, width: '85%', maxWidth: '300px', height: '100%', padding: '28px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${S.cardBorder}`, paddingBottom: '14px', boxSizing: 'border-box', width: '100%' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: S.textPrimary }}>⚙️ ניהול ומערכת</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: S.textSecondary, fontSize: '20px', cursor: 'pointer' }}>✕</button>
            </div>

            <button onClick={() => setAdminModal(true)} style={{ padding: '14px 16px', background: '#0f172a', border: `1px solid ${S.cardBorder}`, borderRadius: '12px', fontWeight: '800', fontSize: '13px', color: S.textPrimary, cursor: 'pointer', textAlign: 'right', boxSizing: 'border-box', width: '100%' }}>
              📂 ניהול / טעינת מסלולים (מנהל)
            </button>

            <button onClick={() => setBackupModal(true)} style={{ padding: '14px 16px', background: '#0f172a', border: `1px solid ${S.cardBorder}`, borderRadius: '12px', fontWeight: '800', fontSize: '13px', color: S.textPrimary, cursor: 'pointer', textAlign: 'right', boxSizing: 'border-box', width: '100%' }}>
              💾 גיבוי ושחזור נתונים (מנהל)
            </button>
            
            <div style={{ marginTop: 'auto', fontSize: '11px', color: S.textSecondary, textAlign: 'center', borderTop: `1px solid ${S.cardBorder}`, paddingTop: '16px', boxSizing: 'border-box', width: '100%' }}>
              Trip-Navigator גרסה {APP_VERSION}
            </div>
          </div>
        </div>
      )}

      {adminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box', backdropFilter: 'blur(4px)' }}>
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, padding: '28px', borderRadius: '20px', width: '100%', maxWidth: '380px', textAlign: 'right', boxSizing: 'border-box', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <h3 style={{ marginTop: 0, color: S.textPrimary, fontSize: '17px', fontWeight: '900' }}>📂 ניהול והוספת מסלולים</h3>
            <p style={{ fontSize:
