import React, { useState, useEffect } from 'react';

const HOTEL_ADDRESS = "Bio Agriturismo Vojon, Ponti sul Mincio, Italy";

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30", label: "רביעי · 30/09", title: "נחיתה והגעה למלון", icon: "✈️",
    challenge: "לצלם את התמונה המשפחתית הראשונה באיטליה.",
    challengeDesc: "הרגע נחתנו! המשימה שלכם: סלפי משפחתי ראשון בשדה או עם הרכב השכור.",
    stops: [
      { time: "16:00", name: "נחיתה בנמל התעופה ורונה", dest: "Verona Villafranca Airport", note: "איסוף מזוודות ורכב שכור." },
      { time: "18:00", name: "נסיעה למלון וארוחת ערב", dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", note: "צ׳ק-אין והתארגנות במלון + ארוחת פיצה ראשונה." }
    ]
  },
  {
    date: "2026-10-01", label: "חמישי · 01/10", title: "Gardaland – יום פארק מלא", icon: "🎢",
    challenge: "לבחור יחד את שלושת המתקנים הכי אקסטרימיים!",
    challengeDesc: "צלמו תמונה צועקים על אחד המתקנים וספרו מי צעק הכי חזק.",
    stops: [
      { time: "08:30", name: "יציאה מהמלון ל-Gardaland", dest: "Gardaland Resort, Castelnuovo del Garda", note: "הגעה מוקדמת לפני פתיחת השערים." }
    ]
  }
];

export default function App() {
  const [activeDay, setActiveDay] = useState(0);
  const [themeMode, setThemeMode] = useState('light');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#090d16' : '#f8fafc';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.75)' : 'rgba(255, 255, 255, 0.9)';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.08)';

  const day = INITIAL_TRIP_DAYS[activeDay];

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: 'system-ui, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {/* Top Header Bar */}
      <header style={{ background: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${borderColor}`, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: isDark ? '#1e293b' : '#e2e8f0', color: textColor, border: 'none', width: '40px', height: '40px', borderRadius: '12px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            ☰
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: '#3b82f6' }}>garda-mobile</span>
            <span style={{ fontSize: '11px', fontWeight: '800', color: isOnline ? '#22c55e' : '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#f59e0b', display: 'inline-block' }}></span>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <a href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ height: '36px', padding: '0 10px', borderRadius: '10px', background: '#33ccff', color: '#000', textDecoration: 'none', fontWeight: '800', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            🚗 למלון
          </a>
          
          <button onClick={() => alert('🚨 אזעקת SOS הופעלה!')} style={{ height: '36px', padding: '0 10px', borderRadius: '10px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>
            🚨 SOS
          </button>
        </div>
      </header>

      {/* Slide-out Menu Drawer */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2500 }} />}
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '280px', background: cardBg, zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s ease', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', borderLeft: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '12px', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>תפריט מהיר</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: textColor, fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
        </div>

        <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ padding: '12px', borderRadius: '12px', background: isDark ? '#334155' : '#e2e8f0', color: textColor, border: 'none', fontWeight: '800', cursor: 'pointer', textAlign: 'center' }}>
          {isDark ? '☀️ מצב בהיר' : '🌙 מצב כהה'}
        </button>

        <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={{ padding: '12px', borderRadius: '12px', background: 'transparent', color: textColor, border: 'none', fontWeight: '700', textAlign: 'right', cursor: 'pointer' }}>
          🆘 מספרי חירום ושגרירות
        </button>
      </aside>

      {/* Main Container */}
      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* Days Horizontal Picker */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => (
            <button key={i} onClick={() => setActiveDay(i)} style={{ flex: '1 0 auto', padding: '12px 16px', borderRadius: '16px', background: activeDay === i ? '#3b82f6' : cardBg, color: activeDay === i ? '#fff' : textColor, border: `1px solid ${activeDay === i ? 'transparent' : borderColor}`, fontSize: '13px', fontWeight: '800', cursor: 'pointer' }}>
              {d.label}
            </button>
          ))}
        </div>

        {/* Active Day Card */}
        <div style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '24px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>{day.icon}</span>
            <div>
              <small style={{ color: '#3b82f6', fontWeight: '800', fontSize: '11px' }}>{day.date}</small>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{day.title}</h2>
            </div>
          </div>

          <div style={{ background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff', border: '1px solid rgba(59, 130, 246, 0.2)', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
            <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', display: 'block', marginBottom: '4px' }}>🎯 אתגר היום:</span>
            <p style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '14px' }}>{day.challenge}</p>
            <p style={{ margin: 0, fontSize: '12px', color: textSub }}>{day.challengeDesc}</p>
          </div>
        </div>

      </main>

      {modalType === 'emergency' && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, color: textColor, padding: '24px', borderRadius: '24px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ margin: '0 0 12px' }}>🆘 מספרי חירום</h3>
            <p>חירום כללי באירופה: <b>112</b></p>
            <p>שגרירות ישראל ברומא: <b>+39 06 361981</b></p>
            <button onClick={() => setModalType(null)} style={{ width: '100%', padding: '12px', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', marginTop: '16px', cursor: 'pointer' }}>סגור</button>
          </div>
        </div>
      )}

    </div>
  );
}
