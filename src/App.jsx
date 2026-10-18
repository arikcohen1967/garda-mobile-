import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.6.5 (Enhanced Live Radar & Clickable Weather) ---
const APP_VERSION = 'v1.6.5';
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

  const [triviaState, setTriviaState] = useState(() => {
    try {
      const saved = localStorage.getItem('trip-trivia-state');
      return saved ? JSON.parse(saved) : { idx: 0, scores: {}, isPaused: false };
    } catch (e) { return { idx: 0, scores: {}, isPaused: false }; }
  });
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedOpt, setSelectedOpt] = useState(null);
  const [adminTriviaPin, setAdminTriviaPin] = useState('');

  // Sync Trivia with Supabase
  useEffect(() => {
    const fetchTriviaGlobal = async () => {
      try {
        const { data } = await supabase.from('family_timers').select('*').eq('id', 999).single();
        if (data && data.trivia_data) {
          setTriviaState(data.trivia_data);
        }
      } catch (e) {}
    };
    fetchTriviaGlobal();

    const triviaChannel = supabase.channel('trip_trivia_sync_v165')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_timers' }, payload => {
        if (payload.new && payload.new.id === 999 && payload.new.trivia_data) {
          setTriviaState(payload.new.trivia_data);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(triviaChannel); };
  }, []);

  const updateTriviaInCloud = async (newState) => {
    setTriviaState(newState);
    try {
      localStorage.setItem('trip-trivia-state', JSON.stringify(newState));
      await supabase.from('family_timers').upsert([{ id: 999, trivia_data: newState }], { onConflict: 'id' });
    } catch (e) {}
  };

  // 30 Seconds Timer Effect
  useEffect(() => {
    if (activeTab !== 'trivia' || triviaState.isPaused || selectedOpt !== null) return;

    if (timeLeft <= 0) {
      setTimeLeft(30);
      const nextIdx = triviaState.idx + 1;
      updateTriviaInCloud({ ...triviaState, idx: nextIdx });
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, triviaState, timeLeft, selectedOpt]);

  // Sync Location & Weather & Fetch Radar Data
  useEffect(() => {
    if (!currentUser) return;

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

    const channel = supabase.channel('trip_radar_v165')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setAllUsersLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
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
        setLocationStatus(`✅ מחובר ל-GPS (${lat.toFixed(3)},${lng.toFixed(3)})`);
        
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
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

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
      if (lat && lng) return `
