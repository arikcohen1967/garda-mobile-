import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.8.8 (Fixed Build & UI Edition) ---
const APP_VERSION = 'v1.8.8';
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

  // ניהול שעון העצר בטריוויה (30 שניות)
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

    const channel = supabase.channel('trip_sync_v188')
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
            else
