import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v9.9.13-SupabaseRadarFix ---
const APP_VERSION = 'v9.9.13-SupabaseRadarFix';

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

const HOTEL_ADDRESS = "Bio Agriturismo Vojon, Ponti sul Mincio, Italy";

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30", label: "רביעי · 30/09", title: "נחיתה והגעה למלון", icon: "✈️",
    stops: [
      { 
        time: "16:00", 
        name: "נחיתה בנמל התעופה ורונה", 
        dest: "Verona Villafranca Airport", 
        lat: 45.3957, 
        lng: 10.8885, 
        note: "איסוף מזוודות וקבלת הרכב השכור בשדה התעופה.",
        challenge: {
          title: "סלפי משפחתי ראשון באיטליה!",
          desc: "נחתנו! המשימה שלכם: סלפי משפחתי חגיגי בשדה או מיד עם קבלת הרכב השכור."
        }
      },
      { 
        time: "18:00", 
        name: "נסיעה למלון והתארגנות", 
        dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", 
        lat: 45.4192, 
        lng: 10.6908, 
        note: "צ׳ק-אין במלון ומנוחה קצרה לפני היציאה לארוחת ערב.",
        culinary: {
          name: "Pizzeria Trattoria al Ponte (פסקיירה)",
          dest: "Peschiera del Garda, Italy",
          desc: "פיצות נפוליטניות מעולות ופסטה קלאסית בפיצריה משפחתית, ולקינוח גלידה איטלקית אמיתית."
        }
      }
    ]
  },
  {
    date: "2026-10-01", label: "חמישי · 01/10", title: "Gardaland – יום פארק מלא", icon: "🎢",
    stops: [
      { 
        time: "08:30", 
        name: "יציאה מהמלון לגארדלנד", 
        dest: "Gardaland Resort, Castelnuovo del Garda", 
        lat: 45.4526, 
        lng: 10.7153, 
        note: "הגעה מוקדמת לפני פתיחת השערים כדי לתפוס את הרכבות הראשונות!"
      },
      { 
        time: "13:00", 
        name: "אקשן ומתקנים בגארדלנד", 
        dest: "Gardaland Resort", 
        lat: 45.4526, 
        lng: 10.7153, 
        note: "בילוי בכל מתקני הפארק, הופעות חיות וארוחת צהריים מהירה."
      }
    ]
  },
  {
    date: "2026-10-02", label: "שישי · 02/10", title: "מונטה באלדו + סירמיונה", icon: "🚠",
    stops: [
      { 
        time: "08:30", 
        name: "רכבל מונטה באלדו (מלצ׳סינה)", 
        dest: "Funivia Malcesine-Monte Baldo", 
        lat: 45.7797, 
        lng: 10.8105, 
        note: "עלייה ברכבל המסתובב אל פסגת ההר המושלג בגובה 1,800 מטר."
      },
      { 
        time: "13:00", 
        name: "סירמיונה וחצי האי", 
        dest: "Sirmione, Italy", 
        lat: 45.4925, 
        lng: 10.6053, 
        note: "שיטוט בסמטאות עיירת ימי הביניים, טירת סקאליג'רו וטיילת האגם הקסומה."
      }
    ]
  },
  {
    date: "2026-10-03", label: "שבת · 03/10", title: "Movieland + Medieval Times", icon: "🎬",
    stops: [
      { 
        time: "09:00", 
        name: "Movieland The Hollywood Park", 
        dest: "Movieland The Hollywood Park, Lazise", 
        lat: 45.4745, 
        lng: 10.7291, 
        note: "יום הרפתקאות, אפקטים מיוחדים, צוללות ופעלולים הוליוודיים."
      },
      { 
        time: "19:30", 
        name: "Medieval Times – מופע האבירים והמשתה", 
        dest: "Medieval Times, Lazise", 
        lat: 45.4745, 
        lng: 10.7291, 
        note: "טורניר אבירים סוער עם סוסים וארוחת ערב מלכותית (5 מבוגרים) ללא סכו״ם!"
      }
    ]
  },
  {
    date: "2026-10-04", label: "ראשון · 04/10", title: "ונציה – עיר המים", icon: "🛶",
    stops: [
      { 
        time: "07:30", 
        name: "יציאה וחניה בוונציה (Tronchetto)", 
        dest: "Venezia Tronchetto Parking", 
        lat: 45.4384, 
        lng: 12.3167, 
        note: "חניה נוחה בחניון טרונקטו ומעבר בסירת ואפורטו למרכז."
      },
      { 
        time: "09:30", 
        name: "כיכר סן מרקו וסמטאות ונציה", 
        dest: "St. Mark's Square, Venice", 
        lat: 45.4343, 
        lng: 12.3388, 
        note: "הלב הפועם של ונציה – הבזיליקה, גשר האנחות ושיטוט בגשרים הקטנים."
      }
    ]
  },
  {
    date: "2026-10-05", label: "שני · 05/10", title: "לימונה + אגם טנו + ריבה", icon: "🍋",
    stops: [
      { 
        time: "08:30", 
        name: "לימונה סול גארדה והטיילת", 
        dest: "Limone sul Garda Parking, Italy", 
        lat: 45.8143, 
        lng: 10.7932, 
        note: "סיור מרגיע בטיילת הציורית התלויה ובסמטאות עצי הלימון."
      },
      { 
        time: "11:30", 
        name: "אגם טנו – פיקניק ושחייה", 
        dest: "Lago di Tenno, Italy", 
        lat: 45.9221, 
        lng: 10.8405, 
        note: "אגם בעל מים בצבע טורקיז מרהיב – זמן למנוחה, פיקניק וטבילה מרעננת."
      }
    ]
  },
  {
    date: "2026-10-06", label: "שלישי · 06/10", title: "קניית VR ורונה + חזרה", icon: "❤️",
    stops: [
      { 
        time: "08:30", 
        name: "רכישת משקפי VR בורונה", 
        dest: "Centro Commerciale Adigeo, Viale delle Nazioni, Verona", 
        lat: 45.4093, 
        lng: 10.9632, 
        note: "ביקור ב-MediaWorld בקניון Adigeo לרכישת Meta Quest והחתמת Tax Free."
      },
      { 
        time: "18:30", 
        name: "שדה התעופה وרונה – מכס וחזרה לישראל", 
        dest: "Verona Villafranca Airport", 
        lat: 45.3957, 
        lng: 10.8885, 
        note: "מעבר במכס להחתמת ה-Tax Free, החזרת הרכב וטיסה ישירה."
      }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🎬 Movieland', '🚤 ונציה'];
const DEFAULT_DOCUMENTS = [
  { id: 'flight-arik', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - אריק כהן (8180011314102)' },
  { id: 'flight-amit', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - עמית כהן (8180011314103)' },
  { id: 'flight-yuly', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - יולי כהן (8180011314104)' },
  { id: 'flight-lian', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - ליאן כהן (8180011314105)' },
  { id: 'flight-harel', folder: '✈️️ טיסות ורכב', title: 'כרטיס טיסה - הראל כהן (8180011314106)' },
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon' }
];

const ROAD_TRIVIA_QUESTIONS = [
  { q: "באיזו מדינה באירופה נמצא אגם גארדה?", options: ["צרפת", "ספרד", "איטליה", "אוסטריה"], correct: 2 },
  { q: "מהי בירת איטליה?", options: ["מילאנו", "ונציה", "רומא", "פירנצה"], correct: 2 },
  { q: "איזו עיר באיטליה ידועה בתור עיר המים?", options: ["רומא", "ונציה", "ורונה", "פירנצה"], correct: 1 },
  { q: "מי צייר את המונה ליזה?", options: ["לאונרדו דה וינצ'י", "מיכלאנג'לו", "פבלו פיקאסו", "ואן גוך"], correct: 0 }
];

const TRAVELERS_LIST = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];

const calculateDistanceAndDuration = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return { dist: '---', duration: '---' };
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = R * c;
  const hours = distKm / 70;
  const mins = Math.round(hours * 60);
  
  let durationStr = `${mins} דק'`;
  if (mins >= 60) {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    durationStr = `${h} שע' ${m > 0 ? `${m} דק'` : ''}`;
  }
  return { dist: `${distKm.toFixed(1)} ק"מ`, duration: durationStr };
};

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  
  const [currentUser, setCurrentUser] = useState(() => {
    try { return localStorage.getItem('garda-current-user') || 'אריק'; } catch (e) { return 'אריק'; }
  });

  const [themeMode, setThemeMode] = useState(() => {
    try { return localStorage.getItem('garda-theme-mode') || 'light'; } catch (e) { return 'light'; }
  });

  useEffect(() => {
    try { localStorage.setItem('garda-current-user', currentUser); } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try { localStorage.setItem('garda-theme-mode', themeMode); } catch (e) {}
  }, [themeMode]);

  // טעינת רדאר משפחתי מ-Supabase וחיבור בזמן אמת
  const [familyLocations, setFamilyLocations] = useState({
    'אריק': { name: 'אריק', lat: 45.4384, lng: 10.6816, updated_at: 'עכשיו', battery: 90, lastSeen: 'מלון Vojon' },
    'עמית': { name: 'עמית', lat: 45.4484, lng: 10.6916, updated_at: 'עכשיו', battery: 85, lastSeen: 'פסקיירה' },
    'יולי': { name: 'יולי', lat: 45.4284, lng: 10.6716, updated_at: 'עכשיו', battery: 92, lastSeen: 'מלון Vojon' },
    'ליאן': { name: 'ליאן', lat: 45.4184, lng: 10.6616, updated_at: 'עכשיו', battery: 88, lastSeen: 'מלון Vojon' },
    'הראל': { name: 'הראל', lat: 45.4584, lng: 10.7016, updated_at: 'עכשיו', battery: 95, lastSeen: 'גארדלנד' }
  });

  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [activeSoundAlert, setActiveSoundAlert] = useState(null);
  const [rallyPoint] = useState({ name: 'שער הכניסה הראשי (נקודת כינוס)', lat: 45.4526, lng: 10.7153 });
  const [myLocation, setMyLocation] = useState(null);

  const chimeIntervalRef = useRef(null);

  const playExtendedChimeMelody = () => {
    try {
      if (chimeIntervalRef.current) clearInterval(chimeIntervalRef.current);
      let cycles = 0;
      chimeIntervalRef.current = setInterval(() => {
        cycles++;
        if (cycles > 10) {
          if (chimeIntervalRef.current) clearInterval(chimeIntervalRef.current);
          return;
        }
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          if (ctx.state === 'suspended') ctx.resume();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime);
          gain.gain.setValueAtTime(0.2, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.8);
        }
      }, 1000);
    } catch (e) {}
  };

  useEffect(() => {
    const fetchFamilyRadar = async () => {
      try {
        const { data, error } = await supabase.from('family_radar').select('*');
        if (!error && data && data.length > 0) {
          const locMap = {};
          data.forEach(item => { locMap[item.name] = item; });
          setFamilyLocations(prev => ({ ...prev, ...locMap }));
        }
      } catch (e) {}
    };
    fetchFamilyRadar();

    const radarChannel = supabase.channel('family_radar_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setFamilyLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.is_sos) {
            setActiveSosAlert(payload.new);
            playExtendedChimeMelody();
          }
          if (payload.new.is_sound_alert && payload.new.name === currentUser) {
            setActiveSoundAlert(payload.new);
            playExtendedChimeMelody();
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(radarChannel);
      if (chimeIntervalRef.current) clearInterval(chimeIntervalRef.current);
    };
  }, [currentUser]);

  const updateAndBroadcastMyLoc = async () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך במכשיר זה');
    navigator.geolocation.getCurrentPosition(async pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      const timeStr = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
      
      const myRecord = {
        name: currentUser,
        lat: lat,
        lng: lng,
        updated_at: timeStr,
        battery: 90,
        lastSeen: 'בדרכים באיטליה',
        is_sos: false,
        is_sound_alert: false
      };

      setMyLocation({ lat, lng });
      setFamilyLocations(prev => ({ ...prev, [currentUser]: myRecord }));

      try {
        const { error } = await supabase.from('family_radar').upsert([myRecord], { onConflict: 'name' });
        if (error) alert("שגיאה בעדכון המיקום לשרת.");
        else alert("📍 המיקום שלך עודכן בהצלחה ומשודר לכולם!");
      } catch (err) {
        alert("תקלת תקשורת בעדכון מיקום.");
      }
    }, () => {
      alert("❌ לא ניתן לקבוע את מיקום ה-GPS.");
    }, { enableHighAccuracy: true });
  };

  const sendSoundAlert = async (targetName) => {
    const customMsg = prompt(`שלח התראה ל-${targetName}:`, "נא ליצור קשר כשאתם יכולים!");
    if (customMsg === null) return;
    const alertPayload = {
      name: targetName,
      sound_msg: customMsg,
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      is_sound_alert: true
    };
    try {
      await supabase.from('family_radar').upsert([alertPayload], { onConflict: 'name' });
      alert(`🔔 התראה נשלחה בהצלחה אל ${targetName}!`);
    } catch (e) {}
  };

  const triggerSos = async () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך');
    if (!window.confirm('🚨 להפעיל אזעקת חירום SOS לכל בני המשפחה?')) return;
    navigator.geolocation.getCurrentPosition(async pos => {
      const sosData = {
        name: currentUser,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        is_sos: true
      };
      setActiveSosAlert(sosData);
      playExtendedChimeMelody();
      try {
        await supabase.from('family_radar').upsert([sosData], { onConflict: 'name' });
      } catch (e) {}
    }, () => {}, { enableHighAccuracy: true });
  };

  const dismissSos = async () => {
    setActiveSosAlert(null);
    try {
      await supabase.from('family_radar').upsert([{ name: currentUser, is_sos: false }], { onConflict: 'name' });
    } catch (e) {}
  };

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#111111' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#a3a3a3' : '#64748b';
  const borderColor = isDark ? '#333333' : '#cbd5e1';

  const day = INITIAL_TRIP_DAYS[activeDay];

  const radarMapHTML = useMemo(() => {
    let centerLat = myLocation?.lat || 45.4384;
    let centerLng = myLocation?.lng || 10.6816;
    if (activeSosAlert?.lat) { centerLat = activeSosAlert.lat; centerLng = activeSosAlert.lng; }

    let markersJS = '';
    Object.values(familyLocations).forEach(loc => {
      if (loc && loc.lat && loc.lng) {
        markersJS += `
          L.marker([${loc.lat}, ${loc.lng}]).addTo(map)
            .bindPopup('<div style="direction:rtl; text-align:right;"><b>👤 ${loc.name}</b><br>🔋 סוללה: ${loc.battery || 85}%<br>📍 ${loc.lastSeen || 'שטח האגם'}<br>🕒 עודכן: ${loc.updated_at || ''}<br><br><a href="https://www.waze.com/ul?q=${loc.lat},${loc.lng}&navigate=yes" target="_blank" style="background:#38bdf8; color:#0f172a; padding:4px 8px; border-radius:6px; text-decoration:none; font-weight:bold; display:inline-block; margin-top:4px;">נווט בוויז 🚗</a></div>');
        `;
      }
    });
    markersJS += `L.marker([${rallyPoint.lat}, ${rallyPoint.lng}]).addTo(map).bindPopup('<b>נקודת כינוס חירום:</b><br>${rallyPoint.name}');\n`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: ${isDark ? '#000' : '#fff'}; } #map { width: 100%; height: 100%; }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${centerLat}, ${centerLng}], 11);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
          ${markersJS}
        </script>
      </body>
      </html>
    `;
  }, [familyLocations, myLocation, activeSosAlert, rallyPoint, isDark]);

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {activeSosAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '45vh', background: 'rgba(239, 68, 68, 0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', color: '#fff', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
          <span style={{ fontSize: '40px', marginBottom: '8px' }}>🚨</span>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '0 0 6px' }}>התרעת חירום SOS פעילה!</h2>
          <p style={{ fontSize: '15px', fontWeight: '800', marginBottom: '10px' }}>משתמש/ת: {activeSosAlert.name} זקוק/ה לעזרה מיידית!</p>
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '300px' }}>
            <a href={`https://maps.google.com/?q=${activeSosAlert.lat},${activeSosAlert.lng}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '10px', background: '#fff', color: '#ef4444', borderRadius: '10px', fontWeight: '900', textDecoration: 'none', textAlign: 'center' }}>נווט 🗺</a>
            <button onClick={dismissSos} style={{ flex: 1, padding: '10px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer' }}>בטל אזעקה ✓</button>
          </div>
        </div>
      )}

      <header style={{ background: isDark ? '#000' : '#f1f5f9', borderBottom: `2px solid ${borderColor}`, padding: '16px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, height: '40px', padding: '0 14px', borderRadius: '10px', fontWeight: '900' }}>•••</button>
          <div style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, fontSize: '13px', fontWeight: '900', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>🛡️ garda-mobile ({APP_VERSION})</div>
          <button onClick={() => setModalType('radar')} style={{ background: '#2563eb', color: '#fff', border: 'none', height: '40px', padding: '0 12px', borderRadius: '10px', fontWeight: '900', cursor: 'pointer' }}>📡 רדאר חי</button>
        </div>
      </header>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 2500 }} />}
      
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '300px', background: bgMain, zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', borderLeft: `1px solid ${borderColor}`, overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>תפריט ניהול</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', cursor: 'pointer' }}>{isDark ? '🌙 כהה' : '☀️ בהיר'}</button>
          <select value={currentUser} onChange={e => setCurrentUser(e.target.value)} style={{ flex: 1.2, padding: '10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold' }}>
            {TRAVELERS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={rectMenuCardStyle(isDark)}><span>📡 רדאר משפחתי חי (כולם על המפה)</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={rectMenuCardStyle(isDark)}><span>🎟️ ארנק כרטיסים ומסמכים</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trivia'); }} style={rectMenuCardStyle(isDark)}><span>🧠 טריויה לדרך</span></button>
      </aside>

      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => {
            const isActive = activeDay === i;
            return (
              <button key={i} onClick={() => setActiveDay(i)} style={{ padding: '10px 16px', borderRadius: '10px', background: isActive ? '#2563eb' : cardBg, color: isActive ? '#fff' : textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {d.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '900' }}>{day.title} 📍</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '12px' }}>
            {day.stops.map((stop, sIdx) => (
              <div key={sIdx} style={{ background: cardBg, borderRadius: '14px', padding: '16px', border: `1.5px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900' }}>{stop.name}</h4>
                  <span style={{ fontSize: '11px', fontWeight: '900', background: isDark ? '#222' : '#f1f5f9', padding: '3px 8px', borderRadius: '6px' }}>{stop.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: textSub }}>{stop.note}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={{ background: cardBg, color: textColor, padding: '8px', borderRadius: '8px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center', border: `1.5px solid ${borderColor}` }}>Apple Maps</a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '8px', borderRadius: '8px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center' }}>Waze 🚗</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {modalType && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bgMain, color: textColor, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1.5px solid ${borderColor}` }}>
              <button onClick={() => setModalType(null)} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, width: '36px', height: '36px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>{modalType === 'radar' ? '📡 רדאר משפחתי חי' : modalType}</h2>
              <div style={{ width: '36px' }} />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {modalType === 'radar' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flex: 1, minHeight: '50vh' }}>
                    <iframe title="RadarMap" srcDoc={radarMapHTML} style={{ width: '100%', height: '100%', border: 'none' }} />
                  </div>
                  <div style={{ padding: '16px', borderTop: `1.5px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '40vh', overflowY: 'auto' }}>
                    {Object.values(familyLocations).map((person, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: cardBg, padding: '10px 12px', borderRadius: '10px', border: `1.5px solid ${borderColor}` }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '900' }}>{person.name} 🔋 {person.battery || 85}%</div>
                          <div style={{ fontSize: '10px', color: textSub }}>📍 {person.lastSeen || 'שטח האגם'} | {person.updated_at}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => sendSoundAlert(person.name)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}>צליל 🔔</button>
                          <a href={`https://www.waze.com/ul?q=${person.lat},${person.lng}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '900', textDecoration: 'none' }}>נווט 🚗</a>
                        </div>
                      </div>
                    ))}
                    <button onClick={updateAndBroadcastMyLoc} style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer', marginTop: '6px' }}>📍 עדכן את המיקום שלי עכשיו לכולם</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const rectMenuCardStyle = (isDark) => ({
  background: isDark ? '#111111' : '#f8fafc',
  border: `1.5px solid ${isDark ? '#333333' : '#cbd5e1'}`,
  color: isDark ? '#ffffff' : '#334155',
  padding: '12px 16px',
  borderRadius: '12px',
  textAlign: 'right',
  fontWeight: '900',
  fontSize: '13px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  boxSizing: 'border-box'
});
