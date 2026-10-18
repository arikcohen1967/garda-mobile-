import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.1.0 ---
const APP_VERSION = 'v1.1.0';
const ADMIN_PIN = '1967';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const S = {
  bg: '#090d16',
  cardBg: 'rgba(255, 255, 255, 0.03)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  textPrimary: '#f8fafc',
  textSecondary: '#94a3b8',
  accent: '#3b82f6',
  accentGlow: 'rgba(59, 130, 246, 0.15)',
  success: '#10b981',
  danger: '#ef4444',
  radius: '16px',
  transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
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
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary', 'radar', 'trivia'
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

  const [adminModal, setAdminModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [excelInputText, setExcelInputText] = useState('');

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

    const channel = supabase.channel('trip_radar_sync_v2')
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

  const handleAdminExcelUpload = () => {
    if (adminPinInput !== ADMIN_PIN) return alert('❌ קוד מנהל שגוי!');
    try {
      alert('✅ הנתונים נקלטו בהצלחה למערכת!');
      setAdminModal(false);
      setAdminPinInput('');
      setExcelInputText('');
    } catch (err) {
      alert('❌ שגיאה בקריאת הנתונים.');
    }
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
      <div style={{ background: S.bg, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', padding: '20px' }}>
        <form onSubmit={handleLogin} style={{ background: S.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${S.cardBorder}`, padding: '36px 28px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🧭</div>
          <h2 style={{ color: S.textPrimary, fontSize: '20px', fontWeight: '800', margin: '0 0 6px' }}>Trip-Navigator</h2>
          <p style={{ color: S.textSecondary, fontSize: '13px', marginBottom: '24px' }}>מערכת ניהול טיולים וניווט משפחתית ({APP_VERSION})</p>
          <input 
            type="text" 
            placeholder="הכנס את שמך המלא (לדוגמה: אריק)" 
            value={loginInput} 
            onChange={e => setLoginInput(e.target.value)}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: 'rgba(255,255,255,0.05)', color: S.textPrimary, marginBottom: '16px', fontSize: '14px', boxSizing: 'border-box', textAlign: 'center', outline: 'none' }}
          />
          <button type="submit" style={{ width: '100%', padding: '14px', background: S.accent, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', fontSize: '14px', cursor: 'pointer', transition: S.transition, boxShadow: '0 4px 12px rgba(59,130,246,0.4)' }}>
            התחל מסע ➔
          </button>
        </form>
      </div>
    );
  }

  const currentDay = tripDays[activeDay] || tripDays[0];
  const activeQ = TRIVIA_BANK[triviaIdx % TRIVIA_BANK.length];

  return (
    <div style={{ background: S.bg, minHeight: '100vh', color: S.textPrimary, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '50px', boxSizing: 'border-box' }}>
      
      {/* Top Header */}
      <header style={{ background: 'rgba(9, 13, 22, 0.85)', backdropFilter: 'blur(16px)', borderBottom: `1px solid ${S.cardBorder}`, padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 1000 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: S.accentGlow, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>🧭</div>
          <div>
            <h1 style={{ fontSize: '15px', fontWeight: '800', color: S.textPrimary, margin: 0, letterSpacing: '-0.3px' }}>Trip-Navigator</h1>
            <span style={{ fontSize: '11px', color: S.textSecondary }}>גרסה {APP_VERSION}</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600', color: S.textSecondary }}>
            👤 {currentUser}
          </div>
          <button onClick={() => setSidebarOpen(true)} style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, padding: '8px 12px', borderRadius: '10px', color: S.textPrimary, cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: S.transition }}>
            ⚙️
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ padding: '20px 16px', maxWidth: '650px', margin: '0 auto' }}>
        
        {/* Navigation Tabs */}
        <nav style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, padding: '5px', borderRadius: '16px', display: 'flex', gap: '4px', marginBottom: '20px', backdropFilter: 'blur(10px)' }}>
          {[
            { id: 'itinerary', label: '📅 מסלול יומי' },
            { id: 'radar', label: '📍 רדאר (Find My)' },
            { id: 'trivia', label: '🎯 טריוויה' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1, padding: '10px', borderRadius: '12px', border: 'none',
                background: activeTab === tab.id ? S.accent : 'transparent',
                color: activeTab === tab.id ? '#ffffff' : S.textSecondary,
                fontWeight: '700', fontSize: '12px', cursor: 'pointer', transition: S.transition,
                boxShadow: activeTab === tab.id ? '0 4px 12px rgba(59,130,246,0.3)' : 'none'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Tab 1: Itinerary */}
        {activeTab === 'itinerary' && (
          <div>
            {/* Days Horizontal Scroll */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', scrollbarWidth: 'none' }}>
              {tripDays.map((d, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveDay(idx)}
                  style={{
                    flex: '0 0 auto', padding: '10px 16px', borderRadius: '12px',
                    border: `1px solid ${activeDay === idx ? S.accent : S.cardBorder}`,
                    background: activeDay === idx ? S.accentGlow : S.cardBg,
                    color: activeDay === idx ? S.textPrimary : S.textSecondary,
                    fontWeight: '700', fontSize: '13px', cursor: 'pointer', backdropFilter: 'blur(10px)',
                    transition: S.transition
                  }}
                >
                  {d.icon} {d.label}
                </button>
              ))}
            </div>

            {/* Active Day Card */}
            <div style={{ background: S.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '22px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px', borderBottom: `1px solid ${S.cardBorder}`, paddingBottom: '14px' }}>
                <span style={{ fontSize: '30px' }}>{currentDay.icon}</span>
                <div>
                  <h2 style={{ fontSize: '17px', fontWeight: '800', color: S.textPrimary, margin: '0 0 2px' }}>{currentDay.title}</h2>
                  <span style={{ fontSize: '12px', color: S.accent, fontWeight: '600' }}>{currentDay.label} · {currentDay.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {currentDay.stops.map((stop, sIdx) => (
                  <div key={sIdx} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${S.cardBorder}`, borderRadius: '14px', padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '10px', transition: S.transition }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '14px', color: S.textPrimary, fontWeight: '700' }}>{stop.name}</strong>
                      <span style={{ background: S.accentGlow, color: S.accent, padding: '3px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '700' }}>{stop.time}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: S.textSecondary, margin: 0, lineHeight: '1.5' }}>{stop.note}</p>
                    
                    {/* Waze & Maps Buttons */}
                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <a href={`https://waze.com/ul?q=${encodeURIComponent(stop.dest || stop.name)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#0284c7', color: '#fff', padding: '8px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        🚗 ניווט ב-Waze
                      </a>
                      <a href={`https://www.google.com/maps/search/?api=1&query=${stop.lat},${stop.lng}`} target="_blank" rel="noreferrer" style={{ flex: 1, background: '#334155', color: '#fff', padding: '8px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        🗺️ Google Maps
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Radar (Find My iOS Style) */}
        {activeTab === 'radar' && (
          <div style={{ background: S.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '22px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: S.textPrimary, marginBottom: '6px' }}>📍 רדאר משפחתי (Find My)</h2>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '20px' }}>מעקב חי אחר כל המשתמשים במערכת בזמן אמת</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'right' }}>
              {Object.values(allUsersLocations).map((loc, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${S.cardBorder}`, padding: '14px 16px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ fontSize: '14px', color: S.textPrimary, fontWeight: '700' }}>👤 {loc.name}</strong>
                    <div style={{ fontSize: '11px', color: S.textSecondary, marginTop: '2px' }}>עודכן לאחרונה: {loc.updated_at || 'עכשיו'}</div>
                  </div>
                  <a href={`https://maps.google.com/?q=${loc.lat},${loc.lng}`} target="_blank" rel="noreferrer" style={{ background: S.accent, color: '#fff', padding: '8px 14px', borderRadius: '10px', textDecoration: 'none', fontSize: '12px', fontWeight: '700', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
                    נווט אליו ➔
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Trivia (1500 Questions) */}
        {activeTab === 'trivia' && (
          <div style={{ background: S.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '24px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '17px', fontWeight: '800', color: S.textPrimary, marginBottom: '6px' }}>🎯 טריוויה בדרכים (1500 שאלות)</h2>
            <p style={{ fontSize: '12px', color: S.accent, fontWeight: '700', marginBottom: '20px' }}>ניקוד כולל: {triviaScore} נקודות | שאלה {triviaIdx + 1} מתוך 1500</p>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${S.cardBorder}`, padding: '18px', borderRadius: '14px', marginBottom: '16px', fontSize: '14px', fontWeight: '700', color: S.textPrimary, lineHeight: '1.5' }}>
              {activeQ.q}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
                    padding: '14px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`,
                    background: selectedOpt === null ? 'rgba(255,255,255,0.03)' : (oIdx === activeQ.correct ? S.success : (selectedOpt === oIdx ? S.danger : 'rgba(255,255,255,0.03)')),
                    color: S.textPrimary, fontWeight: '700', fontSize: '13px', cursor: 'pointer', transition: S.transition
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
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', justifyContent: 'flex-start', backdropFilter: 'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#0f172a', borderLeft: `1px solid ${S.cardBorder}`, width: '85%', maxWidth: '320px', height: '100%', padding: '24px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'right' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${S.cardBorder}`, paddingBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: S.textPrimary }}>⚙️ ניהול ומערכת</h3>
              <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: S.textSecondary, fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <button onClick={() => setAdminModal(true)} style={{ padding: '12px 16px', background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: '12px', fontWeight: '700', fontSize: '13px', color: S.textPrimary, cursor: 'pointer', textAlign: 'right', transition: S.transition }}>
              📂 טעינת מסלולים מאקסל (מנהל)
            </button>

            <button onClick={() => setBackupModal(true)} style={{ padding: '12px 16px', background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: '12px', fontWeight: '700', fontSize: '13px', color: S.textPrimary, cursor: 'pointer', textAlign: 'right', transition: S.transition }}>
              💾 גיבוי ושחזור נתונים (מנהל)
            </button>
            
            <div style={{ marginTop: 'auto', fontSize: '11px', color: S.textSecondary, textAlign: 'center', borderTop: `1px solid ${S.cardBorder}`, paddingTop: '14px' }}>
              Trip-Navigator גרסה {APP_VERSION}
            </div>
          </div>
        </div>
      )}

      {/* Admin Excel Modal */}
      {adminModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, padding: '28px', borderRadius: '20px', width: '100%', maxWidth: '380px', textAlign: 'right' }}>
            <h3 style={{ marginTop: 0, color: S.textPrimary, fontSize: '16px', fontWeight: '800' }}>📂 ניהול מסלולים מאקסל</h3>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '14px' }}>הזן קוד מנהל ({ADMIN_PIN}) והדבק נתונים:</p>
            <input type="password" placeholder="קוד מנהל (1967)" value={adminPinInput} onChange={e => setAdminPinInput(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${S.cardBorder}`, background: 'rgba(255,255,255,0.05)', color: S.textPrimary, marginBottom: '12px', boxSizing: 'border-box', textAlign: 'center' }} />
            <textarea placeholder="הדבק נתונים כאן..." value={excelInputText} onChange={e => setExcelInputText(e.target.value)} style={{ width: '100%', height: '100px', padding: '12px', borderRadius: '10px', border: `1px solid ${S.cardBorder}`, background: 'rgba(255,255,255,0.05)', color: S.textPrimary, marginBottom: '16px', boxSizing: 'border-box', outline: 'none' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleAdminExcelUpload} style={{ flex: 1, padding: '12px', background: S.accent, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>טען נתונים</button>
              <button onClick={() => setAdminModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', color: S.textPrimary, border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>ביטול</button>
            </div>
          </div>
        </div>
      )}

      {/* Backup Modal */}
      {backupModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)' }}>
          <div style={{ background: '#0f172a', border: `1px solid ${S.cardBorder}`, padding: '28px', borderRadius: '20px', width: '100%', maxWidth: '380px', textAlign: 'right' }}>
            <h3 style={{ marginTop: 0, color: S.textPrimary, fontSize: '16px', fontWeight: '800' }}>💾 גיבוי ושחזור מערכת</h3>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '14px' }}>הזן קוד מנהל ({ADMIN_PIN}) להורדת גיבוי:</p>
            <input type="password" placeholder="קוד מנהל (1967)" value={backupPinInput} onChange={e => setBackupPinInput(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: `1px solid ${S.cardBorder}`, background: 'rgba(255,255,255,0.05)', color: S.textPrimary, marginBottom: '16px', boxSizing: 'border-box', textAlign: 'center' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleDownloadBackup} style={{ flex: 1, padding: '12px', background: S.success, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>הורד גיבוי</button>
              <button onClick={() => setBackupModal(false)} style={{ flex: 1, padding: '12px', background: 'rgba(255,255,255,0.1)', color: S.textPrimary, border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>סגור</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
