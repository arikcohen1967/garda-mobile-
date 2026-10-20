import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.8.22 (Clean & Fixed) ---
const APP_VERSION = 'v1.8.22';
const ADMIN_PIN = '1967';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const S = {
  bg: '#f8fafc',
  cardBg: '#ffffff',
  cardBorder: '#cbd5e1',
  textPrimary: '#0f172a',
  textSecondary: '#64748b',
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
  
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [adminTriviaPin, setAdminTriviaPin] = useState('');
  const [activeTriviaPlayer, setActiveTriviaPlayer] = useState(() => currentUser || '');

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
    if (activeTab !== 'trivia' || triviaState.isPaused || selectedOpt !== null) return;

    if (timeLeft <= 0) {
      const nextIdx = triviaState.idx + 1;
      updateTriviaInCloud({ ...triviaState, idx: nextIdx });
      setTimeLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, timeLeft, triviaState, selectedOpt]);

  useEffect(() => {
    setTimeLeft(30);
  }, [triviaState.idx]);

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
        html: `<div style="background-color: #dc2626; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
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
        const response = await supabase.from('family_radar').select('*');
        const data = response.data;
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

    const channel = supabase.channel('trip_sync_v1822')
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
    setActiveTriviaPlayer(name);
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

    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
    const lat = myLocation?.lat;
    const lng = myLocation?.lng;

    // הפורמט הנכון והמדויק שמאלץ את גוגל מפות לחפש את העסקים סביב המיקום הנוכחי של המכשיר
    if (lat && lng) {
      const url = isApple
        ? `maps://maps.apple.com/?q=${encodeURIComponent(q)}&near=${lat},${lng}`
        : `https://www.google.com/maps/search/${encodeURIComponent(q)}+near+${lat},${lng}`;
      window.open(url, '_blank');
    } else {
      const url = isApple
        ? `maps://maps.apple.com/?q=${encodeURIComponent(q)}`
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;
      window.open(url, '_blank');
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
  const activeQ = TRIVIA_BANK[triviaState.idx % TRIVIA_BANK.length];
  const sortedScores = Object.entries(triviaState.scores || {}).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.textPrimary, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box', width: '100%', maxWidth: '100vw', overflowX: 'hidden' }}>
      
      {incomingPing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 20000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ background: '#ffffff', border: '3px solid #dc2626', borderRadius: '20px', padding: '24px', width: '100%', maxWidth: '340px', textAlign: 'center', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🚨</div>
            <h3 style={{ fontSize: '18px', fontWeight: '900', color: '#dc2626', margin: '0 0 8px' }}>קיבלת PING דחוף!</h3>
            <p style={{ fontSize: '14px', fontWeight: '700', color: S.textPrimary, margin: '0 0 4px' }}>מאת: {incomingPing.from}</p>
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '12px', borderRadius: '10px', fontSize: '13px', color: '#991b1b', margin: '14px 0', fontWeight: '600' }}>
              "{incomingPing.msg}"
            </div>
            <button onClick={clearIncomingPing} style={{ width: '100%', padding: '12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
              הבנתי, תודה 👍
            </button>
          </div>
        </div>
      )}

      <header style={{ background: '#ffffff', borderBottom: `1px solid ${S.cardBorder}`, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, boxSizing: 'border-box', width: '100%', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', boxSizing: 'border-box', minWidth: 0 }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>🧭</div>
          <h1 style={{ fontSize: '13px', fontWeight: '900', color: S.textPrimary, margin: 0, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>Trip-Nav</h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', boxSizing: 'border-box', flexShrink: 0 }}>
          
          <div style={{ background: gpsConnected ? '#f0fdf4' : '#f
