import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.5.2 (Perfect Header & Clickable Weather Widget) ---
const APP_VERSION = 'v1.5.2';
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
  const [currentWeather, setCurrentWeather] = useState({ temp: '... ', icon: '⏳' });

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

  // Sync Location & Weather
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

    const channel = supabase.channel('trip_radar_v152')
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

  const openWeatherForecast = () => {
    if (myLocation && myLocation.lat && myLocation.lng) {
      window.open(`https://www.google.com/maps/search/%Dמזג+אוויר/@${myLocation.lat},${myLocation.lng},12z`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/search/weather`, '_blank');
    }
  };

  const searchAroundMe = (queryText) => {
    const q = queryText || customSearchQuery;
    if (!q || !q.trim()) {
      alert('נא להקליד או לבחור קטגוריה לחיפוש');
      return;
    }

    if (myLocation && myLocation.lat && myLocation.lng) {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(q)}/@${myLocation.lat},${myLocation.lng},14z`;
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
