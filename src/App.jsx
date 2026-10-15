import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v9.9.18 Pro Find My ---
const APP_VERSION = 'v9.9.18';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const HOTEL_ADDRESS = "Bio Agriturismo Vojon, Ponti sul Mincio, Italy";
const TRAVELERS_LIST = ['אריק', 'סיגל', 'עמית', 'יולי', 'ליאן', 'הראל'];

export default function App() {
  const [modalType, setModalType] = useState(null);
  const [currentUser, setCurrentUser] = useState('אריק');
  const [themeMode, setThemeMode] = useState('dark');
  const [myLocation, setMyLocation] = useState(null);
  
  const [familyLocations, setFamilyLocations] = useState({
    'אריק': { name: 'אריק', lat: 32.1093, lng: 34.8555, updated_at: 'עכשיו', battery: 95, lastSeen: 'ראש העין' },
    'סיגל': { name: 'סיגל', lat: 32.1150, lng: 34.8170, updated_at: 'לפני דקה', battery: 90, lastSeen: 'השרון' },
    'עמית': { name: 'עמית', lat: 32.3250, lng: 35.0150, updated_at: 'לפני 2 דקות', battery: 88, lastSeen: 'בת חפר' },
    'יולי': { name: 'יולי', lat: 32.3220, lng: 35.0120, updated_at: 'לפני 5 דקות', battery: 92, lastSeen: 'בת חפר' },
    'ליאן': { name: 'ליאן', lat: 32.3300, lng: 35.0200, updated_at: 'עכשיו', battery: 64, lastSeen: 'בת חפר' },
    'הראל': { name: 'הראל', lat: 32.1200, lng: 34.8200, updated_at: 'עכשיו', battery: 99, lastSeen: 'ישראל' }
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const locObj = {
            name: currentUser,
            lat: latitude,
            lng: longitude,
            updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
            is_sos: false,
            battery: 92,
            lastSeen: 'בדרכים (GPS חי)'
          };
          setMyLocation({ lat: latitude, lng: longitude });
          setFamilyLocations(prev => ({ ...prev, [currentUser]: locObj }));
          try {
            await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' });
          } catch (e) {}
        },
        (err) => console.error("GPS Error:", err),
        { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [currentUser]);

  const playChimeSound = () => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      gain.gain.setValueAtTime(0.4, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  const sendSoundPing = async (targetName) => {
    playChimeSound();
    const payload = {
      name: targetName,
      sound_msg: `פינג איתור נשלח אלייך מ-${currentUser}!`,
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      is_sound_alert: true
    };
    try {
      await supabase.from('family_radar').upsert([payload], { onConflict: 'name' });
      alert(`🔔 נשלח פינג קולי אל ${targetName} בהצלחה!`);
    } catch (e) {
      alert(`🔔 נשלח פינג קולי מקומי אל ${targetName}!`);
    }
  };

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#111111' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#a3a3a3' : '#64748b';
  const borderColor = isDark ? '#333333' : '#cbd5e1';

  const radarMapHTML = useMemo(() => {
    let centerLat = myLocation?.lat || 32.1093;
    let centerLng = myLocation?.lng || 34.8555;

    let markersJS = '';
    Object.values(familyLocations).forEach(loc => {
      if (loc && loc.lat) {
        markersJS += `L.marker([${loc.lat}, ${loc.lng}]).addTo(map).bindPopup('<b>${loc.name}</b><br>🔋 סוללה: ${loc.battery || 90}%<br>📍 ${loc.lastSeen || 'מחובר'}');\n`;
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
        <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: ${isDark ? '#000' : '#fff'}; }</style>
      </head>
      <body>
        <div id="map" style="width:100%;height:100%;"></div>
        <script>
          const map = L.map('map').setView([${centerLat}, ${centerLng}], 12);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
          ${markersJS}
        </script>
      </body>
      </html>
    `;
  }, [familyLocations, myLocation, isDark]);

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      <header style={{ background: isDark ? 'rgba(0,0,0,0.9)' : 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderBottom: `1px solid ${borderColor}`, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontWeight: '900', fontSize: '16px' }}>Find My Family ({currentUser})</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setModalType('radar')} style={{ background: '#007aff', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '16px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
            🛰️ רדאר חי
          </button>
          <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ background: isDark ? '#222' : '#f1f5f9', border: `1px solid ${borderColor}`, color: textColor, width: '36px', height: '36px', borderRadius: '50%', fontWeight: 'bold', cursor: 'pointer' }}>
            {isDark ? '🌙' : '☀️'}
          </button>
        </div>
      </header>

      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        <h2 style={{ fontSize: '20px', fontWeight: '900', marginBottom: '16px' }}>ברוך הבא, {currentUser} 👑</h2>
        
        <div onClick={() => setModalType('radar')} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, borderRadius: '20px', padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '32px' }}>🛰️</span>
            <div>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: '900' }}>הצג מפת Find My חיה</h3>
              <p style={{ margin: 0, fontSize: '12px', color: textSub }}>עקוב אחר אריק, סיגל, עמית, יולי, ליאן והראל בזמן אמת</p>
            </div>
          </div>
          <span style={{ fontSize: '18px' }}>➔</span>
        </div>
      </main>

      {modalType === 'radar' && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bgMain, color: textColor, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '
