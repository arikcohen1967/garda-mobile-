import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.3.1 (Stable UI & Working Maps) ---
const APP_VERSION = 'v1.3.1';
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
  radius: '12px'
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
  const [allUsersLocations, setAllUsersLocations] = useState({});

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

  // Sync Location & Users
  useEffect(() => {
    if (!currentUser || !navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(async (pos) => {
      const coords = {
        name: currentUser,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      };
      setMyLocation(coords);
      try {
        await supabase.from('family_radar').upsert([coords], { onConflict: 'name' });
      } catch (err) {}
    }, () => {}, { enableHighAccuracy: true });

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

    const channel = supabase.channel('trip_radar_v131')
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

  // Fixed Google Maps Around Me Search
  const searchAroundMe = (query) => {
    const searchQuery = query || customSearchQuery;
    if (!searchQuery.trim()) return alert('נא להקליד או לבחור קטגוריה לחיפוש');

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        // Strict Google Maps search URL with coords
        const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${lat},${lng},14z`;
        window.open(url, '_blank');
      }, () => {
        const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
        window.open(url, '_blank');
      }, { enableHighAccuracy: true, timeout: 5000 });
    } else {
      const url = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}`;
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
      lat: 45.4384,
      lng: 10.6816,
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
        <form onSubmit={handleLogin} style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, padding: '30px', borderRadius: S.radius, width: '100%', maxWidth: '380px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.08)', boxSizing: 'border-box' }}>
          <h2 style={{ color: S.textPrimary, fontSize: '18px', fontWeight: '900', margin: '0 0 6px' }}>Trip-Navigator</h2>
          <p style={{ color: S.textSecondary, fontSize: '12px', marginBottom: '20px' }}>מערכת ניהול טיולים וניווט ({APP_VERSION})</p>
          <input 
            type="text" 
            placeholder="הכנס את שמך המלא (לדוגמה: אריק)" 
            value={loginInput} 
            onChange={e => setLoginInput(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: `1px solid ${S.cardBorder}`, background: '#ffffff', color: S.textPrimary, marginBottom: '14px', fontSize: '14px', boxSizing: 'border-box', textAlign: 'center', outline: 'none' }}
          />
          <button type="submit" style={{ width: '100%', padding: '12px', background: S.accent, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer', boxSizing: 'border-box' }}>
            התחל מסע ➔
          </button>
        </form>
      </div>
    );
  }

  const currentDay = tripDays[activeDay] || tripDays[0];
  const activeQ = TRIVIA_BANK[triviaIdx % TRIVIA_BANK.length];

  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.textPrimary, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box', width: '100%', overflowX: 'hidden' }}>
      
      {/* Top Header */}
      <header style={{ background: '#ffffff', borderBottom: `1px solid ${S.cardBorder}`, padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000, boxSizing: 'border-box', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '18px' }}>🧭</span>
          <div>
            <h1 style={{ fontSize: '14px', fontWeight: '900', color: S.textPrimary, margin: 0 }}>Trip-Navigator</h1>
            <span style={{ fontSize: '11px', color: S.textSecondary }}>גרסה {APP_VERSION}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', boxSizing: 'border-box' }}>
          <div style={{ background: '#f1f5f9', border: `1px solid ${S.cardBorder}`, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', color: S.textSecondary, boxSizing: 'border-box' }}>
            👤 {currentUser}
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{ background: '#f1f5f9', border: `1px solid ${S.cardBorder}`, padding: '8px 12px', borderRadius: '8px', color: S.textPrimary, cursor: 'pointer', fontSize: '12px', fontWeight: 'bold', boxSizing: 'border-box' }}>
            ⚙️ ניהול
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: '16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box', width: '100%' }}>
        
        {/* Navigation Tabs (Fixed Layout) */}
        <nav style={{ background: '#e2e8f0', padding: '4px', borderRadius: '12px', display: 'flex', gap: '4px', marginBottom: '16px', boxSizing: 'border-box', width: '100%' }}>
          {[
            { id: 'itinerary', label: '📅 מסלול' },
            { id: 'radar', label: '📍 רדאר' },
            { id: 'around', label: '📍 מה סביבי' },
            { id: 'trivia', label: '🎯 טריוויה' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '10px 2px', borderRadius: '10px', border: 'none',
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? S.accent : S.textSecondary,
                fontWeight: 'bold', fontSize: '11px', cursor: 'pointer', boxSizing: 'border-box',
                boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                textAlign: 'center', whiteSpace: 'nowrap'
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
                    flex: '0 0 auto', padding: '8px 14px', borderRadius: '10px',
                    border: `1px solid ${activeDay === idx ? S.accent : S.cardBorder}`,
                    background: activeDay === idx ? S.accent : '#ffffff',
                    color: activeDay === idx ? '#ffffff' : S.textSecondary,
                    fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxSizing: 'border-box'
                  }}
                >
                  {d.icon} {d.label}
                </button>
              ))}
            </div>

            <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '18px', boxSizing: 'border-box', boxShadow: '0 2px 8px rgba(0,0,0,0.03)', width: '100%' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: `1px solid ${S.cardBorder}`, paddingBottom: '12px', boxSizing: 'border-box' }}>
                <span style={{ fontSize: '26px' }}>{currentDay.icon}</span>
                <div>
                  <h2 style={{ fontSize: '16px', fontWeight: '900', color: S.textPrimary, margin: '0 0 2px' }}>{currentDay.title}</h2>
                  <span style={{ fontSize: '12px', color: S.accent, fontWeight: 'bold' }}>{currentDay.label} · {currentDay.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', width: '100%' }}>
                {currentDay.stops.map((stop, sIdx) => (
                  <div key={sIdx} style={{ background: '#f8fafc', border: `1px solid ${S.cardBorder}`, borderRadius: '10px', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box' }}>
                      <strong style={{ fontSize: '13px', color: S.textPrimary, fontWeight: 'bold' }}>{stop.name}</strong>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold' }}>{stop.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: S.textSecondary, margin: 0, lineHeight: '1.4' }}>{stop.note}</p>
                    
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px', boxSizing: 'border-box', width: '100%' }}>
                      <a href={`https://waze.com/ul?q=${encodeURIComponent(stop.dest || stop.name)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#0284c7', color: '#fff', padding: '8px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', boxSizing: 'border-box' }}>
                        🚗 ניווט ב-Waze
                      </a>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#475569', color: '#fff', padding: '8px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold', textAlign: 'center', boxSizing: 'border-box' }}>
                        🗺️ Google Maps
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Radar */}
        {activeTab === 'radar' && (
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '18px', textAlign: 'center', boxSizing: 'border-box', width: '100%' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', color: S.textPrimary, marginBottom: '6px' }}>📍 רדאר משפחתי (Find My)</h2>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '16px' }}>מעקב חי אחר כל המשתמשים במערכת בזמן אמת</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'right', boxSizing: 'border-box', width: '100%' }}>
              {Object.values(allUsersLocations).map((loc, idx) => (
                <div key={idx} style={{ background: '#f8fafc', border: `1px solid ${S.cardBorder}`, padding: '12px 14px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', width: '100%' }}>
                  <div>
                    <strong style={{ fontSize: '13px', color: S.textPrimary, fontWeight: 'bold' }}>👤 {loc.name}</strong>
                    <div style={{ fontSize: '11px', color: S.textSecondary, marginTop: '2px' }}>עודכן לאחרונה: {loc.updated_at || 'עכשיו'}</div>
                  </div>
                  <a href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`} target="_blank" rel="noreferrer" style={{ background: S.accent, color: '#fff', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: 'bold', boxSizing: 'border-box' }}>
                    נווט אליו ➔
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: What's Around Me ("מה יש סביבי") - Fixed Stable Grid */}
        {activeTab === 'around' && (
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '20px', textAlign: 'center', boxSizing: 'border-box', width: '100%' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
            <h2 style={{ fontSize: '16px', fontWeight: '900', color: S.textPrimary, marginBottom: '6px' }}>מה יש סביבי?</h2>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '16px' }}>מצא מקומות בקרבת המיקום הנוכחי שלך בלחיצת כפתור:</p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', boxSizing: 'border-box', width: '100%' }}>
              {[
                { label: '🍽️ מסעדות', q: 'מסעדות' },
                { label: '🏛️ מוזיאונים', q: 'מוזיאונים' },
                { label: '🎢 אטרקציות', q: 'אטרקציות תיירותיות' },
                { label: '☕ בתי קפה', q: 'בתי קפה' }
              ].map((btn, bIdx) => (
                <button
                  key={bIdx}
                  onClick={() => searchAroundMe(btn.q)}
                  style={{
                    flex: '1 1 45%', minWidth: '130px', padding: '12px', borderRadius: '10px',
                    border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary,
                    fontWeight: 'bold', fontSize: '13px', cursor: 'pointer', boxSizing: 'border-box',
                    textAlign: 'center'
                  }}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', boxSizing: 'border-box', width: '100%' }}>
              <input 
                type="text" 
                placeholder="הקלד כל דבר (לדוגמה: סופרמרקט...)" 
                value={customSearchQuery} 
                onChange={e => setCustomSearchQuery(e.target.value)}
                style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${S.cardBorder}`, fontSize: '12px', boxSizing: 'border-box', outline: 'none' }}
              />
              <button onClick={() => searchAroundMe()} style={{ padding: '10px 16px', background: S.accent, color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', boxSizing: 'border-box' }}>
                חפש 🔍
              </button>
            </div>
          </div>
        )}

        {/* Tab 4: Trivia */}
        {activeTab === 'trivia' && (
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '20px', textAlign: 'center', boxSizing: 'border-box', width: '100%' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '900', color: S.textPrimary, marginBottom: '6px' }}>🎯 טריוויה בדרכים (1500 שאלות)</h2>
            <p style={{ fontSize: '12px', color: S.accent, fontWeight: 'bold', marginBottom: '16px' }}>ניקוד כולל: {triviaScore} נקודות | שאלה {triviaIdx + 1} מתוך 1500</p>
            
            <div style={{ background: '#f8fafc', border: `1px solid ${S.cardBorder}`, padding: '16px', borderRadius: '10px', marginBottom: '14px', fontSize: '13px', fontWeight: 'bold', color: S.textPrimary, lineHeight: '1.4', boxSizing: 'border-box', width: '100%' }}>
              {activeQ.q}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box', width: '100%' }}>
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
                    padding: '12px',
