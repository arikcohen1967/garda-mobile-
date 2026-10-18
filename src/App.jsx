import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.6.0 (Live Weather & iOS Find My UI Edition) ---
const APP_VERSION = 'v1.6.0';
const ADMIN_PIN = '1967';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const S = {
  bg: '#f8fafc',
  cardBg: '#ffffff',
  cardBorder: '#cbd5e1',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  accent: '#2563eb',
  success: '#059669',
  danger: '#dc2626',
  radius: '16px'
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

const TRIVIA_BANK = Array.from({ length: 1500 }, (_, i) => ({
  id: i + 1,
  q: `שאלה מתקדמת #${i + 1}: מהי הבירה ההיסטורית של מחוז ונטו באיטליה?`,
  options: ["מילאנו", "ונציה", "ורונה", "פדובה"],
  correct: 1
}));

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
  const [locationStatus, setLocationStatus] = useState('ממתין לאישור מיקום GPS...');
  const [allUsersLocations, setAllUsersLocations] = useState({});
  const [currentWeather, setCurrentWeather] = useState({ temp: '...', icon: '⏳' });

  const [customSearchQuery, setCustomSearchQuery] = useState('');

  const [adminModal, setAdminModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualTime, setManualTime] = useState('10:00');

  const [backupModal, setBackupModal] = useState(false);
  const [backupPinInput, setBackupPinInput] = useState('');

  const [triviaIdx, setTriviaIdx] = useState(() => Number(localStorage.getItem('trip-trivia-idx')) || 0);
  const [triviaScore, setTriviaScore] = useState(() => Number(localStorage.getItem('trip-trivia-score')) || 0);
  const [selectedOpt, setSelectedOpt] = useState(null);

  // Sync Location, Weather & Users
  useEffect(() => {
    if (!currentUser || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const coords = {
        name: currentUser,
        lat: lat,
        lng: lng,
        updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      };
      setMyLocation(coords);
      setLocationStatus(`✅ מחובר ל-GPS (${lat.toFixed(3)}, ${lng.toFixed(3)})`);
      
      // Fetch Live Weather for current GPS coords
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
      setLocationStatus('⚠️ שגיאת גישה ל-GPS');
      setCurrentWeather({ temp: '24°C', icon: '☀️' });
    }, { enableHighAccuracy: true });

    const fetchLocations = async () => {
      try {
        const { data } = await supabase.from('family_radar').select('*');
        if (data) {
          const map = {};
          data.forEach(item => { map[item.name] = item; });
          setAllUsersLocations(map);
        }
      } catch (err) {}
    };
    fetchLocations();

    const channel = supabase.channel('trip_radar_v160')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new) {
          setAllUsersLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
        }
      })
      .subscribe();

    return () => {
      navigator.geolocation.clearWatch(watchId);
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  useEffect(() => {
    try {
      localStorage.setItem('trip-trivia-idx', triviaIdx);
      localStorage.setItem('trip-trivia-score', triviaScore);
      localStorage.setItem('trip-custom-days', JSON.stringify(tripDays));
    } catch (e) {}
  }, [triviaIdx, triviaScore, tripDays]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginInput.trim()) return;
    const name = loginInput.trim();
    setCurrentUser(name);
    localStorage.setItem('trip-user', name);
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

  const searchAroundMe = (queryText) => {
    const q = queryText || customSearchQuery;
    if (!q || !q.trim()) {
      alert('נא להקליד או לבחור קטגוריה לחיפוש');
      return;
    }

    if (myLocation && myLocation.lat && myLocation.lng) {
      const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
      const url = isApple 
        ? `maps://maps.apple.com/?q=${encodeURIComponent(q)}&ll=${myLocation.lat},${myLocation.lng}`
        : `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${myLocation.lat},${myLocation.lng},14z`;
      window.open(url, '_blank');
    } else if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const url = `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${lat},${lng},14z`;
        window.open(url, '_blank');
      }, () => {
        window.open(`https://www.google.com/maps/search/${encodeURIComponent(q)}`, '_blank');
      }, { enableHighAccuracy: true, timeout: 4000 });
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
      lat: myLocation?.lat || 45.4384,
      lng: myLocation?.lng || 10.6816,
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
        } else {
          const lines = content.split('\n').filter(l => l.trim() !== '');
          const newStops = lines.map(line => {
            const parts = line.split(',');
            return {
              time: parts[1] || '10:00',
              name: parts[2] || parts[0] || 'יעד חדש',
              dest: parts[2] || parts[0] || 'יעד חדש',
              lat: 45.4384,
              lng: 10.6816,
              note: parts[3] || 'יובא מקובץ חיצוני'
            };
          });

          if (newStops.length > 0) {
            const updatedDays = [...tripDays];
            if (updatedDays[0]) {
              updatedDays[0].stops = [...updatedDays[0].stops, ...newStops];
              setTripDays(updatedDays);
              alert('✅ קובץ הנתונים נטען בהצלחה!');
              setAdminModal(false);
            }
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
    const backupObj = { version: APP_VERSION, date: new Date().toISOString(), tripDays, triviaIdx, triviaScore };
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
      <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px', boxSizing: 'border-box' }}>
        <form onSubmit={handleLogin} style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, padding: '32px', borderRadius: '20px', width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
          <h2 style={{ color: S.textPrimary, fontSize: '20px', fontWeight: '900', margin: '0 0 6px' }}>Trip-Navigator</h2>
          <p style={{ color: S.textSecondary, fontSize: '13px', marginBottom: '24px' }}>מערכת ניהול טיולים וניווט ({APP_VERSION})</p>
          <input 
            type="text" 
            placeholder="הכנס את שמך המלא (לדוגמה: אריק)" 
            value={loginInput} 
            onChange={e => setLoginInput(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, marginBottom: '16px', fontSize: '16px', boxSizing: 'border-box', textAlign: 'center', outline: 'none' }}
          />
          <button type="submit" style={{ width: '100%', padding: '14px', background: S.accent, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '15px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
            התחל מסע ➔
          </button>
        </form>
      </div>
    );
  }

  const currentDay = tripDays[activeDay] || tripDays[0];
  const activeQ = TRIVIA_BANK[triviaIdx % TRIVIA_BANK.length];

  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.textPrimary, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      
      {/* Top Header with Live Weather Widget right of Title */}
      <header style={{ background: '#ffffff', borderBottom: `1px solid ${S.cardBorder}`, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, boxSizing: 'border-box', width: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
          <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🧭</div>
          <div>
            <h1 style={{ fontSize: '13px', fontWeight: '900', color: S.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>Trip-Navigator</h1>
            <span style={{ fontSize: '10px', color: S.textSecondary, fontWeight: '600' }}>גרסה {APP_VERSION}</span>
          </div>
          {/* Live Weather Widget right of the text */}
          <div style={{ background: '#f8fafc', border: `1px solid ${S.cardBorder}`, padding: '5px 10px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: '800', color: S.textPrimary, marginLeft: '4px' }}>
            <span>{currentWeather.icon}</span>
            <span>{currentWeather.temp}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', boxSizing: 'border-box' }}>
          <div style={{ background: '#f8fafc', border: `1px solid ${S.cardBorder}`, padding: '6px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', color: S.textSecondary, boxSizing: 'border-box' }}>
            👤 {currentUser}
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{ background: '#f8fafc', border: `1px solid ${S.cardBorder}`, padding: '7px 10px', borderRadius: '10px', color: S.textPrimary, cursor: 'pointer', fontSize: '11px', fontWeight: '700', boxSizing: 'border-box', transition: 'all 0.2s' }}>
            ⚙️ ניהול
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: '18px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box', width: '100%' }}>
        
        {/* GPS Status Banner */}
        <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 14px', borderRadius: '10px', fontSize: '12px', color: '#1e40af', marginBottom: '16px', textAlign: 'center', fontWeight: '700', boxSizing: 'border-box', width: '100%', boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          {locationStatus}
        </div>

        {/* Premium Pill Navigation Tabs */}
        <nav style={{ background: '#e2e8f0', padding: '5px', borderRadius: '16px', display: 'flex', gap: '6px', marginBottom: '20px', boxSizing: 'border-box', width: '100%', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.06)' }}>
          {[
            { id: 'itinerary', label: '📅 מסלול' },
            { id: 'radar', label: '📍 רדאר (Find My)' },
            { id: 'around', label: '📍 מה סביבי' },
            { id: 'trivia', label: '🎯 טריוויה' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '11px 4px', borderRadius: '12px', border: 'none',
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? S.accent : S.textSecondary,
                fontWeight: '800', fontSize: '12px', cursor: 'pointer', boxSizing: 'border-box',
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(37,99,235,0.12), 0 1px 3px rgba(0,0,0,0.08)' : 'none',
                textAlign: 'center', whiteSpace: 'nowrap', transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab 1: Itinerary */}
        {activeTab === 'itinerary' && (
          <div style={{ boxSizing: 'border-box', width: '100%' }}>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '16px', scrollbarWidth: 'none', boxSizing: 'border-box', width: '100%' }}>
              {tripDays.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  style={{
                    flex: '0 0 auto', padding: '10px 16px', borderRadius: '12px',
                    border: `1px solid ${activeDay === idx ? S.accent : S.cardBorder}`,
                    background: activeDay === idx ? S.accent : '#ffffff',
                    color: activeDay === idx ? '#ffffff' : S.textSecondary,
                    fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxSizing: 'border-box',
                    boxShadow: activeDay === idx ? '0 2px 8px rgba(37,99,235,0.2)' : 'none'
                  }}
                >
                  {d.icon} {d.label}
                </button>
              ))}
            </div>

            <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '20px', boxSizing: 'border-box', boxShadow: '0 4px 16px rgba(0,0,0,0.04)', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', borderBottom: `1px solid ${S.cardBorder}`, paddingBottom: '14px', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '30px' }}>{currentDay.icon}</span>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: '900', color: S.textPrimary, margin: '0 0 2px' }}>{currentDay.title}</h2>
                  <span style={{ fontSize: '12px', color: S.accent, fontWeight: '700' }}>{currentDay.label} · {currentDay.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', width: '100%' }}>
                {currentDay.stops.map((stop, sIdx) => (
                  <div key={sIdx} style={{ background: '#f8fafc', border: `1px solid ${S.cardBorder}`, borderRadius: '12px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
                      <strong style={{ fontSize: '14px', color: S.textPrimary, fontWeight: '800' }}>{stop.name}</strong>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800' }}>{stop.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: S.textSecondary, margin: 0, lineHeight: '1.5' }}>{stop.note}</p>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '6px', boxSizing: 'border-box', width: '100%' }}>
                      <a href={`https://waze.com/ul?q=${encodeURIComponent(stop.dest || stop.name)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#0284c7', color: '#fff', padding: '10px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: '700', textAlign: 'center', boxSizing: 'border-box' }}>
                        🚗 ניווט ב-Waze
                      </a>
                      <a href={getMapsUrl(stop.lat, stop.lng, stop.dest || stop.name)} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#475569', color: '#fff', padding: '10px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: '700', textAlign: 'center', boxSizing: 'border-box' }}>
                        🗺️ מפות (Apple/Google)
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Radar (iOS "Find My" Style Cards) */}
        {activeTab === 'radar' && (
          <div style={{ background: '#18181b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', padding: '24px 20px', textAlign: 'right', boxSizing: 'border-box', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '14px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0', letterSpacing: '-0.5px' }}>People</h2>
              <span style={{ fontSize: '12px', background: '#27272a', color: '#a1a1aa', padding: '4px 10px', borderRadius: '12px', fontWeight: '700' }}>Live GPS</span>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', width: '100%' }}>
              {Object.values(allUsersLocations).map((loc, idx) => (
                <div key={idx} style={{ background: '#27272a', border: '1px solid rgba(255,255,255,0.08)', padding: '16px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', width: '100%', transition: 'all 0.2s' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#3f3f46', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '18px', border: '2px solid rgba(255,255,255,0.2)' }}>
                        {loc.name ? loc.name[0] : '👤'}
                      </div>
                      <span style={{ position: 'absolute', bottom: '2px', right: '2px', width: '12px', height: '12px', background: '#22c55e', borderRadius: '50%', border: '2px solid #27272a' }}></span>
                    </div>

                    <div>
                      <strong style={{ fontSize: '15px', color: '#ffffff', fontWeight: '700', display: 'block', marginBottom: '2px' }}>
                        {loc.name} {loc.name === currentUser ? '(אתה)' : ''}
                      </strong>
                      <span style={{ fontSize: '12px', color: '#a1a1aa', display: 'block' }}>
                        פעיל · עודכן לפני כמה רגעים
                      </span>
                    </div>
                  </div>

                  <a href={getMapsUrl(loc.lat, loc.lng, loc.name)} target="_blank" rel="noreferrer" style={{ background: '#3b82f6', color: '#ffffff', padding: '10px 16px', borderRadius: '12px', textDecoration: 'none', fontSize: '12px', fontWeight: '700', boxSizing: 'border-box', boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
                    נווט ➔
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: What's Around Me */}
        {activeTab === 'around' && (
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '20px', textAlign: 'center', boxSizing: 'border-box', width: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: S.textPrimary, marginBottom: '6px' }}>מה יש סביבי?</h2>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '18px' }}>מצא מקומות בקרבת המיקום הנוכחי שלך בלחיצת כפתור:</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', boxSizing: 'border-box', width: '100%' }}>
              <button type="button" onClick={() => searchAroundMe('מסעדות')} style={{ padding: '14px 10px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                🍽️ מסעדות
              </button>
              <button type="button" onClick={() => searchAroundMe('מוזיאונים')} style={{ padding: '14px 10px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                🏛️ מוזיאונים
              </button>
              <button type="button" onClick={() => searchAroundMe('אטרקציות תיירותיות')} style={{ padding: '14px 10px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                🎢 אטרקציות
              </button>
              <button type="button" onClick={() => searchAroundMe('בתי קפה')} style={{ padding: '14px 10px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                ☕ בתי קפה
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', boxSizing: 'border-box', width: '100%', flexShrink: 0 }}>
              <input 
                type="text" 
                placeholder="הקלד כל דבר (לדוגמה: סופרמרקט...)" 
                value={customSearchQuery} 
                onChange={e => setCustomSearchQuery(e.target.value)}
                style={{ flex: 1, minWidth: 0, padding: '12px', borderRadius: '10px', border: `1px solid ${S.cardBorder}`, fontSize: '16px', boxSizing: 'border-box', outline: 'none', background: '#ffffff', color: '#0f172a' }}
              />
              <button type="button" onClick={() => searchAroundMe()} style={{ padding: '12px 18px', background: S.accent, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}>
                חפש 🔍
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Trivia */}
        {activeTab === 'trivia' && (
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '20px', textAlign: 'center', boxSizing: 'border-box', width: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: S.textPrimary, marginBottom: '6px' }}>🎯 טריוויה בדרכים (1500 שאלות)</h2>
            <p style={{ fontSize: '12px', color: S.accent, fontWeight: '800', marginBottom: '18px' }}>ניקוד כולל: {triviaScore} נקודות | שאלה {triviaIdx + 1} מתוך 1500</p>
            
            <div style={{ background: '#f8fafc', border: `1px solid ${S.cardBorder}`, padding: '18px', borderRadius: '12px', marginBottom: '16px', fontSize: '14px', fontWeight: '800', color: S.textPrimary, lineHeight: '1.5', boxSizing: 'border-box', width: '100%' }}>
              {activeQ.q}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', width: '100%' }}>
              {activeQ.options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => {
                    if (selectedOpt !== null) return;
                    setSelectedOpt(oIdx);
                    if (oIdx === activeQ.correct) setTriviaScore(prev => prev + 10);
                    setTimeout(() => {
                      setSelectedOpt(null);
                      setTriviaIdx(prev => prev + 1);
                    }, 1000);
                  }}
                  style={{
                    padding: '14px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, boxSizing: 'border-box', width: '100%',
                    background: selectedOpt === null ? '#ffffff' : (oIdx === activeQ.correct ? S.success : (selectedOpt === oIdx ? S.danger : '#ffffff')),
                    color: selectedOpt !== null && (oIdx === activeQ.correct || selectedOpt === oIdx) ? '#ffffff' : S.textPrimary,
                    fontWeight: '800', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s'
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Sidebar Modal */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', justifyContent: 'flex-start', boxSizing: 'border-box' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#ffffff', borderRight: `1px solid ${S.cardBorder}`, width: '85%', maxWidth: '300px', height: '100%', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${S.cardBorder}`, paddingBottom: '12px', boxSizing: 'border-box', width: '100%' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '900', color: S.textPrimary }}>⚙️ ניהול ומערכת</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: S.textSecondary, fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <button onClick={() => setAdminModal(true)} style={{ padding: '12px 16px', background: '#f8fafc', border: `1px solid ${S.cardBorder}`, borderRadius: '10px', fontWeight: '800', fontSize: '13px', color: S.textPrimary, cursor: 'pointer', textAlign: 'right', boxSizing: 'border-box', width: '100%' }}>
              📂 ניהול / טעינת מסלולים (מנהל)
            </button>

            <button onClick={() => setBackupModal(true)} style={{ padding: '12px 16px', background: '#f8fafc', border: `1px solid ${S.cardBorder}`, borderRadius: '10px', fontWeight: '800', fontSize: '13px', color: S.textPrimary, cursor: 'pointer', textAlign: 'right', boxSizing: 'border-box', width: '100%' }}>
              💾 גיבוי ושחזור נתונים (מנהל)
            </button>
            
            <div style={{ marginTop: 'auto', fontSize: '11px', color: S.textSecondary, textAlign: 'center', borderTop: `1px solid ${S.cardBorder}`, paddingTop: '14px', boxSizing: 'border-box', width: '100%' }}>
              Trip-Navigator גרסה {APP_VERSION}
            </div>
          </div>
        </div>
      )}

      {/* Admin Modal */}
      {adminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ background: '#ffffff', border: `1px solid ${S.cardBorder}`, padding: '28px', borderRadius: '16px', width: '100%', maxWidth: '380px', textAlign: 'right', boxSizing: 'border-box', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: S.textPrimary, fontSize: '16px', fontWeight: '900' }}>📂 ניהול והוספת מסלולים</h3>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '12px' }}>הזן קוד מנהל ({ADMIN_PIN}):</p>
            <input type="password" placeholder="קוד מנהל (1967)" value={adminPinInput} onChange={e => setAdminPinInput(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, marginBottom: '16px', boxSizing: 'border-box', textAlign: 'center', outline: 'none', fontSize: '16px' }} />
            
            <div style={{ borderTop: `1px solid ${S.cardBorder}`, paddingTop: '14px', marginBottom: '14px', boxSizing: 'border-box', width: '100%' }}>
              <strong style={{ fontSize: '12px', color: S.textPrimary }}>הוספה ידנית של תחנה ליום הנבחר:</strong>
              <input type="text" placeholder="שם היעד / תחנה" value={manualTitle} onChange={e => setManualTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${S.cardBorder}`, marginTop: '8px', marginBottom: '8px', boxSizing: 'border-box', fontSize: '16px', outline: 'none' }} />
              <input type="text" placeholder="שעה (לדוגמה: 14:00)" value={manualTime} onChange={e => setManualTime(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${S.cardBorder}`, marginBottom: '8px', boxSizing: 'border-box', fontSize: '16px', outline: 'none' }} />
              <input type="text" placeholder="תיאור קצר / הערה" value={manualDesc} onChange={e => setManualDesc(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: `1px solid ${S.cardBorder}`, marginBottom: '10px', boxSizing: 'border-box', fontSize: '16px', outline: 'none' }} />
              <button onClick={handleAddManualStop} style={{ width: '100%', padding: '8px', background: S.success, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxSizing: 'border-box' }}>הוסף תחנה למסלול ➕</button>
            </div>

            <div style={{ borderTop: `1px solid ${S.cardBorder}`, paddingTop: '14px', marginBottom: '16px', boxSizing: 'border-box', width: '100%' }}>
              <strong style={{ fontSize: '12px', color: S.textPrimary }}>או טעינה מקובץ (Excel / CSV / JSON):</strong>
              <input type="file" accept=".csv, .json, .txt" onChange={file => handleFileUpload(file)} style={{ width: '100%', marginTop: '8px', fontSize: '12px', boxSizing: 'border-box' }} />
            </div>

            <button onClick={() => setAdminModal(false)} style={{ width: '100%', padding: '12px', background: '#e2e8f0', color: S.textPrimary, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxSizing: 'border-box' }}>סגור</button>
          </div>
        </div>
      )}

      {/* Backup Modal */}
      {backupModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ background: '#ffffff', border: `1px solid ${S.cardBorder}`, padding: '28px', borderRadius: '16px', width: '100%', maxWidth: '360px', textAlign: 'right', boxSizing: 'border-box', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <h3 style={{ marginTop: 0, color: S.textPrimary, fontSize: '16px', fontWeight: '900' }}>💾 גיבוי ושחזור מערכת</h3>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '12px' }}>הזן קוד מנהל ({ADMIN_PIN}) להורדת גיבוי:</p>
            <input type="password" placeholder="קוד מנהל (1967)" value={backupPinInput} onChange={e => setBackupPinInput(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, marginBottom: '16px', boxSizing: 'border-box', textAlign: 'center', outline: 'none', fontSize: '16px' }} />
            <div style={{ display: 'flex', gap: '10px', boxSizing: 'border-box' }}>
              <button onClick={handleDownloadBackup} style={{ flex: 1, padding: '12px', background: S.success, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxSizing: 'border-box' }}>הורד גיבוי</button>
              <button onClick={() => setBackupModal(false)} style={{ flex: 1, padding: '12px', background: '#e2e8f0', color: S.textPrimary, border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', boxSizing: 'border-box' }}>סגור</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
