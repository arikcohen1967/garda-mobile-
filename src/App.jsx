import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- GARDA-MOBILE v9.9.19-FindMyStyle ---
const APP_VERSION = 'v9.9.19-FindMyStyle';

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
        note: "איסוף מזוודות وקבלת הרכב השכור בשדה התעופה.",
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
          name: "נהר המינצ'و בפסקיירה",
          dest: "Peschiera del Garda, Italy",
          desc: "עצירה קצרה وמרגיעה ליד גדת הנהר לפתיחת מחברות ציור ותיעוד הנוף הראשון שלכם באיטליה."
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
        note: "בילוי בכל מתקני הפארק, הופעות חיות وأרוחת צהריים מהירה.",
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
          desc: "ציור הנוף הנשקף מלמעלה כמפת הרפתקנים על רקע העננים والאגם."
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
          desc: "וידוא קבלת קבלה מקורית וטופס החזר מס עבור המשקפיים."
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
  
  return {
    dist: `${Math.round(distKm)} km`,
    distNum: distKm
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
    'אריק': { name: 'אריק כהן', subtitle: '📍 מיקום נוכחי באיטליה', lat: 45.4384, lng: 10.6816, updated_at: 'Now', battery: 92, lastSeen: 'Bio Agriturismo Vojon' },
    'עמית': { name: 'Amit Cohen 👑❤️😘', subtitle: 'הבת (הבת המועדפת)', lat: 45.4484, lng: 10.6916, updated_at: 'Now', battery: 85, lastSeen: 'Gardaland Resort' },
    'יולי': { name: 'Yuly Cohen', subtitle: 'הבת המקסימה', lat: 45.4284, lng: 10.6716, updated_at: 'Now', battery: 88, lastSeen: 'Sirmione Castle' },
    'ליאן': { name: 'Lian Cohen', subtitle: 'הנסיכה הצעירה', lat: 45.4184, lng: 10.6616, updated_at: 'Now', battery: 78, lastSeen: 'Limone sul Garda' },
    'הראל': { name: 'Harel Cohen', subtitle: 'האביר הצעיר', lat: 45.4584, lng: 10.7016, updated_at: 'Now', battery: 96, lastSeen: 'Movieland Park' }
  });
  const [activeSosAlert, setActiveSosAlert] = useState(null);
  const [activeSoundAlert, setActiveSoundAlert] = useState(null);
  
  const [rallyPoint] = useState({ name: 'שער הכניסה הראשי (נקודת כינוס)', lat: 45.4526, lng: 10.7153 });

  const [tripPhotos, setTripPhotos] = useState([]);
  const [photoCaptionInput, setPhotoCaptionInput] = useState('');
  const [selectedPhotoViewer, setSelectedPhotoViewer] = useState(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const photoFileInputRef = useRef(null);

  const broadcastMyLocation = async (coords) => {
    if (!coords || !coords.latitude || !coords.longitude) return;
    const locObj = { 
      name: currentUser, 
      subtitle: 'מיקום מעודכן מ-GPS',
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
        const { data } = await supabase.from('family_trip_photos').select('*').order('created_at', { ascending: false });
        if (data) setTripPhotos(data);
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

    const radarChannel = supabase.channel('family_radar_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setFamilyLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.is_sos) {
            setActiveSosAlert(payload.new);
            playExtendedChimeMelody();
          }
        }
      })
      .subscribe();

    return () => {
      if (watchId !== null && navigator.geolocation) navigator.geolocation.clearWatch(watchId);
      clearInterval(pollingInterval);
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
        caption: photoCaptionInput || 'תמונה מהטיול 📸',
        image_url: base64Data,
        created_at: new Date().toISOString(),
        time_str: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      };
      try {
        await supabase.from('family_trip_photos').insert([newPhotoRecord]);
        setTripPhotos(prev => [newPhotoRecord, ...prev]);
        setPhotoCaptionInput('');
        alert('✨ התמונה הועלתה בהצלחה!');
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
    if (!savedCarParking || !myLocation) return;
    const { dist } = calculateDistanceAndDuration(myLocation.lat, myLocation.lng, savedCarParking.lat, savedCarParking.lng);
    setCarDistanceToWalk(dist);
  }, [myLocation, savedCarParking]);

  const saveCarLocationNow = () => {
    if (!navigator.geolocation) return alert('GPS אינו נתמך');
    navigator.geolocation.getCurrentPosition(pos => {
      setSavedCarParking({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        note: carNoteInput || 'חניה',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('he-IL')
      });
      setCarNoteInput('');
      setModalType(null);
      alert('🔴 מיקום הרכב נשמר!');
    }, () => {}, { enableHighAccuracy: true });
  };

  const [aroundMeQuery, setAroundMeQuery] = useState('');
  const [isOnline] = useState(navigator.onLine);
  const [currentWeather] = useState({ temp: '24°C', condition: '☀️ שמש' });
  const [backupModalOpen, setBackupModalOpen] = useState(false);
  const [adminPassInput, setAdminPassInput] = useState('');
  const [backupSuccessMsg, setBackupSuccessMsg] = useState(false);
  const [restorePassInput, setRestorePassInput] = useState('');
  const fileInputRef = useRef(null);

  const [triviaIndex, setTriviaIndex] = useState(0);
  const [travelerIndex, setTravelerIndex] = useState(0);
  const [travelerScores, setTravelerScores] = useState({ 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 });
  const [isTriviaPaused, setIsTriviaPaused] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questionTimeLeft, setQuestionTimeLeft] = useState(45);

  const chimeIntervalRef = useRef(null);

  const sendSoundAlert = async (targetName) => {
    const customMsg = prompt(`שלח התראה ל-${targetName}:`, "נא ליצור קשר!");
    if (customMsg === null) return;
    try {
      await supabase.from('family_radar').upsert([{ name: targetName, sound_msg: customMsg, is_sound_alert: true }], { onConflict: 'name' });
      alert(`🔔 התראה נשלחה בהצלחה!`);
    } catch (e) {}
  };

  const playExtendedChimeMelody = () => {};

  const triggerSos = async () => {
    if (!navigator.geolocation) return;
    if (!window.confirm('🚨 להפעיל אזעקת SOS?')) return;
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

  const isDark = true; // מעוצב תמיד כהה כמו ב-Apple Find My
  const bgMain = '#000000';
  const cardBg = '#1c1c1e';
  const textColor = '#ffffff';
  const textSub = '#8e8e93';
  const borderColor = '#38383a';
  const accentGradient = '#0a84ff';

  const day = INITIAL_TRIP_DAYS[activeDay];

  const routeMapHTML = useMemo(() => {
    const currentLat = myLocation?.lat || 45.4384;
    const currentLng = myLocation?.lng || 10.6816;
    const firstStop = day.stops[0];
    const destLat = firstStop?.lat || 45.4192;
    const destLng = firstStop?.lng || 10.6908;
    const { dist } = calculateDistanceAndDuration(currentLat, currentLng, destLat, destLng);

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #111; }</style>
      </head>
      <body>
        <div id="map" style="width:100%; height:100%;"></div>
        <script>
          const map = L.map('map').setView([${currentLat}, ${currentLng}], 11);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(map);
          L.marker([${currentLat}, ${currentLng}]).addTo(map).bindPopup('📍 המיקום שלך');
        </script>
      </body>
      </html>
    `;
  }, [myLocation, activeDay]);

  // מפת Apple Find My דומה בדיוק למקור
  const findMyMapHTML = useMemo(() => {
    let centerLat = 45.4384, centerLng = 10.6816;
    if (myLocation?.lat) { centerLat = myLocation.lat; centerLng = myLocation.lng; }

    let markersJS = '';
    Object.values(familyLocations).forEach(loc => {
      if (loc && loc.lat) {
        markersJS += `L.marker([${loc.lat}, ${loc.lng}]).addTo(map).bindPopup('<b>${loc.name}</b><br>${loc.subtitle || ''}');\n`;
      }
    });

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: #000; }
          #map { width: 100%; height: 100%; filter: brightness(0.9) contrast(1.1); }
        </style>
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
  }, [familyLocations, myLocation]);

  return (
    <div style={{ background: bgMain, minHeight: '100vh', color: textColor, fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Segoe UI", Roboto, sans-serif', direction: 'rtl', paddingBottom: '70px', boxSizing: 'border-box' }}>
      
      {/* כותרת עליונה בסגנון Apple */}
      <header style={{ background: 'rgba(28,28,30,0.85)', backdropFilter: 'blur(20px)', borderBottom: `0.5px solid ${borderColor}`, padding: '12px 16px', position: 'sticky', top: 0, zIndex: 1000, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => setSidebarOpen(true)} style={{ background: '#2c2c2e', color: '#0a84ff', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>•••</button>
        <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: textColor }}>Garda-Mobile Finder</h1>
        <button onClick={triggerSos} style={{ background: '#ff453a', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>SOS</button>
      </header>

      {/* תפריט צד (Sidebar) */}
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 2500, backdropFilter: 'blur(5px)' }} />}
      
      <aside style={{ position: 'fixed', top: 0, bottom: 0, right: 0, width: '280px', background: '#1c1c1e', zIndex: 2600, transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)', padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', borderLeft: `0.5px solid ${borderColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h3 style={{ margin: 0, fontSize: '17px', fontWeight: '600', color: textColor }}>תפריט ניהול</h3>
          <button onClick={() => setSidebarOpen(false)} style={{ background: '#3a3a3c', color: '#fff', border: 'none', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
        </div>
        <button onClick={() => { setSidebarOpen(false); setModalType('radar'); }} style={appleMenuBtnStyle}>📡 רדאר משפחתי (Find My)</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trip-album'); }} style={appleMenuBtnStyle}>📸 אלבום תמונות משפחתי</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('trivia'); }} style={appleMenuBtnStyle}>🧠 טריויה לדרך</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('parking'); }} style={appleMenuBtnStyle}>🚗 איתור רכב חונה</button>
        <button onClick={() => { setSidebarOpen(false); setModalType('tickets'); }} style={appleMenuBtnStyle}>🎟️ ארנק כרטיסים ומסמכים</button>
      </aside>

      {/* תוכן ראשי – תצוגת מסלול ימים */}
      <main style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
          {INITIAL_TRIP_DAYS.map((d, i) => {
            const isActive = activeDay === i;
            return (
              <button key={i} onClick={() => setActiveDay(i)} style={{ padding: '8px 16px', borderRadius: '16px', background: isActive ? '#0a84ff' : '#2c2c2e', color: '#fff', border: 'none', fontSize: '13px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {d.label}
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: '16px', background: cardBg, borderRadius: '20px', padding: '16px', border: `0.5px solid ${borderColor}` }}>
          <h2 style={{ margin: '0 0 12px', fontSize: '18px', fontWeight: '700' }}>{day.icon} {day.title}</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {day.stops.map((stop, sIdx) => {
              const currentLat = myLocation?.lat || 45.4384;
              const currentLng = myLocation?.lng || 10.6816;
              const { dist } = calculateDistanceAndDuration(currentLat, currentLng, stop.lat, stop.lng);

              return (
                <div key={sIdx} style={{ background: '#2c2c2e', padding: '12px 14px', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{stop.name}</span>
                    <span style={{ fontSize: '12px', color: '#0a84ff', fontWeight: '600' }}>{stop.time}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: textSub }}>מרחק: {dist}</span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" style={appleIconBtnStyle}>Maps</a>
                      <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} target="_blank" rel="noreferrer" style={appleIconBtnStyle}>Waze</a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* כפתור מהיר לפתיחת הרדאר בעיצוב Apple Find My */}
        <div style={{ marginTop: '20px' }}>
          <button onClick={() => setModalType('radar')} style={{ width: '100%', padding: '16px', background: '#0a84ff', color: '#fff', border: 'none', borderRadius: '16px', fontSize: '16px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 15px rgba(10, 132, 255, 0.4)' }}>
            <span>📡</span> פתח רדאר משפחתי (Apple Find My Style)
          </button>
        </div>
      </main>

      {/* חלון מודל מלא – רדאר משפחתי בעיצוב Find My בדיוק כמו בתמונה */}
      {modalType === 'radar' && (
        <div style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 5000, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          
          {/* מפת לווין ברקע */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
            <iframe title="Find My Map" srcDoc={findMyMapHTML} style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>

          {/* כפתור סגירה צף למעלה */}
          <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
            <button onClick={() => setModalType(null)} style={{ background: 'rgba(44,44,46,0.85)', backdropFilter: 'blur(10px)', color: '#fff', border: 'none', width: '36px', height: '36px', borderRadius: '50%', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          </div>

          {/* גיליון תחתון (Bottom Sheet) בסגנון Find My */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 5, background: 'rgba(28, 28, 30, 0.92)', backdropFilter: 'blur(25px)', borderTopLeftRadius: '24px', borderTopRightRadius: '24px', borderTop: `0.5px solid ${borderColor}`, padding: '12px 16px 30px', maxHeight: '55vh', display: 'flex', flexDirection: 'column', boxShadow: '0 -10px 30px rgba(0,0,0,0.6)', boxSizing: 'border-box' }}>
            
            {/* ידית גרירה */}
            <div style={{ width: '36px', height: '5px', background: '#48484a', borderRadius: '3px', alignSelf: 'center', marginBottom: '12px' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', padding: '0 4px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '700', color: '#fff' }}>People</h2>
              <button onClick={() => alert('הוספת בן משפחה חדש')} style={{ background: '#3a3a3c', color: '#0a84ff', border: 'none', width: '32px', height: '32px', borderRadius: '50%', fontSize: '18px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>

            {/* רשימת האנשים בסגנון המדויק מהתמונה */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }}>
              {Object.values(familyLocations).map((person, pIdx) => {
                const distObj = myLocation ? calculateDistanceAndDuration(myLocation.lat, myLocation.lng, person.lat, person.lng) : { dist: '26 km' };

                return (
                  <div key={pIdx} onClick={() => window.open(`https://maps.google.com/?q=${person.lat},${person.lng}`, '_blank')} style={{ background: 'rgba(44,44,46,0.6)', padding: '12px 14px', borderRadius: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', border: '0.5px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '50%', background: '#3a3a3c', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', overflow: 'hidden', border: '1px solid #545456' }}>
                        <span>👤</span>
                        <div style={{ position: 'absolute', bottom: '2px', right: '2px', width: '10px', height: '10px', borderRadius: '50%', background: '#34c759', border: '1.5px solid #1c1c1e' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                        <div style={{ fontSize: '15px', fontWeight: '600', color: '#fff', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          {person.name}
                        </div>
                        <div style={{ fontSize: '13px', color: textSub }}>{person.subtitle || person.lastSeen}</div>
                        <div style={{ fontSize: '11px', color: textSub, display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <span>• {person.updated_at || 'Now'}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: textSub, fontWeight: '500' }}>
                      {distObj.dist}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* סרגל ניווט תחתון (Tab Bar) בסגנון Find My */}
            <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', marginTop: '16px', paddingTop: '12px', borderTop: `0.5px solid ${borderColor}` }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#0a84ff', cursor: 'pointer' }}>
                <span style={{ fontSize: '18px' }}>👥</span>
                <span style={{ fontSize: '10px', fontWeight: '600' }}>People</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', color: '#8e8e93', cursor: 'pointer' }}>
                <span style={{ fontSize: '18px' }}>💻</span>
                <span style={{ fontSize: '10px', fontWeight: '500' }}>Devices</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', color: '#8e8e93', cursor: 'pointer' }}>
                <span style={{ fontSize: '18px' }}>🎒</span>
                <span style={{ fontSize: '10px', fontWeight: '500' }}>Items</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', color: '#8e8e93', cursor: 'pointer' }}>
                <span style={{ fontSize: '18px' }}>📍</span>
                <span style={{ fontSize: '10px', fontWeight: '500' }}>Me</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* חלונות מודל נוספים (אלבום, טריויה, חניה וכו') */}
      {modalType && modalType !== 'radar' && (
        <div onClick={() => setModalType(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div onClick={e => e.stopPropagation()} style={{ background: cardBg, color: textColor, padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '450px', maxHeight: '80vh', overflowY: 'auto', border: `0.5px solid ${borderColor}`, position: 'relative' }}>
            <button onClick={() => setModalType(null)} style={{ position: 'absolute', top: '16px', left: '16px', background: '#3a3a3c', color: '#fff', border: 'none', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            
            {modalType === 'trip-album' && (
              <div>
                <h3 style={{ marginTop: 0 }}>📸 אלבום טיול משפחתי</h3>
                <input type="text" placeholder="תיאור תמונה..." value={photoCaptionInput} onChange={e => setPhotoCaptionInput(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#2c2c2e', color: '#fff', border: 'none', marginBottom: '10px' }} />
                <input type="file" accept="image/*" ref={photoFileInputRef} id="photo-file" style={{ display: 'none' }} onChange={handleUploadPhotoFile} />
                <button onClick={() => document.getElementById('photo-file').click()} style={{ width: '100%', padding: '12px', background: '#0a84ff', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', marginBottom: '16px' }}>העלה תמונה 📷</button>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {tripPhotos.map((p, idx) => (
                    <div key={idx} style={{ borderRadius: '10px', overflow: 'hidden', background: '#2c2c2e' }}>
                      <img src={p.image_url} alt="trip" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                      <div style={{ padding: '6px', fontSize: '11px', color: '#fff' }}>{p.caption}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {modalType === 'trivia' && (
              <div>
                <h3 style={{ marginTop: 0 }}>🧠 טריויה לדרך</h3>
                <p>{ROAD_TRIVIA_QUESTIONS[triviaIndex].q}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ROAD_TRIVIA_QUESTIONS[triviaIndex].options.map((opt, oIdx) => (
                    <button key={oIdx} onClick={() => { alert(oIdx === ROAD_TRIVIA_QUESTIONS[triviaIndex].correct ? 'כל הכבוד! תשובה נכונה 🎉' : 'טעות, נסה שוב ❌'); setTriviaIndex(prev => prev + 1); }} style={{ padding: '12px', borderRadius: '10px', background: '#2c2c2e', color: '#fff', border: 'none', cursor: 'pointer', textAlign: 'right' }}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {modalType === 'parking' && (
              <div>
                <h3 style={{ marginTop: 0 }}>🚗 איתור רכב חונה</h3>
                {!savedCarParking ? (
                  <div>
                    <input type="text" placeholder="הערה לחניה (למשל: קומה 2)" value={carNoteInput} onChange={e => setCarNoteInput(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: '#2c2c2e', color: '#fff', border: 'none', marginBottom: '10px' }} />
                    <button onClick={saveCarLocationNow} style={{ width: '100%', padding: '12px', background: '#ff453a', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer' }}>שמור מיקום רכב 🔴</button>
                  </div>
                ) : (
                  <div>
                    <p>רכב חונה: {savedCarParking.note}</p>
                    <p>מרחק הליכה: {carDistanceToWalk}</p>
                    <button onClick={() => setSavedCarParking(null)} style={{ padding: '10px', background: '#3a3a3c', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>אפס חניה</button>
                  </div>
                )}
              </div>
            )}

            {modalType === 'tickets' && (
              <div>
                <h3 style={{ marginTop: 0 }}>🎟️ ארנק כרטיסים ומסמכים</h3>
                <p>כל כרטיסי הטיסה, המלונות והפארקים שמורים כאן לעבודה מהירה.</p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

const appleMenuBtnStyle = {
  background: '#2c2c2e',
  color: '#fff',
  border: 'none',
  padding: '12px 14px',
  borderRadius: '12px',
  textAlign: 'right',
  fontSize: '15px',
  fontWeight: '500',
  cursor: 'pointer'
};

const appleIconBtnStyle = {
  background: '#3a3a3c',
  color: '#0a84ff',
  padding: '4px 10px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '11px',
  fontWeight: '600'
};
