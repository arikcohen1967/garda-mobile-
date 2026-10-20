import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.8.22 (Clean & Fixed) ---
const APP_VERSION = 'v1.8.22';
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
      { time: "16:00", name: "נחיתה בשדה התעופה ורונה", dest: "Verona Villafranca Airport", lat: 45.3957, lng: 10.8885, note: "איסוף רכב וקבלת פנים ראשונה." },
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
  const
