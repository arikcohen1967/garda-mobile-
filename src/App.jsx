import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.7.5 (Locked Panning Map & Uniform Header) ---
const APP_VERSION = 'v1.7.5';
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
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [adminTriviaPin, setAdminTriviaPin] = useState('');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  // Load Leaflet scripts
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

  // Render Locked Red Pins Map
  useEffect(() => {
    if (activeTab !== 'radar') return;
    const timer = setTimeout(() => {
      if (!window.L || !mapContainerRef.current) return;

      const defaultLat = myLocation?.lat || 45.4384;
      const defaultLng = myLocation?.lng || 10.6816;

      if (!mapInstanceRef.current) {
        // Initialize map with dragging disabled so it stays fixed in place
        mapInstanceRef.current = window.L.map(mapContainerRef.current, {
          dragging: false,
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

      // Clear layers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Custom Red Pin Icon
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

  // Sync Supabase & GPS
  useEffect(() => {
    if (!currentUser) return;

    const fetchInitialData = async () => {
      try {
        const { data } = await supabase.from('family_radar').select('*');
        if (data) {
          const map = {};
          data.forEach(item => { map[item.name] = item; });
          setAllUsersLocations(map);
        }
      } catch (err) {}
    };
    fetchInitialData();

    const channel = supabase.channel('trip_sync_v175')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setAllUsersLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
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
      <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px', boxSizing: 'border-box' }}>
        <form onSubmit={handleLogin} style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, padding: '32px', borderRadius: '20px', width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', boxSizing: 'border-box' }}>
          <h2 style={{ color: S.textPrimary, fontSize: '20px', fontWeight: '900', margin: '0 0 6px' }}>Trip-Navigator</h2>
          <p style={{ color: S.textSecondary, fontSize: '13px', marginBottom: '24px' }}>מערכת ניהול טיולים וניווט ({APP_VERSION})</p>
          <input 
            type="text" 
            placeholder="הכנס את שמך המלא (לדוגמה: אריק)" 
            value={loginInput} 
            onChange={e => setLoginInput(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px',
