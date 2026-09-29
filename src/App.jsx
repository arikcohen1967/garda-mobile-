import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v9.9.22 ---
const APP_VERSION = 'v9.9.22';

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

const MAPS_SVG = (
  <svg viewBox="0 0 512 512" width="13" height="13" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="90" fill="currentColor"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#fff"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#aaa"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#000"/>
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
    date: "2026-10-06", label: "שלישי · 06/10", title: "קניית VR ורונה + חזרה לישראל", icon: "❤️",
    stops: [
      { 
        time: "08:30", 
        name: "יציאה מהמלון לרכישת משקפי VR (MediaWorld)", 
        dest: "Centro Commerciale Adigeo, Viale delle Nazioni, Verona", 
        lat: 45.4093, 
        lng: 10.9632, 
        note: "נסיעה ישירה מהמלון לחנות הענק MediaWorld בקניון Adigeo בדרום وרונה. רכישת Meta Quest 3/3S, הצגת דרכון ובקשת טופס Tax Free (Modulo Tax Free).",
        challenge: {
          title: "משימת Tax Free!",
          desc: "וידוא קבלת קבלה מקורית וטופס החזר מס (Global Blue / Planet) עבור המשקפיים."
        }
      },
      { 
        time: "11:00", 
        name: "סיור בעיר העתיקה בוורונה ואוכל", 
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
        name: "שדה התעופה وרונה – מכס וחזרה הביתה", 
        dest: "Verona Villafranca Airport", 
        lat: 45.3957, 
        lng: 10.8885, 
        note: "הגעה לשדה, מעבר בעמדת המכס (Dogana) עם קופסת המשקפיים הסגורה להחתמת טופסי ה-Tax Free, החזרת הרכב השכור, צ'ק-אין וטיסה ישירה חזרה לישראל.",
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
  { id: 'flight-amit', folder: '✈️️ טיסות ורכב', title: 'כרטיס טיסה - עמית כהן (8180011314103)', isLink: false, url: '#', passenger: 'COHEN/AMIT MS', ticketNo: '8180011314103' },
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
    { q: `שאלה #${id}: כמה רגליים יש לעכביש?`, options: ["6", "8", "10", "12"], correct: 1 },
    { q: `שאלה #${id}: באיזו יבשת נמצאת מדבר סהרה?`, options: ["אסיה", "אפריקה", "אוסטרליה", "דרום אמריקה"], correct: 1 },
    { q: `שאלה #${id}: מהו ההר הגבוה ביותר בעולם?`, options: ["מונט בלאן", "קילימנג'רו", "אוורסט", "המלצ'ינה"], correct: 2 },
    { q: `שאלה #${id}: איזה יסוד כימי מסומן באותיות Au?`, options: ["כסף", "זהב", "נחושת", "ברזל"], correct: 1 },
    { q: `שאלה #${id}: באיזו עיר באיטליה נמצאת הארנה הרומית המפורסמת שבה מופיעים אופרות?`, options: ["מילאנו", "ורונה", "נאפולי", "טורינו"], correct: 1 },
    { q: `שאלה #${id}: מי צייר את המונה ליזה?`, options: ["לאונרדו דה וינצ'י", "מיכלאנג'לו", "פבלו פיקאסו", "ואן גוך"], correct: 0 }
  ];
  return banks[i % banks.length];
});

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

  return {
    dist: `${distKm.toFixed(1)} ק"מ`,
    duration: durationStr
  };
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
    'אריק': { name: 'אריק', lat: 45.4384, lng: 10.6816, updated_at: 'עכשיו', battery: 90, lastSeen: 'טוען מ-Supabase...' },
    'עמית': { name: 'עמית', lat: 45.4484, lng: 10.6916, updated_at: 'עכשיו', battery: 85, lastSeen: 'טוען מ-Supabase...' },
    'יולי': { name: 'יולי', lat: 45.4284, lng: 10.6716, updated_at: 'עכשיו', battery: 88, lastSeen: 'טוען מ-Supabase...' },
    'ליאן': { name: 'ליאן', lat: 45.4184, lng: 10.6616, updated_at: 'עכשיו', battery: 92, lastSeen: 'טוען מ-Supabase...' },
    'הראל': { name: 'הראל', lat: 45.4584, lng: 10.7016, updated_at: 'עכשיו', battery: 95, lastSeen: 'טוען מ-Supabase...' }
  });

  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [activeSoundAlert, setActiveSoundAlert] = useState(null);
  
  const [safeZoneRadiusKm, setSafeZoneRadiusKm] = useState(15);
  const [rallyPoint, setRallyPoint] = useState({ name: 'שער הכניסה הראשי (נקודת כינוס)', lat: 45.4526, lng: 10.7153 });

  const [tripPhotos, setTripPhotos] = useState([]);
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');
  const [selectedPhotoViewer, setSelectedPhotoViewer] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoFileInputRef = useRef(null);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase.from('family_trip_photos').select('*').order('created_at', { ascending: false });
        if (error) console.error("Supabase fetch error:", error);
        if (data) setTripPhotos(data);
      } catch (e) { console.error(e); }
    };
    fetchPhotos();

    const photoChannel = supabase.channel('family_trip_photos_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_trip_photos' }, payload => {
        if (payload.eventType === 'INSERT') {
          setTripPhotos(prev => [payload.new, ...prev]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(photoChannel);
    };
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
          console.error("Supabase insert error:", error);
          setTripPhotos(prev => [newPhotoRecord, ...prev]);
        } else if (data && data[0]) {
          setTripPhotos(prev => [data[0], ...prev]);
        }
        setPhotoCaptionInput('');
        alert('✨ התמונה הועלתה בהצלחה לאלבום המרכזי וזמינה לכולם!');
      } catch (err) {
        console.error("Upload error:", err);
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
      if (savedCarParking) {
        localStorage.setItem('garda-car-parking', JSON.stringify(savedCarParking));
      } else {
        localStorage.removeItem('garda-car-parking');
      }
    } catch (e) {}
  }, [savedCarParking]);

  useEffect(() => {
    if (!savedCarParking || !myLocation || typeof myLocation.lat !== 'number' || typeof myLocation.lng !== 'number') return;
    try {
      const { dist } = calculateDistanceAndDuration(myLocation.lat, myLocation.lng, savedCarParking.lat, savedCarParking.lng);
      setCarDistanceToWalk(dist);
    } catch (err) {
      setCarDistanceToWalk('---');
    }
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
      alert('🔴 כפתור אדום ננעץ! מיקום הרכב נשמר בהצלחה.');
    }, () => {
      alert('❌ לא ניתן לקבוע את מיקום ה-GPS. בדוק את הרשאות המיקום.');
    }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
  };

  const clearCarLocation = () => {
    if (window.confirm('למחוק את מיקום הרכב השמור?')) {
      setSavedCarParking(null);
    }
  };

  const [aroundMeQuery, setAroundMeQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  
  const [currentWeather, setCurrentWeather] = useState({ temp: 'טוען...', condition: '⏳ מזג אוויר' });

  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [backupSuccessMsg, setBackupSuccessMsg] = useState(false);
  const [restorePassInput, setRestorePassInput] = useState('');
  const fileInputRef = useRef(null);

  const handleProtectedBackup = () => {
    setAdminPassInput('');
    setRestorePassInput('');
    setBackupSuccessMsg(false);
    setBackupModalOpen(true);
  };

  const executeBackupDownload = () => {
    if (adminPassInput.trim() === "1967") {
      try {
        const backupData = JSON.stringify({
          version: APP_VERSION,
          date: new Date().toISOString(),
          carParking: savedCarParking,
          scores: travelerScores
        }, null, 2);
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
      } catch (err) {
        alert("❌ שגיאה בהורדת קובץ הגיבוי.");
      }
    } else {
      alert("❌ סיסמה שגויה!");
    }
  };

  const handleFileUploadRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (restorePassInput.trim() !== "1967") {
      alert("❌ נא להזין קוד מנהל תקין (1967) לפני העלאת קובץ השחזור!");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const fileContent = event.target.result;
        const parsedData = JSON.parse(fileContent);
        if (!parsedData || !parsedData.version) {
          alert("❌ קובץ לא חוקי או שאינו קובץ גיבוי תקין של Garda-Mobile!");
          return;
        }

        if (window.confirm("⚠️ אזהרה: שחזור מערכת יעדכן את הנתונים הנוכחיים מתוך קובץ הגיבוי שנבחר. להמשיך?")) {
          if (parsedData.carParking) setSavedCarParking(parsedData.carParking);
          if (parsedData.scores) setTravelerScores(parsedData.scores);
          alert("✅ הגיבוי שוחזר בהצלחה!");
          setBackupModalOpen(false);
        }
      } catch (err) {
        alert("❌ שגיאה בקריאת קובץ הגיבוי.");
      }
    };
    reader.readAsText(file);
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
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    }
  }, []);

  const [triviaIndex, setTriviaIndex] = useState(() => {
    try { const saved = localStorage.getItem('garda-trivia-index'); return saved ? Number(saved) : 0; } catch (e) { return 0; }
  });
  const [travelerIndex, setTravelerIndex] = useState(() => {
    try { const saved = localStorage.getItem('garda-traveler-index'); return saved ? Number(saved) : 0; } catch (e) { return 0; }
  });
  const [travelerScores, setTravelerScores] = useState(() => {
    try { const saved = localStorage.getItem('garda-traveler-scores'); return saved ? JSON.parse(saved) : { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 }; } catch (e) { return { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 }; }
  });
  
  const [isTriviaPaused, setIsTriviaPaused] = useState(() => {
    try { const saved = localStorage.getItem('garda-trivia-paused'); return saved ? JSON.parse(saved) : true; } catch (e) { return true; }
  });
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45);

  useEffect(() => {
    try {
      localStorage.setItem('garda-trivia-index', triviaIndex);
      localStorage.setItem('garda-traveler-index', travelerIndex);
      localStorage.setItem('garda-traveler-scores', JSON.stringify(travelerScores));
      localStorage.setItem('garda-trivia-paused', JSON.stringify(isTriviaPaused));
    } catch (e) {}
  }, [triviaIndex, travelerIndex, travelerScores, isTriviaPaused]);

  useEffect(() => {
    if (modalType !== 'trivia' || isTriviaPaused || selectedAnswer !== null) return;

    if (questionTimeLeft <= 0) {
      setQuestionTimeLeft(45);
      setTriviaIndex(prev => (prev + 1) % ROAD_TRIVIA_QUESTIONS.length);
      setTravelerIndex(prev => (prev + 1) % TRAVELERS_LIST.length);
      return;
    }

    const timer = setInterval(() => {
      setQuestionTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [modalType, isTriviaPaused, questionTimeLeft, selectedAnswer]);

  const [folders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles] = useState(DEFAULT_DOCUMENTS);

  const chimeIntervalRef = useRef(null);

  const playLoudAlertMelody = () => {
    try {
      if (chimeIntervalRef.current) clearInterval(chimeIntervalRef.current);

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      let count = 0;
      const playSequence = () => {
        if (count >= 4) {
          clearInterval(chimeIntervalRef.current);
          chimeIntervalRef.current = null;
          return;
        }
        count++;

        const notes = [659.25, 783.99, 987.77, 1318.51, 1567.98];
        notes.forEach((freq, idx) => {
          setTimeout(() => {
            try {
              if (ctx.state === 'suspended') ctx.resume();
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'square';
              osc.frequency.setValueAtTime(freq, ctx.currentTime);

              gain.gain.setValueAtTime(0.7, ctx.currentTime);
              gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

              osc.connect(gain);
              gain.connect(ctx.destination);

              osc.start();
              osc.stop(ctx.currentTime + 0.6);
            } catch (err) {}
          }, idx * 150);
        });
      };

      playSequence();
      chimeIntervalRef.current = setInterval(playSequence, 1800);
    } catch (e) {}
  };

  const stopLoudAlertMelody = () => {
    if (chimeIntervalRef.current) {
      clearInterval(chimeIntervalRef.current);
      chimeIntervalRef.current = null;
    }
  };

  const sendSoundAlert = async (targetName) => {
    const customMsg = prompt(`שלח הודעה דחופה ובקשת יצירת קשר אל ${targetName}:`, "נא ליצור קשר מיידית עם אריק!");
    if (customMsg === null) return;

    playLoudAlertMelody();

    const soundAlertPayload = {
      name: targetName,
      sound_msg: customMsg || "נא ליצור קשר דחוף!",
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
      is_sound_alert: true
    };

    setActiveSoundAlert(soundAlertPayload);

    try {
      await supabase.from('family_radar').upsert([soundAlertPayload], { onConflict: 'name' });
      alert(`🔔 נשלחה התראה קולית והודעה אל ${targetName}!`);
    } catch (e) {
      alert(`❌ שגיאה בשליחת ההתראה לשרת.`);
    }
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const fetchRadarFromSupabase = async () => {
      try {
        const { data, error } = await supabase.from('family_radar').select('*');
        if (data && !error && data.length > 0) {
          setFamilyLocations(prev => {
            const updated = { ...prev };
            data.forEach(item => {
              if (item && item.name) {
                updated[item.name] = item;
                if (item.is_sound_alert && item.name === currentUser) {
                  setActiveSoundAlert(item);
                  playLoudAlertMelody();
                }
              }
            });
            return updated;
          });
        }
      } catch (e) {
        console.error("Supabase radar fetch error:", e);
      }
    };

    fetchRadarFromSupabase();
    const radarInterval = setInterval(fetchRadarFromSupabase, 4000);

    const fetchInitialTimer = async () => {
      try {
        const { data } = await supabase.from('family_timers').select('*').eq('id', 1).single();
        if (data) {
          setSharedTimer(data);
          setIsTimerPaused(data.is_paused);
        }
      } catch (e) {}
    };
    fetchInitialTimer();

    const channel = supabase.channel('family_trip_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setFamilyLocations(prev => ({
            ...prev,
            [payload.new.name]: payload.new
          }));
          if (payload.new.is_sos) {
            setActiveSosAlert(payload.new);
            playLoudAlertMelody();
          }
          if (payload.new.is_sound_alert && payload.new.name === currentUser) {
            setActiveSoundAlert(payload.new);
            playLoudAlertMelody();
          }
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_timers' }, payload => {
        if (payload.new) {
          setSharedTimer(payload.new);
          setIsTimerPaused(payload.new.is_paused);
        }
      })
      .subscribe();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      supabase.removeChannel(channel);
      clearInterval(radarInterval);
      stopLoudAlertMelody();
    };
  }, [currentUser]);

  useEffect(() => {
    if (!sharedTimer || !sharedTimer.end_time || isTimerPaused) return;
    const interval = setInterval(() => {
      const diff = Math.max(0, Math.floor((sharedTimer.end_time - Date.now()) / 1000));
      setTimerRemainingSec(diff);
      if (diff === 0) {
        alert(`⏱ הזמן נגמר עבור: ${sharedTimer.title}!`);
        setSharedTimer(null);
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sharedTimer, isTimerPaused]);

  const startSharedTimer = async (mins) => {
    const duration = Number(mins) || 10;
    const endTime = Date.now() + duration * 60 * 1000;
    const timerPayload = { id: 1, title: 'טיימר משפחתי מרכזי', end_time: endTime, duration: duration, is_paused: false };
    
    setSharedTimer(timerPayload);
    setTimerRemainingSec(duration * 60);
    setIsTimerPaused(false);
    setModalType(null);

    try {
      await supabase.from('family_timers').upsert([timerPayload], { onConflict: 'id' });
    } catch (e) {}
  };

  const toggleSharedTimerPause = async () => {
    const nextPaused = !isTimerPaused;
    setIsTimerPaused(nextPaused);
    if (sharedTimer) {
      const updated = { ...sharedTimer, is_paused: nextPaused };
      setSharedTimer(updated);
      try {
        await supabase.from('family_timers').upsert([updated], { onConflict: 'id' });
      } catch (e) {}
    }
  };

  const clearSharedTimer = async () => {
    setSharedTimer(null);
    setIsTimerPaused(false);
    try {
      await supabase.from('family_timers').delete().eq('id', 1);
    } catch (e) {}
  };

  const triggerSos = async () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך במכשיר זה');
    if (!window.confirm('🚨 להפעיל אזעקת חירום SOS לכל בני המשפחה?')) return;

    navigator.geolocation.getCurrentPosition(async pos => {
      const sosData = {
        name: currentUser,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        is_sos: true,
        battery: 95,
        lastSeen: `${currentUser} (מצב חירום SOS)`
      };
      setActiveSosAlert(sosData);
      playLoudAlertMelody();
      try {
        await supabase.from('family_radar').upsert([sosData], { onConflict: 'name' });
      } catch (e) {}
    }, () => {}, { enableHighAccuracy: true, timeout: 10000 });
  };

  const dismissSos = async () => {
    stopLoudAlertMelody();
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
  const accentGradient = isDark ? '#ffffff' : 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';

  const itineraryStopCardStyle = {
    background: isDark ? '#111111' : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    borderRadius: '16px',
    padding: '18px',
    border: `1px solid ${borderColor}`,
    borderRight: isDark ? '3.5px solid #ffffff' : '3.5px solid #475569',
    boxShadow: isDark ? 'none' : '0 4px 14px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxSizing: 'border-box'
  };

  const headerBg = isDark ? '#000000' : 'linear-gradient(180deg, #f1f5f9 0%, #e2e8f0 100%)';
  const day = INITIAL_TRIP_DAYS[activeDay];

  const formatClock = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const broadcastMyLocation = async (coords) => {
    const locObj = { 
      name: currentUser, 
      lat: coords.latitude, 
      lng: coords.longitude, 
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }), 
      is_sos: false, 
      battery: 95, 
      lastSeen: `${currentUser} (עדכון ידני)` 
    };

    setMyLocation({ lat: coords.latitude, lng: coords.longitude });
    
    try { 
      const { error } = await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' });
      if (error) {
        console.error("Supabase radar upsert error:", error);
        alert('❌ שגיאה בשמירת המיקום בשרת.');
        return;
      }
      alert('✅ המיקום שלך הועלה בהצלחה לשרת המרכזי!');
    } catch (e) {
      console.error(e);
      alert('❌ שגיאה בהתחברות לשרת.');
    }
  };

  const routeMapHTML = useMemo(() => {
    const currentLat = myLocation?.lat || 45.4384;
    const currentLng = myLocation?.lng || 10.6816;

    const targetDayObj = INITIAL_TRIP_DAYS[activeDay] || INITIAL_TRIP_DAYS[0];
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: ${isDark ? '#000000' : '#ffffff'}; }
          #map { width: 100%; height: 100%; }
          .route-badge {
            position: absolute;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            z-index: 9999;
            background: ${isDark ? '#111111' : 'rgba(255, 255, 255, 0.95)'};
            color: ${isDark ? '#ffffff' : '#0f172a'};
            padding: 8px 14px;
            border-radius: 10px;
            font-weight: 900;
            font-size: 12px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.25);
            backdrop-filter: blur(10px);
            border: 1.5px solid ${isDark ? '#333333' : '#cbd5e1'};
            display: flex;
            align-items: center;
            gap: 10px;
            direction: rtl;
          }
          .route-badge span { color: ${isDark ? '#ffffff' : '#2563eb'}; }
        </style>
      </head>
      <body>
        <div class="route-badge">
          <span>🚗 יעד:</span> ${destName} | <span>📏 מרחק:</span> ${dist} | <span>⏱️ זמן:</span> ${duration}
        </div>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${currentLat}, ${currentLng}], 11);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);

          L.marker([${currentLat}, ${currentLng}]).addTo(map).bindPopup('📍 המיקום הנוכחי שלך (GPS)').openPopup();
          L.marker([${destLat}, ${destLng}]).addTo(map).bindPopup('🏁 <b>יעד המסלול:</b> ' + "${destName}");

          const latlngs = [
            [${currentLat}, ${currentLng}],
            [${destLat}, ${destLng}]
          ];
          L.polyline(latlngs, {color: '${isDark ? '#ffffff' : '#ef4444'}', weight: 5, opacity: 0.85, dashArray: '10, 10'}).addTo(map);
        </script>
      </body>
      </html>
    `;
  }, [myLocation, activeDay, isDark]);

  const radarMapHTML = useMemo(() => {
    let centerLat = 45.4384, centerLng = 10.6816;
    if (activeSosAlert?.lat) { centerLat = activeSosAlert.lat; centerLng = activeSosAlert.lng; }
    else if (myLocation?.lat) { centerLat = myLocation.lat; centerLng = myLocation.lng; }

    let markersJS = '';
    Object.values(familyLocations).forEach(loc => {
      if (loc && loc.lat && loc.lng) {
        const firstLetter = loc.name ? loc.name.charAt(0) : '👤';
        markersJS += `
          const icon_${loc.name} = L.divIcon({
            className: 'custom-family-marker',
            html: '<div style="background:#ef4444; color:#fff; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:900; font-size:15px; border:2.5px solid #fff; box-shadow:0 4px 12px rgba(0,0,0,0.4);">${firstLetter}</div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16]
          });
          L.marker([${loc.lat}, ${loc.lng}], {icon: icon_${loc.name}}).addTo(map).bindPopup('<b>👤 ${loc.name}</b><br>🔋 סוללה: ${loc.battery || 85}%<br>📍 עדכון: ${loc.lastSeen || 'שטח האגם'}');\n`;
      }
    });

    markersJS += `L.marker([${rallyPoint.lat}, ${rallyPoint.lng}]).addTo(map).bindPopup('<b>🚩 נקודת כינוס חירום:</b><br>${rallyPoint.name}');\n`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: ${isDark ? '#000000' : '#ffffff'}; } #map { width: 100%; height: 100%; }</style>
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

  const handleTriviaAnswer = (optIdx) => {
    if (isTriviaPaused || selectedAnswer !== null) return;
    setSelectedAnswer(optIdx);
    const currentQ = ROAD_TRIVIA_QUESTIONS[triviaIndex % ROAD_TRIVIA_QUESTIONS.length];
    const currentTraveler = TRAVELERS_LIST[travelerIndex];
    
    if (optIdx === currentQ.correct) {
      setTravelerScores(prev => ({ ...prev, [currentTraveler]: (prev[currentTraveler] || 0) + 10 }));
    }
    
    setTimeout(() => {
      setSelectedAnswer(null);
      setQuestionTimeLeft(45);
      setTriviaIndex(prev => (prev + 1) % ROAD_TRIVIA_QUESTIONS.length);
      setTravelerIndex(prev => (prev + 1) % TRAVELERS_LIST.length);
    }, 1200);
  };

  const handleResetTrivia = () => {
    const adminPassword = window.prompt("🔒 קוד מנהל לאיפוס מלא של משחק הטרוויה (1967):");
    if (adminPassword && adminPassword.trim() === "1967") {
      setTriviaIndex(0);
      setTravelerIndex(0);
      setTravelerScores({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
      setIsTriviaPaused(true);
      setSelectedAnswer(null);
      setQuestionTimeLeft(45);
      alert("🔄 משחק הטרוויה אופס לחלוטין למשחק חדש לגמרי!");
    } else if (adminPassword !== null) {
      alert("❌ סיסמה שגויה!");
    }
  };

  const handleStartTrivia = () => setIsTriviaPaused(false);
  const handlePauseTrivia = () => setIsTriviaPaused(true);

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {activeSosAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '50vh', background: isDark ? '#111111' : 'rgba(239, 68, 68, 0.95)', borderBottom: isDark ? '2px solid #ffffff' : 'none', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', color: '#fff', borderBottomLeftRadius: '28px', borderBottomRightRadius: '28px', boxShadow: '0 15px 40px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
          <span style={{ fontSize: '44px', marginBottom: '8px' }}>🚨</span>
          <h2 style={{ fontSize: '22px', fontWeight: '900', margin: '0 0 6px' }}>התרעת חירום SOS פעילה!</h2>
          <p style={{ fontSize: '15px', fontWeight: '800', marginBottom: '10px' }}>משתמש/ת: {activeSosAlert.name} זקוק/ה לעזרה מיידית!</p>
          <div style={{ display: 'flex', gap: '10px', width: '100%', maxWidth: '320px' }}>
            <a href={`https://maps.google.com/?q=${activeSosAlert.lat},${activeSosAlert.lng}`} target="_blank" rel="noreferrer" style={{ flex: 1, padding: '12px', background: '#fff', color: '#ef4444', borderRadius: '12px', fontWeight: '900', textDecoration: 'none', fontSize: '13px', textAlign: 'center' }}>
              נווט למיקום 🗺️
            </a>
            <button onClick={dismissSos} style={{ flex: 1, padding: '12px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', fontSize: '13px' }}>
              בטל אזעקה ✓
            </button>
          </div>
        </div>
      )}

      <header style={{ background: headerBg, backdropFilter: 'blur(20px)', borderBottom: `2px solid ${borderColor}`, padding: '16px 16px 24px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '8px' }}>
          <button onClick={() => setSidebarOpen(true)} style={{ background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, height: '42px', padding: '0 16px', borderRadius: '10px', fontSize: '18px', fontWeight: '900', cursor: 'pointer' }}>•••</button>
          <button onClick={handleProtectedBackup} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, fontSize: '13px', fontWeight: '900', cursor: 'pointer', height: '42px', padding: '0 16px', borderRadius: '10px', width: '100%' }}>🛡️ garda-mobile</button>
          <div style={{ background: cardBg, border: `1.5px solid ${borderColor}`, height: '42px', padding: '0 14px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: '900', color: textColor }}>{isOnline ? 'Online' : 'Offline'}</span>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#737373', display: 'inline-block' }}></span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1.3fr 1.2fr', gap: '8px', alignItems: 'center' }}>
          <button onClick={triggerSos} style={{ height: '36px', padding: '0 10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '12px', cursor: 'pointer' }}>🚨 SOS חירום</button>
          <a href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ height: '36px', padding: '0 10px', borderRadius: '10px', background: cardBg, color: textColor, textDecoration: 'none', border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>{WAZE_SVG} למלון Vojon</a>
          <button onClick={() => alert(`מזג אוויר: ${currentWeather.condition}, ${currentWeather.temp}`)} style={{ height: '36px', padding: '0 10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '800', fontSize: '11px', cursor: 'pointer' }}>{currentWeather.temp}</button>
        </div>
      </header>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 2500 }} />}
      
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '315px', background: bgMain, zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.35s ease', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '16px', boxSizing: 'border-box', overflowY: 'auto', borderLeft: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>תפריט מהיר</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, width: '34px', height: '34px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', cursor: 'pointer' }}>{isDark ? '🌙 כהה' : '☀️ בהיר'}</button>
          <select value={currentUser} onChange={e => setCurrentUser(e.target.value)} style={{ flex: 1.2, padding: '10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold' }}>
            {TRAVELERS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={rectMenuCardStyle(isDark)}><span>רדאר משפחתי חי (Supabase)</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('timer'); }} style={rectMenuCardStyle(isDark)}><span>⏱️ טיימר משפחתי</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('parking'); }} style={rectMenuCardStyle(isDark)}><span>🚗 שמירת מיקום רכב חכם</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('around-me'); }} style={rectMenuCardStyle(isDark)}><span>📍 סביבי (Around Me)</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trip-album'); }} style={rectMenuCardStyle(isDark)}><span>📸 אלבום טיול למשפחת כהן</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trivia'); }} style={rectMenuCardStyle(isDark)}><span>🧠 טריויה חכמה לדרך</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={rectMenuCardStyle(isDark)}><span>🎟️️ ארנק כרטיסים ומסמכים</span></button>
        <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={rectMenuCardStyle(isDark)}><span>🆘 מספרי חירום ושגרירות</span></button>
      </aside>

      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => {
            const isActive = activeDay === i;
            return (
              <button key={i} onClick={() => setActiveDay(i)} style={{ padding: '10px 18px', borderRadius: '10px', background: isActive ? '#2563eb' : cardBg, color: isActive ? '#fff' : textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {d.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: '900', color: textColor, cursor: 'pointer' }} onClick={() => setModalType('route-map')}>{day.title} 📍</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '14px' }}>
            {day.stops.map((stop, sIdx) => (
              <div key={sIdx} style={itineraryStopCardStyle}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>{stop.name}</h4>
                    <span style={{ fontSize: '11px', fontWeight: '900', background: cardBg, padding: '4px 10px', borderRadius: '8px', border: `1.5px solid ${borderColor}` }}>{stop.time}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: textSub }}>{stop.note}</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={{ background: cardBg, color: textColor, padding: '10px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center', border: `1.5px solid ${borderColor}` }}>Maps</a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '10px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center' }}>Waze</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {modalType && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: bgMain, color: textColor, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: `1.5px solid ${borderColor}`, background: bgMain }}>
              <button onClick={() => setModalType(null)} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, width: '40px', height: '40px', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>{modalType === 'radar' ? '📡 רדאר משפחתי חי' : modalType}</h2>
              <div style={{ width: '40px' }} />
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              {modalType === 'route-map' && <iframe title="Route" srcDoc={routeMapHTML} style={{ width: '100%', height: '100%', border: 'none' }} />}
              {modalType === 'radar' && (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ flex: 1, minHeight: '45vh' }}>
                    <iframe title="RadarMap" srcDoc={radarMapHTML} style={{ width: '100%', height: '100%', border: 'none' }} />
                  </div>
                  <div style={{ padding: '16px', borderTop: `1.5px solid ${borderColor}`, background: bgMain, display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '45vh', overflowY: 'auto' }}>
                    {Object.values(familyLocations).map((person, pIdx) => (
                      <div key={pIdx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: cardBg, padding: '10px 12px', borderRadius: '12px', border: `1.5px solid ${borderColor}` }}>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: '900' }}>{person.name} 🔋 {person.battery || 85}%</div>
                          <div style={{ fontSize: '10px', color: textSub }}>📍 {person.lastSeen || 'שטח האגם'} | {person.updated_at}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => sendSoundAlert(person.name)} style={{ background: '#f59e0b', color: '#fff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', cursor: 'pointer' }}>🔔 צליל</button>
                          <a href={`https://maps.google.com/?q=${person.lat},${person.lng}`} target="_blank" rel="noreferrer" style={{ background: '#2563eb', color: '#fff', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '900', textDecoration: 'none' }}>נווט 🧭</a>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => navigator.geolocation.getCurrentPosition(pos => broadcastMyLocation(pos.coords), () => alert('שגיאת GPS'), { enableHighAccuracy: true })} style={{ padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '900', cursor: 'pointer', marginTop: '6px' }}>📍 עדכן מיקום יזום שלי לשרת</button>
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

const emergencyBtnStyle = (isDark) => ({
  padding: '14px',
  borderRadius: '10px',
  background: isDark ? '#111111' : '#fee2e2',
  color: isDark ? '#ffffff' : '#ef4444',
  fontWeight: '800',
  fontSize: '13px',
  textAlign: 'center',
  textDecoration: 'none',
  border: `1.5px solid ${isDark ? '#333333' : '#fecaca'}`,
  boxSizing: 'border-box'
});
