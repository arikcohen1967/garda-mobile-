import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WAZE_SVG = (
  <svg viewBox="0 0 512 512" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M375.4 233.5c-3.7-31.8-29.3-56.7-61.6-59.5-35.3-3.1-66.5 19.3-73.8 53.6-1.5 7-1.4 14.3.4 21.2-22.1 4.7-38.6 24.1-38.6 47.3 0 17.5 9.7 32.7 24.1 40.5l-10.7 33.3c-2.4 7.4 2.8 15 10.6 15 3.3 0 6.4-1.4 8.6-3.8l21.9-23.7c13.7 4.9 28.7 7.5 44.1 7.5 70.7 0 128-50.5 128-112.7 0-11.8-1.8-23.3-5.2-34.4zm-146 5.3c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm112 40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-56 22c-29.8 0-54-15.6-54-35 0-3.3 2.7-6 6-6h96c3.3 0 6 2.7 6 6 0 19.4-24.2 35-54 35z" fill="#fff"/>
    <path d="M220.5 240c-1.2 5.5-6.2 9.5-12 9.5s-10.8-4-12-9.5-2.8-12.7-14.2-22-27.5-22-15.5 0-28 12.5-28 28s12.5 28 28 28c4.4 0 8 3.6 8 8s-3.6 8-8 8c-24.3 0-44-19.7-44-44s19.7-44 44-44c21.2 0 39.1 14.7 43.5 34.5z" fill="#18181b"/>
    <circle cx="178" cy="246" r="10" fill="#18181b"/>
    <circle cx="282" cy="216" r="10" fill="#18181b"/>
    <circle cx="338" cy="216" r="10" fill="#18181b"/>
  </svg>
);

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#10b981"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#3b82f6"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#2563eb"/>
  </svg>
);

const HOTEL_COORDINATES = { lat: 45.4057, lng: 10.7022, name: "Bio Agriturismo Vojon" };
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

const RAW_BASE_QUESTIONS = [
  { q: "כמה רגליים יש לעכביש?", options: ["6", "8", "10", "12"], correct: 1 },
  { q: "איזה בעל חיים נחשב למהיר ביותר בעולם ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס מירוץ", "זברה"], correct: 1 },
  { q: "כמה פלנטות יש במערכת השמש שלנו?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "איזה גז אנחנו בני האדם שואפים בעיקר כדי לחיות?", options: ["פחמן דו-חמצני", "חמצן", "מימן", "חנקן"], correct: 1 }
];

const generateMassiveTrivia = () => {
  const generated = [];
  for (let i = 0; i < 50; i++) {
    const template = RAW_BASE_QUESTIONS[i % RAW_BASE_QUESTIONS.length];
    generated.push({ q: `(שאלה #${i + 1}) ${template.q}`, options: template.options, correct: template.correct });
  }
  return generated;
};

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lon2 || !lat2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} מטר` : `${d.toFixed(1)} ק"מ`;
};

const generateMapHTML = (familyLocs, myLoc, sosState, isDark) => {
  const locsArray = Object.values(familyLocs || {});
  let centerLat = 45.4384, centerLng = 10.6816;
  if (sosState?.lat) { centerLat = sosState.lat; centerLng = sosState.lng; }
  else if (myLoc?.lat) { centerLat = myLoc.lat; centerLng = myLoc.lng; }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #0f172a; } #map { width: 100%; height: 100%; }</style>
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
      </script>
    </body>
    </html>
  `;
};

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 'radar', 'timer', 'parking', 'challengesLog', 'trivia', 'gallery', 'tickets', 'emergency', 'weatherModal', 'appleMusicModal'
  const [themeMode, setThemeMode] = useState('dark');
  const [viewerItem, setViewerItem] = useState(null);

  // States for Radar & Family GPS
  const [myLocation, setMyLocation] = useState(null);
  const [familyLocations, setFamilyLocations] = useState({});
  const [activeSosAlert, setActiveSosAlert] = useState(null);

  // States for Timer
  const [activeTimer, setActiveTimer] = useState(null);
  const [timerRemainingSec, setTimerRemainingSec] = useState(0);

  // States for Parking
  const [savedParking, setSavedParking] = useState(null);
  const [parkingNote, setParkingNote] = useState('');

  // States for Trivia
  const [triviaQuestions] = useState(() => generateMassiveTrivia());
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [travelerIndex, setTravelerIndex] = useState(0);
  const [travelerScores, setTravelerScores] = useState({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const travelers = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];

  // States for Gallery & Documents
  const [galleryItems, setGalleryItems] = useState([]);
  const [folders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles] = useState(DEFAULT_DOCUMENTS);

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#090d16' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.85)';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const accentGradient = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
  const cardShadow = isDark ? '0 10px 30px rgba(0, 0, 0, 0.5)' : '0 10px 30px rgba(15, 23, 42, 0.05)';

  const day = INITIAL_TRIP_DAYS[activeDay];

  const triggerSos = () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך');
    if (!window.confirm('להפעיל התראת מצוקה SOS?')) return;
    navigator.geolocation.getCurrentPosition(pos => {
      const sosData = { name: 'אריק', lat: pos.coords.latitude, lng: pos.coords.longitude, time: new Date().toLocaleTimeString() };
      setActiveSosAlert(sosData);
      setModalType('radar');
    });
  };

  const handleTriviaAnswer = (optIdx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);
    const currentQ = triviaQuestions[triviaIndex];
    const currentTraveler = travelers[travelerIndex];
    if (optIdx === currentQ.correct) {
      setTravelerScores(prev => ({ ...prev, [currentTraveler]: (prev[currentTraveler] || 0) + 10 }));
    }
    setTimeout(() => {
      setSelectedAnswer(null);
      setTriviaIndex(prev => (prev + 1) % triviaQuestions.length);
      setTravelerIndex(prev => (prev + 1) % travelers.length);
    }, 1200);
  };

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: 'system-ui, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {/* Top Header Bar with Menu Button */}
      <header style={{ background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${borderColor}`, padding: '16px 20px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: isDark ? '#1e293b' : '#e2e8f0', color: textColor, border: 'none', width: '40px', height: '40px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          ☰
        </button>
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '10px', fontWeight: '800', color: '#3b82f6' }}>GARDA MOBILE 2026</span>
          <h1 style={{ margin: '0', fontSize: '16px', fontWeight: '900' }}>🇮🇹 אגם גארדה וונציה</h1>
        </div>
        <button onClick={triggerSos} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '12px', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}>🚨 SOS</button>
      </header>

      {/* Slide-out Menu Drawer */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2500, backdropFilter: 'blur(5px)' }} />}
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '300px', background: cardBg, backdropFilter: 'blur(20px)', zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', overflowY: 'auto', borderLeft: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>תפריט מהיר</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: textColor, fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
        </div>

        <button onClick={() => { setSidebarOpen(false); setModalType(null); }} style={menuBtnStyle}>📅 מסלול ימי הטיול</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={menuBtnStyle}>🧭 רדאר משפחתי חי</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('timer'); }} style={menuBtnStyle}>⏱️ טיימר משפחתי</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('parking'); }} style={menuBtnStyle}>🚗 שמירת מיקום רכב חכם</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trivia'); }} style={menuBtnStyle}>🧠 טריויה חכמה לדרך</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('gallery'); }} style={menuBtnStyle}>📸 יומן ואלבום תמונות</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={menuBtnStyle}>🎟️ ארנק כרטיסים ומסמכים</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={menuBtnStyle}>🆘 מספרי חירום</button>
      </aside>

      {/* Main Container */}
      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* Quick Hotel Waze Widget */}
        <div style={{ background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', borderRadius: '20px', padding: '16px 20px', color: '#fff', marginBottom: '20px', boxShadow: '0 8px 25px rgba(0,210,243,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', opacity: 0.9, display: 'block' }}>ניווט מהיר למלון</span>
            <strong style={{ fontSize: '15px' }}>Bio Agriturismo Vojon</strong>
          </div>
          <a href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#fff', color: '#000', padding: '10px 16px', borderRadius: '12px', textDecoration: 'none', fontWeight: '800', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            {WAZE_SVG} Waze
          </a>
        </div>

        {/* Days Horizontal Picker */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', scrollbarWidth: 'none' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{ flex: '1 0 auto', padding: '12px 16px', borderRadius: '16px', background: activeDay === i ? accentGradient : cardBg, color: activeDay === i ? '#fff' : textColor, border: `1px solid ${activeDay === i ? 'transparent' : borderColor}`, fontSize: '13px', fontWeight: '800', cursor: 'pointer', boxShadow: cardShadow }}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Active Day Card */}
        <div style={{ background: cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${borderColor}`, borderRadius: '24px', padding: '24px', boxShadow: cardShadow, marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>{day.icon}</span>
            <div>
              <small style={{ color: '#3b82f6', fontWeight: '800', fontSize: '11px' }}>{day.date}</small>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{day.title}</h2>
            </div>
          </div>

          <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', display: 'block', marginBottom: '4px' }}>🎯 אתגר היום:</span>
            <p style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '14px', color: textColor }}>{day.challenge}</p>
            <p style={{ margin: 0, fontSize: '12px', color: textSub }}>{day.challengeDesc}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {day.stops.map((stop, sIdx) => (
              <div key={sIdx} style={{ background: isDark ? 'rgba(15, 23, 42, 0.4)' : '#f8fafc', borderRadius: '16px', padding: '16px', border: `1px solid ${borderColor}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>{stop.name}</h4>
                  <span style={{ fontSize: '11px', fontWeight: '800', color: textSub, background: isDark ? '#1e293b' : '#e2e8f0', padding: '4px 8px', borderRadius: '8px' }}>{stop.time}</span>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: '13px', color: textSub, lineHeight: '1.4' }}>{stop.note}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={{ background: isDark ? '#1e293b' : '#fff', color: textColor, padding: '10px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '12px', textAlign: 'center', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{MAPS_SVG} Maps</a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#33ccff', color: '#000', padding: '10px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>{WAZE_SVG} Waze</a>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* Modals for Features (Radar, Trivia, Tickets, Emergency, etc.) */}
      {modalType && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', backdropFilter: 'blur(10px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, color: textColor, padding: '24px', borderRadius: '24px', width: '100%', maxWidth: '450px', maxHeight: '85vh', overflowY: 'auto', border: `1px solid ${borderColor}`, boxShadow: cardShadow }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>
                {modalType === 'radar' && '📡 רדאר משפחתי חי'}
                {modalType === 'timer' && '⏱️ טיימר משפחתי'}
                {modalType === 'parking' && '🚗 שמירת מיקום רכב חכם'}
                {modalType === 'trivia' && '🧠 טריויה חכמה לדרך'}
                {modalType === 'tickets' && '🎟️ ארנק כרטיסים ומסמכים'}
                {modalType === 'emergency' && '🆘 מספרי חירום'}
                {modalType === 'gallery' && '📸 אלבום תמונות משפחתי'}
              </h2>
              <button onClick={() => setModalType(null)} style={{ background: 'none', border: 'none', color: textColor, fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
            </div>

            {modalType === 'radar' && (
              <div>
                <div style={{ width: '100%', height: '240px', borderRadius: '14px', overflow: 'hidden', marginBottom: '14px' }}>
                  <iframe title="Map" srcDoc={generateMapHTML(familyLocations, myLocation, activeSosAlert, isDark)} style={{ width: '100%', height: '100%', border: 'none' }} />
                </div>
                <button onClick={() => navigator.geolocation.getCurrentPosition(pos => broadcastMyLocation(pos.coords))} style={{ width: '100%', padding: '12px', background: accentGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>📍 עדכן מיקום שלי GPS</button>
              </div>
            )}

            {modalType === 'trivia' && (
              <div>
                <div style={{ background: isDark ? '#1e293b' : '#eff6ff', padding: '10px', borderRadius: '10px', marginBottom: '12px', textAlign: 'center', fontSize: '13px', fontWeight: '800' }}>
                  תורו של: {travelers[travelerIndex]} | ניקוד: {travelerScores[travelers[travelerIndex]]}
                </div>
                <p style={{ fontSize: '15px', fontWeight: '800', marginBottom: '14px' }}>{triviaQuestions[triviaIndex].q}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {triviaQuestions[triviaIndex].options.map((opt, oIdx) => (
                    <button key={oIdx} onClick={() => handleTriviaAnswer(oIdx)} style={{ padding: '12px', borderRadius: '10px', background: isDark ? '#1e293b' : '#fff', color: textColor, border: `1px solid ${borderColor}`, fontWeight: '700', textAlign: 'right', cursor: 'pointer' }}>{opt}</button>
                  ))}
                </div>
              </div>
            )}

            {modalType === 'tickets' && (
              <div>
                <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '12px' }}>
                  {folders.map((f, idx) => (
                    <button key={idx} onClick={() => setActiveFolder(f)} style={{ padding: '8px 12px', borderRadius: '10px', background: activeFolder === f ? accentGradient : (isDark ? '#1e293b' : '#f1f5f9'), color: activeFolder === f ? '#fff' : textColor, border: 'none', fontWeight: '700', fontSize: '11px', cursor: 'pointer' }}>{f}</button>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ticketFiles.filter(d => d.folder === activeFolder).map((doc, dIdx) => (
                    <div key={dIdx} onClick={() => setViewerItem(doc)} style={{ background: isDark ? 'rgba(15, 23, 42, 0.4)' : '#f8fafc', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
                      <span style={{ fontSize: '13px', fontWeight: '700' }}>📄 {doc.title}</span>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6' }}>צפה 👁️</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalType === 'emergency' && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <a href="tel:112" style={emergencyBtnStyle}>🚨 חירום: 112</a>
                <a href="tel:118" style={emergencyBtnStyle}>🚑 אמבולנס: 118</a>
                <a href="tel:113" style={emergencyBtnStyle}>👮 משטרה: 113</a>
                <a href="tel:+390636911" style={emergencyBtnStyle}>🇮🇱 שגרירות</a>
              </div>
            )}

            {modalType === 'parking' && (
              <div>
                <p style={{ fontSize: '13px', color: textSub }}>שמור את מיקום הרכב כדי למצוא אותו בקלות אחר כך.</p>
                <input type="text" placeholder="תיאור חניה (למשל: קומה 2, עמוד 4)..." value={parkingNote} onChange={e => setParkingNote(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: isDark ? '#0f172a' : '#f8fafc', color: textColor, margin: '10px 0', boxSizing: 'border-box' }} />
                <button onClick={() => { navigator.geolocation.getCurrentPosition(pos => { setSavedParking({ lat: pos.coords.latitude, lng: pos.coords.longitude, note: parkingNote }); alert('החניה נשמרה!'); setModalType(null); }); }} style={{ width: '100%', padding: '12px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>📍 שמור מיקום GPS</button>
              </div>
            )}

            {modalType === 'timer' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', color: textSub }}>הגדר טיימר משפחתי לפעילות או זמן חופשי.</p>
                <button onClick={() => { setActiveTimer({ endTime: Date.now() + 15 * 60 * 1000, title: 'זמן חופשי' }); setModalType(null); alert('הטיימר הופעל ל-15 דקות!'); }} style={{ width: '100%', padding: '12px', background: accentGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>⏱️ הפעל טיימר ל-15 דקות</button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}

const menuBtnStyle = {
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  padding: '12px 14px',
  borderRadius: '12px',
  textAlign: 'right',
  fontWeight: '700',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background 0.2s'
};

const emergencyBtnStyle = {
  padding: '14px',
  borderRadius: '12px',
  background: '#fee2e2',
  color: '#ef4444',
  fontWeight: '800',
  fontSize: '13px',
  textAlign: 'center',
  textDecoration: 'none',
  border: '1.5px solid #fecaca',
  boxSizing: 'border-box'
};
