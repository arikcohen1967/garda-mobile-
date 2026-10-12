import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v9.9.21-Fix ---
const APP_VERSION = 'v9.9.21-Fix';

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
        note: "שיטוט בסמטאות עיירת ימי הביניים, טירת סקאליג'רו وטיילת האגם הקסומה.",
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
        note: "יום הרפתקאות, אפקטים מיוחדים, צוללות وפעלולים הוליוודיים.",
        challenge: {
          title: "פוסטר קולנועי משפחתי!",
          desc: "צלמו סלפי משפחתי בפוזה דרמטית ליד אחת מתפאורות הסרטים בפארק."
        }
      },
      { 
        time: "19:30", 
        name: "Medieval Times – מופע האבירים والמשתה (הזמנה CVBDK20260922114620)", 
        dest: "Medieval Times, Lazise", 
        lat: 45.4745, 
        lng: 10.7291, 
        note: "טורניר אבירים סוער עם סוסים وأרוחת ערב מלכותית (5 מבוגרים) ללא סכו״ם!",
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
        note: "חניה נוחה בחניון טרונקטו ومעבר בסירת ואפורטו (או מונית מים) לכיוון המרכז."
      },
      { 
        time: "09:30", 
        name: "כיכר סן מרקו וסמטאות ונציה", 
        dest: "St. Mark's Square, Venice", 
        lat: 45.4343, 
        lng: 12.3388, 
        note: "הלב הפועם של ונציה – הבזיליקה, גשר האנחות وשיטוט בגשרים הקטנים.",
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
          desc: "משולשי פיצה דקים وטריים בסמטאות, ולקינוח גלידת סוסו (Suso) המפורסמת ביותר בוונציה."
        }
      }
    ]
  },
  {
    date: "2026-10-05", label: "שני · 05/10", title: "לימונה + אגם טנו + ריבה/בארונה", icon: "🍋",
    stops: [
      { 
        time: "08:30", 
        name: "לימונה סול גארדה والטיילת (Limone sul Garda)", 
        dest: "Limone sul Garda Parking, Italy", 
        lat: 45.8143, 
        lng: 10.7932, 
        note: "ירידה לצד המערבי של האגם, חנייה מסודרת وסיור מרגיע בטיילת הציורית התלויה ובסמטאות עצי הלימון.",
        challenge: {
          title: "תמונת לימון משפחתית!",
          desc: "מצאו פרי לימון אמיתי או סממן לימוני והצטלמו איתו בחיוך ענק."
        }
      },
      { 
        time: "11:30", 
        name: "אגם טנו – פיקניק وشחייה (Lake Tenno)", 
        dest: "Lago di Tenno, Italy", 
        lat: 45.9221, 
        lng: 10.8405, 
        note: "עלייה קצרה להר לאגם טנו בעל המים בצבע טורקיז מרהיב – זמן למנוחה, פיקניק وטבילה מרעננת.",
        creative: {
          name: "חופי טורקיז בטנו",
          dest: "Lago di Tenno",
          desc: "איסוף אבנים חלקות ومיוחדות משפת האגם והכנת מגדל אבנים משפחתי למזכרת."
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
        note: "נסיעה חזרה דרומה דרך הגדה המזרחית של האגם وعצירה קצרה במלצ'זינה לקראת השקיעה."
      }
    ]
  },
  {
    date: "2026-10-06", label: "שלישי · 06/10", title: "קניית VR وרונה + חזרה לישראל", icon: "❤️",
    stops: [
      { 
        time: "08:30", 
        name: "רכישת משקפי VR בורונה (מדריך רכישה מלא و-Tax Free)", 
        dest: "Centro Commerciale Adigeo, Viale delle Nazioni, Verona", 
        lat: 45.4093, 
        lng: 10.9632, 
        note: "מדריך מקוצר وשימושי לרכישת משקפי Meta Quest בורונה:\n\n1. השוואת דגמים ומחירי יעד:\n- Meta Quest 3S (128GB): ~€330–€350 (נטו לאחר Tax Free: ~€290–€310) | המומלץ ביותר לילדים وנוער.\n- Meta Quest 3S (256GB): ~€470 (נטו: ~€410–€415) | למשחקים כבדים.\n- Meta Quest 3 (512GB): ~€570–€620 (נטו: ~€500–€545) | דגם הדגל עם עדשות Pancake.\n\n2. חנויות מומלצות:\n- MediaWorld (קניון Adigeo, Viale delle Nazioni): חנות ענק עם הסיכוי הגבוה ביותר למלאי זמין על המדף.\n- Unieuro (סניף מרכז Via Cappello 34 או סניף פרברי Via Preare 42).\n\n3. צ'ק-ליסט Tax Free:\n- בקשו בעת הקנייה טופס החזר מס (Modulo Tax Free) והציגו דרכון.\n- אל תפתחו את האריזה עד לאישור המכס בשדה (Dogana).\n- החתימו את הטופס בשדה התעופה (בעמדת המכס או בקיוסקים הדיגיטליים) טרם קבלת הזיכוי.",
        challenge: {
          title: "משימת Tax Free!",
          desc: "וידוא קבלת קבלה מקורית وטופס החזר מס עבור המשקפיים."
        }
      },
      { 
        time: "11:00", 
        name: "סיור בעיר העתיקה בוורונה ואוכל", 
        dest: "Piazza Cittadella, Verona", 
        lat: 45.4384, 
        lng: 10.9916, 
        note: "הארנה של وרונה, פיאצה ברה והמרפסת המפורסמת של יוליה.",
        culinary: {
          name: "Farcito Verona",
          dest: "Verona, Italy",
          desc: "המבורגרים איטלקיים מעולים وפיצה מיוחדת בלב وרונה לפני הנסיעה לשדה."
        }
      },
      { 
        time: "18:30", 
        name: "שדה התעופה وרונה – מכס וחזרה הביתה", 
        dest: "Verona Villafranca Airport", 
        lat: 45.3957, 
        lng: 10.8885, 
        note: "מעבר במכס (Dogana) עם קופסת המשקפיים להחתמת ה-Tax Free, החזרת הרכב وטיסה ישירה לישראל.",
        creative: {
          name: "גלוית פרידה מאיטליה",
          dest: "Verona, Italy",
          desc: "כתיבת גלוית סיכום משפחתית وציור קטן למזכרת במחברת הטיול לפני העלייה למטוס."
        }
      }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות وרכב', '🏡 מלון', '🎢 Gardaland', '🎬 Movieland', '🚤 ונציה'];
const DEFAULT_DOCUMENTS = [
  { id: 'flight-arik', folder: '✈️ טיסות وרכב', title: 'כרטיס טיסה - אריק כהן (8180011314102)', isLink: false, url: '#', passenger: 'COHEN/ARIK MR', ticketNo: '8180011314102' },
  { id: 'flight-amit', folder: '✈️ טיסות وרכב', title: 'כרטיס טיסה - עמית כהן (8180011314103)', isLink: false, url: '#', passenger: 'COHEN/AMIT MS', ticketNo: '8180011314103' },
  { id: 'flight-yuly', folder: '✈️ טיסות وרכב', title: 'כרטיס טיסה - יולי כהן (8180011314104)', isLink: false, url: '#', passenger: 'COHEN/YULY MS', ticketNo: '8180011314104' },
  { id: 'flight-lian', folder: '✈️ טיסות وרכב', title: 'כרטיס טיסה - ליאן כהן (8180011314105)', isLink: false, url: '#', passenger: 'COHEN/LIAN CHD', ticketNo: '8180011314105' },
  { id: 'flight-harel', folder: '✈️ טיסות وרכב', title: 'כרטיס טיסה - הראל כהן (8180011314106)', isLink: false, url: '#', passenger: 'VILNAI COHEN/HAREL MR', ticketNo: '8180011314106' },
  { id: 'aig-insurance', folder: '✈️ טיסות وרכב', title: 'ביטוח נסיעות AIG (170270213826)', isInsuranceInfo: true },
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
  { id: 'medieval-times', folder: '🎬 Movieland', title: 'Medieval Times - כרטיס משפחתי (5 מבוגרים)', ticketCode: 'CVBDK20260922114620', trans: '195.00€', desc: 'מופע אבירים وأרוחה (Tikez) - 03.10.2026 בשעה 19:30' }
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
    'אריק': { name: 'אריק', lat: 45.4384, lng: 10.6816, updated_at: 'לפני דקה', battery: 88, lastSeen: 'מלון Vojon' },
    'עמית': { name: 'עמית', lat: 45.4484, lng: 10.6916, updated_at: 'לפני 5 דקות', battery: 74, lastSeen: 'פסקיירה דל גארדה' },
    'יולי': { name: 'יולי', lat: 45.4284, lng: 10.6716, updated_at: 'לפני 10 דקות', battery: 92, lastSeen: 'מלון Vojon' },
    'ליאן': { name: 'ליאן', lat: 45.4184, lng: 10.6616, updated_at: 'לפני 12 דקות', battery: 65, lastSeen: 'מלון Vojon' },
    'הראל': { name: 'הראל', lat: 45.4584, lng: 10.7016, updated_at: 'Now', battery: 99, lastSeen: 'גארדלנד' }
  });
  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [rallyPoint] = useState({ name: 'שער הכניסה הראשי (נקודת כינוס)', lat: 45.4526, lng: 10.7153 });

  const [tripPhotos, setTripPhotos] = useState([]);
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoFileInputRef = useRef(null);

  const broadcastMyLocation = async (coords) => {
    if (!coords || !coords.latitude || !coords.longitude) return;
    const locObj = { 
      name: currentUser, 
      lat: coords.latitude, 
      lng: coords.longitude, 
      updated_at: 'Now', 
      is_sos: false, 
      battery: 95, 
      lastSeen: 'שטח הטיול' 
    };
    setMyLocation({ lat: coords.latitude, lng: coords.longitude });
    setFamilyLocations(prev => ({ ...prev, [currentUser]: locObj }));
    try { 
      await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' }); 
    } catch (e) {}
  };

  const fetchAllFamilyLocations = async () => {
    try {
      const { data, error } = await supabase.from('family_radar').select('*');
      if (!error && data) {
        const locationsMap = {};
        data.forEach(item => {
          if (item && item.name) {
            locationsMap[item.name] = item;
            if (item.is_sos && (!activeSosAlert || activeSosAlert.name !== item.name)) {
              setActiveSosAlert(item);
            }
          }
        });
        if (Object.keys(locationsMap).length > 0) {
          setFamilyLocations(prev => ({ ...prev, ...locationsMap }));
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const { data, error } = await supabase.from('family_trip_photos').select('*').order('created_at', { ascending: false });
        if (!error && data) setTripPhotos(data);
      } catch (e) {}
    };
    fetchPhotos();
    fetchAllFamilyLocations();

    let watchId = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => { broadcastMyLocation(pos.coords); },
        () => {},
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }

    const pollingInterval = setInterval(() => { fetchAllFamilyLocations(); }, 10000);

    const photoChannel = supabase.channel('family_trip_photos_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_trip_photos' }, payload => {
        if (payload.eventType === 'INSERT') {
          setTripPhotos(prev => [payload.new, ...prev]);
        }
      })
      .subscribe();

    const radarChannel = supabase.channel('family_radar_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setFamilyLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.is_sos) {
            setActiveSosAlert(payload.new);
          }
        }
      })
      .subscribe();

    return () => {
      if (watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
      clearInterval(pollingInterval);
      supabase.removeChannel(photoChannel);
      supabase.removeChannel(radarChannel);
    };
  }, [currentUser]);

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
        time_str: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      };

      try {
        const { data, error } = await supabase.from('family_trip_photos').insert([newPhotoRecord]).select();
        if (!error && data && data[0]) {
          setTripPhotos(prev => [data[0], ...prev]);
        } else {
          setTripPhotos(prev => [newPhotoRecord, ...prev]);
        }
        setPhotoCaptionInput('');
        alert('✨ התמונה הועלתה בהצלחה לאלבום המרכזי!');
      } catch (err) {
        setTripPhotos(prev => [newPhotoRecord, ...prev]);
      } finally {
        setIsUploadingPhoto(false);
        if (photoFileInputRef.current) photoFileInputRef.current.value = '';
      }
    };
    reader.readAsDataURL(file);
  };

  const [savedCarParking, setSavedCarParking] = useState(() => {
    try {
      const saved = localStorage.getItem('garda-car-parking');
      return saved ? JSON.parse(saved) : null;
    } catch (e) { return null; }
  });
  const [carNoteInput, setCarNoteInput] = useState('');
  const [carDistanceToWalk, setCarDistanceToWalk] = useState('0 ק"מ');

  useEffect(() => {
    try {
      if (savedCarParking) localStorage.setItem('garda-car-parking', JSON.stringify(savedCarParking));
      else localStorage.removeItem('garda-car-parking');
    } catch (e) {}
  }, [savedCarParking]);

  useEffect(() => {
    if (!savedCarParking || !myLocation) return;
    try {
      const { dist } = calculateDistanceAndDuration(myLocation.lat, myLocation.lng, savedCarParking.lat, savedCarParking.lng);
      setCarDistanceToWalk(dist);
    } catch (err) {}
  }, [myLocation, savedCarParking]);

  const saveCarLocationNow = () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך במכשיר זה');
    navigator.geolocation.getCurrentPosition(pos => {
      setSavedCarParking({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        note: carNoteInput || 'חניה ללא הערה',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('he-IL')
      });
      setCarNoteInput('');
      setModalType(null);
      alert('🔴 כפתור אדום ננעץ! מיקום הרכב נשמר בהצלחה.');
    }, () => {
      alert('❌ לא ניתן לקבוע את מיקום ה-GPS.');
    }, { enableHighAccuracy: true, timeout: 10000 });
  };

  const clearCarLocation = () => {
    if (window.confirm('למחוק את מיקום הרכב השמור?')) setSavedCarParking(null);
  };

  const [isOnline] = useState(navigator.onLine);
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
        const backupData = JSON.stringify({ version: APP_VERSION, carParking: savedCarParking, scores: travelerScores }, null, 2);
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
      } catch (err) { alert("❌ שגיאה בהורדת הגיבוי."); }
    } else { alert("❌ סיסמה שגויה!"); }
  };

  const handleFileUploadRestore = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (restorePassInput.trim() !== "1967") {
      alert("❌ נא להזין קוד מנהל תקין (1967)!");
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsedData = JSON.parse(event.target.result);
        if (window.confirm("⚠️ לשחזר נתונים מהגיבוי?")) {
          if (parsedData.carParking) setSavedCarParking(parsedData.carParking);
          if (parsedData.scores) setTravelerScores(parsedData.scores);
          alert("✅ שוחזר בהצלחה!");
          setBackupModalOpen(false);
        }
      } catch (err) { alert("❌ שגיאה בקריאת הקובץ."); }
    };
    reader.readAsText(file);
  };

  const [triviaIndex, setTriviaIndex] = useState(0);
  const [travelerScores, setTravelerScores] = useState({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
  const [isTriviaPaused] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const [folders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות وרכב');
  const [ticketFiles] = useState(DEFAULT_DOCUMENTS);

  const triggerSos = async () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך');
    if (!window.confirm('🚨 להפעיל התרעת חירום SOS?')) return;
    navigator.geolocation.getCurrentPosition(async pos => {
      const sosData = { name: currentUser, lat: pos.coords.latitude, lng: pos.coords.longitude, is_sos: true };
      setActiveSosAlert(sosData);
      try { await supabase.from('family_radar').upsert([sosData], { onConflict: 'name' }); } catch (e) {}
    });
  };

  const dismissSos = async () => {
    setActiveSosAlert(null);
    try { await supabase.from('family_radar').upsert([{ name: currentUser, is_sos: false }], { onConflict: 'name' }); } catch (e) {}
  };

  const isDark = themeMode === 'dark';
  const bgMain = isDark ? '#000000' : '#ffffff';
  const cardBg = isDark ? '#111111' : '#ffffff';
  const textColor = isDark ? '#ffffff' : '#0f172a';
  const textSub = isDark ? '#a3a3a3' : '#64748b';
  const borderColor = isDark ? '#333333' : '#cbd5e1';

  const day = INITIAL_TRIP_DAYS[activeDay];

  const routeMapHTML = useMemo(() => {
    const currentLat = myLocation?.lat || 45.4384;
    const currentLng = myLocation?.lng || 10.6816;
    const firstStop = day.stops[0];
    const destLat = firstStop?.lat || 45.4192;
    const destLng = firstStop?.lng || 10.6908;
    const { dist, duration } = calculateDistanceAndDuration(currentLat, currentLng, destLat, destLng);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body { margin: 0; background: #111; }</style>
      </head>
      <body>
        <div id="map" style="width:100vw; height:100vh;"></div>
        <script>
          const map = L.map('map').setView([${currentLat}, ${currentLng}], 11);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
          L.marker([${currentLat}, ${currentLng}]).addTo(map).bindPopup('📍 המיקום שלך');
          L.marker([${destLat}, ${destLng}]).addTo(map).bindPopup('🏁 ${firstStop?.name || ''}');
        </script>
      </body>
      </html>
    `;
  }, [myLocation, activeDay]);

  const findMyMapHTML = useMemo(() => {
    let centerLat = 45.4384, centerLng = 10.6816;
    if (activeSosAlert?.lat) { centerLat = activeSosAlert.lat; centerLng = activeSosAlert.lng; }
    else if (myLocation?.lat) { centerLat = myLocation.lat; centerLng = myLocation.lng; }

    let markersJS = '';
    Object.values(familyLocations).forEach(loc => {
      if (loc && loc.lat && loc.lng) {
        markersJS += `L.marker([${loc.lat}, ${loc.lng}]).addTo(map).bindPopup('<b>${loc.name}</b><br>🔋 סוללה: ${loc.battery || 85}%<br>📍 ${loc.lastSeen || ''}');\n`;
      }
    });
    markersJS += `L.marker([${rallyPoint.lat}, ${rallyPoint.lng}]).addTo(map).bindPopup('<b>נקודת כינוס:</b><br>${rallyPoint.name}');\n`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; } #map { width: 100%; height: 100%; filter: brightness(0.9) contrast(1.1); }</style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map', { zoomControl: false }).setView([${centerLat}, ${centerLng}], 11);
          L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }).addTo(map);
          ${markersJS}
        </script>
      </body>
      </html>
    `;
  }, [familyLocations, myLocation, activeSosAlert, rallyPoint]);

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '40px', boxSizing: 'border-box' }}>
      
      {activeSosAlert && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '40vh', background: 'rgba(239, 68, 68, 0.95)', zIndex: 9999, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', textAlign: 'center', color: '#fff', borderBottomLeftRadius: '24px', borderBottomRightRadius: '24px' }}>
          <span style={{ fontSize: '36px' }}>🚨</span>
          <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '6px 0' }}>התרעת חירום SOS פעילה!</h2>
          <p style={{ fontSize: '14px', fontWeight: '800', marginBottom: '12px' }}>משתמש/ת: {activeSosAlert.name} זקוק/ה לעזרה!</p>
          <button onClick={dismissSos} style={{ padding: '10px 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer' }}>בטל אזעקה ✓</button>
        </div>
      )}

      {backupModalOpen && (
        <div onClick={() => setBackupModalOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, color: textColor, padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '380px', border: `2px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900' }}>ניהול גיבוי ושחזור ({APP_VERSION})</h3>
            {backupSuccessMsg ? (
              <p style={{ fontWeight: 'bold', color: '#10b981' }}>💾 הגיבוי הורד בהצלחה!</p>
            ) : (
              <>
                <input type="password" placeholder="קוד מנהל (1967)" value={adminPassInput} onChange={e => setAdminPassInput(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: isDark ? '#000' : '#fff', color: textColor, textAlign: 'center', fontWeight: 'bold' }} />
                <button onClick={executeBackupDownload} style={{ padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>הורד גיבוי 💾</button>
                <hr style={{ border: `0.5px solid ${borderColor}`, width: '100%' }} />
                <input type="password" placeholder="קוד מנהל לשחזור (1967)" value={restorePassInput} onChange={e => setRestorePassInput(e.target.value)} style={{ padding: '10px', borderRadius: '8px', border: `1px solid ${borderColor}`, background: isDark ? '#000' : '#fff', color: textColor, textAlign: 'center', fontWeight: 'bold' }} />
                <input type="file" ref={fileInputRef} onChange={handleFileUploadRestore} accept=".json,.txt" style={{ display: 'none' }} id="restore-input" />
                <button onClick={() => { if (restorePassInput !== "1967") { alert("קוד שגוי"); return; } fileInputRef.current.click(); }} style={{ padding: '12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>שחזר מקובץ 📂</button>
              </>
            )}
          </div>
        </div>
      )}

      {/* כותרת עליונה */}
      <header style={{ background: isDark ? '#000' : '#f1f5f9', borderBottom: `2px solid ${borderColor}`, padding: '14px 16px', position: 'sticky', top: 0, zIndex: 1000, display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: '8px' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, height: '40px', padding: '0 14px', borderRadius: '10px', fontSize: '16px', fontWeight: '900', cursor: 'pointer' }}>•••</button>
        <button onClick={handleProtectedBackup} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, fontSize: '13px', fontWeight: '900', height: '40px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
          <span>🛡️</span> garda-mobile
        </button>
        <div style={{ background: cardBg, border: `1.5px solid ${borderColor}`, height: '40px', padding: '0 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: '900' }}>{isOnline ? 'Online' : 'Offline'}</span>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#737373', display: 'inline-block' }}></span>
        </div>
      </header>

      {/* תפריט צד */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 2500, backdropFilter: 'blur(5px)' }} />}
      
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '300px', background: isDark ? '#000' : '#fff', zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', borderLeft: `1px solid ${borderColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '900', color: textColor }}>תפריט מהיר</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, width: '32px', height: '32px', borderRadius: '8px', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setThemeMode(isDark ? 'light' : 'dark')} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: '900', fontSize: '13px', cursor: 'pointer' }}>
            {isDark ? '🌙 כהה' : '☀ בהיר'}
          </button>
          <select value={currentUser} onChange={e => setCurrentUser(e.target.value)} style={{ flex: 1.2, padding: '10px', borderRadius: '10px', background: cardBg, color: textColor, border: `1.5px solid ${borderColor}`, fontWeight: 'bold', fontSize: '13px' }}>
            {TRAVELERS_LIST.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <button onClick={() => { setSidebarOpen(false); setModalType(null); }} style={rectMenuCardStyle(isDark)}>מסלול ימי הטיול</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={rectMenuCardStyle(isDark)}>רדאר משפחתי חי (Find My)</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('timer'); }} style={rectMenuCardStyle(isDark)}>טיימר משפחתי</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('parking'); }} style={rectMenuCardStyle(isDark)}>שמירת מיקום רכב חכם</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('around-me'); }} style={rectMenuCardStyle(isDark)}>סביבי (Around Me)</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trip-album'); }} style={rectMenuCardStyle(isDark)}>📸 אלבום טיול משפחתי</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trivia'); }} style={rectMenuCardStyle(isDark)}>טריויה לדרך</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={rectMenuCardStyle(isDark)}>ארנק כרטיסים ומסמכים</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('emergency'); }} style={rectMenuCardStyle(isDark)}>מספרי חירום ושגרירות</button>
      </aside>

      {/* תוכן ראשי */}
      <main style={{ padding: '20px 16px', maxWidth: '600px', margin: '0 auto', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '10px' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => {
            const isActive = activeDay === i;
            return (
              <button key={i} onClick={() => setActiveDay(i)} style={{ padding: '10px 16px', borderRadius: '10px', background: isActive ? '#2563eb' : cardBg, color: isActive ? '#fff' : textColor, border: `1.5px solid ${borderColor}`, fontSize: '13px', fontWeight: '900', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {d.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <span style={{ fontSize: '28px' }}>{day.icon}</span>
            <div>
              <small style={{ color: textSub, fontWeight: '800', fontSize: '11px' }}>{day.date}</small>
              <button onClick={() => setModalType('route-map')} style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'right', cursor: 'pointer' }}>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '900', color: textColor }}>{day.title} 📍</h2>
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {day.stops.map((stop, sIdx) => (
              <div key={sIdx} style={{ background: cardBg, borderRadius: '16px', padding: '16px', border: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '900', color: textColor }}>{stop.name}</h4>
                  <span style={{ fontSize: '11px', fontWeight: '900', background: isDark ? '#222' : '#eff6ff', padding: '4px 8px', borderRadius: '6px' }}>{stop.time}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: textSub, lineHeight: '1.4' }}>{stop.note}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={{ background: cardBg, color: textColor, padding: '8px', borderRadius: '8px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center', border: `1px solid ${borderColor}` }}>{MAPS_SVG} Maps</a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={{ background: '#38bdf8', color: '#0f172a', padding: '8px', borderRadius: '8px', textDecoration: 'none', fontWeight: '900', fontSize: '12px', textAlign: 'center' }}>{WAZE_SVG} Waze</a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* כפתור מהיר לפתיחת הרדאר בעיצוב Apple Find My */}
        <div style={{ marginTop: '24px' }}>
          <button onClick={() => setModalType('radar')} style={{ width: '100%', padding: '16px', background: '#0a84ff', color: '#fff', border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(10, 132, 255, 0.4)' }}>
            <span>📡</span> פתח רדאר משפחתי (Apple Find My Style)
          </button>
        </div>
      </main>

      {/* חלונות מודל מלאים */}
      {modalType && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: modalType === 'radar' ? '#000' : 'rgba(0,0,0,0.7)', zIndex: 3000, display: 'flex', flexDirection: 'column' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: modalType === 'radar' ? '#000' : bgMain, color: textColor, width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflow: 'hidden' }}>
            
            {modalType !== 'radar' && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', background: cardBg, borderBottom: `1.5px solid ${borderColor}` }}>
                <button onClick={() => setModalType(null)} style={{ background: cardBg, border: `1.5px solid ${borderColor}`, color: textColor, width: '36px', height: '36px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
                <h2 style={{ margin: 0, fontSize: '16px', fontWeight: '900' }}>{modalType === 'route-map' && '🗺️ מפת ניווט'}{modalType === 'around-me' && '📍 סביבי'}{modalType === 'timer' && '⏱️ טיימר משפחתי'}{modalType === 'parking' && '🚗 איתור רכב'}{modalType === 'trivia' && '🧠 טריויה'}{modalType === 'trip-album' && '📸 אלבום תמונות'}{modalType === 'tickets' && '🎟️ ארנק כרטיסים'}{modalType === 'emergency' && '🆘 מספרי חירום'}</h2>
                <div style={{ width: '36px' }} />
              </div>
            )}

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
              
              {/* === רדאר משפחתי בעיצוב Apple Find My המדויק === */}
              {modalType === 'radar' && (
                <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 5000, display: 'flex', flexDirection: 'column', overflow: 'hidden', direction: 'rtl' }}>
                  
                  <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
                    <iframe title="Find My Map" srcDoc={findMyMapHTML} style={{ width: '100%', height: '100%', border: 'none' }} />
                  </div>

                  <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
                    <button onClick={() => setModalType(null)} style={{ background: 'rgba(44,44,46,0.85)', backdropFilter: 'blur(10px)', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                  </div>

                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, background: 'rgba(28, 28, 30, 0.92)', backdropFilter: 'blur(25px)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', borderTop: '0.5px solid #38383a', padding: '12px 16px 30px', maxHeight: '55vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 30px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
                    
                    <div style={{ width: '36px', height: '5px', background: '#48484a', borderRadius: '3px', alignSelf: 'center', marginBottom: '12px' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
                      <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#fff' }}>People</h2>
                      <button onClick={() => navigator.geolocation.getCurrentPosition(pos => broadcastMyLocation(pos.coords), () => {}, { enableHighAccuracy: true })} style={{ background: '#3a3a3c', color: '#0a84ff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📍</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
                      {Object.values(familyLocations).map((person, pIdx) => {
                        let distStr = '---';
                        if (myLocation && person.lat && person.lng) {
                          const { dist } = calculateDistanceAndDuration(myLocation.lat, myLocation.lng, person.lat, person.lng);
                          distStr = dist;
                        }
                        return (
                          <div key={pIdx} onClick={() => window.open(`https://maps.google.com/?q=${person.lat},${person.lng}`, '_blank')} style={{ background: 'rgba(44,44,46,0.6)', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '0.5px solid rgba(255,255,255,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', overflow: 'hidden', border: '1px solid #545456' }}>
                                <span>👤</span>
                                <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', background: '#34c759', border: '1.5px solid #1c1c1e' }} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff' }}>{person.name}</div>
                                <div style={{ fontSize: '13px', color: '#8e8e93' }}>{person.lastSeen || 'שטח הטיול'}</div>
                                <div style={{ fontSize: '11px', color: '#8e8e93' }}>• {person.updated_at || 'Now'}</div>
                              </div>
                            </div>
                            <div style={{ fontSize: '13px', color: '#8e8e93', fontWeight: '500' }}>{distStr}</div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: '0.5px solid #38383a' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#0a84ff', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>👥</span><span style={{ fontSize: '10px', fontWeight: '600' }}>People</span></div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8e8e93', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>💻</span><span style={{ fontSize: '10px' }}>Devices</span></div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8e8e93', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>🎒</span><span style={{ fontSize: '10px' }}>Items</span></div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', color: '#8e8e93', cursor: 'pointer' }}><span style={{ fontSize: '18px' }}>📍</span><span style={{ fontSize: '10px' }}>Me</span></div>
                    </div>

                  </div>
                </div>
              )}

              {modalType === 'route-map' && <iframe title="Route" srcDoc={routeMapHTML} style={{ width: '100%', height: '100%', border: 'none' }} />}

              {modalType === 'trip-album' && (
                <div style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <input type="text" placeholder="תיאור לתמונה..." value={photoCaptionInput} onChange={e => setPhotoCaptionInput(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, fontWeight: 'bold' }} />
                  <input type="file" accept="image/*" ref={photoFileInputRef} id="photo-input" style={{ display: 'none' }} onChange={handleUploadPhotoFile} />
                  <button onClick={() => document.getElementById('photo-input').click()} disabled={isUploadingPhoto} style={{ padding: '14px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer' }}>{isUploadingPhoto ? 'מעלה...' : 'בחר תמונה והעלה 📷'}</button>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {tripPhotos.map((p, idx) => (
                      <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '12px', overflow: 'hidden' }}>
                        <img src={p.image_url} alt="trip" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                        <div style={{ padding: '8px', fontSize: '12px', fontWeight: 'bold' }}>{p.caption}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {modalType === 'trivia' && (
                <div style={{ padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
                  <div style={{ background: cardBg, border: `1px solid ${borderColor}`, padding: '16px', borderRadius: '12px', fontWeight: '900', fontSize: '15px' }}>{ROAD_TRIVIA_QUESTIONS[triviaIndex].q}</div>
                  {ROAD_TRIVIA_QUESTIONS[triviaIndex].options.map((opt, oIdx) => (
                    <button key={oIdx} onClick={() => { alert(oIdx === ROAD_TRIVIA_QUESTIONS[triviaIndex].correct ? 'כל הכבוד! 🎉' : 'טעות ❌'); setTriviaIndex(prev => prev + 1); }} style={{ padding: '14px', borderRadius: '12px', background: cardBg, color: textColor, border: `1px solid ${borderColor}`, fontWeight: '900', cursor: 'pointer' }}>{opt}</button>
                  ))}
                </div>
              )}

              {modalType === 'parking' && (
                <div style={{ padding: '20px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {!savedCarParking ? (
                    <>
                      <input type="text" placeholder="הערה לחניה (למשל: קומה 2)" value={carNoteInput} onChange={e => setCarNoteInput(e.target.value)} style={{ padding: '12px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: cardBg, color: textColor }} />
                      <button onClick={saveCarLocationNow} style={{ padding: '14px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '900', cursor: 'pointer' }}>נָעץ מיקום רכב 🔴</button>
                    </>
                  ) : (
                    <>
                      <p style={{ fontWeight: '900' }}>רכב חונה ב-{savedCarParking.time} ({savedCarParking.note})</p>
                      <p style={{ fontWeight: '900' }}>מרחק הליכה: {carDistanceToWalk}</p>
                      <button onClick={clearCarLocation} style={{ padding: '12px', background: cardBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: '10px', fontWeight: '900', cursor: 'pointer' }}>אפס חניה 🗑️</button>
                    </>
                  )}
                </div>
              )}

              {modalType === 'tickets' && (
                <div style={{ padding: '16px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '12px' }}>
                    {folders.map((f, idx) => (
                      <button key={idx} onClick={() => setActiveFolder(f)} style={{ padding: '8px 14px', borderRadius: '8px', background: activeFolder === f ? '#2563eb' : cardBg, color: activeFolder === f ? '#fff' : textColor, border: `1px solid ${borderColor}`, fontWeight: '900', fontSize: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>{f}</button>
                    ))}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ticketFiles.filter(d => d.folder === activeFolder).map((doc, dIdx) => (
                      <div key={dIdx} onClick={() => setViewerItem(doc)} style={{ background: cardBg, padding: '14px', borderRadius: '12px', border: `1px solid ${borderColor}`, cursor: 'pointer', fontWeight: '800', fontSize: '13px' }}>📄 {doc.title}</div>
                    ))}
                  </div>
                </div>
              )}

              {modalType === 'emergency' && (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <a href="tel:112" style={emergencyBtnStyle(isDark)}>🚨 חירום כללי: 112</a>
                  <a href="tel:118" style={emergencyBtnStyle(isDark)}>🚑 אמבולנס: 118</a>
                  <a href="tel:113" style={emergencyBtnStyle(isDark)}>👮 משטרה: 113</a>
                </div>
              )}

              {modalType === 'around-me' && (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <a href="https://www.google.com/maps/search/?api=1&query=Autogrill" target="_blank" rel="noreferrer" style={{ padding: '14px', background: cardBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: '12px', textAlign: 'center', fontWeight: '900', textDecoration: 'none' }}>☕ עצרת דרך / Autogrill</a>
                  <a href="https://www.google.com/maps/search/?api=1&query=pharmacy" target="_blank" rel="noreferrer" style={{ padding: '14px', background: cardBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: '12px', textAlign: 'center', fontWeight: '900', textDecoration: 'none' }}>💊 פארם</a>
                  <a href="https://www.google.com/maps/search/?api=1&query=gas+station" target="_blank" rel="noreferrer" style={{ padding: '14px', background: cardBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: '12px', textAlign: 'center', fontWeight: '900', textDecoration: 'none' }}>⛽ תחנת דלק</a>
                </div>
              )}

              {modalType === 'timer' && (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'center' }}>
                  <button onClick={() => setModalType(null)} style={{ padding: '16px', background: cardBg, color: textColor, border: `1px solid ${borderColor}`, borderRadius: '12px', fontWeight: '900', cursor: 'pointer' }}>⏳ טיימר פעיל</button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {viewerItem && (
        <div onClick={() => setViewerItem(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 6000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, color: textColor, padding: '24px', borderRadius: '16px', width: '100%', maxWidth: '360px', border: `1px solid ${borderColor}`, textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 10px', fontSize: '16px', fontWeight: '900' }}>{viewerItem.title}</h3>
            {viewerItem.ticketCode && <p style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>🔑 {viewerItem.ticketCode}</p>}
            <button onClick={() => setViewerItem(null)} style={{ marginTop: '14px', padding: '10px 20px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '900', cursor: 'pointer' }}>סגור ✓</button>
          </div>
        </div>
      )}

    </div>
  );
}

const rectMenuCardStyle = (isDark) => ({
  background: isDark ? '#111111' : '#f8fafc',
  border: `1px solid ${isDark ? '#333333' : '#cbd5e1'}`,
  color: isDark ? '#ffffff' : '#334155',
  padding: '12px 16px',
  borderRadius: '12px',
  textAlign: 'right',
  fontWeight: '900',
  fontSize: '13px',
  cursor: 'pointer',
  width: '100%',
  boxSizing: 'border-box'
});

const emergencyBtnStyle = (isDark) => ({
  padding: '14px',
  borderRadius: '10px',
  background: isDark ? '#111111' : '#fee2e2',
  color: isDark ? '#ffffff' : '#ef4444',
  fontWeight: '900',
  fontSize: '13px',
  textAlign: 'center',
  textDecoration: 'none',
  border: `1.5px solid ${isDark ? '#333333' : '#fecaca'}`,
  boxSizing: 'border-box'
});
