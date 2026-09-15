import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// Supabase Cloud Configuration
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
  <svg viewBox="0 0 512 512" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="110" fill="#71717a"/>
    <path d="M120 392l80-160 160-80-80 160z" fill="#10b981"/>
    <path d="M200 232l152-72-72 152-80-80z" fill="#3b82f6"/>
    <circle cx="260" cy="260" r="50" fill="#fff"/>
    <polygon points="260,225 240,290 260,275 280,290" fill="#2563eb"/>
  </svg>
);

const TIMER_SVG = (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="13" r="9"/>
    <polyline points="12 9 12 13 15 16"/>
    <path d="M12 2v2"/>
    <path d="M5 5l1.5 1.5"/>
  </svg>
);

const HOTEL_COORDINATES = { lat: 45.4057, lng: 10.7022, name: "Bio Agriturismo Vojon" };
const HOTEL_ADDRESS = "Bio Agriturismo Vojon, Ponti sul Mincio, Italy";

const INITIAL_TRIP_DAYS = [
  {
    date: "2026-09-30",
    label: "רביעי · 30/09",
    fullLabel: "יום רביעי · 30 בספטמבר 2026",
    title: "נחיתה והגעה למלון",
    icon: "✈️",
    challenge: "לצלם את התמונה המשפחתית הראשונה באיטליה.",
    challengeDesc: "הרגע נחתנו! המשימה שלכם: סלפי משפחתי ראשון בשדה או עם הרכב השכור החדש.",
    stops: [
      { time: "16:00", name: "נחיתה בנמל התעופה ורונה", dest: "Verona Villafranca Airport", note: "איסוף מזוודות ואיסוף הרכב השכור." },
      { time: "18:00", name: "נסיעה למלון וארוחת ערב", dest: "Bio Agriturismo Vojon, Ponti sul Mincio, Italy", note: "צ׳ק-אין, התארגנות בחדרים וארוחת ערב פיצה/פסטה משפחתית במסעדה מקומית סמוכה + גלידה ראשונה בפסקיירה.", food: { name: "🍕 פיצריה מקומית + גלידה בפסקיירה", dest: "Peschiera del Garda, Italy" } }
    ]
  },
  {
    date: "2026-10-01",
    label: "חמישי · 01/10",
    fullLabel: "יום חמישי · 01 באוקטובר 2026",
    title: "Gardaland – יום פארק מלא",
    icon: "🎢",
    challenge: "לבחור יחד את שלושת המתקנים הכי אקסטרימיים של היום!",
    challengeDesc: "צלמו תמונה צועקים על אחד המתקנים, וכתבו מי צעק הכי חזק ברכבת הרים.",
    stops: [
      { time: "08:30", name: "יציאה מהמלון ל-Gardaland", dest: "Gardaland Resort, Via Derna 4, Castelnuovo del Garda", note: "לצאת מוקדם ולהגיע בנחת לפני פתיחת השערים." },
      { time: "09:00", name: "חניה וכניסה ל-Gardaland", dest: "Gardaland Parking, Castelnuovo del Garda", note: "מומלץ לשמור את מיקום הרכב בחניה כדי לחזור אליו בקלות בסוף היום." },
      { time: "13:00", name: "ארוחת צהריים בפארק", dest: "Gardaland Resort", note: "אוכל מהיר, פיצות והמבורגרים בתוך הפארק.", food: { name: "🍔 Aladino Pizza & Burger (בתוך הפארק)", dest: "Gardaland Resort" } },
      { time: "19:00", name: "ארוחת ערב", dest: "Osteria Sottoportego, Peschiera del Garda", note: "פסטות מעולות ואווירה על המים בפסקיירה דל גארדה.", food: { name: "🍝 Osteria Sottoportego", dest: "Osteria Sottoportego, Peschiera del Garda" } }
    ]
  },
  {
    date: "2026-10-02",
    label: "שישי · 02/10",
    fullLabel: "יום שישי · 02 באוקטובר 2026",
    title: "מונטה באלדו (רכבל) + סירמיונה",
    icon: "🚠",
    challenge: "לצלם תמונת פנורמה משפחתית מפסגת הרכבל ותמונה רומנטית/משפחתית בסירמיונה!",
    challengeDesc: "תצפית מרהיבה מגובה של כמעט 1,800 מטר באלדו, ולאחר מכן שיטוט בסמטאות הקסומות של סירמיונה.",
    stops: [
      { time: "08:30", name: "עלייה לרכבל מונטה באלדו (מלצ׳סינה)", dest: "Funivia Malcesine-Monte Baldo", note: "רכבל מסתובב עוצר נשק אל פסגת הר האלדו. מומלץ להזמין מקום מראש!" },
      { time: "11:00", name: "תצפית מפסגת מונטה באלדו", dest: "Monte Baldo Summit, Italy", note: "הליכה קצרה, תצפיות פנורמיות על כל אגם גארדה, ואולי פגישה עם פרות הרריות." },
      { time: "13:00", name: "נסיעה וירידה דרומה לסירמיונה", dest: "Sirmione, Italy", note: "עיירת הימי ביניים הקסומה הבנויה על לשון יבשה בתוך האגם.", food: { name: "🍦 גלידה מפורסמת בסירמיונה + פיצה איטלקית", dest: "Sirmione, Italy" } },
      { time: "15:00", name: "טירת סקאליג'ר ומצודת סירמיונה", dest: "Scaliger Castle in Sirmione", note: "סיור סביב הטירת מים העתיקה והמרהיבה ושיטוט בסמטאות הצרות." }
    ]
  },
  {
    date: "2026-10-03",
    label: "שבת · 03/10",
    fullLabel: "יום שבת · 03 באוקטובר 2026",
    title: "Movieland + Medieval Times",
    icon: "🎬",
    challenge: "לצלם סלפי משפחתי שנראה כמו פוסטר של סרט הוליוודי!",
    challengeDesc: "פוזה דרמטית ליד תפאורת סרט ב-Movieland או תמונה של כולם אוכלים עוף בידיים במופע האבירים.",
    stops: [
      { time: "09:00", name: "יציאה ל-Movieland", dest: "Movieland The Hollywood Park, Via Fossalta 58, Lazise", note: "יום של אקשן וחוויות קולנועיות." },
      { time: "20:00", name: "Medieval Times – מופע האבירים", dest: "Medieval Times, Via Fossalta 58, Lazise", note: "מופע ערב סוחף וארוחה שחיתות בלי סכו״ם (עם הידיים!).", food: { name: "🍗 Medieval Times (אכילה בידיים!)", dest: "Medieval Times, Via Fossalta 58, Lazise" } }
    ]
  },
  {
    date: "2026-10-04",
    label: "ראשון · 04/10",
    fullLabel: "יום ראשון · 04 באוקטובר 2026",
    title: "ונציה – יום סיור קסום בעיר המים",
    icon: "🛶",
    challenge: "למצוא גשר קטן ויפה מחוץ למסלול הראשי ולספור 3 גונדולות!",
    challengeDesc: "צלמו את הגשר הכי מיוחד שמצאתם בסמטאות ונציה, וכתבו את הדבר הכי מוזר או יפה שראיתם בעיר המים.",
    stops: [
      { time: "07:30", name: "יציאה מוקדמת מהמלון לוונציה", dest: "Venezia Tronchetto Parking, Isola Nova del Tronchetto, Venezia", note: "חניית טרונקטו ומעבר בסירה/רכבת קלה למרכז." },
      { time: "09:30", name: "כיכר סן מרקו והבזיליקה", dest: "St. Mark's Square, Venice, Italy", note: "הלב הפועם של ונציה, כיכר מרהיבה, יונים וארמון הדוג'ה." },
      { time: "11:00", name: "גשר ריאלטו והשוק המפורסם", dest: "Rialto Bridge, Venice, Italy", note: "תצפית עוצרת נשק על התעלה הגדולה ושיטוט בשוק הססגוני." },
      { time: "13:00", name: "ארוחת צהריים בוונציה", dest: "Pizzeria L'Anfora, Venezia", note: "פיצרייה שכונתית מעולה הרחק מההמונים סביב סן מרקו.", food: { name: "🍕 Pizzeria L'Anfora + גלידת Suso המפורסמת", dest: "Calle Larga dei Bari, 1223, Venezia" } },
      { time: "15:00", name: "רובע דורסודור וגשר האקדמיה", dest: "Accademia Bridge, Venice, Italy", note: "אווירה אותנטית ושקטה יותר, גלריות אָמָּנוּת ונופים מדהימים של התעלה." }
    ]
  },
  {
    date: "2026-10-05",
    label: "שני · 05/10",
    fullLabel: "יום שני · 05 באוקטובר 2026",
    title: "X Rafting בבוקר + Borghetto בצהריים",
    icon: "🚣",
    challenge: "לצלם תמונה משפחתית מטורפת מהראפטינג ותמונה חגיגית בבורגטו!",
    challengeDesc: "מתחילים את הבוקר באקשן מים מסעיר ב-X Rafting, וממשיכים לצהריים רומנטיים בכפר הטחנות בבורגטו.",
    stops: [
      { time: "09:00", name: "X Rafting – חוויית אקסטרים במים", dest: "X Rafting, Centri Rafting, Italy", note: "שיט ראפטינג משפחתי ומרגש בנהר עם צוות מדריכים מקצועי." },
      { time: "12:30", name: "Borghetto sul Mincio – הכפר והטחנות", dest: "Borghetto sul Mincio, Italy", note: "טיול רגלי ציורי בין הנהר, הגשרים והטחנות העתיקות.", food: { name: "🍝 Ristorante Alla Borsa (טורטליני מקורי 'קשר האהבה')", dest: "Ristorante Alla Borsa, Valeggio sul Mincio, Italy" } }
    ]
  },
  {
    date: "2026-10-06",
    label: "שלישי · 06/10",
    fullLabel: "יום שלישי · 06 באוקטובר 2026",
    title: "ורונה + הטיסה הביתה",
    icon: "❤️",
    challenge: "לבחור יחד את רגע השיא (הטופ 1) של כל הטיול!",
    challengeDesc: "כל אחד כותב את הרגע שהוא לעולם לא ישכח מהטיול לאיטליה, ומצטלמים יחד פעם אחרונה בוורונה.",
    stops: [
      { time: "09:00", name: "צ׳ק-אאוט ויציאה לוורונה", dest: "Parcheggio Cittadella, Piazza Cittadella, Verona", note: "סיור קצר בוורונה, הארנה והמרפסת של יוליה." },
      { time: "13:00", name: "ארוחת צהריים מסכמת בוורונה", dest: "Pizzeria Saporè Downtown, Verona", note: "ארוחת פרידה מעולה מאיטליה עם פיצות גורמה ופסטות.", food: { name: "🍕 Pizzeria Saporè Downtown", dest: "Pizzeria Saporè, Verona" } },
      { time: "18:30", name: "החזרת הרכב בשדה התעופה", dest: "Verona Villafranca Airport", note: "התארגנות וטיסה חזרה הביתה." }
    ]
  }
];

const TICKET_DEFAULT_FOLDERS = ['✈️ טיסות ורכב', '🏡 מלון', '🎢 Gardaland', '🚣 X Rafting ומונטה באלדו', '🎬 Movieland', '🏰 Medieval Times', '🚤 ונציה'];

const DEFAULT_DOCUMENTS = [
  { id: 'flight-arik', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - אריק כהן (8180011314102)', name: 'Israir_Arik_Cohen.pdf', type: 'text/flight-info', size: 15400, created: 1005, isFlightInfo: true, passenger: 'COHEN/ARIK MR', ticketNo: '8180011314102' },
  { id: 'flight-amit', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - עמית כהן (8180011314103)', name: 'Israir_Amit_Cohen.pdf', type: 'text/flight-info', size: 15400, created: 1004, isFlightInfo: true, passenger: 'COHEN/AMIT MS', ticketNo: '8180011314103' },
  { id: 'flight-yuly', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - יולי כהן (8180011314104)', name: 'Israir_Yuly_Cohen.pdf', type: 'text/flight-info', size: 15400, created: 1003, isFlightInfo: true, passenger: 'COHEN/YULY MS', ticketNo: '8180011314104' },
  { id: 'flight-lian', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - ליאן כהן (8180011314105)', name: 'Israir_Lian_Cohen.pdf', type: 'text/flight-info', size: 15400, created: 1002, isFlightInfo: true, passenger: 'COHEN/LIAN CHD', ticketNo: '8180011314105' },
  { id: 'flight-harel', folder: '✈️ טיסות ורכב', title: 'כרטיס טיסה - הראל וילנאי כהן (8180011314106)', name: 'Israir_Harel_Vilnai.pdf', type: 'text/flight-info', size: 15400, created: 1001, isFlightInfo: true, passenger: 'VILNAI COHEN/HAREL MR', ticketNo: '8180011314106' },
  { id: 'israir-general', folder: '✈️ טיסות ורכב', title: 'הזמנת ישראייר ראשית (4623652)', name: 'Israir Booking General', type: 'text/flight-info', size: 15400, created: 1000, isFlightInfo: true },
  { id: 'aig-insurance', folder: '✈️ טיסות ורכב', title: 'ביטוח נסיעות AIG (170270213826)', name: 'AIG Insurance Policy', type: 'text/insurance-info', size: 12000, created: 900, isInsuranceInfo: true },
  { id: 'ecovia-car', folder: '✈️ טיסות ורכב', title: 'שובר השכרת רכב (724715780)', name: 'Car Rental Voucher', type: 'text/car-voucher', size: 14000, created: 800, isCarVoucher: true },
  { id: 'vojon-hotel', folder: '🏡 מלון', title: 'הזמנת Bio Agriturismo Vojon', name: 'Hotel Booking Confirmation', type: 'text/hotel-info', size: 13000, created: 700, isHotelInfo: true },
  { id: 'gardaland-1', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #1 (Serial 600)', name: 'Gardaland Ticket 600', type: 'text/gardaland-ticket', size: 11000, created: 650, isGardalandTicket: true, serial: '600', code: 'BKN1P01Y901MART', ticketId: '33385742', sigillo: '542965AEE291FEA3' },
  { id: 'gardaland-2', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #2 (Serial 601)', name: 'Gardaland Ticket 601', type: 'text/gardaland-ticket', size: 11000, created: 640, isGardalandTicket: true, serial: '601', code: 'VKN1P01Y901ME4T', ticketId: '33385743', sigillo: '8762764E1A637781' },
  { id: 'gardaland-3', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #3 (Serial 606)', name: 'Gardaland Ticket 606', type: 'text/gardaland-ticket', size: 11000, created: 630, isGardalandTicket: true, serial: '606', code: 'TKN1P01Y901MUTT', ticketId: '33385748', sigillo: 'DD1F221668493023' },
  { id: 'gardaland-4', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #4 (Serial 608)', name: 'Gardaland Ticket 608', type: 'text/gardaland-ticket', size: 11000, created: 620, isGardalandTicket: true, serial: '608', code: 'CKN1P01Y901N2IT', ticketId: '33385750', sigillo: '7379E49AA9784605' },
  { id: 'gardaland-5', folder: '🎢 Gardaland', title: 'כרטיס Gardaland #5 (Serial 601 נוסף)', name: 'Gardaland Ticket Harel', type: 'text/gardaland-ticket', size: 11000, created: 610, isGardalandTicket: true, serial: '601', code: 'VKN1P01Y901ME4T', ticketId: '33385743', sigillo: '8762764E1A637781' },
  { id: 'movieland-1', folder: '🎬 Movieland', title: 'כרטיס Movieland #1 (069)', name: 'Movieland Ticket 069', type: 'text/movieland-ticket', size: 11000, created: 550, isMovielandTicket: true, codeNum: '017JUNAR0069', barcode: '256612CCD43B8E08' },
  { id: 'movieland-2', folder: '🎬 Movieland', title: 'כרטיס Movieland #2 (070)', name: 'Movieland Ticket 070', type: 'text/movieland-ticket', size: 11000, created: 540, isMovielandTicket: true, codeNum: '017JUNAR0070', barcode: 'EA35DB7A2EA540D5' },
  { id: 'movieland-3', folder: '🎬 Movieland', title: 'כרטיס Movieland #3 (071)', name: 'Movieland Ticket 071', type: 'text/movieland-ticket', size: 11000, created: 530, isMovielandTicket: true, codeNum: '017JUNAR0071', barcode: '934FEA2F66750267' },
  { id: 'movieland-4', folder: '🎬 Movieland', title: 'כרטיס Movieland #4 (072)', name: 'Movieland Ticket 072', type: 'text/movieland-ticket', size: 11000, created: 520, isMovielandTicket: true, codeNum: '017JUNAR0072', barcode: '52CACC0D5CAE334B' },
  { id: 'movieland-5', folder: '🎬 Movieland', title: 'כרטיס Movieland #5 (073)', name: 'Movieland Ticket 073', type: 'text/movieland-ticket', size: 11000, created: 510, isMovielandTicket: true, codeNum: '017JUNAR0073', barcode: '32D6C578DF258ACF' }
];

const RAW_BASE_QUESTIONS = [
  { q: "כמה רגליים יש לעכביש?", options: ["6", "8", "10", "12"], correct: 1 },
  { q: "איזה בעל חיים נחשב למהיר ביותר בעולם ביבשה?", options: ["אריה", "ברדלס (צ'יטה)", "סוס מירוץ", "זברה"], correct: 1 },
  { q: "כמה פלנטות יש במערכת השמש שלנו?", options: ["7", "8", "9", "10"], correct: 1 },
  { q: "איזה גז אנחנו בני האדם שואפים בעיקר כדי לחיות?", options: ["פחמן דו-חמצני", "חמצן", "מימן", "חנקן"], correct: 1 },
  { q: "איזה כוכב לכת ידוע בתור 'הכוכב האדום'?", options: ["נוגה", "מאדים", "צדק", "שבתאי"], correct: 1 },
  { q: "מהו האוקיינוס הגדול ביותר בעולם?", options: ["האוקיינוס האטלנטי", "האוקיינוס ההודי", "האוקיינוס השקט", "אוקיינוס הקרח הצפוני"], correct: 2 },
  { q: "כמה ימים יש בשנה רגילה?", options: ["364", "365", "366", "360"], correct: 1 },
  { q: "איזה יצור קדום חי בעבר על כדור הארץ ונכחד לפני מיליוני שנים?", options: ["כריש לבן", "דינוזאור", "תנין", "צב ים"], correct: 1 },
  { q: "מהי היבשה הקטנה ביותר בעולם?", options: ["אפריקה", "אוסטרליה", "אירופה", "אמריקה"], correct: 1 },
  { q: "באיזו מדינה נמצאים המפלים הגבוהים בעולם (מפלי אנג'ל)?", options: ["ונצואלה", "ברזיל", "ארצות הברית", "קנדה"], correct: 0 },
  { q: "כמה שיניים יש לבן אדם מבוגר בדרך כלל (כולל שיני בינה)?", options: ["28", "32", "36", "24"], correct: 1 },
  { q: "איזה חומר נחשב לקשה ביותר בטבע?", options: ["ברזל", "זהב", "יהלום", "טיטניום"], correct: 2 }
];

const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lon2 || !lat2) return null;
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c;
  if (d < 1) return `${Math.round(d * 1000)} מטר`;
  return `${d.toFixed(1)} ק"מ`;
};

const calculateBearing = (lat1, lon1, lat2, lon2) => {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  return (θ * 180 / Math.PI + 360) % 360;
};

const generateMapHTML = (familyLocs, myLoc, sosState, isDark) => {
  const locsArray = Object.values(familyLocs || {});
  let centerLat = 45.4384;
  let centerLng = 10.6816;
  
  if (sosState && sosState.lat) {
    centerLat = sosState.lat;
    centerLng = sosState.lng;
  } else if (myLoc && myLoc.lat) {
    centerLat = myLoc.lat;
    centerLng = myLoc.lng;
  } else if (locsArray.length > 0) {
    centerLat = locsArray[0].lat;
    centerLng = locsArray[0].lng;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html { margin: 0; padding: 0; width: 100%; height: 100%; background: ${isDark ? '#000000' : '#0f172a'}; }
        #map { width: 100%; height: 100%; }
        .custom-tooltip { background: ${isDark ? '#1c1c1e' : '#1e293b'}; color: ${isDark ? '#f5f5f7' : '#fff'}; border: 1.5px solid #38bdf8; font-weight: 900; font-family: sans-serif; padding: 4px 10px; border-radius: 8px; font-size: 13px; direction: rtl; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const map = L.map('map', { zoomControl: true }).setView([${centerLat}, ${centerLng}], 11);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        const locs = ${JSON.stringify(locsArray)};
        const sos = ${JSON.stringify(sosState)};
        const myLocData = ${JSON.stringify(myLoc)};
        const markers = [];

        if (myLocData && myLocData.lat && myLocData.lng) {
          const redIcon = L.divIcon({
            className: 'custom-red-pin',
            html: '<div style="background-color:#ef4444; width:22px; height:22px; border-radius:50%; border:3px solid #ffffff; box-shadow:0 0 16px rgba(239,68,68,0.9);"></div>',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });
          L.marker([myLocData.lat, myLocData.lng], { icon: redIcon }).addTo(map).bindPopup('📍 המיקום שלי באגם');
          markers.push([myLocData.lat, myLocData.lng]);
        }

        locs.forEach(loc => {
          const isSos = sos && sos.name === loc.name;
          const marker = L.marker([loc.lat, loc.lng]).addTo(map);
          const firstLetter = loc.name ? loc.name.charAt(0) : '?';
          const labelText = isSos ? '🚨 ' + firstLetter : firstLetter;
          
          marker.bindTooltip(labelText, {permanent: true, direction: 'top', className: 'custom-tooltip'});
          markers.push([loc.lat, loc.lng]);
        });

        if (markers.length > 1) {
          map.fitBounds(markers, { padding: [40, 40], maxZoom: 13 });
        } else if (markers.length === 1) {
          map.setView(markers[0], 12);
        }
      </script>
    </body>
    </html>
  `;
};

const generateMassiveTrivia = () => {
  const shuffledBase = [...RAW_BASE_QUESTIONS];
  for (let i = shuffledBase.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffledBase[i], shuffledBase[j]] = [shuffledBase[j], shuffledBase[i]];
  }
  const generated = [];
  for (let i = 0; i < 1000; i++) {
    const template = shuffledBase[i % shuffledBase.length];
    generated.push({
      q: `(שאלה #${i + 1}) ${template.q}`,
      options: template.options,
      correct: template.correct
    });
  }
  return generated;
};

const cacheMediaOffline = async (url) => {
  if (!url || typeof window === 'undefined' || !('caches' in window)) return url;
  try {
    const cache = await caches.open('garda-offline-photos-v1');
    const match = await cache.match(url);
    if (!match) {
      const res = await fetch(url, { mode: 'cors' });
      if (res.ok) {
        await cache.put(url, res.clone());
      }
    }
  } catch (e) {}
  return url;
};

function DocumentViewer({ item, isDark, blockText, cardShadow }) {
  const [blobUrl, setBlobUrl] = useState(null);

  useEffect(() => {
    if (item?.blob) {
      const url = URL.createObjectURL(item.blob);
      setBlobUrl(url);
      return () => { URL.revokeObjectURL(url); };
    } else {
      setBlobUrl(null);
    }
  }, [item?.blob]);

  return (
    <div style={{ lineHeight: '1.8', fontSize: '14px', color: blockText, fontWeight: '500', boxSizing: 'border-box' }}>
      {item.isHotelInfo && (
        <>
          <p><b>סטטוס הזמנה:</b> <span style={{ color: '#10b981', fontWeight: '800' }}>Confirmed (מאושר)</span></p>
          <p><b>כתובת המלון:</b><br/><span dir="ltr">Via Del Forte 6, 46040 Ponti Sul Mincio, Italy</span></p>
          <p><b>תאריכי שהות:</b> 30.09.2026 – 06.10.2026 (6 לילות)</p>
          <p><b>טלפון ליצירת קשר:</b> <a href="tel:+393792027060" style={{ color: isDark ? '#60a5fa' : '#2563eb', fontWeight: '700' }} dir="ltr">+39 379 202 7060</a></p>
          
          <a 
            href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`} 
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px', background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)', color: '#ffffff', borderRadius: '14px', textDecoration: 'none', fontWeight: '700', marginTop: '20px', boxShadow: '0 8px 20px rgba(0,210,243,0.3)' }}
          >
            {WAZE_SVG} נווט למלון ב-Waze לפי הכתובת
          </a>
        </>
      )}

      {item.isFlightInfo && (
        <>
          <div style={{ background: isDark ? 'rgba(56, 189, 248, 0.15)' : '#e0f2fe', padding: '14px', borderRadius: '14px', color: isDark ? '#38bdf8' : '#0369a1', marginBottom: '16px', textAlign: 'center', fontWeight: '700' }}>
            ✈️ Israir E-Ticket Flight
          </div>
          {item.passenger && <p><b>נוסע/ת:</b> <span style={{ fontWeight: '800', fontSize: '15px' }}>{item.passenger}</span></p>}
          {item.ticketNo && <p><b>מספר כרטיס טיסה:</b> <span dir="ltr">{item.ticketNo}</span></p>}
          <p><b>חברת תעופה:</b> ישראייר (Israir Airlines)</p>
          <p><b>מספר הזמנה (PNR):</b> <span style={{ fontWeight: '800' }}>4623652</span></p>
          <div style={{ background: isDark ? '#2c2c2e' : '#f1f5f9', padding: '12px', borderRadius: '12px', marginTop: '12px' }}>
            <p style={{ margin: '0 0 6px' }}>🛫 <b>הלוך (30-Sep-2026):</b> TLV ➔ VRN | טיסה 6H:357 | 13:15 - 16:05</p>
            <p style={{ margin: 0 }}>🛬 <b>חזור (06-Oct-2026):</b> VRN ➔ TLV | טיסה 6H:352 | 21:35 - 02:05</p>
          </div>
        </>
      )}

      {item.isGardalandTicket && (
        <>
          <div style={{ background: isDark ? 'rgba(56, 189, 248, 0.15)' : '#e0f2fe', padding: '14px', borderRadius: '14px', color: isDark ? '#38bdf8' : '#0369a1', marginBottom: '16px', textAlign: 'center', fontWeight: '700' }}>
            🎢 Gardaland Park Official Ticket
          </div>
          <p><b>קוד כרטיס (Code):</b> <span dir="ltr" style={{ fontWeight: '800', fontSize: '15px' }}>{item.code}</span></p>
          <p><b>מספר כרטיס (Ticket ID):</b> {item.ticketId}</p>
          <p><b>סיריאלי/סדרה:</b> {item.serial}</p>
          <p><b>סיגיל (Sigillo):</b> <span dir="ltr">{item.sigillo}</span></p>
          <p><b>תוקף:</b> עד 01.11.2026</p>
        </>
      )}

      {item.isMovielandTicket && (
        <>
          <div style={{ background: isDark ? 'rgba(217, 70, 239, 0.15)' : '#fae8ff', padding: '14px', borderRadius: '14px', color: isDark ? '#e879f9' : '#86198f', marginBottom: '16px', textAlign: 'center', fontWeight: '700' }}>
            🎬 Movieland The Hollywood Park Ticket
          </div>
          <p><b>מספר כרטיס:</b> <span style={{ fontWeight: '800', fontSize: '15px' }}>{item.codeNum}</span></p>
          <p><b>ברקוד דיגיטלי:</b> <span dir="ltr" style={{ fontWeight: '800' }}>{item.barcode}</span></p>
          <p><b>תוקף:</b> עד 29.11.2026 (כרטיס פתוח לעונת 2026)</p>
        </>
      )}

      {item.isInsuranceInfo && (
        <>
          <p><b>מבטח:</b> AIG ישראל</p>
          <p><b>מספר פוליסה:</b> 170270213826</p>
          <p><b>כיסוי:</b> ביטוח נסיעות ורפואי מלא לחו"ל כולל הרחבות וספורט ימי (ראפטינג).</p>
        </>
      )}

      {item.isCarVoucher && (
        <>
          <p><b>חברת השכרה:</b> Ecovia Car Rental</p>
          <p><b>מספר שובר:</b> 724715780</p>
          <p><b>איסוף והחזרה:</b> נמל התעופה ורונה (VRN)</p>
        </>
      )}

      {blobUrl && (
        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          {item.type?.startsWith('image/') ? (
            <img 
              src={blobUrl} 
              alt={item.title || item.name} 
              style={{ maxWidth: '100%', borderRadius: '14px', boxShadow: cardShadow }} 
            />
          ) : (
            <a 
              href={blobUrl} 
              download={item.name} 
              style={{ display: 'inline-block', padding: '12px 20px', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: '700', boxShadow: '0 4px 12px rgba(37,99,235,0.3)' }}
            >
              📥 פתח / הורד קובץ ({item.name})
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tripDays, setTripDays] = useState(INITIAL_TRIP_DAYS);
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [viewerItem, setViewerItem] = useState(null);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  
  const [themeMode, setThemeMode] = useState('light');
  const [weatherData] = useState({ temp: '25°C', condition: '☀️ שמש נעימה באגם', location: 'אגם Garda', humidity: '58%', wind: '12 קמ"ש', updated: 'כעת' });

  const [customTheme, setCustomTheme] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-custom-theme')) || null;
    } catch (e) { return null; }
  });
  const [showThemeBuilder, setShowThemeBuilder] = useState(false);
  const [tempBgMain, setTempBgMain] = useState('#f8fafc');
  const [tempCardBg, setTempCardBg] = useState('#ffffff');
  const [tempTextColor, setTempTextColor] = useState('#0f172a');
  const [tempBorderColor, setTempBorderColor] = useState('#e2e8f0');

  const [folders, setFolders] = useState(TICKET_DEFAULT_FOLDERS);
  const [activeFolder, setActiveFolder] = useState('✈️ טיסות ורכב');
  const [ticketFiles, setTicketFiles] = useState(DEFAULT_DOCUMENTS.filter(d => d.folder === '✈️ טיסות ורכב'));
  const [showUploadBox, setShowUploadBox] = useState(false);
  const [newTicketTitle, setNewTicketTitle] = useState('');
  const [selectedUploadFolder, setSelectedUploadFolder] = useState('✈️ טיסות ורכב');

  const [galleryItems, setGalleryItems] = useState([]);
  const [showGalleryUpload, setShowGalleryUpload] = useState(false);
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryUploaderName, setGalleryUploaderName] = useState('אריק');
  const [selectedGalleryPhoto, setSelectedGalleryPhoto] = useState(null);

  const [completedChallenges, setCompletedChallenges] = useState({});
  const [challengeNote, setChallengeNote] = useState('');
  const [challengeAuthor, setChallengeAuthor] = useState('אריק');
  
  const challengeAuthorRef = useRef(challengeAuthor);
  useEffect(() => { challengeAuthorRef.current = challengeAuthor; }, [challengeAuthor]);

  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [aroundSearchQuery, setAroundSearchQuery] = useState('');
  const [isAroundListening, setIsAroundListening] = useState(false);

  const [incomingSoundAlert, setIncomingSoundAlert] = useState(null);
  const [listeningStream, setListeningStream] = useState(null);
  
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);
  const alarmGainRef = useRef(null);

  const travelers = ['אריק', 'עמית', 'יולי', 'ליאן', 'הראל'];
  
  const [travelerIndex, setTravelerIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('garda-trivia-traveler-idx');
      return saved !== null ? Number(saved) : 0;
    } catch (e) { return 0; }
  });

  const [triviaIndex, setTriviaIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('garda-trivia-index');
      return saved !== null ? Number(saved) : 0;
    } catch (e) { return 0; }
  });

  const [travelerScores, setTravelerScores] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-trivia-scores'));
      if (saved && typeof saved === 'object') return saved;
    } catch (e) {}
    return { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 };
  });

  const [triviaQuestions, setTriviaQuestions] = useState(() => generateMassiveTrivia());
  const [selectedAnswer, setSelectedAnswer]  = useState(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(null);
  const [isTriviaPaused, setIsTriviaPaused] = useState(false);
  const triviaTimerRef = useRef(null);

  const [myLocation, setMyLocation] = useState(null);
  const [radarTrackingMode, setRadarTrackingMode] = useState('manual');
  const [familyLocations, setFamilyLocations] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-family-radar-cache')) || {};
    } catch (e) { return {}; }
  });
  const [activeSosAlert, setActiveSosAlert] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-active-sos')) || null;
    } catch (e) { return null; }
  });
  const watchPositionIdRef = useRef(null);

  const [savedParking, setSavedParking] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-saved-parking')) || null;
    } catch (e) { return null; }
  });
  const [parkingNote, setParkingNote] = useState('');
  const [parkingPhotoUrl, setParkingPhotoUrl] = useState('');
  const [compassTarget, setCompassTarget] = useState('parking');
  const [deviceHeading, setDeviceHeading] = useState(0);
  const [compassPermissionGranted, setCompassPermissionGranted] = useState(false);
  const parkingWatchIdRef = useRef(null);

  const [activeTimer, setActiveTimer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('garda-active-timer')) || null;
    } catch (e) { return null; }
  });
  const [timerRemainingSec, setTimerRemainingSec] = useState(0);
  const [customTimerMinutes, setCustomTimerMinutes] = useState('15');
  const [customTimerTitle, setCustomTimerTitle] = useState('זמן חופשי ומפגש');

  const [isArActive, setIsArActive] = useState(false);
  const [arHeading, setArHeading] = useState(0);
  const [arBearing, setArBearing] = useState(0);

  const [menuOrder, setMenuOrder] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-menu-order'));
      if (Array.isArray(saved) && saved.length === 11) return saved;
    } catch (e) {}
    return ['schedule', 'radar', 'timer', 'parking', 'challenges', 'trivia', 'gallery', 'around', 'tickets', 'emergency', 'appleMusic'];
  });

  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const dbInstanceRef = useRef(null);
  const videoRef = useRef(null);

  const setupOrientationListener = () => {
    const handleOrientation = (e) => {
      let alpha = e.alpha;
      if (e.webkitCompassHeading !== undefined && e.webkitCompassHeading !== null) {
        alpha = e.webkitCompassHeading;
      }
      if (alpha !== undefined && alpha !== null) {
        setDeviceHeading(alpha);
        setArHeading(alpha);
      }
    };
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  };

  const requestCompassPermission = async () => {
    playClickSound();
    try {
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        const response = await DeviceOrientationEvent.requestPermission();
        if (response === 'granted') {
          setCompassPermissionGranted(true);
          setupOrientationListener();
        } else {
          alert('הרשאת המצפן נדחתה בהגדרות הטלפון.');
        }
      } else {
        setCompassPermissionGranted(true);
        setupOrientationListener();
      }
    } catch (err) {
      setupOrientationListener();
    }
  };

  useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined' || typeof DeviceOrientationEvent.requestPermission !== 'function') {
      setCompassPermissionGranted(true);
      setupOrientationListener();
    }
  }, []);

  useEffect(() => {
    if (modalType === 'parking' && navigator.geolocation) {
      parkingWatchIdRef.current = navigator.geolocation.watchPosition(
        (pos) => { setMyLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); },
        (err) => console.warn('Compass GPS watch error', err),
        { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 }
      );
    } else {
      if (parkingWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(parkingWatchIdRef.current);
        parkingWatchIdRef.current = null;
      }
    }
    return () => {
      if (parkingWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(parkingWatchIdRef.current);
        parkingWatchIdRef.current = null;
      }
    };
  }, [modalType]);

  useEffect(() => {
    if (!isArActive) return;
    navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
      .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
      .catch(err => console.log('Camera error', err));

    if (savedParking && myLocation) {
      const brng = calculateBearing(myLocation.lat, myLocation.lng, savedParking.lat, savedParking.lng);
      setArBearing(brng);
    }
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(t => t.stop());
      }
    };
  }, [isArActive, savedParking, myLocation]);

  const playClickSound = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) { audioCtxRef.current = new AudioCtx(); }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') { ctx.resume(); }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };

  const broadcastMyLocation = async (coords) => {
    const currentName = challengeAuthorRef.current || 'אריק';
    const locObj = {
      name: currentName,
      lat: coords.latitude,
      lng: coords.longitude,
      updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    };
    setMyLocation({ lat: coords.latitude, lng: coords.longitude });
    setFamilyLocations(prev => {
      const updated = { ...prev, [currentName]: locObj };
      localStorage.setItem('garda-family-radar-cache', JSON.stringify(updated));
      return updated;
    });
    try {
      await supabase.from('family_radar').upsert([locObj], { onConflict: 'name' });
    } catch (e) {}
    return locObj;
  };

  const triggerSosLostAlert = () => {
    const currentName = challengeAuthorRef.current || 'אריק';
    if (!navigator.geolocation) { alert('שירותי מיקום אינם נתמכים'); return; }
    if (!window.confirm(`להפעיל התראת מצוקה עבור ${currentName}? כל הטלפונים של המשפחה יקבלו התראה ומיקומך יופיע במפה.`)) return;

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await broadcastMyLocation(pos.coords);
        const sosData = {
          name: currentName,
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
        };
        setActiveSosAlert(sosData);
        localStorage.setItem('garda-active-sos', JSON.stringify(sosData));
        startEscalatingAlarm();
        try {
          await supabase.channel('realtime-radar-alerts').send({
            type: 'broadcast', event: 'sos_alert', payload: sosData
          });
        } catch (e) {}
        setModalType('radar');
      },
      () => alert('שגיאה בדגימת מיקום ה-GPS. בדוק שה-GPS מופעל בהגדרות הטלפון.'),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  const clearSosAlert = async () => {
    setActiveSosAlert(null);
    stopEscalatingAlarm();
    localStorage.removeItem('garda-active-sos');
    try {
      await supabase.channel('realtime-radar-alerts').send({ type: 'broadcast', event: 'sos_clear', payload: {} });
    } catch (e) {}
  };

  const startAutoTracking = () => {
    if (!navigator.geolocation) { alert('שירותי מיקום אינם נתמכים'); return; }
    setRadarTrackingMode('auto');
    if (watchPositionIdRef.current !== null) { navigator.geolocation.clearWatch(watchPositionIdRef.current); }
    watchPositionIdRef.current = navigator.geolocation.watchPosition(
      (pos) => broadcastMyLocation(pos.coords),
      (err) => console.warn('GPS Watch error', err),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  const stopAutoTracking = () => {
    setRadarTrackingMode('manual');
    if (watchPositionIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchPositionIdRef.current);
      watchPositionIdRef.current = null;
    }
  };

  const handleManualLocationUpdate = () => {
    if (!navigator.geolocation) { alert('שירותי מיקום אינם נתמכים'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => { broadcastMyLocation(pos.coords); alert('📍 מיקומך עודכן ונשמר במפה לכל המשפחה!'); },
      () => alert('שגיאה בקבלת מיקום GPS.'),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  const adminForceRefreshAllLocations = async () => {
    if (challengeAuthorRef.current !== 'אריק' && !isAdminUnlocked) {
      const pass = window.prompt('הזן קוד מנהל לפעולה זו:');
      if (pass !== '1967') { alert('קוד שגוי!'); return; }
      setIsAdminUnlocked(true);
    }
    try {
      await supabase.channel('realtime-radar-alerts').send({
        type: 'broadcast', event: 'admin_request_location', payload: { requestedBy: 'אריק' }
      });
      alert('📡 נשלחה בקשת רענון מיקום מרחוק לכל בני המשפחה!');
    } catch (e) { alert('שגיאה בשליחת הפקודה'); }
  };

  useEffect(() => {
    return () => {
      if (watchPositionIdRef.current !== null) { navigator.geolocation.clearWatch(watchPositionIdRef.current); }
    };
  }, []);

  useEffect(() => {
    if (!activeTimer || !activeTimer.endTime) { setTimerRemainingSec(0); return; }
    const updateTimer = () => {
      const now = Date.now();
      const diff = Math.max(0, Math.floor((activeTimer.endTime - now) / 1000));
      setTimerRemainingSec(diff);
      if (diff === 0 && !activeTimer.notified) {
        startEscalatingAlarm();
        setActiveTimer(prev => ({ ...prev, notified: true }));
      }
    };
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeTimer]);

  const startEscalatingAlarm = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) { audioCtxRef.current = new AudioCtx(); }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      
      let currentVol = 0.05;
      const rampInterval = setInterval(() => {
        if (!audioCtxRef.current) { clearInterval(rampInterval); return; }
        currentVol = Math.min(1.0, currentVol + 0.08);
        try { gain.gain.setValueAtTime(currentVol, ctx.currentTime); } catch (e) {}
      }, 800);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = osc;
      alarmGainRef.current = gain;
    } catch (e) {}
  };

  const stopEscalatingAlarm = () => {
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
        oscillatorRef.current = null;
      }
    } catch (e) {}
  };

  const verifyAdminAccess = () => {
    if (isAdminUnlocked || challengeAuthorRef.current === 'אריק') return true;
    const pass = window.prompt('הזן קוד מנהל לשליטה בטיימר המשפחתי:');
    if (pass === '1967') { setIsAdminUnlocked(true); return true; }
    alert('גישה חסומה! רק אריק רשאי להגדיר או לבטל את הטיימר.');
    return false;
  };

  const startGlobalTimer = async (minutes, title) => {
    if (!verifyAdminAccess()) return;
    const mins = Number(minutes) || 15;
    if (mins <= 0) { alert('יש להזין מספר דקות תקין.'); return; }

    const timerTitle = title || 'פעילות משפחתית';
    const endTime = Date.now() + mins * 60 * 1000;
    const timerData = { title: timerTitle, durationMinutes: mins, endTime, startedBy: 'אריק', startedAt: Date.now(), notified: false };

    setActiveTimer(timerData);
    localStorage.setItem('garda-active-timer', JSON.stringify(timerData));

    try {
      await supabase.channel('realtime-radar-alerts').send({ type: 'broadcast', event: 'family_timer_start', payload: timerData });
    } catch (e) {}
    alert(`⏱️ טיימר ל-${mins} דקות ("${timerTitle}") הופעל בהצלחה וסונכרן לכל המשפחה!`);
    setModalType(null);
  };

  const cancelGlobalTimer = async () => {
    if (!verifyAdminAccess()) return;
    stopEscalatingAlarm();
    setActiveTimer(null);
    setTimerRemainingSec(0);
    localStorage.removeItem('garda-active-timer');
    try {
      await supabase.channel('realtime-radar-alerts').send({ type: 'broadcast', event: 'family_timer_cancel', payload: {} });
    } catch (e) {}
  };

  useEffect(() => {
    const radarChannel = supabase
      .channel('realtime-radar-db')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setFamilyLocations(prev => {
            const updated = { ...prev, [payload.new.name]: payload.new };
            localStorage.setItem('garda-family-radar-cache', JSON.stringify(updated));
            return updated;
          });
        }
      })
      .subscribe();

    const alertsChannel = supabase
      .channel('realtime-radar-alerts')
      .on('broadcast', { event: 'sos_alert' }, ({ payload }) => {
        if (payload) { setActiveSosAlert(payload); localStorage.setItem('garda-active-sos', JSON.stringify(payload)); startEscalatingAlarm(); }
      })
      .on('broadcast', { event: 'sos_clear' }, () => { setActiveSosAlert(null); stopEscalatingAlarm(); localStorage.removeItem('garda-active-sos'); })
      .on('broadcast', { event: 'sound_alert_with_msg' }, ({ payload }) => {
        if (payload && payload.targetName === (challengeAuthorRef.current || 'אריק')) { setIncomingSoundAlert(payload); startEscalatingAlarm(); }
      })
      .on('broadcast', { event: 'mic_listen_request' }, async ({ payload }) => {
        if (payload && payload.targetName === (challengeAuthorRef.current || 'אריק')) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setListeningStream(stream);
            alert(`🎙️ ${payload.requester} מתחבר כעת להאזנה למיקרופון שלך.`);
          } catch (err) { alert('הגישה למיקרופון נדחתה בהגדרות הדפדפן.'); }
        }
      })
      .on('broadcast', { event: 'admin_request_location' }, () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition((pos) => broadcastMyLocation(pos.coords), () => {}, { enableHighAccuracy: true });
        }
      })
      .on('broadcast', { event: 'family_timer_start' }, ({ payload }) => {
        if (payload && payload.endTime) { setActiveTimer(payload); localStorage.setItem('garda-active-timer', JSON.stringify(payload)); playClickSound(); }
      })
      .on('broadcast', { event: 'family_timer_cancel' }, () => {
        stopEscalatingAlarm(); setActiveTimer(null); setTimerRemainingSec(0); localStorage.removeItem('garda-active-timer');
      })
      .subscribe();

    return () => {
      supabase.removeChannel(radarChannel);
      supabase.removeChannel(alertsChannel);
    };
  }, []);

  const saveSmartParkingLocation = () => {
    if (!navigator.geolocation) { alert('שירותי מיקום אינם נתמכים'); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const parkObj = {
          lat: pos.coords.latitude, lng: pos.coords.longitude,
          note: parkingNote || 'רכב חונה', photo: parkingPhotoUrl || null,
          time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
          date: new Date().toLocaleDateString('he-IL')
        };
        setSavedParking(parkObj);
        localStorage.setItem('garda-saved-parking', JSON.stringify(parkObj));
        alert('🚗 מיקום הרכב נשמר בהצלחה (עובד גם Offline)!');
      },
      () => alert('שגיאה בדגימת מיקום ה-GPS של הרכב'),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 15000 }
    );
  };

  const handleParkingPhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const reader = new FileReader();
      reader.onload = (event) => { setParkingPhotoUrl(event.target.result); };
      reader.readAsDataURL(file);
    } catch (err) {}
  };

  const clearSavedParking = () => {
    if (!window.confirm('האם למחוק את מיקום החניה השמור?')) return;
    setSavedParking(null); setParkingPhotoUrl(''); setParkingNote('');
    localStorage.removeItem('garda-saved-parking');
  };

  useEffect(() => {
    if (modalType || sidebarOpen || isArActive) { document.body.style.overflow = 'hidden'; }
    else { document.body.style.overflow = 'unset'; }
    return () => { document.body.style.overflow = 'unset'; };
  }, [modalType, sidebarOpen, isArActive]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (sidebarOpen) setSidebarOpen(false);
        if (modalType) closeModal();
        if (isArActive) setIsArActive(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen, modalType, isArActive]);

  const handleGlobalClick = (callback) => { playClickSound(); if (typeof callback === 'function') callback(); };
  const closeModal = () => { setViewerItem(null); setModalType(null); setShowGalleryUpload(false); setGalleryCaption(''); };
  const closeDocumentViewer = () => { playClickSound(); setViewerItem(null); setModalType('tickets'); };

  const moveMenuItem = (index, direction) => {
    const newOrder = [...menuOrder];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newOrder.length) return;
    const temp = newOrder[index];
    newOrder[index] = newOrder[targetIndex];
    newOrder[targetIndex] = temp;
    setMenuOrder(newOrder);
    localStorage.setItem('garda-menu-order', JSON.stringify(newOrder));
  };

  const touchStartXRef = useRef(0);
  const touchCurrentXRef = useRef(0);

  const handleTouchStart = (e) => { touchStartXRef.current = e.touches[0].clientX; touchCurrentXRef.current = e.touches[0].clientX; };
  const handleTouchMove = (e) => { touchCurrentXRef.current = e.touches[0].clientX; };
  const handleTouchEnd = (onCloseCallback) => { if (touchCurrentXRef.current - touchStartXRef.current > 120) onCloseCallback(); };

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      if (!navigator.onLine) { setIsOnline(false); return; }
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);
        const { error } = await supabase.from('trip_data').select('id').limit(1).abortSignal(controller.signal);
        clearTimeout(timeoutId);
        setIsOnline(!error);
      } catch (err) { setIsOnline(false); }
    };
    const handleOnline = () => { setIsOnline(true); checkSupabaseConnection(); };
    const handleOffline = () => { setIsOnline(false); };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    checkSupabaseConnection();

    async function fetchTripDataFromCloud() {
      try {
        const { data, error } = await supabase.from('trip_data').select('*').order('id', { ascending: false }).limit(1);
        if (!error && data && data.length > 0 && data[0].data) {
          setTripDays(data[0].data);
          localStorage.setItem('garda-trip-days-cache', JSON.stringify(data[0].data));
        }
      } catch (err) {}
    }
    fetchTripDataFromCloud();
    fetchChallengesFromCloud();

    const galleryChannel = supabase
      .channel('realtime-gallery-changes')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'gallery' }, payload => {
        setGalleryItems(prev => {
          if (prev.some(item => item.id === payload.new.id)) return prev;
          if (payload.new.media_url) cacheMediaOffline(payload.new.media_url);
          return [payload.new, ...prev];
        });
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'gallery' }, payload => {
        setGalleryItems(prev => prev.filter(item => item.id !== payload.old.id));
      })
      .subscribe();

    const challengesChannel = supabase
      .channel('realtime-challenges-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'challenges_log' }, () => { fetchChallengesFromCloud(); })
      .subscribe();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      supabase.removeChannel(galleryChannel);
      supabase.removeChannel(challengesChannel);
      if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    };
  }, []);

  const fetchChallengesFromCloud = async () => {
    try {
      const { data, error } = await supabase.from('challenges_log').select('*');
      if (!error && data) {
        const mapped = {};
        data.forEach(item => {
          mapped[item.date_key] = { completed: item.completed, text: item.text, author: item.author, time: item.time, date: item.date_key };
        });
        setCompletedChallenges(mapped);
        localStorage.setItem('garda-challenges-log', JSON.stringify(mapped));
      }
    } catch (e) {}
  };

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('garda-ticket-folders'));
      if (Array.isArray(saved) && saved.length) setFolders(saved);
    } catch (e) {}
    initTickets();
    loadGalleryFromCloud();
  }, []);

  useEffect(() => { loadFiles(activeFolder); }, [activeFolder]);

  const openDb = () => {
    if (dbInstanceRef.current) return Promise.resolve(dbInstanceRef.current);
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('gardaTripMasterDB', 2);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('files')) {
          const st = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
          st.createIndex('folder', 'folder', { unique: false });
        }
      };
      req.onsuccess = () => { dbInstanceRef.current = req.result; resolve(req.result); };
      req.onerror = () => reject(req.error);
    });
  };

  const initTickets = async () => {
    try {
      const db = await openDb();
      const tx = db.transaction('files', 'readonly');
      const req = tx.objectStore('files').getAll();
      req.onsuccess = async () => {
        const all = req.result || [];
        const writeTx = db.transaction('files', 'readwrite');
        const store = writeTx.objectStore('files');
        DEFAULT_DOCUMENTS.forEach(doc => {
          if (!all.some(f => f.title === doc.title || (doc.isFlightInfo && f.isFlightInfo) || (doc.isInsuranceInfo && f.isInsuranceInfo) || (doc.isCarVoucher && f.isCarVoucher) || (doc.isHotelInfo && f.isHotelInfo) || (doc.isGardalandTicket && f.isGardalandTicket) || (doc.isMovielandTicket && f.isMovielandTicket))) {
            store.add(doc);
          }
        });
        writeTx.oncomplete = () => loadFiles(activeFolder);
      };
    } catch (e) {}
  };

  const loadFiles = async (folder) => {
    try {
      const db = await openDb();
      const req = db.transaction('files', 'readonly').objectStore('files').index('folder').getAll(folder);
      req.onsuccess = () => {
        const dbFiles = req.result || [];
        const defaultsForFolder = DEFAULT_DOCUMENTS.filter(d => d.folder === folder);
        const merged = [...dbFiles];
        defaultsForFolder.forEach(def => {
          if (!merged.some(m => m.title === def.title)) merged.push(def);
        });
        setTicketFiles(merged.sort((a, b) => (b.created || 0) - (a.created || 0)));
      };
    } catch (e) {
      setTicketFiles(DEFAULT_DOCUMENTS.filter(d => d.folder === folder));
    }
  };

  const loadGalleryFromCloud = async () => {
    try {
      const { data, error } = await supabase.from('gallery').select('*').order('created', { ascending: false });
      if (!error && data) {
        setGalleryItems(data);
        localStorage.setItem('garda-gallery-cache', JSON.stringify(data));
      } else {
        const local = JSON.parse(localStorage.getItem('garda-gallery-cache')) || [];
        setGalleryItems(local);
      }
    } catch (e) {
      const local = JSON.parse(localStorage.getItem('garda-gallery-cache')) || [];
      setGalleryItems(local);
    }
  };

  const handleFileUpload = async (e) => {
    const files = [...e.target.files];
    if (!files.length) return;
    try {
      const db = await openDb();
      const tx = db.transaction('files', 'readwrite');
      const store = tx.objectStore('files');
      files.forEach(file => {
        store.add({
          folder: selectedUploadFolder || activeFolder,
          title: newTicketTitle || file.name,
          name: file.name, type: file.type, size: file.size,
          created: Date.now(), blob: file
        });
      });
      tx.oncomplete = () => { setNewTicketTitle(''); setShowUploadBox(false); loadFiles(activeFolder); };
    } catch (err) {}
  };

  const runLocalAITagger = (fileName, caption) => {
    const text = (fileName + ' ' + (caption || '')).toLowerCase();
    if (text.includes('pizza') || text.includes('food') || text.includes('פיצה')) return '🍕 אוכל';
    if (text.includes('gardaland') || text.includes('park')) return '🎢 אטרקציה';
    if (text.includes('gelato') || text.includes('גלידה')) return '🍦 גלידה';
    return '📸 משפחה';
  };

  const handleDirectGalleryUpload = async (photoFile) => {
    if (!photoFile) return;
    try {
      const filePath = `gallery_${Date.now()}_${photoFile.name}`;
      const aiTag = runLocalAITagger(photoFile.name, galleryCaption);
      let publicUrl = null;
      try {
        const { error: uploadErr } = await supabase.storage.from('trip-photos').upload(filePath, photoFile);
        if (!uploadErr) {
          const { data: publicUrlData } = supabase.storage.from('trip-photos').getPublicUrl(filePath);
          publicUrl = publicUrlData?.publicUrl;
        }
      } catch (err) {}

      if (!publicUrl) publicUrl = URL.createObjectURL(photoFile);
      await cacheMediaOffline(publicUrl);

      const newItem = {
        id: Date.now(), name: photoFile.name, type: photoFile.type, size: photoFile.size,
        day_index: activeDay, caption: `${aiTag} | ${galleryCaption || `יום ${activeDay + 1}`}`,
        author: galleryUploaderName || 'אריק', created: Date.now(), media_url: publicUrl
      };

      setGalleryItems(prev => [newItem, ...prev]);
      localStorage.setItem('garda-gallery-cache', JSON.stringify([newItem, ...galleryItems]));

      try {
        await supabase.from('gallery').insert([newItem]);
      } catch (e) {}

      setGalleryCaption(''); setShowGalleryUpload(false);
      alert('📸 התמונה הועלתה בהצלחה לאלבום!');
    } catch (e) { alert('שגיאה בשמירת התמונה'); }
  };

  const saveDailyChallenge = async (photoFile = null) => {
    const currentDayObj = tripDays[activeDay] || tripDays[0];
    const dayKey = currentDayObj?.date || String(activeDay);
    const timeNow = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
    const textNote = challengeNote || 'אתגר הושלם בהצלחה! 🎉';
    const authorName = challengeAuthor || 'משפחה';

    const updated = {
      ...completedChallenges,
      [dayKey]: { completed: true, text: textNote, author: authorName, time: timeNow, date: currentDayObj?.date }
    };
    setCompletedChallenges(updated);
    localStorage.setItem('garda-challenges-log', JSON.stringify(updated));

    try {
      await supabase.from('challenges_log').upsert([{
        date_key: dayKey, completed: true, text: textNote, author: authorName, time: timeNow
      }], { onConflict: 'date_key' });
    } catch (e) {}

    if (photoFile) {
      try {
        const filePath = `challenge_${Date.now()}_${photoFile.name}`;
        let publicUrl = null;
        try {
          await supabase.storage.from('trip-photos').upload(filePath, photoFile);
          const { data: publicUrlData } = supabase.storage.from('trip-photos').getPublicUrl(filePath);
          publicUrl = publicUrlData?.publicUrl;
        } catch (err) {}
        if (!publicUrl) publicUrl = URL.createObjectURL(photoFile);
        await cacheMediaOffline(publicUrl);

        const newItem = {
          id: Date.now(), name: `אתגר: ${currentDayObj?.title}`, type: photoFile.type, size: photoFile.size,
          day_index: activeDay, caption: `🎯 אתגר: ${textNote}`, author: authorName, created: Date.now(), media_url: publicUrl
        };
        setGalleryItems(prev => [newItem, ...prev]);
        try { await supabase.from('gallery').insert([newItem]); } catch (e) {}
      } catch (e) {}
    }

    setChallengeNote('');
    alert('🏆 כל הכבוד! האתגר בוצע ונשמר ביומן האתגרים המשפחתי!');
    closeModal();
  };

  const resetSingleChallenge = async (dayIdx) => {
    const pass = window.prompt('הזן קוד מנהל לאפוס המשימה:');
    if (pass !== '1967') { alert('קוד שגוי!'); return; }
    const targetDay = tripDays[dayIdx] || tripDays[0];
    const dayKey = targetDay?.date || String(dayIdx);

    const updated = { ...completedChallenges };
    delete updated[dayKey]; delete updated[String(dayIdx)];
    setCompletedChallenges(updated);
    localStorage.setItem('garda-challenges-log', JSON.stringify(updated));
    try { await supabase.from('challenges_log').delete().eq('date_key', dayKey); } catch (e) {}
    if (modalType === 'questModal') closeModal();
  };

  const deleteFile = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('למחוק כרטיס זה לצמיתות?')) return;
    try {
      const db = await openDb();
      const tx = db.transaction('files', 'readwrite');
      tx.objectStore('files').delete(id);
      tx.oncomplete = () => loadFiles(activeFolder);
    } catch (err) {
      setTicketFiles(prev => prev.filter(f => f.id !== id));
    }
  };

  const addNewFolder = () => {
    const name = window.prompt('שם התקייה החדשה:');
    if (!name || !name.trim()) return;
    const clean = '📁 ' + name.trim();
    if (!folders.includes(clean)) {
      const updated = [...folders, clean];
      setFolders(updated);
      localStorage.setItem('garda-ticket-folders', JSON.stringify(updated));
      setActiveFolder(clean);
    }
  };

  const nextTriviaQuestion = () => {
    if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    setSelectedAnswer(null); setIsAnswerCorrect(null);
    setTriviaIndex(prev => (prev + 1) % triviaQuestions.length);
    setTravelerIndex(prev => (prev + 1) % travelers.length);
  };

  const handleTriviaAnswer = (optionIdx) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optionIdx);
    const currentQ = triviaQuestions[triviaIndex];
    const currentTraveler = travelers[travelerIndex];

    if (optionIdx === currentQ.correct) {
      setIsAnswerCorrect(true);
      setTravelerScores(prev => ({ ...prev, [currentTraveler]: (prev[currentTraveler] || 0) + 10 }));
    } else {
      setIsAnswerCorrect(false);
    }

    if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    triviaTimerRef.current = setTimeout(() => { nextTriviaQuestion(); }, 1500);
  };

  const resetTriviaGame = () => {
    const pass = window.prompt('הזן קוד מנהל לאפוס משחק הטריוויה:');
    if (pass !== '1967') { alert('קוד שגוי!'); return; }
    if (triviaTimerRef.current) clearTimeout(triviaTimerRef.current);
    const newQuestions = generateMassiveTrivia();
    setTriviaQuestions(newQuestions); setTriviaIndex(0); setTravelerIndex(0);
    setSelectedAnswer(null); setIsAnswerCorrect(null);
    const initialScores = { 'אריק': 0, 'עמית': 0, 'יולי': 0, 'ליאן': 0, 'הראל': 0 };
    setTravelerScores(initialScores);
    localStorage.setItem('garda-trivia-scores', JSON.stringify(initialScores));
    localStorage.setItem('garda-trivia-index', '0');
    localStorage.setItem('garda-trivia-traveler-idx', '0');
    alert('המשחק והניקוד אופסו בהצלחה!');
  };

  const handleToggleAdminQuests = () => {
    if (isAdminUnlocked) { setIsAdminUnlocked(false); return; }
    const pass = window.prompt('הזן קוד מנהל לחשיפת כל המשימות:');
    if (pass === '1967') { setIsAdminUnlocked(true); alert('הרשאת מנהל הופעלה!'); }
    else { alert('קוד שגוי!'); }
  };

  const formatTimerClock = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const day = tripDays[activeDay] || tripDays[0];
  const isCurrentDayCompleted = completedChallenges[day?.date]?.completed || completedChallenges[String(activeDay)]?.completed;

  const isDark = themeMode === 'dark';
  const currentBgMain = isDark ? '#000000' : '#f8fafc';
  const currentCardBg = isDark ? '#1c1c1e' : '#ffffff';
  const currentTextColor = isDark ? '#f5f5f7' : '#0f172a';
  const currentBorderColor = isDark ? '#2c2c2e' : '#e2e8f0';
  const currentShadow = isDark ? '0 10px 30px rgba(0, 0, 0, 0.7)' : '0 10px 30px rgba(15, 23, 42, 0.06)';

  const bgMain = customTheme ? customTheme.bgMain : currentBgMain;
  const cardBg = customTheme ? customTheme.cardBg : currentCardBg;
  const textColor = customTheme ? customTheme.textColor : currentTextColor;
  const borderColor = customTheme ? customTheme.borderColor : currentBorderColor;

  const textSub = isDark ? '#98989d' : '#64748b';
  const blockText = textColor; 
  const cardShadow = customTheme ? '0 10px 30px rgba(0,0,0,0.3)' : currentShadow;

  const primaryGradient = 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)';

  const saveCustomTheme = () => {
    const newTheme = { bgMain: tempBgMain, cardBg: tempCardBg, textColor: tempTextColor, borderColor: tempBorderColor };
    setCustomTheme(newTheme);
    localStorage.setItem('garda-custom-theme', JSON.stringify(newTheme));
    setShowThemeBuilder(false);
    alert('🎨 העיצוב החדשני נשמר בהצלחה!');
  };

  const resetCustomTheme = () => {
    setCustomTheme(null);
    localStorage.removeItem('garda-custom-theme');
    setShowThemeBuilder(false);
  };

  const renderMenuItem = (id, index) => {
    const menuConfigs = {
      schedule: { label: 'מסלול ימי הטיול', icon: '📅', action: () => { setSidebarOpen(false); closeModal(); } },
      timer: { label: `טיימר משפחתי ${activeTimer ? `(${formatTimerClock(timerRemainingSec)})` : ''}`, icon: TIMER_SVG, action: () => { setSidebarOpen(false); setModalType('timer'); } },
      radar: { label: 'רדאר משפחתי חי', icon: '🧭', action: () => { setSidebarOpen(false); setModalType('radar'); } },
      parking: { label: 'שמירת מיקום רכב חכם', icon: '🚗', action: () => { setSidebarOpen(false); setModalType('parking'); } },
      challenges: { label: 'יומן אתגרים ובדיחות', icon: '🏆', action: () => { setSidebarOpen(false); setModalType('challengesLog'); } },
      trivia: { label: 'טריויה חכמה לדרך', icon: '🧠', action: () => { setSidebarOpen(false); setModalType('trivia'); } },
      gallery: { label: 'יומן ואלבום תמונות משפחתי', icon: '📸', action: () => { setSidebarOpen(false); setModalType('gallery'); } },
      around: { label: 'סביבי (Around Me)', icon: '📍', action: () => { setSidebarOpen(false); setModalType('around'); } },
      tickets: { label: 'ארנק כרטיסים ומסמכים', icon: '🎟️', action: () => { setSidebarOpen(false); setModalType('tickets'); } },
      emergency: { label: 'מספרי חירום', icon: '🆘', action: () => { setSidebarOpen(false); setModalType('emergency'); } },
      appleMusic: { label: 'פלייליסט נסיעה (Apple Music)', icon: '🎵', action: () => { setSidebarOpen(false); setModalType('appleMusicModal'); } }
    };

    const cfg = menuConfigs[id];
    if (!cfg) return null;

    return (
      <div key={id} style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', boxSizing: 'border-box' }}>
        <button 
          onClick={() => handleGlobalClick(cfg.action)} 
          style={{ 
            background: cardBg,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: `1px solid ${borderColor}`,
            color: textColor,
            borderRadius: '16px',
            padding: '14px 18px',
            fontWeight: '600',
            fontSize: '15px',
            textAlign: 'right',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            boxSizing: 'border-box',
            width: '100%',
            boxShadow: cardShadow,
            transition: 'transform 0.15s ease'
          }}
        >
          <span style={{ fontSize: '18px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#2c2c2e' : '#f1f5f9', borderRadius: '10px', flexShrink: 0 }}>
            {cfg.icon}
          </span>
          <span style={{ flex: 1, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cfg.label}</span>
          <span style={{ color: textSub, fontSize: '14px' }}>‹</span>
        </button>

        {isEditingMenu && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', flexShrink: 0 }}>
            <button onClick={() => moveMenuItem(index, 'up')} style={arrowBtnStyle}>▲</button>
            <button onClick={() => moveMenuItem(index, 'down')} style={arrowBtnStyle}>▼</button>
          </div>
        )}
      </div>
    );
  };

  const activeCompassCoords = compassTarget === 'parking' && savedParking
    ? { lat: savedParking.lat, lng: savedParking.lng, name: savedParking.note }
    : HOTEL_COORDINATES;

  const activeCompassBearing = myLocation && activeCompassCoords
    ? calculateBearing(myLocation.lat, myLocation.lng, activeCompassCoords.lat, activeCompassCoords.lng)
    : 0;

  const activeCompassDistance = myLocation && activeCompassCoords
    ? calculateDistanceKm(myLocation.lat, myLocation.lng, activeCompassCoords.lat, activeCompassCoords.lng)
    : 'דוגם GPS...';

  const compassArrowRotation = (activeCompassBearing - deviceHeading + 360) % 360;

  return (
    <div style={{ 
      background: bgMain, 
      minHeight: '100vh', 
      width: '100%', 
      maxWidth: '100vw', 
      overflowX: 'hidden', 
      fontFamily: 'system-ui, -apple-system, sans-serif', 
      color: textColor, 
      direction: 'rtl', 
      paddingBottom: '40px', 
      boxSizing: 'border-box', 
      position: 'relative' 
    }}>
      
      {incomingSoundAlert && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 4000, background: 'rgba(0,0,0,0.85)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', direction: 'rtl', boxSizing: 'border-box'
        }}>
          <div style={{
            background: cardBg, color: textColor, padding: '28px', borderRadius: '24px',
            width: '100%', maxWidth: '400px', border: '2px solid #ef4444', textAlign: 'center',
            boxShadow: '0 25px 50px rgba(239,68,68,0.4)', boxSizing: 'border-box'
          }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🚨</span>
            <h2 style={{ color: '#ef4444', margin: '0 0 8px', fontSize: '22px' }}>התראה דחופה!</h2>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0 0 10px' }}>
              {incomingSoundAlert.senderName} דורש/ת תשומת לב מיידית:
            </p>
            <div style={{ background: isDark ? '#3f1515' : '#fee2e2', color: '#ef4444', padding: '14px', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold', marginBottom: '20px' }}>
              "{incomingSoundAlert.message}"
            </div>
            <button
              onClick={() => { stopEscalatingAlarm(); setIncomingSoundAlert(null); }}
              style={{
                width: '100%', padding: '14px', background: '#22c55e', color: '#fff',
                border: 'none', borderRadius: '14px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(34,197,94,0.3)', boxSizing: 'border-box'
              }}
            >
              הפסק צפצוף וצור קשר ✓
            </button>
          </div>
        </div>
      )}

      {listeningStream && (
        <div style={{
          position: 'fixed', bottom: '20px', left: '20px', right: '20px', zIndex: 3500,
          background: '#ef4444', color: '#fff', padding: '14px 18px', borderRadius: '16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 10px 25px rgba(239,68,68,0.4)', boxSizing: 'border-box'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '20px', flexShrink: 0 }}>🎙️</span>
            <span style={{ fontSize: '13px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>מישהו מאזין כעת למיקרופון שלך (שידור חי)</span>
          </div>
          <button
            onClick={() => { listeningStream.getTracks().forEach(track => track.stop()); setListeningStream(null); }}
            style={{ background: '#fff', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '10px', fontWeight: 'bold', fontSize: '12px', cursor: 'pointer', flexShrink: 0 }}
          >
            נתק מיקרופון ✕
          </button>
        </div>
      )}

      {/* Modern Floating Header Bar */}
      <div style={{
        background: cardBg,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        color: textColor,
        padding: '12px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: cardShadow
      }}>
        <button 
          onClick={() => handleGlobalClick(() => setSidebarOpen(true))}
          style={{
            background: isDark ? '#2c2c2e' : '#f1f5f9', 
            border: 'none', 
            width: '42px', 
            height: '42px',
            borderRadius: '12px', 
            fontSize: '20px', 
            fontWeight: '900', 
            cursor: 'pointer',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            color: textColor,
            flexShrink: 0
          }}
          title="תפריט מהיר"
        >
          ☰
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', background: isOnline ? '#22c55e' : '#f59e0b' }}></span>
          <span style={{ color: textColor, fontWeight: '600', fontSize: '13px' }}>{isOnline ? 'מקוון' : 'לא מקוון'}</span>
        </div>
      </div>

      {activeSosAlert && (
        <div
          onClick={() => handleGlobalClick(() => setModalType('radar'))}
          style={{
            background: '#ef4444', color: '#ffffff', padding: '12px 20px',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', fontWeight: 'bold', fontSize: '14px',
            boxShadow: '0 6px 16px rgba(239,68,68,0.35)', boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: '18px', flexShrink: 0 }}>🚨</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><b>{activeSosAlert.name} הלך/ה לאיבוד!</b> לחץ כאן לפתיחת מפת החירום</span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); clearSosAlert(); }}
            style={{ background: 'rgba(0,0,0,0.25)', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', cursor: 'pointer', flexShrink: 0 }}
          >
            אישור ✓
          </button>
        </div>
      )}

      {activeTimer && (
        <div
          onClick={() => handleGlobalClick(() => setModalType('timer'))}
          style={{
            background: timerRemainingSec > 0 ? '#f59e0b' : '#ef4444', color: '#ffffff',
            padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
            <span style={{ flexShrink: 0 }}>⏱️</span>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{activeTimer.title}:</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <span style={{ fontSize: '15px', letterSpacing: '1px', background: 'rgba(0,0,0,0.2)', padding: '2px 8px', borderRadius: '6px' }}>
              {formatTimerClock(timerRemainingSec)}
            </span>
            <span style={{ fontSize: '11px' }}>פתח ⚙️</span>
          </div>
        </div>
      )}

      {/* Hero Banner with Glassmorphism */}
      <div style={{
        margin: '16px 16px 12px 16px',
        borderRadius: '24px',
        background: primaryGradient,
        color: '#ffffff',
        padding: '24px 20px',
        boxShadow: '0 15px 35px rgba(37, 99, 235, 0.35)',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
        width: 'calc(100% - 32px)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div 
            onClick={() => handleGlobalClick(() => setModalType('radar'))}
            style={{ cursor: 'pointer', flex: 1, minWidth: 0 }}
          >
            <h1 style={{ fontSize: '24px', fontWeight: '900', margin: 0, letterSpacing: '-0.02em', color: '#fff' }}>
              🇮🇹 אגם Garda וונציה
            </h1>
          </div>
          
          <div 
            onClick={() => handleGlobalClick(() => setModalType('weatherModal'))}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              padding: '8px 14px',
              borderRadius: '14px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              flexShrink: 0
            }}
            title="תחזית מזג אוויר"
          >
            <span style={{ fontSize: '16px', fontWeight: '800' }}>{weatherData.temp}</span>
            <span style={{ fontSize: '14px' }}>☀️</span>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: '1px solid rgba(255, 255, 255, 0.25)' }}>
          <button
            onClick={triggerSosLostAlert}
            style={{
              padding: '12px', borderRadius: '14px', background: '#ffffff', color: '#ef4444',
              border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              boxShadow: '0 6px 15px rgba(0,0,0,0.1)', boxSizing: 'border-box'
            }}
          >
            🚨 הלכתי לאיבוד! (SOS)
          </button>
          <button
            onClick={() => handleGlobalClick(() => setModalType('radar'))}
            style={{
              padding: '12px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.2)', color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', backdropFilter: 'blur(4px)', boxSizing: 'border-box'
            }}
          >
            🧭 מפת המשפחה
          </button>
        </div>
      </div>

      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0, 0, 0, 0.5)', zIndex: 2500, width: '100vw', height: '100vh', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}
        />
      )}
      
      <aside 
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => handleTouchEnd(() => setSidebarOpen(false))}
        style={{
          position: 'fixed', top: 0, bottom: 0, right: 0, width: '320px', maxWidth: '85vw',
          background: cardBg, zIndex: 2600, boxShadow: '-20px 0 50px rgba(0,0,0,0.3)',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)', padding: '24px 18px',
          display: 'flex', flexDirection: 'column', gap: '12px', borderLeft: `1px solid ${borderColor}`, boxSizing: 'border-box', overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '8px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: '800', margin: 0, color: textColor, letterSpacing: '-0.02em' }}>תפריט מהיר</h3>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              onClick={() => handleGlobalClick(() => setThemeMode(isDark ? 'light' : 'dark'))}
              style={{ background: isDark ? '#374155' : '#e2e8f0', color: textColor, border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
            >
              {isDark ? '☀️ בהיר' : '🌙 כהה'}
            </button>
            <button onClick={() => handleGlobalClick(() => setSidebarOpen(false))} style={{ width: '36px', height: '36px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
          </div>
        </div>

        {menuOrder.map((id, index) => renderMenuItem(id, index))}
      </aside>

      {/* Main Container */}
      <main style={{ padding: '20px 16px', maxWidth: '600px', width: '100%', margin: 'auto', boxSizing: 'border-box' }}>
        
        {/* Day Pills Bar */}
        <div style={{ 
          display: 'flex', 
          gap: '8px', 
          overflowX: 'auto', 
          paddingBottom: '12px', 
          marginBottom: '20px', 
          scrollbarWidth: 'none', 
          width: '100%', 
          boxSizing: 'border-box' 
        }}>
          {tripDays.map((d, i) => (
            <button
              key={i}
              onClick={() => handleGlobalClick(() => setActiveDay(i))}
              style={{
                flex: '1 0 auto',
                padding: '12px 16px',
                borderRadius: '16px',
                background: activeDay === i ? primaryGradient : cardBg,
                color: activeDay === i ? '#ffffff' : textColor,
                border: `1px solid ${activeDay === i ? 'transparent' : borderColor}`,
                fontSize: '13px',
                fontWeight: '700',
                cursor: 'pointer',
                boxShadow: activeDay === i ? '0 8px 20px rgba(37, 99, 235, 0.35)' : cardShadow,
                transition: 'all 0.2s ease',
                textAlign: 'center',
                boxSizing: 'border-box'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>

        <section style={{ width: '100%', boxSizing: 'border-box' }}>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: textColor }}>{day.icon} {day.title}</h2>
          </div>

          {/* Daily Quest Box */}
          <div 
            onClick={() => handleGlobalClick(() => setModalType('questModal'))}
            style={{
              background: cardBg,
              border: `1px solid ${borderColor}`,
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '20px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              boxSizing: 'border-box',
              width: '100%',
              boxShadow: cardShadow
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <span style={{ display: 'block', fontSize: '11px', fontWeight: '800', color: '#10b981', marginBottom: '2px', textTransform: 'uppercase' }}>
                  {isCurrentDayCompleted ? 'אתגר היום הושלם בהצלחה! 🎉' : 'אתגר היום היומי:'}
                </span>
                <strong style={{ display: 'block', fontSize: '14px', color: textColor, fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {day.challenge}
                </strong>
              </div>
            </div>

            <span style={{
              background: isDark ? '#2c2c2e' : '#f1f5f9',
              color: textColor,
              padding: '8px 14px', borderRadius: '12px',
              fontSize: '12px', fontWeight: '700', flexShrink: '0'
            }}>
              {isCurrentDayCompleted ? 'צפה ✏️' : 'פתח 🚀'}
            </span>
          </div>

          {/* Stops Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', boxSizing: 'border-box' }}>
            {day.stops && day.stops.map((stop, idx) => (
              <div key={idx} style={{ background: cardBg, border: `1px solid ${borderColor}`, borderRadius: '20px', padding: '20px', boxSizing: 'border-box', width: '100%', boxShadow: cardShadow }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', gap: '8px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', margin: 0, color: textColor, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{stop.name}</h3>
                  <span style={{ fontSize: '12px', fontWeight: '700', color: textSub, background: isDark ? '#2c2c2e' : '#f1f5f9', padding: '6px 10px', borderRadius: '10px', flexShrink: 0 }}>{stop.time}</span>
                </div>
                <p style={{ fontSize: '14px', color: textSub, margin: '6px 0 16px', lineHeight: '1.5' }}>{stop.note}</p>

                {stop.food && (
                  <div style={{ fontSize: '13px', background: isDark ? '#221e1d' : '#fffbeb', color: isDark ? '#fde047' : '#92400e', padding: '12px 16px', borderRadius: '14px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px', border: '1px solid #fde68a', boxSizing: 'border-box' }}>
                    <span><b>🍴 המלצה קולינרית:</b> {stop.food.name}</span>
                    <a 
                      href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.food.dest)}&navigate=yes`}
                      onClick={() => playClickSound()}
                      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px', background: '#fff', color: '#000', fontWeight: '700', fontSize: '12px', padding: '8px 14px', borderRadius: '10px', textDecoration: 'none', alignSelf: 'flex-start', boxShadow: '0 4px 10px rgba(0,0,0,0.08)' }}
                    >
                      {WAZE_SVG} נווט למסעדה בים Waze
                    </a>
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', paddingTop: '14px', borderTop: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>
                  <a href={`https://maps.apple.com/?q=${encodeURIComponent(stop.dest)}`} target="_blank" rel="noreferrer" onClick={() => playClickSound()} style={{ ...navBtnStyle, background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, textDecoration: 'none' }}>
                    {MAPS_SVG} Apple Maps
                  </a>
                  <a href={`https://www.waze.com/ul?q=${encodeURIComponent(stop.dest)}&navigate=yes`} onClick={() => playClickSound()} style={{ ...navBtnStyle, background: '#33ccff', color: '#000000', textDecoration: 'none' }}>
                    {WAZE_SVG} Waze
                  </a>
                </div>

                <div style={{ marginTop: '10px', display: 'flex', gap: '10px', boxSizing: 'border-box' }}>
                  <button 
                    onClick={() => handleGlobalClick(() => setModalType('parking'))}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                      padding: '10px 14px', borderRadius: '12px', background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor,
                      border: `1px solid ${borderColor}`, fontSize: '12px', fontWeight: '700', cursor: 'pointer', boxSizing: 'border-box'
                    }}
                  >
                    🚗 שמור/מצא רכב חונה
                  </button>
                  <button 
                    onClick={() => handleGlobalClick(() => setModalType('timer'))}
                    style={{ border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: '#f59e0b', borderRadius: '12px', padding: '0 14px', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                    title="טיימר מרכזי"
                  >
                    {TIMER_SVG}
                  </button>
                </div>
              </div>
            ))}

            {/* Quick Hotel Return Button */}
            <div style={{ marginTop: '10px' }}>
              <a 
                href={`https://www.waze.com/ul?q=${encodeURIComponent(HOTEL_ADDRESS)}&navigate=yes`}
                onClick={() => playClickSound()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '16px',
                  background: 'linear-gradient(135deg, #00d2ff 0%, #3a7bd5 100%)',
                  color: '#ffffff',
                  borderRadius: '20px',
                  textDecoration: 'none',
                  fontWeight: '800',
                  fontSize: '15px',
                  boxShadow: '0 10px 25px rgba(0,210,243,0.3)',
                  boxSizing: 'border-box'
                }}
              >
                {WAZE_SVG} חזור למלון (Bio Agriturismo Vojon) ב-Waze
              </a>
            </div>

          </div>
        </section>
      </main>

      {/* Modals with Clean Glassmorphism */}
      {modalType === 'timer' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <small style={{ color: '#f59e0b', fontWeight: '800', fontSize: '11px', textTransform: 'uppercase' }}>FAMILY SYNC TIMER</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '800', color: textColor }}>⏱️ טיימר משפחתי</h2>
              </div>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>

            {activeTimer ? (
              <div style={{ background: cardBg, borderRadius: '24px', padding: '24px', textAlign: 'center', marginBottom: '16px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#f59e0b', display: 'block', marginBottom: '8px' }}>
                  🎯 פעילות: {activeTimer.title}
                </span>
                <div style={{ fontSize: '48px', fontWeight: '900', color: timerRemainingSec > 0 ? textColor : '#ef4444', letterSpacing: '2px', margin: '12px 0' }}>
                  {formatTimerClock(timerRemainingSec)}
                </div>
                <small style={{ color: textSub, fontSize: '12px', display: 'block', marginBottom: '20px' }}>
                  מוגדר ע"י אריק (סה"כ {activeTimer.durationMinutes} דקות)
                </small>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {timerRemainingSec === 0 && (
                    <button onClick={stopEscalatingAlarm} style={{ padding: '10px 16px', borderRadius: '12px', background: '#22c55e', color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>🛑 עצור אזעקה</button>
                  )}
                  <button onClick={cancelGlobalTimer} style={{ padding: '10px 16px', borderRadius: '12px', background: '#ef4444', color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>⏹️ בטל טיימר</button>
                  <button onClick={() => startGlobalTimer(Number(activeTimer.durationMinutes) + 5, activeTimer.title)} style={{ padding: '10px 16px', borderRadius: '12px', background: '#f59e0b', color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>➕ הוסף 5 דקות</button>
                </div>
              </div>
            ) : (
              <div style={{ background: cardBg, borderRadius: '24px', padding: '20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '14px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '6px' }}>שם הפעילות:</label>
                  <input type="text" placeholder="לדוגמה: זמן חופשי בפארק..." value={customTimerTitle} onChange={(e) => setCustomTimerTitle(e.target.value)} style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '6px' }}>הגדר זמן בספרות (דקות):</label>
                  <input type="number" value={customTimerMinutes} onChange={(e) => setCustomTimerMinutes(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, boxSizing: 'border-box', fontWeight: '800', fontSize: '18px', textAlign: 'center', marginBottom: '10px', outline: 'none' }} />
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {['10', '15', '30', '45'].map((mins) => (
                      <button key={mins} onClick={() => setCustomTimerMinutes(mins)} style={{ padding: '10px 4px', borderRadius: '10px', background: customTimerMinutes === mins ? primaryGradient : (isDark ? '#2c2c2e' : '#f1f5f9'), color: customTimerMinutes === mins ? '#fff' : textColor, border: `1px solid ${borderColor}`, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>{mins} דק'</button>
                    ))}
                  </div>
                </div>
                <button onClick={() => startGlobalTimer(customTimerMinutes, customTimerTitle)} style={{ padding: '14px', borderRadius: '14px', background: primaryGradient, color: '#fff', border: 'none', fontWeight: '800', fontSize: '15px', cursor: 'pointer', marginTop: '6px', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>🚀 הפעל טיימר משפחתי</button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalType === 'radar' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain, overflowY: 'auto' }}>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%', boxSizing: 'border-box' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, padding: '16px 20px', background: cardBg, position: 'sticky', top: 0, zIndex: 100, boxSizing: 'border-box' }}>
              <div>
                <small style={{ color: textSub, fontWeight: '800', fontSize: '10px', textTransform: 'uppercase' }}>GPS LIVE RADAR</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '18px', fontWeight: '800', color: textColor }}>📡 רדאר משפחתי חי ומפת האגם</h2>
              </div>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>

            <div style={{ width: '100%', height: '340px', position: 'relative', background: '#0f172a', flexShrink: 0 }}>
              <iframe title="Family Radar Map" srcDoc={generateMapHTML(familyLocations, myLocation, activeSosAlert, isDark)} style={{ width: '100%', height: '100%', border: 'none' }} />
            </div>

            <div style={{ flex: 1, background: bgMain, padding: '20px 16px 60px 16px', boxSizing: 'border-box', width: '100%' }}>
              <div style={{ background: cardBg, borderRadius: '20px', padding: '18px', marginBottom: '16px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
                    <span style={{ fontSize: '20px', flexShrink: 0 }}>👤</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <strong style={{ fontSize: '15px', color: textColor, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }}>פרופיל פעיל: {challengeAuthor || 'אריק'}</strong>
                      <small style={{ color: textSub, fontSize: '12px' }}>סטטוס GPS: {radarTrackingMode === 'auto' ? '🟢 שידור רציף' : (myLocation ? '🟡 מיקום נשמר' : '⚪ טרם שותף')}</small>
                    </div>
                  </div>
                  <button onClick={triggerSosLostAlert} style={{ padding: '8px 12px', borderRadius: '10px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', fontWeight: '800', fontSize: '11px', cursor: 'pointer', flexShrink: 0 }}>🚨 הלכתי לאיבוד!</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button onClick={handleManualLocationUpdate} style={{ padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>📍 עדכן מיקום יזום</button>
                  <button onClick={() => { if (radarTrackingMode === 'auto') { stopAutoTracking(); } else { startAutoTracking(); } }} style={{ padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '12px', cursor: 'pointer', background: radarTrackingMode === 'auto' ? '#22c55e' : (isDark ? '#2c2c2e' : '#f1f5f9'), color: radarTrackingMode === 'auto' ? '#ffffff' : textColor, border: `1px solid ${borderColor}`, boxSizing: 'border-box' }}>{radarTrackingMode === 'auto' ? '🛰️ כבה מעקב' : '🛰️ הפעל מעקב'}</button>
                </div>
              </div>

              {(challengeAuthor === 'אריק' || isAdminUnlocked) && (
                <div style={{ background: cardBg, borderRadius: '20px', padding: '18px', marginBottom: '16px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: textColor, display: 'block', marginBottom: '8px' }}>👑 פאנל ניהול (אריק)</span>
                  <button onClick={adminForceRefreshAllLocations} style={{ width: '100%', padding: '12px', borderRadius: '12px', background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, border: `1px solid ${borderColor}`, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>🔄 רענן את כל המיקומים עכשיו</button>
                </div>
              )}

              <h3 style={{ fontSize: '14px', fontWeight: '800', color: textColor, margin: '0 0 10px' }}>מיקומי כל בני המשפחה:</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Object.keys(familyLocations).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: textSub, fontSize: '13px' }}>טרם נרשם מיקום. לחצו על "עדכן מיקום יזום".</div>
                ) : (
                  Object.values(familyLocations).map((member, i) => {
                    const distStr = myLocation ? calculateDistanceKm(myLocation.lat, myLocation.lng, member.lat, member.lng) : null;
                    const isSosMember = activeSosAlert && activeSosAlert.name === member.name;
                    return (
                      <div key={i} style={{ background: isSosMember ? (isDark ? '#3f1515' : '#fee2e2') : cardBg, borderRadius: '16px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${borderColor}`, boxShadow: cardShadow, gap: '10px' }}>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <b style={{ fontSize: '14px', color: isSosMember ? '#ef4444' : textColor, display: 'block' }}>{isSosMember ? '🚨 ' : '👤 '}{member.name}</b>
                          <small style={{ color: textSub, fontSize: '11px' }}>עודכן: {member.updated_at}</small>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          {distStr && <span style={{ fontSize: '11px', fontWeight: '700', color: '#10b981' }}>📏 {distStr}</span>}
                          <a href={`https://maps.apple.com/?daddr=${member.lat},${member.lng}&dirflg=w`} target="_blank" rel="noreferrer" style={{ padding: '6px 10px', borderRadius: '8px', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, textDecoration: 'none', fontSize: '11px', fontWeight: '700', border: `1.5px solid ${borderColor}` }}>🧭 Directions</a>
                          <button onClick={() => sendSoundAlertToMember(member.name)} style={{ padding: '6px 10px', borderRadius: '8px', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: `1.5px solid ${borderColor}`, fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}>🔔 צליל</button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {modalType === 'parking' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px' }}>
              <div>
                <small style={{ color: '#10b981', fontWeight: '800', fontSize: '10px', textTransform: 'uppercase' }}>CAR FINDER & COMPASS</small>
                <h3 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '800', color: textColor }}>🚗 מציאת רכב / מלון ומצפן חי</h3>
              </div>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button onClick={() => setCompassTarget('parking')} style={{ flex: 1, padding: '12px', borderRadius: '14px', background: compassTarget === 'parking' ? primaryGradient : cardBg, color: compassTarget === 'parking' ? '#fff' : textColor, border: `1px solid ${borderColor}`, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>🚗 לרכב החונה</button>
              <button onClick={() => setCompassTarget('hotel')} style={{ flex: 1, padding: '12px', borderRadius: '14px', background: compassTarget === 'hotel' ? primaryGradient : cardBg, color: compassTarget === 'hotel' ? '#fff' : textColor, border: `1px solid ${borderColor}`, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>🏡 למלון Vojon</button>
            </div>

            <div style={{ background: cardBg, borderRadius: '24px', padding: '20px', marginBottom: '16px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, textAlign: 'center', boxSizing: 'border-box' }}>
              <small style={{ color: textSub, fontSize: '12px', display: 'block', marginBottom: '6px' }}>מכוון אל: <b>{activeCompassCoords.name}</b></small>
              <div style={{ fontSize: '26px', fontWeight: '900', color: '#10b981', margin: '4px 0 16px' }}>{activeCompassDistance}</div>

              {!compassPermissionGranted && (
                <button onClick={requestCompassPermission} style={{ padding: '10px 18px', borderRadius: '12px', background: primaryGradient, color: '#fff', border: 'none', fontWeight: '700', fontSize: '13px', cursor: 'pointer', marginBottom: '16px' }}>🧭 אשר גישה למצפן המכשיר (iOS)</button>
              )}

              <div style={{ width: '150px', height: '150px', margin: '0 auto 14px', borderRadius: '50%', border: `3px solid ${borderColor}`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isDark ? '#2c2c2e' : '#f8fafc', boxShadow: 'inset 0 4px 12px rgba(0,0,0,0.1)' }}>
                <span style={{ position: 'absolute', top: '8px', fontWeight: '900', fontSize: '12px', color: '#ef4444' }}>N</span>
                <span style={{ position: 'absolute', bottom: '8px', fontWeight: '900', fontSize: '12px', color: textSub }}>S</span>
                <div style={{ transform: `rotate(${compassArrowRotation}deg)`, transition: 'transform 0.12s ease-out', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: '38px solid #2563eb' }}></div>
                  <div style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '38px solid #94a3b8' }}></div>
                </div>
              </div>
            </div>

            {savedParking ? (
              <div style={{ background: cardBg, borderRadius: '24px', padding: '20px', marginBottom: '16px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
                <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981', display: 'block', marginBottom: '6px' }}>✅ רכב שמור במערכת</span>
                <p style={{ margin: '0 0 6px', fontSize: '15px', fontWeight: '800', color: textColor }}>📌 {savedParking.note}</p>
                <small style={{ color: textSub, fontSize: '12px', display: 'block', marginBottom: '14px' }}>נשמר בתאריך {savedParking.date} בשעה {savedParking.time}</small>

                {savedParking.photo && (
                  <img src={savedParking.photo} alt="Parking place" style={{ width: '100%', maxHeight: '180px', objectFit: 'cover', borderRadius: '14px', marginBottom: '14px', border: `1px solid ${borderColor}` }} />
                )}

                <button onClick={() => setIsArActive(true)} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: primaryGradient, color: '#fff', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', marginBottom: '12px', boxShadow: '0 8px 20px rgba(37,99,235,0.35)' }}>📍 פתח מצפן AR במצלמה למציאת הרכב</button>
                <button onClick={clearSavedParking} style={{ width: '100%', padding: '8px', background: 'none', border: 'none', color: '#ef4444', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ מחק חניה זו והזן חדשה</button>
              </div>
            ) : (
              <div style={{ background: cardBg, borderRadius: '24px', padding: '20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '6px' }}>תיאור מקום החניה / קומה / עמוד:</label>
                  <input type="text" placeholder="לדוגמה: קומה 2, עמוד 14B..." value={parkingNote} onChange={(e) => setParkingNote(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <input type="file" id="parkingCamera" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleParkingPhotoUpload} />
                <button onClick={() => document.getElementById('parkingCamera').click()} style={{ padding: '12px', borderRadius: '12px', background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, border: `1px solid ${borderColor}`, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>📷 {parkingPhotoUrl ? '✓ תמונת חניה צולמה' : 'צלם תמונה של עמוד החניה'}</button>
                <button onClick={saveSmartParkingLocation} style={{ padding: '14px', borderRadius: '14px', background: '#22c55e', color: '#ffffff', border: 'none', fontWeight: '800', fontSize: '14px', cursor: 'pointer', marginTop: '6px', boxShadow: '0 8px 20px rgba(34,197,94,0.3)' }}>📍 שמור מיקום GPS מדויק עכשיו</button>
              </div>
            )}
          </div>
        </div>
      )}

      {modalType === 'trivia' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: textColor }}>🚗 טריויה חכמה לדרך</h2>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <button onClick={() => handleGlobalClick(() => setIsTriviaPaused(!isTriviaPaused))} style={{ background: isTriviaPaused ? '#f59e0b' : (isDark ? '#2c2c2e' : '#f1f5f9'), border: 'none', color: isTriviaPaused ? '#fff' : textColor, padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>{isTriviaPaused ? '▶️ המשך' : '⏸️ השהה'}</button>
                <button onClick={() => handleGlobalClick(resetTriviaGame)} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>🔒 איפוס</button>
                <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
              </div>
            </div>

            {isTriviaPaused ? (
              <div style={{ textAlign: 'center', padding: '40px 20px', background: cardBg, borderRadius: '24px', border: `1px solid ${borderColor}`, boxShadow: cardShadow }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>⏸️</span>
                <h3 style={{ fontSize: '18px', fontWeight: '800', color: textColor, margin: '0 0 8px' }}>המשחק מושהה</h3>
                <p style={{ fontSize: '13px', color: textSub, margin: 0 }}>הניקוד והשאלה שמורים בבטחה.</p>
              </div>
            ) : (
              <>
                <div style={{ background: cardBg, borderRadius: '16px', padding: '12px 18px', marginBottom: '16px', textAlign: 'center', border: `1px solid ${borderColor}`, boxShadow: cardShadow }}>
                  <span style={{ fontSize: '15px', fontWeight: '800', color: textColor }}>
                    🎯 תורו/ה של: <u style={{ fontSize: '16px', color: '#2563eb' }}>{travelers[travelerIndex]}</u>!
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
                  {travelers.map((name, idx) => (
                    <div key={idx} style={{ background: travelerIndex === idx ? primaryGradient : cardBg, color: travelerIndex === idx ? '#fff' : textColor, borderRadius: '12px', padding: '8px 2px', textAlign: 'center', fontSize: '12px', fontWeight: '700', border: `1px solid ${borderColor}`, boxShadow: cardShadow }}>
                      <div style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{name}</div>
                      <div style={{ fontSize: '13px', fontWeight: '900', color: travelerIndex === idx ? '#fff' : '#10b981' }}>{travelerScores[name] || 0} נק'</div>
                    </div>
                  ))}
                </div>

                {selectedAnswer !== null && (
                  <div style={{ textAlign: 'center', marginBottom: '16px', background: cardBg, padding: '12px', borderRadius: '14px', border: `1px solid ${borderColor}`, boxShadow: cardShadow }}>
                    <p style={{ fontSize: '15px', fontWeight: '800', color: isAnswerCorrect ? '#10b981' : '#ef4444', margin: 0 }}>
                      {isAnswerCorrect ? `🎉 כל הכבוד ${travelers[travelerIndex]}! (+10 נק')` : `❌ לא מדויק! עוברים הלאה...`}
                    </p>
                  </div>
                )}

                <div style={{ background: cardBg, borderRadius: '20px', padding: '20px', marginBottom: '16px', border: `1px solid ${borderColor}`, boxShadow: cardShadow }}>
                  <p style={{ margin: 0, fontSize: '16px', fontWeight: '800', color: textColor, lineHeight: '1.5' }}>
                    {triviaQuestions[triviaIndex]?.q}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
                  {triviaQuestions[triviaIndex]?.options.map((option, optIdx) => {
                    let btnBg = cardBg;
                    let btnColor = textColor;
                    if (selectedAnswer !== null) {
                      if (optIdx === triviaQuestions[triviaIndex].correct) { btnBg = '#10b981'; btnColor = '#ffffff'; }
                      else if (optIdx === selectedAnswer) { btnBg = '#ef4444'; btnColor = '#ffffff'; }
                    }
                    return (
                      <button key={optIdx} disabled={selectedAnswer !== null} onClick={() => handleGlobalClick(() => handleTriviaAnswer(optIdx))} style={{ padding: '14px 16px', borderRadius: '14px', textAlign: 'right', fontSize: '14px', fontWeight: '700', background: btnBg, color: btnColor, border: `1px solid ${borderColor}`, cursor: selectedAnswer === null ? 'pointer' : 'default', boxShadow: cardShadow, width: '100%', boxSizing: 'border-box' }}>
                        {option}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {modalType === 'questModal' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: textColor }}>הפתעת הבוקר והאתגר!</h2>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>

            <div style={{ background: cardBg, borderRadius: '24px', padding: '20px', marginBottom: '20px', textAlign: 'center', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
              <span style={{ fontSize: '36px', display: 'block', marginBottom: '8px' }}>🎯</span>
              <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: '800', color: textColor }}>{day.challenge}</h3>
              <p style={{ margin: 0, fontSize: '14px', color: textSub, lineHeight: '1.5' }}>{day.challengeDesc}</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px', boxSizing: 'border-box' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '6px' }}>מי ביצע / מתעד?</label>
                <select value={challengeAuthor} onChange={(e) => setChallengeAuthor(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, fontWeight: '700', boxSizing: 'border-box', outline: 'none' }}>
                  <option value="אריק">אריק</option>
                  <option value="עמית">עמית</option>
                  <option value="יולי">יולי</option>
                  <option value="ליאן">ליאן</option>
                  <option value="הראל">הראל</option>
                  <option value="משפחה">כולנו יחד 👨‍👩‍👧‍👧</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '6px' }}>💬 כתוב בדיחה, משפט או סיכום:</label>
                <textarea rows="3" placeholder="לדוגמה: עמית צעקה הכי חזק..." value={challengeNote} onChange={(e) => setChallengeNote(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, fontSize: '14px', boxSizing: 'border-box', outline: 'none' }} />
              </div>

              <input type="file" id="questPhotoInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) saveDailyChallenge(e.target.files[0]); }} />

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <button onClick={() => handleGlobalClick(() => document.getElementById('questPhotoInput').click())} style={{ padding: '14px', borderRadius: '14px', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}`, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>📸 צלם לאלבום</button>
                <button onClick={() => handleGlobalClick(() => saveDailyChallenge(null))} style={{ padding: '14px', borderRadius: '14px', background: primaryGradient, color: '#fff', border: 'none', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,0.3)' }}>✅ סמן כהושלם</button>
              </div>

              {isCurrentDayCompleted && (
                <button onClick={() => handleGlobalClick(() => resetSingleChallenge(activeDay))} style={{ background: '#fee2e2', color: '#ef4444', border: 'none', padding: '12px', borderRadius: '12px', fontWeight: '700', fontSize: '13px', cursor: 'pointer', width: '100%', boxSizing: 'border-box' }}>🔒 אפס משימה זו (מנהל)</button>
              )}
            </div>
          </div>
        </div>
      )}

      {modalType === 'gallery' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <small style={{ color: textSub, fontWeight: '800', fontSize: '10px' }}>FAMILY CLOUD ALBUM</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '900', color: textColor }}>📸 אלבום המסע המשפחתי</h2>
              </div>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>

            <div style={{ background: cardBg, borderRadius: '24px', padding: '20px', marginBottom: '20px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
              <button onClick={() => handleGlobalClick(() => setShowGalleryUpload(!showGalleryUpload))} style={{ width: '100%', padding: '14px', borderRadius: '14px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', background: primaryGradient, color: '#fff', border: 'none', boxShadow: '0 8px 20px rgba(37,99,235,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxSizing: 'border-box' }}>
                <span>📷</span> צלם והעלה זיכרון חדש למשפחה
              </button>

              {showGalleryUpload && (
                <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: `1px solid ${borderColor}`, display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box' }}>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '4px' }}>👤 מי צילם/ה?</label>
                    <select value={galleryUploaderName} onChange={(e) => setGalleryUploaderName(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, fontWeight: '700', outline: 'none', boxSizing: 'border-box' }}>
                      {travelers.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '4px' }}>💬 תיאור או כותרת:</label>
                    <input type="text" placeholder="לדוגמה: נוף עוצר נשק במלצ'סינה 🏔️" value={galleryCaption} onChange={(e) => setGalleryCaption(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '12px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
                  </div>
                  <input type="file" id="directGalleryCamera" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) handleDirectGalleryUpload(e.target.files[0]); }} />
                  <input type="file" id="directGalleryFile" accept="image/*" style={{ display: 'none' }} onChange={(e) => { if (e.target.files && e.target.files[0]) handleDirectGalleryUpload(e.target.files[0]); }} />
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <button onClick={() => handleGlobalClick(() => document.getElementById('directGalleryCamera').click())} style={{ padding: '12px', borderRadius: '12px', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}`, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>📸 צלם כעת</button>
                    <button onClick={() => handleGlobalClick(() => document.getElementById('directGalleryFile').click())} style={{ padding: '12px', borderRadius: '12px', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}`, fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}>📁 בחר מהמכשיר</button>
                  </div>
                </div>
              )}
            </div>

            {galleryItems.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '50px 20px', background: cardBg, borderRadius: '24px', border: `1px solid ${borderColor}`, color: textSub, boxShadow: cardShadow }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>✨</span>
                <p style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 6px', color: textColor }}>האלבום המשפחתי מחכה לתמונות הראשונות</p>
                <p style={{ fontSize: '13px', margin: 0 }}>השתמש בכפתור למעלה כדי לצלם ולהעלות תמונות!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', width: '100%', boxSizing: 'border-box' }}>
                {galleryItems.map((item, i) => (
                  <div key={item.id || i} onClick={() => setSelectedGalleryPhoto(item)} style={{ background: cardBg, borderRadius: '20px', padding: '10px', position: 'relative', border: `1px solid ${borderColor}`, boxShadow: cardShadow, cursor: 'pointer', overflow: 'hidden' }}>
                    {item.media_url && <img src={item.media_url} alt={item.caption} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '14px', display: 'block' }} />}
                    <div style={{ padding: '10px 4px 4px 4px' }}>
                      <b style={{ fontSize: '13px', color: textColor, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>👤 {item.author || 'משפחה'}</b>
                      <small style={{ fontSize: '11px', color: textSub, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.caption || item.name}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {selectedGalleryPhoto && (
        <div onClick={() => setSelectedGalleryPhoto(null)} style={{ position: 'fixed', inset: 0, zIndex: 6000, background: 'rgba(0,0,0,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(10px)', boxSizing: 'border-box' }}>
          <button onClick={() => setSelectedGalleryPhoto(null)} style={{ position: 'absolute', top: '20px', left: '20px', background: 'rgba(255,255,255,0.2)', color: '#fff', border: 'none', borderRadius: '50%', width: '44px', height: '44px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>✕</button>
          <img src={selectedGalleryPhoto.media_url} alt={selectedGalleryPhoto.caption} style={{ maxWidth: '100%', maxHeight: '65vh', objectFit: 'contain', borderRadius: '16px', marginBottom: '16px' }} />
          <div style={{ textAlign: 'center', color: '#fff', maxWidth: '500px', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 'bold' }}>👤 {selectedGalleryPhoto.author || 'משפחה'}</h3>
            <p style={{ margin: 0, fontSize: '14px', opacity: 0.9 }}>{selectedGalleryPhoto.caption}</p>
          </div>
          <button onClick={async (e) => { e.stopPropagation(); if (!window.confirm('למחוק תמונה זו?')) return; await supabase.from('gallery').delete().eq('id', selectedGalleryPhoto.id); setGalleryItems(prev => prev.filter(item => item.id !== selectedGalleryPhoto.id)); setSelectedGalleryPhoto(null); }} style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}>🗑️ מחק תמונה זו מהאלבום</button>
        </div>
      )}

      {modalType === 'tickets' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '16px' }}>
              <div>
                <small style={{ color: textSub, fontWeight: '800', textTransform: 'uppercase', display: 'block', fontSize: '10px' }}>ארנק דיגיטלי</small>
                <h2 style={{ margin: '2px 0 0', fontSize: '20px', fontWeight: '800', color: textColor }}>🎟️ כרטיסים ומסמכים</h2>
              </div>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', width: '100%', boxSizing: 'border-box' }}>
              <button onClick={() => handleGlobalClick(() => setShowUploadBox(!showUploadBox))} style={{ padding: '12px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', border: 'none', background: primaryGradient, color: '#fff', boxShadow: '0 8px 20px rgba(37,99,235,0.3)', boxSizing: 'border-box' }}>➕ הוסף כרטיס</button>
              <button onClick={() => handleGlobalClick(addNewFolder)} style={{ padding: '12px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', border: `1px solid ${borderColor}`, background: cardBg, color: textColor, boxSizing: 'border-box' }}>📁 תקייה חדשה</button>
            </div>

            {showUploadBox && (
              <div style={{ background: cardBg, padding: '18px', borderRadius: '20px', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '12px', boxSizing: 'border-box', border: `1px solid ${borderColor}`, boxShadow: cardShadow }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '4px' }}>בחר תקייה:</label>
                  <select value={selectedUploadFolder} onChange={(e) => setSelectedUploadFolder(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, boxSizing: 'border-box', outline: 'none' }}>
                    {folders.map((f, i) => <option key={i} value={f}>{f}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: textSub, display: 'block', marginBottom: '4px' }}>שם המסמך:</label>
                  <input type="text" placeholder="לדוגמה: כרטיס כניסה" value={newTicketTitle} onChange={(e) => setNewTicketTitle(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${borderColor}`, background: isDark ? '#2c2c2e' : '#f8fafc', color: textColor, boxSizing: 'border-box', outline: 'none' }} />
                </div>
                <input type="file" id="cameraInput" accept="image/*" capture="environment" style={{ display: 'none' }} onChange={handleFileUpload} />
                <input type="file" id="fileInput" accept="image/*,application/pdf" multiple style={{ display: 'none' }} onChange={handleFileUpload} />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => handleGlobalClick(() => document.getElementById('cameraInput').click())} style={{ flex: 1, ...uploadBtnStyle, background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}` }}>📷 צלם במצלמה</button>
                  <button onClick={() => handleGlobalClick(() => document.getElementById('fileInput').click())} style={{ flex: 1, ...uploadBtnStyle, background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: `1px solid ${borderColor}` }}>📁 בחר מהמכשיר</button>
                </div>
              </div>
            )}

            <h3 style={{ fontSize: '14px', margin: '10px 0 10px', fontWeight: '800', color: textColor }}>תקיות הטיול</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px', marginBottom: '20px', width: '100%', boxSizing: 'border-box' }}>
              {folders.map((f, i) => (
                <div key={i} onClick={() => handleGlobalClick(() => setActiveFolder(f))} style={{ padding: '12px', borderRadius: '14px', background: activeFolder === f ? primaryGradient : cardBg, color: activeFolder === f ? '#fff' : textColor, border: `1px solid ${activeFolder === f ? 'transparent' : borderColor}`, cursor: 'pointer', boxShadow: cardShadow, overflow: 'hidden' }}>
                  <strong style={{ display: 'block', fontSize: '13px', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{f}</strong>
                  <small style={{ fontSize: '11px', opacity: 0.8 }}>הצג קבצים</small>
                </div>
              ))}
            </div>

            <div style={{ borderBottom: `1px solid ${borderColor}`, paddingBottom: '8px', marginBottom: '12px', fontWeight: '800', fontSize: '13px', color: textColor }}>
              תכולת תיקייה: {activeFolder}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
              {ticketFiles.length === 0 ? (
                <div style={{ textAlign: 'center', color: textSub, padding: '20px', fontSize: '13px' }}>אין עדיין כרטיסים בתקייה זו.</div>
              ) : (
                ticketFiles.map((x, idx) => (
                  <div key={x.id || idx} onClick={() => handleGlobalClick(() => { setViewerItem(x); setModalType('viewer'); })} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px', padding: '14px', borderRadius: '16px', background: cardBg, border: `1px solid ${borderColor}`, cursor: 'pointer', boxShadow: cardShadow, width: '100%', boxSizing: 'border-box' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: isDark ? '#2c2c2e' : '#f1f5f9', border: `1px solid ${borderColor}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', flexShrink: 0 }}>
                        {x.isFlightInfo ? '✈️' : (x.isInsuranceInfo ? '🛡️' : (x.isCarVoucher ? '🚗' : (x.isHotelInfo ? '🏡' : (x.isGardalandTicket ? '🎢' : (x.isMovielandTicket ? '🎬' : '📄')))))}
                      </div>
                      <div style={{ minWidth: 0, textAlign: 'right', flex: 1 }}>
                        <b style={{ display: 'block', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: textColor }}>{x.title || x.name}</b>
                        <small style={{ color: textSub, fontSize: '11px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{x.isFlightInfo ? 'ישראייר 4623652' : (x.isGardalandTicket ? 'Gardaland' : 'הזמנה')}</small>
                      </div>
                    </div>
                    <span style={{ fontSize: '12px', color: textColor, fontWeight: '700' }}>צפה 👁️</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {modalType === 'viewer' && viewerItem && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: textColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>{viewerItem.title || viewerItem.name}</h3>
              <button onClick={closeDocumentViewer} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>
            <DocumentViewer item={viewerItem} isDark={isDark} blockText={blockText} cardShadow={cardShadow} />
          </div>
        </div>
      )}

      {modalType === 'emergency' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#ef4444' }}>🆘 מספרי חירום באיטליה</h3>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', width: '100%', boxSizing: 'border-box' }}>
              <a href="tel:112" style={{ ...gridModalBtn, background: '#fee2e2', color: '#ef4444', textDecoration: 'none', border: '1px solid #fecaca' }}>🚨 חירום כללי: 112</a>
              <a href="tel:118" style={{ ...gridModalBtn, background: '#fee2e2', color: '#ef4444', textDecoration: 'none', border: '1px solid #fecaca' }}>🚑 אמבולנס: 118</a>
              <a href="tel:113" style={{ ...gridModalBtn, background: '#fee2e2', color: '#ef4444', textDecoration: 'none', border: '1px solid #fecaca' }}>👮 משטרה: 113</a>
              <a href="tel:+390636911" style={{ ...gridModalBtn, background: '#fee2e2', color: '#ef4444', textDecoration: 'none', border: '1px solid #fecaca' }}>🇮🇱 שגרירות: +39 06 361911</a>
            </div>
          </div>
        </div>
      )}

      {modalType === 'appleMusicModal' && (
        <div onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={() => handleTouchEnd(closeModal)} style={{ ...modalStyle, background: bgMain }}>
          <div style={modalContentStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${borderColor}`, paddingBottom: '16px', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: textColor }}>🎵 פלייליסט נסיעה (Apple Music)</h2>
              <button onClick={() => handleGlobalClick(closeModal)} style={{ width: '38px', height: '38px', borderRadius: '50%', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', fontWeight: '900', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>✕</button>
            </div>
            <div style={{ background: cardBg, borderRadius: '24px', padding: '24px', textAlign: 'center', border: `1px solid ${borderColor}`, boxShadow: cardShadow }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>🎧</span>
              <p style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '700', color: textColor }}>חיבור לחשבון Apple Music ליצירת פלייליסט משפחתי לדרך:</p>
              <a href="https://music.apple.com" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 24px', background: '#fa233b', color: '#ffffff', borderRadius: '14px', textDecoration: 'none', fontWeight: '800', fontSize: '14px', boxShadow: '0 8px 20px rgba(250,35,59,0.3)' }}>פתח את Apple Music והתחבר 🎵</a>
            </div>
          </div>
        </div>
      )}

      {showThemeBuilder && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 5000, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', boxSizing: 'border-box' }}>
          <div style={{ background: cardBg, borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '400px', border: `1px solid ${borderColor}`, boxShadow: cardShadow, boxSizing: 'border-box' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '20px', fontWeight: '800', color: textColor }}>🎨 בונה עיצוב אישי</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '700' }}>צבע רקע ראשי: <input type="color" value={tempBgMain} onChange={(e) => setTempBgMain(e.target.value)} style={{ float: 'left' }} /></label>
              <label style={{ fontSize: '13px', fontWeight: '700' }}>צבע כרטיסים: <input type="color" value={tempCardBg} onChange={(e) => setTempCardBg(e.target.value)} style={{ float: 'left' }} /></label>
              <label style={{ fontSize: '13px', fontWeight: '700' }}>צבע טקסט: <input type="color" value={tempTextColor} onChange={(e) => setTempTextColor(e.target.value)} style={{ float: 'left' }} /></label>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saveCustomTheme} style={{ flex: 1, padding: '12px', background: primaryGradient, color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '800', cursor: 'pointer' }}>שמור עיצוב</button>
              <button onClick={resetCustomTheme} style={{ flex: 1, padding: '12px', background: isDark ? '#2c2c2e' : '#f1f5f9', color: textColor, border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>איפוס לברירת מחדל</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

const arrowBtnStyle = {
  background: '#64748b', color: '#ffffff', border: 'none', borderRadius: '8px',
  width: '26px', height: '24px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
};

const navBtnStyle = {
  fontSize: '13px', fontWeight: '800',
  padding: '12px', borderRadius: '14px', display: 'flex', alignItems: 'center',
  justifyContent: 'center', gap: '8px', cursor: 'pointer', boxSizing: 'border-box'
};

const modalStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  width: '100vw', maxWidth: '100vw', height: '100dvh',
  zIndex: 3000, overflow: 'hidden',
  direction: 'rtl', boxSizing: 'border-box'
};

const modalContentStyle = {
  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
  width: '100%', maxWidth: '600px', margin: '0 auto',
  padding: '20px 16px 80px', boxSizing: 'border-box',
  overflowY: 'auto', WebkitOverflowScrolling: 'touch'
};

const gridModalBtn = {
  padding: '16px', borderRadius: '16px',
  fontWeight: '800', fontSize: '13px', textAlign: 'center', cursor: 'pointer',
  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxSizing: 'border-box', width: '100%'
};

const uploadBtnStyle = {
  width: '100%', padding: '12px', borderRadius: '12px',
  fontWeight: '800', cursor: 'pointer', fontSize: '13px', boxSizing: 'border-box'
};
