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

const HOTEL_ADDRESS = "Bio Agriturismo Vojon, Ponti sul Mincio, Italy";

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30", label: "רביעי · 30/09", title: "נחיתה והגעה למלון", icon: "✈️",
    challenge: "לצלם את התמונה המשפחתית הראשונה באיטליה.",
    challengeDesc: "הרגע נחתנו! סלפי משפחתי ראשון בשדה או עם הרכב השכור.",
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
      { time: "08:30", name: "יציאה מהמלון ל-Gardaland", dest: "Gardaland Resort, Via Derna 4, Castelnuovo del Garda", note: "הגעה מוקדמת לפני פתיחת השערים." },
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
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon', isHotelInfo: true },
  { id: 'gardaland-1', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #1 (Serial 600)', isGardalandTicket: true, code: 'BKN1P01Y901MART', ticketId: '33385742' }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('itinerary'); // 'itinerary', 'wallet', 'radar', 'trivia'
  const [activeDay, setActiveDay] = useState(0);
  const [themeMode, setThemeMode] = useState('dark'); // ברירת מחדל מצב כהה פרימיום יוקרתי
  const [folders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles] = useState(DEFAULT_DOCUMENTS);
  const [viewerItem, setViewerItem] = useState(null);

  // עיצוב צבעים דינמי מתקדם (Glassmorphism & High-End Dark/Light Mode)
  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#090d16' : '#f1f5f9';
  const cardBg = isDark ? 'rgba(30, 41, 59, 0.7)' : 'rgba(255, 255, 255, 0.85)';
  const textColor = isDark ? '#f8fafc' : '#0f172a';
  const textSub = isDark ? '#94a3b8' : '#64748b';
  const borderColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)';
  const accentGradient = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
  const cardShadow = isDark ? '0 10px 30px rgba(0, 0, 0, 0.5)' : '0 10px 30px rgba(15, 23, 42, 0.05)';

  const day = INITIAL_TRIP_DAYS[activeDay];

  return (
    <div style={{
      background: bgMain,
      minHeight: '100vh',
      color: textColor,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      direction: 'rtl',
      paddingBottom: '90px',
      boxSizing: 'border-box'
    }}>
      
      {/* Top Header Bar */}
      <header style={{
        background: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${borderColor}`,
        padding: '16px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', letterSpacing: '0.05em' }}>GARDA MOBILE 2026</span>
          <h1 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '900' }}>🇮🇹 אגם גארדה וונציה</h1>
        </div>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button 
            onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
            style={{
              background: isDark ? '#1e293b' : '#e2e8f0',
              color: textColor,
              border: 'none',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer'
            }}
          >
            {isDark ? '☀️ בהיר' : '🌙 כהה'}
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        
        {/* Quick Hotel Return Widget */}
        <div style={{
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          borderRadius: '20px',
          padding: '16px 20px',
          color: '#fff',
          marginBottom: '20px',
          boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: '800', opacity: 0.9, display: 'block' }}>ניווט חירום למלון</span>
            <strong style={{ fontSize: '15px' }}>Bio Agriturismo Vojon</strong>
          </div>
          <a 
            href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`}
            target="_blank"
            rel="noreferrer"
            style={{
              background: '#fff',
              color: '#dc2626',
              padding: '10px 16px',
              borderRadius: '12px',
              textDecoration: 'none',
              fontWeight: '800',
              fontSize: '13px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {WAZE_SVG} Waze
          </a>
        </div>

        {/* TAB 1: ITINERARY */}
        {activeTab === 'itinerary' && (
          <div>
            {/* Days Horizontal Picker */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px', marginBottom: '20px', scrollbarWidth: 'none' }}>
              {INITIAL_TRIP_DAYS.map((d, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  style={{
                    flex: '1 0 auto',
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: activeDay === i ? accentGradient : cardBg,
                    color: activeDay === i ? '#fff' : textColor,
                    border: `1px solid ${activeDay === i ? 'transparent' : borderColor}`,
                    fontSize: '13px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: cardShadow,
                    transition: 'all 0.2s ease'
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            {/* Active Day Card */}
            <div style={{
              background: cardBg,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${borderColor}`,
              borderRadius: '24px',
              padding: '24px',
              boxShadow: cardShadow,
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <span style={{ fontSize: '28px' }}>{day.icon}</span>
                <div>
                  <small style={{ color: '#3b82f6', fontWeight: '800', fontSize: '11px' }}>{day.date}</small>
                  <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900' }}>{day.title}</h2>
                </div>
              </div>

              {/* Daily Challenge Box */}
              <div style={{
                background: isDark ? 'rgba(59, 130, 246, 0.1)' : '#eff6ff',
                border: '1px solid rgba(59, 130, 246, 0.2)',
                borderRadius: '16px',
                padding: '16px',
                marginBottom: '20px'
              }}>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#3b82f6', display: 'block', marginBottom: '4px' }}>🎯 אתגר היום:</span>
                <p style={{ margin: '0 0 4px', fontWeight: '800', fontSize: '14px', color: textColor }}>{day.challenge}</p>
                <p style={{ margin: 0, fontSize: '12px', color: textSub }}>{day.challengeDesc}</p>
              </div>

              {/* Stops Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {day.stops.map((stop, sIdx) => (
                  <div key={sIdx} style={{
                    background: isDark ? 'rgba(15, 23, 42, 0.4)' : '#f8fafc',
                    borderRadius: '16px',
                    padding: '16px',
                    border: `1px solid ${borderColor}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>{stop.name}</h4>
                      <span style={{ fontSize: '11px', fontWeight: '800', color: textSub, background: isDark ? '#1e293b' : '#e2e8f0', padding: '4px 8px', borderRadius: '8px' }}>{stop.time}</span>
                    </div>
                    <p style={{ margin: '0 0 12px', fontSize: '13px', color: textSub, lineHeight: '1.4' }}>{stop.note}</p>

                    {stop.food && (
                      <div style={{
                        background: isDark ? 'rgba(245, 158, 11, 0.1)' : '#fffbeb',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                        borderRadius: '12px',
                        padding: '10px 14px',
                        marginBottom: '12px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: isDark ? '#fbbf24' : '#b45309'
                      }}>
                        🍴 המלצה: {stop.food.name}
                      </div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={{
                        background: isDark ? '#1e293b' : '#fff', color: textColor, padding: '10px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '12px', textAlign: 'center', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}>
                        {MAPS_SVG} Apple Maps
                      </a>
                      <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{
                        background: '#33ccff', color: '#000', padding: '10px', borderRadius: '10px', textDecoration: 'none', fontWeight: '800', fontSize: '12px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                      }}>
                        {WAZE_SVG} Waze
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: WALLET & DOCUMENTS */}
        {activeTab === 'wallet' && (
          <div style={{
            background: cardBg,
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '24px',
            border: `1px solid ${borderColor}`,
            boxShadow: cardShadow
          }}>
            <h2 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: '900' }}>🎟️ ארנק כרטיסים ומסמכים</h2>
            
            {/* Folders */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px' }}>
              {folders.map((f, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveFolder(f)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: activeFolder === f ? accentGradient : (isDark ? '#1e293b' : '#f1f5f9'),
                    color: activeFolder === f ? '#fff' : textColor,
                    border: 'none',
                    fontWeight: '800',
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Files List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {ticketFiles.filter(d => d.folder === activeFolder).map((doc, dIdx) => (
                <div key={dIdx} onClick={() => setViewerItem(doc)} style={{
                  background: isDark ? 'rgba(15, 23, 42, 0.4)' : '#f8fafc',
                  padding: '14px',
                  borderRadius: '14px',
                  border: `1px solid ${borderColor}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '18px' }}>📄</span>
                    <div>
                      <strong style={{ fontSize: '13px', display: 'block', color: textColor }}>{doc.title}</strong>
                      <small style={{ color: textSub, fontSize: '11px' }}>לחץ לצפייה מהירה</small>
                    </div>
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#3b82f6' }}>צפה 👁️</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Modern Bottom Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: `1px solid ${borderColor}`,
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-around',
        zIndex: 1000,
        boxSizing: 'border-box'
      }}>
        <button 
          onClick={() => setActiveTab('itinerary')}
          style={{ background: 'none', border: 'none', color: activeTab === 'itinerary' ? '#3b82f6' : textSub, fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>📅</span> מסלול
        </button>
        <button 
          onClick={() => setActiveTab('wallet')}
          style={{ background: 'none', border: 'none', color: activeTab === 'wallet' ? '#3b82f6' : textSub, fontWeight: '800', fontSize: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}
        >
          <span style={{ fontSize: '18px' }}>🎟️</span> ארנק וכרטיסים
        </button>
      </nav>

      {/* Document Viewer Modal */}
      {viewerItem && (
        <div onClick={() => setViewerItem(null)} style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)'
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            background: isDark ? '#1e293b' : '#fff', color: textColor, padding: '24px', borderRadius: '24px',
            width: '100%', maxWidth: '400px', border: `1px solid ${borderColor}`, boxShadow: cardShadow
          }}>
            <h3 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '900' }}>{viewerItem.title}</h3>
            {viewerItem.isFlightInfo && (
              <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                ✈️ <b>חברת תעופה:</b> ישראייר<br/>
                🎟️ <b>מספר כרטיס:</b> {viewerItem.ticketNo}<br/>
                👤 <b>נוסע/ת:</b> {viewerItem.passenger}<br/>
                📦 <b>הזמנה (PNR):</b> 4623652
              </p>
            )}
            {viewerItem.isHotelInfo && (
              <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                🏡 <b>מלון:</b> Bio Agriturismo Vojon<br/>
                📍 <b>כתובת:</b> Ponti sul Mincio, Italy<br/>
                📅 <b>תאריכים:</b> 30.09.2026 – 06.10.2026
              </p>
            )}
            <button onClick={() => setViewerItem(null)} style={{
              width: '100%', padding: '12px', background: accentGradient, color: '#fff',
              border: 'none', borderRadius: '14px', fontWeight: '800', marginTop: '16px', cursor: 'pointer'
            }}>
              סגור חלון
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
