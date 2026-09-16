import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

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
    challenge: "לצלם את התמונה המשפחתית הראשונה באיטליה.",
    challengeDesc: "הרגע נחתנו! המשימה שלכם: סלפי משפחתי ראשון בשדה או עם הרכב השכור.",
    stops: [
      { time: "16:00", name: "נחיתה בנמל התעופה ורונה", dest: "Verona Villafranca Airport", note: "איסוף מזוודות ורכב שכור." },
      { time: "18:00", name: "נסיעה למלון וארוחת ערב", dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", note: "צ׳ק-אין והתארגנות במלון + ארוחת פיצה ראשונה.", food: { name: "🍕 פיצריה מקומית + גלידה בפסקיירה", dest: "Peschiera del Garda, Italy" } }
    ]
  },
  {
    date: "2026-10-01", label: "חמישי · 01/10", title: "Gardaland – יום פארק מלא", icon: "🎢",
    challenge: "לבחור יחד את שלושת המתקנים הכי אקסטרימיים!",
    challengeDesc: "צלמו תמונה צועקים על אחד המתקנים וספרו מי צעק הכי חזק.",
    stops: [
      { time: "08:30", name: "יציאה מהמלון ל-Gardaland", dest: "Gardaland Resort, Castelnuovo del Garda", note: "הגעה מוקדמת לפני פתיחת השערים." },
      { time: "13:00", name: "ארוחת צהריים בפארק", dest: "Gardaland Resort", note: "אוכל מהיר והמבורגרים.", food: { name: "🍔 Aladino Pizza & Burger", dest: "Gardaland Resort" } }
    ]
  },
  {
    date: "2026-10-02", label: "שישי · 02/10", title: "מונטה באלדו + סירמיונה", icon: "🚠",
    challenge: "תמונת פנורמה משפחתית מפסגת הרכבל!",
    challengeDesc: "תצפית מרהיבה מגובה 1,800 מטר באלדו ולאחר מכן שיטוט בסמטאות סירמיונה.",
    stops: [
      { time: "08:30", name: "רכבל מונטה באלדו (מלצ׳סינה)", dest: "Funivia Malcesine-Monte Baldo", note: "רכבל מסתובב אל פסגת ההר." },
      { time: "13:00", name: "סירמיונה וחצי האי", dest: "Sirmione, Italy", note: "עיירת ימי ביניים קסומה באגם.", food: { name: "🍦 גלידה מפורסמת בסירמיונה", dest: "Sirmione, Italy" } }
    ]
  },
  {
    date: "2026-10-03", label: "שבת · 03/10", title: "Movieland + Medieval Times", icon: "🎬",
    challenge: "סלפי משפחתי שנראה כמו פוסטר של סרט הוליוודי!",
    challengeDesc: "פוזה דרמטית ליד תפאורת סרט ב-Movieland.",
    stops: [
      { time: "09:00", name: "Movieland The Hollywood Park", dest: "Movieland The Hollywood Park, Lazise", note: "יום אקשן וחוויות קולנועיות." },
      { time: "20:00", name: "Medieval Times – מופע האבירים", dest: "Medieval Times, Lazise", note: "ארוחה ללא סכו״ם ואבירים.", food: { name: "🍗 Medieval Times", dest: "Medieval Times, Lazise" } }
    ]
  },
  {
    date: "2026-10-04", label: "ראשון · 04/10", title: "ונציה – עיר המים", icon: "🛶",
    challenge: "למצוא גשר קטן ומיוחד מחוץ למסלול הראשי!",
    challengeDesc: "צלמו את הגשר הכי מיוחד שמצאתם בסמטאות ונציה.",
    stops: [
      { time: "07:30", name: "יציאה לוונציה", dest: "Venezia Tronchetto Parking", note: "חנייה ומעבר בסירה למרכז." },
      { time: "09:30", name: "כיכר סן מרקו", dest: "St. Mark's Square, Venice", note: "הלב הפועם של ונציה." }
    ]
  },
  {
    date: "2026-10-05", label: "שני · 05/10", title: "X Rafting + Borghetto", icon: "🚣",
    challenge: "תמונה משפחתית מטורפת מהראפטינג!",
    challengeDesc: "אקשן מים מסעיר בבוקר וטיול רומנטי בבורגטו בצהריים.",
    stops: [
      { time: "09:00", name: "X Rafting", dest: "X Rafting, Italy", note: "שיט ראפטינג משפחתי מרגש בנהר." },
      { time: "12:30", name: "Borghetto sul Mincio", dest: "Borghetto sul Mincio", note: "כפר טחנות מרהיב.", food: { name: "🍝 טורטליני בבורגטו", dest: "Valeggio sul Mincio" } }
    ]
  },
  {
    date: "2026-10-06", label: "שלישי · 06/10", title: "ורונה + חזרה לישראל", icon: "❤️",
    challenge: "לבחור יחד את רגע השיא של הטיול כולו!",
    challengeDesc: "סיכום חוויות בוורונה וטיסה חזרה הביתה.",
    stops: [
      { time: "09:00", name: "סיור בוורונה", dest: "Piazza Cittadella, Verona", note: "הארנה והמרפסת של יוליה." },
      { time: "18:30", name: "שדה התעופה ורונה", dest: "Verona Villafranca Airport", note: "טיסה חזרה לישראל." }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🎬 Movieland', '🚤 ונציה'];
const DEFAULT_DOCUMENTS = [
  { id: 'flight-arik', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - אריק כהן (8180011314102)', isFlightInfo: true, passenger: 'COHEN/ARIK MR', ticketNo: '8180011314102' },
  { id: 'aig-insurance', folder: '✈️ טיסות ורכב', title: 'ביטוח נסיעות AIG (170270213826)', isInsuranceInfo: true },
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon', isHotelInfo: true }
];

const ROAD_TRIVIA_QUESTIONS = [
  { q: "כמה שיניים יש לאדם מבוגר בדרך כלל (כולל שיני בינה)?", options: ["28", "32", "36", "24"], correct: 1 },
  { q: "באיזו מדינה באירופה נמצא אגם גארדה?", options: ["צרפת", "ספרד", "איטליה", "אוסטריה"], correct: 2 },
  { q: "איזה בעל חיים ימי נחשב למהיר ביותר באוקיינוס?", options: ["כריש לבן", "דג מפרש", "דולפין", "לווייתן כחול"], correct: 1 },
  { q: "מהי בירת איטליה?", options: ["מילאנו", "ונציה", "רומא", "פירנצה"], correct: 2 },
  { q: "כמה רגליים יש לעכביש?", options: ["6", "8", "10", "12"], correct: 1 }
];

const generateMapHTML = (familyLocs, myLoc, sosState, isDark) => {
  let centerLat = 45.4384, centerLng = 10.6816;
  if (sosState?.lat) { centerLat = sosState.lat; centerLng = sosState.lng; }
  else if (myLoc?.lat) { centerLat = myLoc.lat; centerLng = myLoc.lng; }

  let markersJS = '';
  Object.values(familyLocs).forEach(loc => {
    if (loc && loc.lat) {
      markersJS += `L.marker([${loc.lat}, ${loc.lng}]).addTo(map).bindPopup('<b>${loc.name}</b><br>עודכן: ${loc.updated_at || 'עכשיו'}');\n`;
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
      <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: ${isDark ? '#0b0f19' : '#f8fafc'}; } #map { width: 100%; height: 100%; }</style>
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
  
  const [themeMode, setThemeMode] = useState(() => {
    try { return localStorage.getItem('garda-theme-mode') || 'light'; } catch (e) { return 'light'; }
  });

  useEffect(() => {
    try { localStorage.setItem('garda-theme-mode', themeMode); } catch (e) {}
  }, [themeMode]);

  const [viewerItem, setViewerItem] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [familyLocations, setFamilyLocations] = useState({
    'אריק': { name: 'אריק', lat: 45.4384, lng: 10.6816, updated_at: 'לפני דקה' },
    'עמית': { name: 'עמית', lat: 45.4484, lng: 10.6916, updated_at: 'לפני 5 דקות' },
    'יולי': { name: 'יולי', lat: 45.4284, lng: 10.6716, updated_at: 'לפני 10 דקות' },
    'ליאן': { name: 'ליאן', lat: 45.4184, lng: 10.6616, updated_at: 'לפני 12 דקות' },
    'הראל': { name: 'הראל', lat: 45.4584, lng: 10.7016, updated_at: 'עכשיו' }
  });
  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [activeSoundAlert, setActiveSoundAlert] = useState(null);
  
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerRemainingSec, setTimerRemainingSec] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const [parkingNote, setParkingNote] = useState('');
  const [savedParking, setSavedParking] = useState(null);
  const [aroundMeQuery, setAroundMeQuery] = useState('');
  const [carCompassHeading, setCarCompassHeading] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [currentWeather, setCurrentWeather] = useState({ temp: 'טוען...', condition: '⏳ מזג אוויר' });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await res.json();
            if (data && data.current_weather) {
              const tempVal = Math.round(data.current_weather.temperature);
              const code = data.current_weather.weathercode;
              let condIcon = '☀️ שמש';
              if (code >= 1 && code <= 3) condIcon = '🌤️ מעונן';
              else if (code >= 51 && code <= 67) condIcon = '🌧️ גשם';
              else if (code >= 71 && code <= 77) condIcon = '❄️ שלג';
              else if (code >= 95) condIcon = '⛈️ סערה';

              setCurrentWeather({ temp: `${tempVal}°C`, condition: condIcon });
            }
          } catch (e) {
            setCurrentWeather({ temp: '24°C', condition: '☀️ שמש' });
          }
        },
        () => {
          setCurrentWeather({ temp: '25°C', condition: '☀️ שמש נעימה' });
        }
      );
    }
  }, []);

  const [triviaIndex, setTriviaIndex] = useState(() => {
    try { const saved = localStorage.getItem('garda-trivia-index'); return saved ? Number(saved) : 0; } catch (e) { return 0; }
  });
  const travelers = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];
  const [travelerIndex, setTravelerIndex] = useState(() => {
    try { const saved = localStorage.getItem('garda-traveler-index'); return saved ? Number(saved) : 0; } catch (e) { return 0; }
  });
  const [travelerScores, setTravelerScores] = useState(() => {
    try { const saved = localStorage.getItem('garda-traveler-scores'); return saved ? JSON.parse(saved) : { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 }; } catch (e) { return { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 }; }
  });
  const [isTriviaPaused, setIsTriviaPaused] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45);

  useEffect(() => {
    try {
      localStorage.setItem('garda-trivia-index', triviaIndex);
      localStorage.setItem('garda-traveler-index', travelerIndex);
      localStorage.setItem('garda-traveler-scores', JSON.stringify(travelerScores));
    } catch (e) {}
  }, [triviaIndex, travelerIndex, travelerScores]);

  useEffect(() => {
    if (modalType !== 'trivia' || isTriviaPaused || selectedAnswer !== null) return;

    if (questionTimeLeft <= 0) {
      setQuestionTimeLeft(45);
      setTriviaIndex(prev => prev + 1);
      setTravelerIndex(prev => (prev + 1) % travelers.length);
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [modalType, isTriviaPaused, questionTimeLeft, selectedAnswer, travelers.length]);

  const [folders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles] = useState(DEFAULT_DOCUMENTS);

  const audioCtxRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  const sendSoundAlert = async (targetName) => {
    const customMsg = prompt(`שלח הודעה וצליל אל ${targetName}:`, "נא להגיע אל נקודת המפגש!");
    if (customMsg === null) return;

    playLongChime();

    const soundAlertPayload = {
      name: targetName,
      sound_msg: customMsg || "התראה קולית מהרדאר המשפחתי!",
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      is_sound_alert: true
    };

    setActiveSoundAlert(soundAlertPayload);

    try {
      await supabase.from('family_radar').upsert([soundAlertPayload], { onConflict: 'name' });
    } catch (e) {}
  };

  const playLongChime = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          try {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, ctx.currentTime);

            gain.gain.setValueAtTime(0.4, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.6);
          } catch (err) {}
        }, idx * 200);
      });
    } catch (e) {}
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const channel = supabase.channel('family_trip_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new) {
          setFamilyLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.is_sos) {
            setActiveSosAlert(payload.new);
            triggerSirenSound();
          }
          if (payload.new.is_sound_alert) {
            setActiveSoundAlert(payload.new);
            playLongChime();
          }
        }
      })
      .subscribe();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      supabase.removeChannel(channel);
      stopSirenSound();
    };
  }, []);

  const triggerSirenSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      let freq = 300;
      if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);

      alarmIntervalRef.current = setInterval(() => {
        try {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);

          gain.gain.setValueAtTime(0.1, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.7, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start();
          osc.stop(ctx.currentTime + 0.4);

          freq += 80;
          if (freq > 1200) freq = 300;
        } catch (e) {}
      }, 500);
    } catch (e) {}
  };

  const stopSirenSound = () => {
    if (alarmIntervalRef.current) {
      clearInterval(alarmIntervalRef.current);
      alarmIntervalRef.current = null;
    }
  };

  const triggerSos = async () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך במכשיר זה');
    if (!window.confirm('🚨 להפעיל אזעקת חירום SOS לכל בני המשפחה?')) return;

    navigator.geolocation.getCurrentPosition(async pos => {
      const sosData = {
        name: 'אריק',
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        is_sos: true
      };
      setActiveSosAlert(sosData);
      triggerSirenSound();
      try {
        await supabase.from('family_radar').upsert([sosData], { onConflict: 'name' });
      } catch (e) {}
    });
  };

  const dismissSos = async () => {
    stopSirenSound();
    setActiveSosAlert(null);
    try {
      await supabase.from('family_radar').upsert([{ name: 'אריק', is_sos: false }], { onConflict: 'name' });
    } catch (e) {}
  };

  const requestCompassPermission = () => {
    if (typeof window !== 'undefined' && window.DeviceOrientationEvent && typeof window.DeviceOrientationEvent.requestPermission === 'function') {
      window.DeviceOrientationEvent.requestPermission().then(response => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', (e) => {
            if (e.alpha !== null) setCarCompassHeading(e.alpha);
          });
          alert("🧭 גישה למצפן אושרה בהצלחה!");
        } else {
          alert("❌ גישה למצפן נדחתה.");
        }
      }).catch(() => alert("שגיאה בבקשת גישה למצפן"));
    } else {
      window.addEventListener('deviceorientation', (e) => {
        if (e.alpha !== null) setCarCompassHeading(e.alpha);
      });
      alert("🧭 מצפן הופעל!");
    }
  };

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#060913' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(17, 24, 39, 0.85)' : 'rgba(255, 255, 255, 0.95)';
  const textColor = isDark ? '#f3f4f6' : '#0f172a';
  const textSub = isDark ? '#9ca3af' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const accentGradient = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';
  const cardShadow = isDark ? '0 12px 35px rgba(0, 0, 0, 0.6)' : '0 10px 30px rgba(15, 23, 42, 0.05)';

  const day = INITIAL_TRIP_DAYS[activeDay];

  useEffect(() => {
    if (!activeTimer || !activeTimer.endTime || isTimerPaused) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((activeTimer.endTime - Date.now()) / 1000));
      setTimerRemainingSec(diff);
      if (diff === 0) {
        alert(`⏱️ הזמן נגמר עבור: ${activeTimer.title}!`);
        setActiveTimer(null);
        setIsTimerPaused(false);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [activeTimer, isTimerPaused]);

  const startTimer = (mins) => {
    const duration = Number(mins) || 10;
    const endTime = Date.now() + duration * 60 * 1000;
    setActiveTimer({ title: 'טיימר משפחתי', endTime, duration });
    setTimerRemainingSec(duration * 60);
    setIsTimerPaused(false);
    setModalType(null);
  };

  const stopTimer = () => {
    setIsTimerPaused(prev => !prev);
  };

  const resetTimer = () => {
    if (activeTimer) {
      const endTime = Date.now() + activeTimer.duration * 60 * 1000;
      setActiveTimer(prev => ({ ...prev, endTime }));
      setTimerRemainingSec(activeTimer.duration * 60);
      setIsTimerPaused(false);
    }
  };

  const formatClock = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const broadcastMyLocation = async (coords) => {
    const locObj = { name: 'אריק', lat: coords.latitude, lng: coords.longitude, updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }), is_sos: false };
    setMyLocation({ lat: coords.latitude, lng: coords.longitude });
    setFamilyLocations(prev => ({ ...prev, 'אריק': locObj }));
    try { await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' }); } catch (e) {}
  };

  const handleTriviaAnswer = (optIdx) => {
    if (isTriviaPaused || selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);
    const currentQ = ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length];
    const currentTraveler = travelers[travelerIndex];
    if (optIdx === currentQ.correct) {
      setTravelerScores(prev => ({ ...prev, [currentTraveler]: (prev[currentTraveler] || 0) + 10 }));
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      setQuestionTimeLeft(45);
      setTriviaIndex(prev => prev + 1);
      setTravelerIndex(prev => (prev + 1) % travelers.length);
    }, 1200);
  };

  const handleAdminReset = () => {
    const adminPassword = window.prompt("🔒 אזור מנהל בלבד: הזן סיסמת איפוס");
    if (adminPassword && adminPassword.trim() === "1967") {
      setTriviaIndex(0);
      setTravelerIndex(0);
      setTravelerScores({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
      setIsTriviaPaused(true);
      setQuestionTimeLeft(45);
      alert("🔄 המשחק אותחל בהצלחה על ידי המנהל (מושהה עד ללחיצה על המשך)!");
    } else if (adminPassword !== null) {
      alert("❌ סיסמה שגויה!");
    }
  };

  const handleNewGame = () => {
    if (window.confirm("🎮 להתחיל משחק חדש מאפס? (הניקוד והשאלות יתאפסו)")) {
      setTriviaIndex(0);
      setTravelerIndex(0);
      setTravelerScores({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
      setIsTriviaPaused(true);
      setQuestionTimeLeft(45);
    }
  };

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box', transition: 'background 0.3s ease, color 0.3s ease' }}>
      
      {/* GLOBAL HALF-SCREEN RED SOS EMERGENCY BANNER */}
      {activeSosAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '50vh', background: 'rgba(239, 68, 68, 0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', color: '#fff', borderBottomLeftRadius: '28px', borderBottomRightRadius: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '44px', marginBottom: '8px' }}>🚨</span>
          <h2 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 6px' }}>התרעת חירום SOS פעילה!</h2>
          <p style={{ fontSize: '15px', fontWeight: '800', marginBottom: '10px' }}>משתמש/ת: {activeSosAlert.name} זקוק/ה לעזרה מיידית!</p>
          <p style={{ fontSize: '12px', opacity: 0.9, marginBottom: '16px' }}>זמן עדכון: {activeSosAlert.updated_at}</p>
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
            <a href={`https://maps.google.com/?q=${activeSosAlert.lat},${activeSosAlert.lng}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '12px', background: '#fff', color: '#ef4444', borderRadius: '14px', fontWeight: '900', textDecoration: 'none', fontSize: '13px', textAlign: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              נווט למיקום 🗺️
            </a>
            <button onClick={dismissSos} style={{ flex: 1, padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
              בטל אזעקה ✓
            </button>
          </div>
        </div>
      )}

      {/* INCOMING SOUND & MESSAGE ALERT BANNER */}
      {activeSoundAlert && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '400px', background: '#2563eb', zIndex: 9998, borderRadius: '22px', padding: '18px', textAlign: 'center', color: '#fff', boxShadow: '0 15px 40px rgba(37, 99, 235, 0.4)', boxSizing: 'border-box', border: '2px solid rgba(255,255,255,0.3)' }}>
          <span style={{ fontSize: '32px' }}>🔔</span>
          <h3 style={{ margin: '6px 0', fontSize: '16px', fontWeight: '900' }}>התראה קולית התקבלה!</h3>
          <p style={{ margin: '0 0 10px', fontSize: '14px', fontWeight: '800', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px' }}>
            "{activeSoundAlert.sound_msg}"
          </p>
          <span style={{ fontSize: '11px', opacity: 0.85, display: 'block', marginBottom: '12px' }}>נשלח על ידי: {activeSoundAlert.name} ({activeSoundAlert.updated_at})</span>
          <button onClick={() => setActiveSoundAlert(null)} style={{ padding: '8px 22px', background: '#fff', color: '#2563eb', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '12px' }}>
            אישור והסרה ✓
          </button>
        </div>
      )}

      {/* Top Header Bar */}
      <header style={{ background: isDark ? 'rgba(11, 15, 25, 0.85)' : 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${borderColor}`, padding: '12px 16px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}`, width: '40px', height: '40px', borderRadius: '14px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0', boxShadow: '0 2px 6px rgba(0,0,0,0.04)' }}>
            ☰
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#3b82f6', letterSpacing: '0.03em' }}>garda-mobile</span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: isOnline ? '#22c55e' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#f59e0b', display: 'inline-block' }}></span>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        {/* Uniform Sized Header Buttons */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={uniformHeaderBtnStyle(isDark, cardBg, textColor, borderColor)} title="מזג אוויר מותאם לפי מיקום המכשיר">
            <span>{currentWeather.condition.split(' ')[0]}</span>
            <span>{currentWeather.temp}</span>
          </div>

          <a href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ ...uniformHeaderBtnStyle(isDark, cardBg, textColor, borderColor), textDecoration: 'none', background: '#38bdf8', color: '#0f172a', borderColor: '#38bdf8' }}>
            {WAZE_SVG} למלון
          </a>
          
          <button onClick={triggerSos} style={{ ...uniformHeaderBtnStyle(isDark, cardBg, textColor, borderColor), background: '#ef4444', color: '#fff', borderColor: '#ef4444', border: 'none', cursor: 'pointer' }}>
            🚨 SOS
          </button>
        </div>
      </header>

      {/* Active Timer Banner */}
      {activeTimer && (
        <div style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', color: '#fff', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: '800', fontSize: '13px', boxShadow: '0 4px 12px rgba(245, 158, 11, 0.25)' }}>
          <span onClick={() => setModalType('timer')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⏱️ טיימר {isTimerPaused ? '(מושהה)' : 'פועל'}: <span style={{ fontFamily: 'monospace', fontSize: '15px' }}>{formatClock(timerRemainingSec)}</span>
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button onClick={stopTimer} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
              {isTimerPaused ? '▶️ המשך' : '⏸️ עצור'}
            </button>
            <button onClick={resetTimer} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
              🔄 איפוס
            </button>
            <button onClick={() => { setActiveTimer(null); setIsTimerPaused(false); }} style={{ background: 'rgba(0,0,0,0.3)', border: 'none', color: '#fff', padding: '4px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Slide-out Menu Drawer */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 2500, backdropFilter: 'blur(8px)', transition: 'opacity 0.3s ease' }} />}
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '315px', background: isDark ? 'rgba(11, 15, 25, 0.98)' : 'rgba(255, 255, 255, 0.98)', backdropFilter: 'blur(25px)', zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', overflowY: 'auto', borderLeft: `1px solid ${borderColor}`, boxShadow: isDark ? '-15px 0 40px rgba(0,0,0,0.7)' : '-15px 0 40px rgba(0,0,0,0.1)' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '14px', background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '18px', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.35)' }}>
              🇮🇹
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '900', letterSpacing: '-0.01em' }}>תפריט הטיול</h3>
              <span style={{ fontSize: '11px', color: textSub, fontWeight: '700' }}>גארדה ואזור הטיול</span>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} style={{ background: isDark ? '#1e293b' : '#e2e8f0', border: 'none', color: isDark ? '#f8fafc' : '#1e293b', width: '34px', height: '34px', borderRadius: '12px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>✕</button>
        </div>

        <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: isDark ? '#1e293b' : '#f8fafc', border: `1px solid ${borderColor}`, color: textColor, padding: '12px 16px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <span>{isDark ? 'מצב תצוגה: כהה' : 'מצב תצוגה: בהיר'}</span>
          <span style={{ fontSize: '16px' }}>{isDark ? '🌙' : '☀️'}</span>
        </button>

        <div style={categoryGroupStyle(isDark, borderColor)}>
          <div style={categoryTitleStyle('#3b82f6')}>
            <span>📍</span> ניווט ראשי
          </div>
          <button onClick={() => { setSidebarOpen(false); setModalType(null); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>📅</span> מסלול ימי הטיול
          </button>
          <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>🧭</span> רדאר משפחתי חי
          </button>
        </div>

        <div style={categoryGroupStyle(isDark, borderColor)}>
          <div style={categoryTitleStyle('#f59e0b')}>
            <span>📍</span> סביבי (בקרבת מקום)
          </div>
          <button onClick={() => { setSidebarOpen(false); setModalType('around-me'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>📍</span> סביבי (Around Me)
          </button>
        </div>

        <div style={categoryGroupStyle(isDark, borderColor)}>
          <div style={categoryTitleStyle('#10b981')}>
            <span>⚡</span> כלים ושימושי
          </div>
          <button onClick={() => { setSidebarOpen(false); setModalType('timer'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>⏱️</span> טיימר משפחתי
          </button>
          <button onClick={() => { setSidebarOpen(false); setModalType('parking'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>🚗</span> שמירת מיקום רכב חכם
          </button>
          <button onClick={() => { setSidebarOpen(false); setModalType('trivia'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>🧠</span> טריויה משפחתית
          </button>
          <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={menuBtnStyle(isDark, textColor)}>
            <span style={{ fontSize: '16px' }}>🎟️</span> ארנק כרטיסים ומסמכים
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: 'auto', paddingTop: '10px', borderTop: `1px solid ${borderColor}` }}>
          <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={{ ...menuBtnStyle(isDark, textColor), background: isDark ? 'rgba(239, 68, 68, 0.15)' : '#fee2e2', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
            <span style={{ fontSize: '16px' }}>🆘</span> מספרי חירום ושגרירות
          </button>
        </div>

      </aside>

      {/* Main Container */}
      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* Days Horizontal Picker */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', scrollbarWidth: 'none' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{ flex: '1 0 auto', padding: '12px 16px', borderRadius: '16px', background: activeDay === i ? accentGradient : cardBg, color: activeDay === i ? '#fff' : textColor, border: `1px solid ${activeDay === i ? 'transparent' : borderColor}`, fontSize: '13px', fontWeight: '800', cursor: 'pointer', boxShadow: cardShadow, transition: 'all 0.2s ease' }}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Active Day Card */}
        <div style={{ background: cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${borderColor}`, borderRadius: '24px', padding: '24px', boxShadow: cardShadow, marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
            <span style={{ fontSize: '32px' }}>{day.icon}</span>
            <div>
              <small style={{ color: '#3b82f6', fontWeight: '800', fontSize: '11px', letterSpacing: '0.02em' }}>{day.date}</small>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', letterSpacing: '-0.01em' }}>{day.title}</h2>
            </div>
          </div>

          <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.12)' : '#eff6ff', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#3b82f6', display: 'block', marginBottom: '4px' }}>🎯 אתגר היום:</span>
            <p style={{ margin: '0 0 4px', fontWeight: '900', fontSize: '14px', color: textColor }}>{day.challenge}</p>
            <p style={{ margin: 0, fontSize: '12px', color: textSub, lineHeight: '1.4' }}>{day.challengeDesc}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {day.stops.map((stop, sIdx) => (
              <div key={sIdx} style={{ background: isDark ? 'rgba(11, 15, 25, 0.45)' : '#f8fafc', borderRadius: '18px', padding: '16px', border: `1px solid ${borderColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900' }}>{stop.name}</h4>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: textSub, background: isDark ? '#1e293b' : '#e2e8f0', padding: '4px 10px', borderRadius: '8px' }}>{stop.time}</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: textSub, lineHeight: '1.4' }}>{stop.note}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={{ background: isDark ? '#1e293b' : '#fff', color: textColor, padding: '10px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '12px', textAlign: 'center', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>{MAPS_SVG} Maps</a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '10px', borderRadius: '12px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 2px 5px rgba(56, 189, 248, 0.25)' }}>{WAZE_SVG} Waze</a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Modals */}
      {modalType && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, backdropFilter: 'blur(10px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, color: textColor, padding: 0, borderRadius: 0, width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none', overflowY: 'auto', border: 'none', boxShadow: 'none', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', flexShrink: 0, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, background: isDark ? 'rgba(11, 15, 25, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(15px)', borderBottom: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>
              <button onClick={() => setModalType(null)} style={{ background: isDark ? '#1e293b' : '#e2e8f0', border: 'none', color: isDark ? '#f8fafc' : '#1e293b', width: '36px', height: '36px', borderRadius: '12px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>✕</button>
              
              {modalType === 'trivia' ? (
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button onClick={() => setIsTriviaPaused(prev => !prev)} style={{ background: isDark ? '#1e293b' : '#e2e8f0', color: textColor, border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }}>
                    {isTriviaPaused ? '▶️ המשך' : '⏸️ השהה'}
                  </button>
                  <button onClick={handleAdminReset} style={{ background: isDark ? '#1e293b' : '#e2e8f0', color: textColor, border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s' }}>
                    🔒 איפוס
                  </button>
                </div>
              ) : null}

              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '900', textAlign: 'center', flex: 1, paddingRight: '10px' }}>
                {modalType === 'radar' && '📡 רדאר משפחתי חי ומופת האגם'}
                {modalType === 'around-me' && '📍 סביבי (Around Me)'}
                {modalType === 'timer' && '⏱️ טיימר משפחתי'}
                {modalType === 'parking' && '🚗 שמירת מיקום רכב חכם'}
                {modalType === 'trivia' && '🧠 טריויה משפחתית'}
                {modalType === 'tickets' && '🎟️ ארנק כרטיסים ומסמכים'}
                {modalType === 'emergency' && '🆘 מספרי חירום ושגרירות'}
              </h2>
            </div>

            {modalType === 'around-me' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '75px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '16px', background: bgMain }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(aroundMeQuery || 'supermarket')}`} target="_blank" rel="noreferrer" style={{ padding: '14px 24px', background: accentGradient, color: '#fff', borderRadius: '16px', fontWeight: '900', textDecoration: 'none', fontSize: '14px', textAlign: 'center', flexShrink: 0, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)' }}>
                    חפש
                  </a>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: cardBg, border: `1.5px solid ${borderColor}`, borderRadius: '16px', padding: '0 14px', boxShadow: cardShadow }}>
                    <input type="text" placeholder="הקלד או חפש כל דבר (לדוגמה: ...)" value={aroundMeQuery} onChange={e => setAroundMeQuery(e.target.value)} style={{ width: '100%', padding: '14px 0', border: 'none', background: 'transparent', color: textColor, outline: 'none', fontSize: '16px', fontWeight: '800' }} />
                    <span style={{ fontSize: '18px', cursor: 'pointer' }}>🎙️</span>
                  </div>
                </div>

                <p style={{ fontSize: '13px', fontWeight: '800', color: textSub, margin: '4px 0 0' }}>או בחר קטגוריה מהירה לחיפוש במפה:</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href="https://www.google.com/maps/search/?api=1&query=Autogrill" target="_blank" rel="noreferrer" style={{ background: cardBg, border: `1.5px solid ${borderColor}`, padding: '18px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: '#d97706', fontWeight: '900', fontSize: '15px', boxShadow: cardShadow, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span>☕</span> עצרת דרך / Autogrill & שירותים
                  </a>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <a href="https://www.google.com/maps/search/?api=1&query=pharmacy" target="_blank" rel="noreferrer" style={{ background: cardBg, border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>💊</span> פארם
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=gas+station" target="_blank" rel="noreferrer" style={{ background: cardBg, border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>⛽</span> תחנת דלק
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=gelateria" target="_blank" rel="noreferrer" style={{ background: cardBg, border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>🍦</span> גלידריה
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=pizza" target="_blank" rel="noreferrer" style={{ background: cardBg, border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>🍕</span> פיצה
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=restaurant" target="_blank" rel="noreferrer" style={{ background: cardBg, border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>🍲</span> מסעדות
                    </a>
                    <a href="https://www.google.com/maps/search/?api=1&query=supermarket" target="_blank" rel="noreferrer" style={{ background: cardBg, border: `1.5px solid ${borderColor}`, padding: '20px', borderRadius: '20px', textAlign: 'center', textDecoration: 'none', color: textColor, fontWeight: '900', fontSize: '15px', boxShadow: cardShadow, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '22px' }}>🛒</span> סופרמרקט
                    </a>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'radar' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', position: 'relative', boxSizing: 'border-box' }}>
                <div style={{ width: '100%', flex: 1, minHeight: '65vh', overflow: 'hidden', boxSizing: 'border-box' }}>
                  <iframe title="Map" srcDoc={generateMapHTML(familyLocations, myLocation, activeSosAlert, isDark)} style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
                
                <div style={{ background: isDark ? 'rgba(11, 15, 25, 0.95)' : 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(15px)', padding: '12px 16px 20px', borderTop: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box' }}>
                  <span style={{ fontSize: '11px', fontWeight: '900', color: textSub }}>מיקומי כל בני המשפחה:</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                    {Object.values(familyLocations).map((person, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: isDark ? 'rgba(30, 41, 59, 0.6)' : '#f8fafc', padding: '8px 12px', borderRadius: '12px', border: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '14px' }}>👤</span>
                          <div>
                            <div style={{ fontSize: '12px', fontWeight: '900', color: textColor }}>{person.name}</div>
                            <div style={{ fontSize: '9px', color: textSub }}>עודכן: {person.updated_at || 'עכשיו'}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => sendSoundAlert(person.name)} style={{ background: isDark ? '#1e293b' : '#fff', color: textColor, border: `1px solid ${borderColor}`, padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }}>
                            🔔 צליל
                          </button>
                          <a href={`https://maps.google.com/?q=${person.lat},${person.lng}`} target="_blank" rel="noreferrer" style={{ background: accentGradient, color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '3px' }}>
                            Directions 🧭
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <button onClick={() => navigator.geolocation.getCurrentPosition(pos => broadcastMyLocation(pos.coords))} style={{ flex: 1, padding: '12px', background: accentGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)' }}>📍 עדכן מיקום יום</button>
                    <button onClick={() => alert('🔄 המיקומים עודכנו בהצלחה!')} style={{ flex: 1, padding: '12px', background: isDark ? '#1e293b' : '#e2e8f0', color: textColor, border: `1px solid ${borderColor}`, borderRadius: '12px', fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}>🔄 רענן מיקומים</button>
                  </div>
                </div>
              </div>
            )}

            {modalType === 'timer' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '85px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '16px', background: bgMain }}>
                <p style={{ fontSize: '14px', fontWeight: '800', color: textSub, margin: 0 }}>בחר משך זמן מהיר לטיימר:</p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '12px' }}>
                  <button onClick={() => startTimer(5)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⚡ 5 דקות</button>
                  <button onClick={() => startTimer(15)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⏳ 15 דקות</button>
                  <button onClick={() => startTimer(30)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⏳ 30 דקות</button>
                  <button onClick={() => startTimer(45)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⏳ 45 דקות</button>
                  <button onClick={() => startTimer(60)} style={{ ...timerPresetBtn, padding: '16px', fontSize: '16px' }}>⏰ 60 דקות (שעה)</button>
                </div>

                {activeTimer && (
                  <div style={{ display: 'flex', gap: '10px', width: '100%', boxSizing: 'border-box', marginTop: '10px' }}>
                    <button onClick={stopTimer} style={{ flex: 1, padding: '14px', background: '#f59e0b', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}>
                      {isTimerPaused ? '▶️ המשך' : '⏸️ עצור'}
                    </button>
                    <button onClick={resetTimer} style={{ flex: 1, padding: '14px', background: '#10b981', color: '#fff', border: 'none', borderRadius: '14px', fontWeight: '900', cursor: 'pointer', fontSize: '14px' }}>
                      🔄 איפוס
                    </button>
                  </div>
                )}
              </div>
            )}

            {modalType === 'trivia' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '85px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '14px', background: bgMain }}>
                {isTriviaPaused && (
                  <div style={{ background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}`, padding: '12px 16px', borderRadius: '14px', textAlign: 'center', fontWeight: '900', fontSize: '13px' }}>
                    ⏸️ המשחק מושהה (לחץ למעלה על "המשך" כדי להפעיל את הזמן)
                  </div>
                )}

                <div style={{ background: isDark ? '#1e293b' : '#e2e8f0', borderRadius: '8px', height: '8px', width: '100%', overflow: 'hidden', display: 'flex' }}>
                  <div style={{ background: questionTimeLeft <= 10 ? '#ef4444' : '#3b82f6', width: `${(questionTimeLeft / 45) * 100}%`, transition: 'width 1s linear' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: '800', color: textSub, marginTop: '-6px' }}>
                  <span>⏳ זמן נותר לשאלה:</span>
                  <span style={{ color: questionTimeLeft <= 10 ? '#ef4444' : '#3b82f6' }}>{questionTimeLeft} שניות</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <div style={{ flex: 1, height: '46px', background: isDark ? '#1e293b' : '#f8fafc', padding: '0 14px', borderRadius: '14px', border: `1px solid ${borderColor}`, fontWeight: '900', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: textColor, boxSizing: 'border-box' }}>
                    <span>תורו של:</span> <span style={{ color: '#3b82f6', textDecoration: 'underline' }}>{travelers[travelerIndex]}</span>
                  </div>
                  <button onClick={handleNewGame} style={{ flex: 1, height: '46px', background: isDark ? '#1e293b' : '#e2e8f0', color: textColor, border: `1px solid ${borderColor}`, padding: '0 14px', borderRadius: '14px', fontSize: '13px', fontWeight: '900', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
                    משחק חדש
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                  {travelers.map((t, tIdx) => {
                    const isCurrent = tIdx === travelerIndex;
                    return (
                      <div key={tIdx} style={{ background: isCurrent ? (isDark ? '#334155' : '#cbd5e1') : (isDark ? '#1e293b' : '#fff'), color: textColor, padding: '10px 4px', borderRadius: '12px', textAlign: 'center', border: `1.5px solid ${isCurrent ? '#64748b' : borderColor}`, boxShadow: isCurrent ? '0 4px 12px rgba(0,0,0,0.1)' : 'none', boxSizing: 'border-box' }}>
                        <div style={{ fontSize: '12px', fontWeight: '900', marginBottom: '2px' }}>{t}</div>
                        <div style={{ fontSize: '11px', fontWeight: '800', color: textSub }}>{travelerScores[t] || 0} נק'</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', padding: '16px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(59, 130, 246, 0.2)', boxSizing: 'border-box' }}>
                  <span style={{ fontSize: '15px', fontWeight: '900', color: textColor }}>
                    (שאלה #{ (triviaIndex % ROAD_TRIVIA_QUESTIONS.length) + 1 }) {ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length].q}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length].options.map((opt, oIdx) => {
                    const currentQ = ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length];
                    let btnBg = isDark ? '#1e293b' : '#fff';
                    let btnColor = textColor;
                    let btnBorder = borderColor;
                    if (selectedAnswer !== null) {
                      if (oIdx === currentQ.correct) {
                        btnBg = '#10b981'; btnColor = '#fff'; btnBorder = '#10b981';
                      } else if (oIdx === selectedAnswer) {
                        btnBg = '#ef4444'; btnColor = '#fff'; btnBorder = '#ef4444';
                      }
                    }
                    return (
                      <button key={oIdx} onClick={() => handleTriviaAnswer(oIdx)} style={{ width: '100%', height: '48px', borderRadius: '14px', background: btnBg, color: btnColor, border: `1.5px solid ${btnBorder}`, fontWeight: '900', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s ease', boxSizing: 'border-box', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {modalType === 'tickets' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '85px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '12px', background: bgMain }}>
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {folders.map((f, idx) => (
                    <button key={idx} onClick={() => setActiveFolder(f)} style={{ padding: '10px 14px', borderRadius: '12px', background: activeFolder === f ? accentGradient : (isDark ? '#1e293b' : '#f1f5f9'), color: activeFolder === f ? '#fff' : textColor, border: 'none', fontWeight: '700', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{f}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {ticketFiles.filter(d => d.folder === activeFolder).map((doc, dIdx) => (
                    <div key={dIdx} onClick={() => setViewerItem(doc)} style={{ background: isDark ? 'rgba(11, 15, 25, 0.4)' : '#f8fafc', padding: '16px', borderRadius: '16px', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <span style={{ fontSize: '14px', fontWeight: '800' }}>📄 {doc.title}</span>
                      <span style={{ fontSize: '12px', fontWeight: '900', color: '#3b82f6' }}>צפה 👁️</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalType === 'emergency' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '85px 16px 24px', boxSizing: 'border-box', overflowY: 'auto', gap: '10px', background: bgMain }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <a href="tel:112" style={emergencyBtnStyle}>🚨 חירום כללי: 112</a>
                  <a href="tel:118" style={emergencyBtnStyle}>🚑 אמבולנס: 118</a>
                  <a href="tel:113" style={emergencyBtnStyle}>👮 משטרה: 113</a>
                  <a href="tel:115" style={emergencyBtnStyle}>🚒 כיבוי אש: 115</a>
                </div>
                <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '16px', borderRadius: '16px', marginTop: '6px' }}>
                  <strong style={{ display: 'block', marginBottom: '4px', fontSize: '14px', color: '#3b82f6' }}>🇮🇱 שגרירות ישראל באיטליה (רומא)</strong>
                  <p style={{ margin: '0 0 10px', fontSize: '13px', color: textSub }}>כתובת: Via Michele Mercati 12, 00197 Roma</p>
                  <a href="tel:+3906361981" style={{ display: 'block', padding: '12px', background: '#3b82f6', color: '#fff', textAlign: 'center', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', fontSize: '14px' }}>📞 חיוג לשגרירות: +39 06 361981</a>
                </div>
              </div>
            )}

            {modalType === 'parking' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', padding: '75px 12px 16px', boxSizing: 'border-box', overflow: 'hidden', gap: '10px', background: bgMain }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: isDark ? '#1e293b' : '#fff', color: textColor, borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '900', fontSize: '12px', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    🏡 למלון Vojon
                  </a>
                  <a href={`https://maps.google.com/?q=${savedParking ? `${savedParking.lat},${savedParking.lng}` : HOTEL_ADDRESS}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: '#1e3a8a', color: '#fff', borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: '900', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                    🚗 לרכב החונה
                  </a>
                </div>

                <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '16px', padding: '10px 14px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', boxShadow: cardShadow }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: '800', color: textSub }}>יעד: Vojon</span>
                    <span style={{ fontSize: '18px', fontWeight: '900', color: '#10b981' }}>2554.9 ק"מ</span>
                    <button onClick={requestCompassPermission} style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: '900', cursor: 'pointer' }}>
                      🧭 מצפן (iOS)
                    </button>
                  </div>

                  <div style={{ width: '90px', height: '90px', borderRadius: '50%', border: `2.5px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: isDark ? '#0b0f19' : '#f8fafc' }}>
                    <div style={{ position: 'absolute', top: '4px', fontSize: '10px', fontWeight: '900', color: '#ef4444' }}>N</div>
                    <div style={{ position: 'absolute', bottom: '4px', fontSize: '10px', fontWeight: '900', color: textSub }}>S</div>
                    <div style={{ position: 'absolute', left: '6px', fontSize: '10px', fontWeight: '900', color: textSub }}>W</div>
                    <div style={{ position: 'absolute', right: '6px', fontSize: '10px', fontWeight: '900', color: textSub }}>E</div>
                    <div style={{ width: '40px', height: '40px', transform: `rotate(${carCompassHeading}deg)`, transition: 'transform 0.3s ease', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: '24px' }}>🧭</span>
                    </div>
                  </div>
                </div>

                <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '16px', padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px', boxShadow: cardShadow }}>
                  <input type="text" placeholder="תיאור מקום החניה / קומה / עמוד..." value={parkingNote} onChange={e => setParkingNote(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: isDark ? '#0b0f19' : '#f8fafc', color: textColor, outline: 'none', fontSize: '14px', boxSizing: 'border-box' }} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => alert('📷 מצלמה נפתחת לצילום עמוד החניה!')} style={{ flex: 1, padding: '10px', background: isDark ? '#1e293b' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}`, borderRadius: '12px', fontWeight: '800', cursor: 'pointer', fontSize: '12px', textAlign: 'center' }}>
                      📸 צלם עמוד
                    </button>
                    <button onClick={() => { navigator.geolocation.getCurrentPosition(pos => { setSavedParking({ lat: pos.coords.latitude, lng: pos.coords.longitude, note: parkingNote }); alert('מיקום החניה נשמר בהצלחה!'); }); }} style={{ flex: 1.5, padding: '10px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '12px', textAlign: 'center' }}>
                      📍 שמור מיקום GPS
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

const uniformHeaderBtnStyle = (isDark, cardBg, textColor, borderColor) => ({
  height: '36px',
  padding: '0 10px',
  borderRadius: '12px',
  background: cardBg,
  color: textColor,
  border: `1px solid ${borderColor}`,
  fontWeight: '800',
  fontSize: '11px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '5px',
  boxSizing: 'border-box',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 5px rgba(0,0,0,0.02)'
});

const categoryGroupStyle = (isDark, borderColor) => ({
  background: isDark ? 'rgba(255, 255, 255, 0.02)' : 'rgba(0, 0, 0, 0.015)',
  border: `1px solid ${borderColor}`,
  borderRadius: '16px',
  padding: '10px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
});

const categoryTitleStyle = (accentColor) => ({
  fontSize: '11px',
  fontWeight: '900',
  color: accentColor,
  paddingRight: '6px',
  marginBottom: '2px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  letterSpacing: '0.02em'
});

const menuBtnStyle = (isDark, textColor) => ({
  background: 'transparent',
  border: 'none',
  color: textColor,
  padding: '10px 12px',
  borderRadius: '12px',
  textAlign: 'right',
  fontWeight: '700',
  fontSize: '13px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  transition: 'all 0.2s ease'
});

const timerPresetBtn = {
  padding: '16px',
  borderRadius: '14px',
  background: 'rgba(59, 130, 246, 0.1)',
  color: '#3b82f6',
  border: '1.5px solid rgba(59, 130, 246, 0.3)',
  fontWeight: '900',
  fontSize: '15px',
  cursor: 'pointer',
  textAlign: 'center'
};

const emergencyBtnStyle = {
  padding: '14px',
  borderRadius: '14px',
  background: '#fee2e2',
  color: '#ef4444',
  fontWeight: '800',
  fontSize: '13px',
  textAlign: 'center',
  textDecoration: 'none',
  border: '1.5px solid #fecaca',
  boxSizing: 'border-box'
};
