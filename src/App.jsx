import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v9.9.4 ---
const APP_VERSION = 'v9.9.4';

const SUPABASE_URL = 'https://qrdgructcnphiyosakgb.supabase.co';
const SUPABASE_KEY = 'sb_publishable_Ov14SZJ4k0-4UeqQNEQ6CQ_N4da5ABY';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const WAZE_SVG = (
  <svg viewBox="0 0 512 512" width="13" height="13" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="90" fill="#38bdf8"/>
    <path d="M375.4 233.5c-3.7-31.8-29.3-56.7-61.6-59.5-35.3-3.1-66.5 19.3-73.8 53.6-1.5 7-1.4 14.3.4 21.2-22.1 4.7-38.6 24.1-38.6 47.3 0 17.5 9.7 32.7 24.1 40.5l-10.7 33.3c-2.4 7.4 2.8 15 10.6 15 3.3 0 6.4-1.4 8.6-3.8l21.9-23.7c13.7 4.9 28.7 7.5 44.1 7.5 70.7 0 128-50.5 128-112.7 0-11.8-1.8-23.3-5.2-34.4zm-146 5.3c0-11 9-20 20-20s20 9 20 20-9 20-20 20-20-9-20-20zm112 40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20-9 20-20 20zm-56 22c-29.8 0-54-15.6-54-35 0-3.3 2.7-6 6-6h96c3.3 0 6 2.7 6 6 0 19.4-24.2 35-54 35z" fill="#fff"/>
    <path d="M220.5 240c-1.2 5.5-6.2 9.5-12 9.5s-10.8-4-12-9.5-2.8-12.7-14.2-22-27.5-22-15.5 0-28 12.5-28 28s12.5 28 28 28c4.4 0 8 3.6 8 8s-3.6 8-8 8c-24.3 0-44-19.7-44-44s19.7-44 44-44c21.2 0 39.1 14.7 43.5 34.5z" fill="#18181b"/>
    <circle cx="178" cy="246" r="10" fill="#18181b"/>
    <circle cx="282" cy="216" r="10" fill="#18181b"/>
    <circle cx="338" cy="216" r="10" fill="#18181b"/>
  </svg>
);

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="13" height="13" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="90" fill="#71717a"/>
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
    stops: [
      { 
        time: "16:00", 
        name: "נחיתה בנמל התעופה وרונה", 
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
        creative: {
          name: "נהר המינצ'ו בפסקיירה",
          dest: "Peschiera del Garda, Italy",
          desc: "עצירה קצרה ומרגיעה ליד גדת הנהר לפתיחת מחברות ציור ותיעוד הנוף הראשון שלכם באיטליה."
        },
        culinary: {
          name: "Pizzeria Trattoria al Ponte (פסקיירה)",
          dest: "Peschiera del Garda, Italy",
          desc: "פיצות נפוליטניות מעולות ופסטה קלאסית בפיצריה משפחתית, ולקינוח גלידה איטלקית אמיתית (Gelateria Popolare)."
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
        note: "הגעה מוקדמת לפני פתיחת השערים כדי לתפוס את הרכבות הראשונות!",
        creative: {
          name: "סדנת סיכות האמיצים",
          dest: "Gardaland Resort",
          desc: "הכנת סיכת 'אמיצים בגארדלנד' מקרטון קשיח וטושים מהתיק המשפחתי לפני שנכנסים לרכבות."
        }
      },
      { 
        time: "13:00", 
        name: "אקשן ומתקנים בגארדלנד", 
        dest: "Gardaland Resort", 
        lat: 45.4526, 
        lng: 10.7153, 
        note: "בילוי בכל מתקני הפארק, הופעות חיות וארוחת צהריים מהירה.",
        challenge: {
          title: "שלושת המתקנים הכי אקסטרימיים!",
          desc: "צלמו תמונה צועקים על אחד המתקנים וספרו מי צעק הכי חזק."
        },
        culinary: {
          name: "Roadhouse Restaurant (פסקיירה)",
          dest: "Peschiera del Garda, Italy",
          desc: "המבורגרים עסיסיים וסטייקים מעולים על האש להתאוששות לאחר יום הבילוי האינטנסיבי בפארק."
        }
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
        note: "עלייה ברכבל המסתובב אל פסגת ההר המושלג בגובה 1,800 מטר.",
        challenge: {
          title: "תמונת פנורמה משפחתית מפסגת הרכבל!",
          desc: "תצפית מרהיבה על כל אגם גארדה מלמעלה – לא לשכוח ללבוש שכבה חמה."
        },
        creative: {
          name: "פסגת מונטה באלדו",
          dest: "Funivia Malcesine-Monte Baldo",
          desc: "ציור הנוף הנשקף מלמעלה כמפת הרפתקנים על רקע העננים והאגם."
        }
      },
      { 
        time: "13:00", 
        name: "סירמיונה וחצי האי", 
        dest: "Sirmione, Italy", 
        lat: 45.4925, 
        lng: 10.6053, 
        note: "שיטוט בסמטאות עיירת ימי הביניים, טירת סקאליג'רו וטיילת האגם הקסומה.",
        culinary: {
          name: "Trattoria La Marsa & Gelateria Iguana",
          dest: "Sirmione, Italy",
          desc: "פסטה טורטליני מדהימה הצופה לאגם, ולאחר מכן גלידריית בוטיק עם עשרות טעמים ייחודיים בסמטאות."
        }
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
        note: "יום הרפתקאות, אפקטים מיוחדים, צוללות ופעלולים הוליוודיים.",
        challenge: {
          title: "פוסטר קולנועי משפחתי!",
          desc: "צלמו סלפי משפחתי בפוזה דרמטית ליד אחת מתפאורות הסרטים בפארק."
        }
      },
      { 
        time: "19:30", 
        name: "Medieval Times – מופע האבירים והמשתה (הזמנה CVBDK20260922114620)", 
        dest: "Medieval Times, Lazise", 
        lat: 45.4745, 
        lng: 10.7291, 
        note: "טורניר אבירים סוער עם סוסים וארוחת ערב מלכותית (5 מבוגרים) ללא סכו״ם!",
        creative: {
          name: "סדנת כתרים אביריים",
          dest: "Medieval Times, Lazise",
          desc: "הכנת כתרים מקושטים מנייר כסף ודפים צבעוניים לפני תחילת המופע."
        },
        culinary: {
          name: "Medieval Times Banquet (Tikez)",
          dest: "Medieval Times, Lazise",
          desc: "ארוחת אבירים מסורתית הכוללת עוף צלוי, תפוחי אדמה חמים, מרק ומאפים – הכול נאכל בידיים! (סה״כ 195€)."
        }
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
        note: "חניה נוחה בחניון טרונקטו ומעבר בסירת ואפורטו (או מונית מים) לכיוון המרכז."
      },
      { 
        time: "09:30", 
        name: "כיכר סן מרקו וסמטאות ונציה", 
        dest: "St. Mark's Square, Venice", 
        lat: 45.4343, 
        lng: 12.3388, 
        note: "הלב הפועם של ונציה – הבזיליקה, גשר האנחות ושיטוט בגשרים הקטנים.",
        challenge: {
          title: "הגשר הנסתר בסמטה!",
          desc: "מצאו גשר אבן קטן ומיוחד מחוץ למסלול הראשי והעמוס והצטלמו עליו."
        },
        creative: {
          name: "גשר הציורים בוונציה",
          dest: "Venice, Italy",
          desc: "עצירה קצרה על גשר שקט לציור מהיר של גונדולה חולפת מתחת לתעלה."
        },
        culinary: {
          name: "Suso Gelatoteca & Pizza al Taglio",
          dest: "St. Mark's Square, Venice",
          desc: "משולשי פיצה דקים וטריים בסמטאות, ולקינוח גלידת סוסו (Suso) המפורסמת ביותר בוונציה."
        }
      }
    ]
  },
  {
    date: "2026-10-05", label: "שני · 05/10", title: "לימונה + אגם טנו + ריבה/בארונה", icon: "🍋",
    stops: [
      { 
        time: "08:30", 
        name: "לימונה סול גארדה והטיילת (Limone sul Garda)", 
        dest: "Limone sul Garda Parking, Italy", 
        lat: 45.8143, 
        lng: 10.7932, 
        note: "ירידה לצד המערבי של האגם, חנייה מסודרת וסיור מרגיע בטיילת הציורית התלויה ובסמטאות עצי הלימון.",
        challenge: {
          title: "תמונת לימון משפחתית!",
          desc: "מצאו פרי לימון אמיתי או סממן לימוני והצטלמו איתו בחיוך ענק."
        }
      },
      { 
        time: "11:30", 
        name: "אגם טנו – פיקניק ושחייה (Lake Tenno)", 
        dest: "Lago di Tenno, Italy", 
        lat: 45.9221, 
        lng: 10.8405, 
        note: "עלייה קצרה להר לאגם טנו בעל המים בצבע טורקיז מרהיב – זמן למנוחה, פיקניק וטבילה מרעננת.",
        creative: {
          name: "חופי טורקיז בטנו",
          dest: "Lago di Tenno",
          desc: "איסוף אבנים חלקות ומיוחדות משפת האגם והכנת מגדל אבנים משפחתי למזכרת."
        }
      },
      { 
        time: "14:30", 
        name: "ריבה דל גארדה או מפלי בארונה (Varone Waterfall)", 
        dest: "Cascata del Varone, Riva del Garda", 
        lat: 45.9085, 
        lng: 10.8442, 
        note: "ביקור בריבה דל גארדה הצפונית או כניסה למפלי בארונה המרהיבים הזורמים בתוך נקיק סלע פנימי.",
        culinary: {
          name: "Gelateria Flora (Riva del Garda)",
          dest: "Riva del Garda, Italy",
          desc: "גלידה איטלקית מעולה מול הנוף הפתוח של צפון האגם."
        }
      },
      { 
        time: "17:00", 
        name: "נסיעה חזרה דרך מלצ'זינה (דרך המזרח)", 
        dest: "Malcesine, Italy", 
        lat: 45.7678, 
        lng: 10.8119, 
        note: "נסיעה חזרה דרומה דרך הגדה המזרחית של האגם ועצירה קצרה במלצ'זינה לקראת השקיעה."
      }
    ]
  },
  {
    date: "2026-10-06", label: "שלישי · 06/10", title: "ורונה + חזרה לישראל", icon: "❤️",
    stops: [
      { 
        time: "09:00", 
        name: "סיור בעיר העתיקה בוורונה", 
        dest: "Piazza Cittadella, Verona", 
        lat: 45.4384, 
        lng: 10.9916, 
        note: "הארנה של وרונה, פיאצה ברה והמרפסת המפורסמת של יוליה.",
        challenge: {
          title: "שיא הטיול המשפחתי!",
          desc: "בוחרים יחד בארנה של وרונה את הרגע המצחיק והמרגש ביותר של הטיול."
        },
        culinary: {
          name: "Farcito Verona",
          dest: "Verona, Italy",
          desc: "המבורגרים איטלקיים מעולים ופיצה מיוחדת בלב وרונה לפני הנסיעה לשדה."
        }
      },
      { 
        time: "18:30", 
        name: "שדה התעופה وרונה וחזרה הביתה", 
        dest: "Verona Villafranca Airport", 
        lat: 45.3957, 
        lng: 10.8885, 
        note: "החזרת הרכב השכור, צ'ק-אין וטיסה ישירה חזרה לישראל.",
        creative: {
          name: "גלוית פרידה מאיטליה",
          dest: "Verona, Italy",
          desc: "כתיבת גלוית סיכום משפחתית וציור קטן למזכרת במחברת הטיול לפני העלייה למטוס."
        }
      }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🎬 Movieland', '🚤 ונציה'];
const DEFAULT_DOCUMENTS = [
  { id: 'flight-arik', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - אריק כהן (8180011314102)', isLink: false, url: '#', passenger: 'COHEN/ARIK MR', ticketNo: '8180011314102' },
  { id: 'flight-amit', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - עמית כהן (8180011314103)', isLink: false, url: '#', passenger: 'COHEN/AMIT MS', ticketNo: '8180011314103' },
  { id: 'flight-yuly', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - יולי כהן (8180011314104)', isLink: false, url: '#', passenger: 'COHEN/YULY MS', ticketNo: '8180011314104' },
  { id: 'flight-lian', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - ליאן כהן (8180011314105)', isLink: false, url: '#', passenger: 'COHEN/LIAN CHD', ticketNo: '8180011314105' },
  { id: 'flight-harel', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - הראל כהן (8180011314106)', isLink: false, url: '#', passenger: 'VILNAI COHEN/HAREL MR', ticketNo: '8180011314106' },
  { id: 'aig-insurance', folder: '✈️ טיסות ורכב', title: 'ביטוח נסיעות AIG (170270213826)', isInsuranceInfo: true },
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon', isHotelInfo: true, hotelPhone: '+39 0376 83522', hotelAddress: 'Via Pradello 8, 46040 Ponti sul Mincio, Mantova, Italy', bookingRef: 'BK-VOJON-2026', bookingUrl: 'https://www.booking.com' },
  { id: 'gardaland-1', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 1 (Serial 600)', ticketCode: 'BKN1P01Y901MART', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'gardaland-2', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 2 (Serial 601)', ticketCode: 'VKN1P01Y901ME4T', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'gardaland-3', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 3 (Serial 606)', ticketCode: 'TKN1P01Y901MUTT', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'gardaland-4', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 4 (Serial 607)', ticketCode: 'VKN1P01Y901MY6T', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'gardaland-5', folder: '🎢 Gardaland', title: 'כרטיס Gardaland - נוסע 5 (Serial 608)', ticketCode: 'CKN1P01Y901N2IT', trans: '602608201209', desc: 'פארק גארדה - כניסה מהירה (1 Giorno Open)' },
  { id: 'movieland-1', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 1', ticketCode: 'EA35DB7A2EA540D5', trans: '017JUNAR0070', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'movieland-2', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 2', ticketCode: '256612CCD43B8E08', trans: '017JUNAR0069', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'movieland-3', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 3', ticketCode: '934FEA2F66750267', trans: '017JUNAR0071', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'movieland-4', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 4', ticketCode: '52CACC0D5CAE334B', trans: '017JUNAR0072', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'movieland-5', folder: '🎬 Movieland', title: 'כרטיס Movieland - נוסע 5', ticketCode: '32D6C578DF258ACF', trans: '017JUNAR0073', desc: 'Movieland The Hollywood Park - כרטיס פתוח עונה 2026' },
  { id: 'medieval-times', folder: '🎬 Movieland', title: 'Medieval Times - כרטיס משפחתי (5 מבוגרים)', ticketCode: 'CVBDK20260922114620', trans: '195.00€', desc: 'מופע אבירים וארוחה (Tikez) - 03.10.2026 בשעה 19:30' }
];

const ROAD_TRIVIA_QUESTIONS = Array.from({ length: 1000 }, (_, i) => {
  const id = i + 1;
  const banks = [
    { q: `שאלה #${id}: כמה שיניים יש לאדם מבוגר בדרך כלל (כולל שיני בינה)?`, options: ["28", "32", "36", "24"], correct: 1 },
    { q: `שאלה #${id}: באיזו מדינה באירופה נמצא אגם גארדה?`, options: ["צרפת", "ספרד", "איטליה", "אוסטריה"], correct: 2 },
    { q: `שאלה #${id}: איזה בעל חיים ימי נחשב למהיר ביותר באוקיינוס?`, options: ["כריש לבן", "דג מפרש", "דולפין", "לווייתן כחול"], correct: 1 },
    { q: `שאלה #${id}: מהי בירת איטליה?`, options: ["מילאנו", "ונציה", "רומא", "פירנצה"], correct: 2 },
    { q: `שאלה #${id}: כמה רגליים יש לעכביש?`, options: ["6", "8", "10", "12"], correct: 1 }
  ];
  return banks[i % banks.length];
});

const TRAVELERS_LIST = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];

const calculateDistanceAndDuration = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return { dist: '---', duration: '---' };
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distKm = R * c;
  const mins = Math.round((distKm / 70) * 60);
  return { dist: `${distKm.toFixed(1)} ק"מ`, duration: `${mins} דק'` };
};

const generateRouteMapHTML = (myLoc, targetDayIndex, isDark) => {
  const currentLat = myLoc?.lat || 45.4384;
  const currentLng = myLoc?.lng || 10.6816;
  const targetDayObj = INITIAL_TRIP_DAYS[targetDayIndex] || INITIAL_TRIP_DAYS[0];
  const firstStop = targetDayObj.stops[0];
  const destLat = firstStop?.lat || 45.4192;
  const destLng = firstStop?.lng || 10.6908;
  const destName = firstStop?.name || targetDayObj.title;
  const { dist, duration } = calculateDistanceAndDuration(currentLat, currentLng, destLat, destLng);

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: ${isDark ? '#0b0f19' : '#ffffff'}; }
        #map { width: 100%; height: 100%; }
        .route-badge {
          position: absolute; top: 15px; left: 50%; transform: translateX(-50%); z-index: 9999;
          background: ${isDark ? 'rgba(15, 23, 42, 0.92)' : 'rgba(255, 255, 255, 0.95)'};
          color: ${isDark ? '#f8fafc' : '#0f172a'}; padding: 8px 14px; border-radius: 10px;
          font-weight: 900; font-size: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.25);
          border: 1.5px solid ${isDark ? 'rgba(255,255,255,0.2)' : '#cbd5e1'}; direction: rtl; display: flex; gap: 10px;
        }
      </style>
    </head>
    <body>
      <div class="route-badge"><span>🚗 יעד:</span> ${destName} | <span>📏 מרחק:</span> ${dist} | <span>⏱️ זמן:</span> ${duration}</div>
      <div id="map"></div>
      <script>
        const map = L.map('map').setView([${currentLat}, ${currentLng}], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
        L.marker([${currentLat}, ${currentLng}]).addTo(map).bindPopup('📍 המיקום הנוכחי שלך').openPopup();
        L.marker([${destLat}, ${destLng}]).addTo(map).bindPopup('🏁 <b>יעד:</b> ' + "${destName}");
        L.polyline([[${currentLat}, ${currentLng}], [${destLat}, ${destLng}]], {color: '#ef4444', weight: 5, opacity: 0.85, dashArray: '10, 10'}).addTo(map);
      </script>
    </body>
    </html>
  `;
};

const generateMapHTML = (familyLocs, myLoc, sosState, activeDayIndex, isDark) => {
  let centerLat = 45.4384, centerLng = 10.6816;
  if (sosState?.lat) { centerLat = sosState.lat; centerLng = sosState.lng; }
  else if (myLoc?.lat) { centerLat = myLoc.lat; centerLng = myLoc.lng; }

  const currentDayObj = INITIAL_TRIP_DAYS[activeDayIndex] || INITIAL_TRIP_DAYS[0];
  const nextStop = currentDayObj.stops[0];
  const nextLat = nextStop?.lat || 45.4192;
  const nextLng = nextStop?.lng || 10.6908;
  const nextName = nextStop?.name || 'היעד הבא';

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
      <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: ${isDark ? '#0b0f19' : '#ffffff'}; } #map { width: 100%; height: 100%; }</style>
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
        L.marker([${nextLat}, ${nextLng}]).addTo(map).bindPopup('🏁 <b>יעד הבא:</b> ${nextName}');
      </script>
    </body>
    </html>
  `;
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

  const [viewerItem, setViewerItem] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [familyLocations, setFamilyLocations] = useState({
    'אריק': { name: 'אריק', lat: 45.4384, lng: 10.6816, updated_at: 'לפני דקה', battery: 95 },
    'עמית': { name: 'עמית', lat: 45.4484, lng: 10.6916, updated_at: 'לפני 5 דקות', battery: 88 },
    'יולי': { name: 'יולי', lat: 45.4284, lng: 10.6716, updated_at: 'לפני 10 דקות', battery: 92 },
    'ליאן': { name: 'ליאן', lat: 45.4184, lng: 10.6616, updated_at: 'לפני 12 דקות', battery: 64 },
    'הראל': { name: 'הראל', lat: 45.4584, lng: 10.7016, updated_at: 'עכשיו', battery: 99 }
  });
  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [activeSoundAlert, setActiveSoundAlert] = useState(null);
  
  const [tripPhotos, setTripPhotos] = useState([]);
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');
  const [selectedPhotoViewer, setSelectedPhotoViewer] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoFileInputRef = useRef(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data } = await supabase.from('family_trip_photos').select('*').order('created_at', { ascending: false });
        if (data) setTripPhotos(data);
      } catch (e) {}
    };
    fetchPhotos();

    const photoChannel = supabase.channel('family_trip_photos_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_trip_photos' }, payload => {
        if (payload.eventType === 'INSERT') {
          setTripPhotos(prev => [payload.new, ...prev]);
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(photoChannel); };
  }, []);

  const handleUploadPhotoFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target.result;
      const newPhotoRecord = {
        uploader: currentUser,
        caption: photoCaptionInput || 'תמונה מהטיול האיטלקי 📸',
        image_url: base64Data,
        created_at: new Date().toISOString(),
        time_str: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        date_str: new Date().toLocaleDateString('he-IL')
      };

      try {
        const { data, error } = await supabase.from('family_trip_photos').insert([newPhotoRecord]).select();
        if (error) {
          setTripPhotos(prev => [newPhotoRecord, ...prev]);
        } else if (data && data[0]) {
          setTripPhotos(prev => [data[0], ...prev]);
        }
        setPhotoCaptionInput('');
        alert('✨ התמונה הועלתה בהצלחה לאלבום המרכזי וזמינה לכולם!');
      } catch (err) {
        setTripPhotos(prev => [newPhotoRecord, ...prev]);
      } finally {
        setIsUploadingPhoto(false);
        if (photoFileInputRef.current) photoFileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const [sharedTimer, setSharedTimer] = useState(null);
  const [timerRemainingSec, setTimerRemainingSec] = useState(0);
  const [isTimerPaused, setIsTimerPaused] = useState(false);

  const [savedCarParking, setSavedCarParking] = useState(() => {
    try {
      const saved = localStorage.getItem('garda-car-parking');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [carNoteInput, setCarNoteInput] = useState('');
  const [carDistanceToWalk, setCarDistanceToWalk] = useState('0 ק"מ');
  const [showParkingMapModal, setShowParkingMapModal] = useState(false);

  useEffect(() => {
    try {
      if (savedCarParking) localStorage.setItem('garda-car-parking', JSON.stringify(savedCarParking));
      else localStorage.removeItem('garda-car-parking');
    } catch (e) {}
  }, [savedCarParking]);

  useEffect(() => {
    if (!savedCarParking || !myLocation || typeof myLocation.lat !== 'number' || typeof myLocation.lng !== 'number') return;
    try {
      const { dist } = calculateDistanceAndDuration(myLocation.lat, myLocation.lng, savedCarParking.lat, savedCarParking.lng);
      setCarDistanceToWalk(dist);
    } catch (err) { setCarDistanceToWalk('---'); }
  }, [myLocation, savedCarParking]);

  const saveCarLocationNow = () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך במכשיר זה');
    navigator.geolocation.getCurrentPosition(pos => {
      const newCarLoc = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        note: carNoteInput || 'חניה ללא הערה',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('he-IL')
      };
      setSavedCarParking(newCarLoc);
      setCarNoteInput('');
      setModalType(null);
      alert('🔴 מיקום הרכב נשמר בהצלחה.');
    }, () => alert('❌ שגיאת קביעת מיקום GPS.'));
  };

  const clearCarLocation = () => {
    if (window.confirm('למחוק את מיקום הרכב השמור?')) setSavedCarParking(null);
  };

  const [aroundMeQuery, setAroundMeQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentWeather, setCurrentWeather] = useState({ temp: '24°C', condition: '☀️ שמש' });

  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [backupSuccessMsg, setBackupSuccessMsg] = useState(false);

  const handleProtectedBackup = () => {
    setAdminPassInput('');
    setBackupSuccessMsg(false);
    setBackupModalOpen(true);
  };

  const executeBackupDownload = () => {
    if (adminPassInput.trim() === "1967") {
      try {
        const backupData = JSON.stringify({ version: APP_VERSION, date: new Date().toISOString(), carParking: savedCarParking, scores: travelerScores }, null, 2);
        const blob = new Blob([backupData], { type: 'application/json;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `garda-mobile-${APP_VERSION}-backup.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setBackupSuccessMsg(true);
      } catch (err) { alert("❌ שגיאה בהורדת גיבוי."); }
    } else { alert("❌ סיסמה שגויה!"); }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            setMyLocation({ lat, lng: lon });
            const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const data = await res.json();
            if (data && data.current_weather) {
              const tempVal = Math.round(data.current_weather.temperature);
              setCurrentWeather({ temp: `${tempVal}°C`, condition: '☀️ שמש' });
            }
          } catch (e) {}
        },
        () => {},
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const [triviaIndex, setTriviaIndex] = useState(0);
  const [travelerIndex, setTravelerIndex] = useState(0);
  const [travelerScores, setTravelerScores] = useState({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
  const [isTriviaPaused, setIsTriviaPaused] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45);

  useEffect(() => {
    if (modalType !== 'trivia' || isTriviaPaused || selectedAnswer !== null) return;
    if (questionTimeLeft <= 0) {
      setQuestionTimeLeft(45);
      setTriviaIndex(prev => (prev + 1) % ROAD_TRIVIA_QUESTIONS.length);
      setTravelerIndex(prev => (prev + 1) % TRAVELERS_LIST.length);
      return;
    }
    const timer = setInterval(() => setQuestionTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [modalType, isTriviaPaused, questionTimeLeft, selectedAnswer]);

  const [folders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles] = useState(DEFAULT_DOCUMENTS);

  const audioCtxRef = useRef(null);
  const alarmIntervalRef = useRef(null);

  const playLongChime = () => {
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (!ctx) return;
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
          if (payload.new.is_sos) setActiveSosAlert(payload.new);
          if (payload.new.is_sound_alert && payload.new.name === currentUser) {
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
    };
  }, [currentUser]);

  const triggerSos = async () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך');
    if (!window.confirm('🚨 להפעיל אזעקת חירום SOS?')) return;
    navigator.geolocation.getCurrentPosition(async pos => {
      const sosData = { name: currentUser, lat: pos
