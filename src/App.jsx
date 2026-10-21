import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

// --- TRIP-NAVIGATOR v1.8.27 (Manual Start Trivia Edition) ---
const APP_VERSION = 'v1.8.27';
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

const BASE_TRIVIA_QUESTIONS = [
  // --- אגם גארדה והסביבה ---
  { q: "באיזו מדינה באירופה נמצא אגם גארדה?", options: ["צרפת", "ספרד", "איטליה", "אוסטריה"], correct: 2 },
  { q: "מהו אגם גארדה מבחינת גודלו באיטליה?", options: ["האגם הקטן ביותר", "האגם הגדול ביותר", "אגם מלאכותי", "אגם מלח"], correct: 1 },
  { q: "איזה פארק שעשועים ענק נמצא בסמוך לדרום אגם גארדה?", options: ["דיסנילנד", "גארדלנד (Gardaland)", "פורט אבנטורה", "אסטריקס"], correct: 1 },
  { q: "באיזו עיירת נופש דרומית באגם גארדה ממוקם פארק המים קאנבה וורלד?", options: ["פשקיירה דל גארדה (Peschiera)", "סירמיונה", "ריווה דל גארדה", "מלצ'יאזה"], correct: 0 },
  { q: "איזה מבצר היסטורי ומפורסם מקדם את פני הבאים בכניסה לעיר העתיקה של סירמיונה?", options: ["טירת סקליג'רו (Scaliger)", "טירת מילאנו", "הארמון הלבן", "מצודת רומא"], correct: 0 },
  { q: "מהי האטרקציה המפורסמת ביותר בקצה הצפוני של אגם גארדה שמושכת אליה חובבי ספורט ימי ורוח?", options: ["ריווה דל גארדה", "גרדלנד", "ורונה", "פשקיירה"], correct: 0 },
  { q: "איזה הר גבוה מתנשא מעל העיירה מלצ'יאזה וכולל רכבל מסתובב?", options: ["מונטה באלדו (Monte Baldo)", "האלפים הצרפתיים", "הר הריפ", "הדולומיטים"], correct: 0 },
  { q: "איזה נהר מרכזי זורם מתוך אגם גארדה דרומה לעבר הים התיכון?", options: ["נהר הפו", "נהר המינצ'ו (Mincio)", "נהר הטיבר", "נהר הארנו"], correct: 1 },
  { q: "איזה פארק מים קולנועי ייחודי נמצא בסמוך לגארדלנד?", options: ["Movieland Studios", "Aqualandia", "Mirabilandia", "Cinecitta World"], correct: 0 },
  { q: "באיזה אזור יין מפורסם בדרום אגם גארדה מיוצר יין לבן יבש ורענן בשם זה?", options: ["קיאנטי", "לוגאנה (Lugana)", "ברולו", "פרוסקו"], correct: 1 },

  // --- ערים ואטרקציות באיטליה ---
  { q: "מהי בירת מחוז ונטו שבו שוכן חלק מאגם גארדה?", options: ["ונציה", "ורונה", "מילאנו", "בולוניה"], correct: 1 },
  { q: "איזו עיר איטלקית מפורסמת בתעלות המים והגונדולות שלה?", options: ["רומא", "נאפולי", "ונציה", "פירנצה"], correct: 2 },
  { q: "איזה בניין עתיק ומרשים בורונה שימש לקרבות גלדיאטורים ומשמש כיום כאולם אופרה פתוח?", options: ["הקולוסיאום", "הארנה של ורונה (Arena di Verona)", "הפנתאון", "בזיליקת פטרוס הקדוש"], correct: 1 },
  { q: "איזה מרפסת בעיר ורונה מקושרת לסיפור האהבה של שייקספיר?", options: ["המרפסת של יוליה (Juliet's Balcony)", "המרפסת המלכותית", "ארמון הדוגّه", "טירת רומיאו"], correct: 0 },
  { q: "מהי בירת איטליה?", options: ["מילאנו", "ונציה", "רומא", "נאפולי"], correct: 2 },
  { q: "איזו עיר איטלקית נחשבת לבירת האופנה והכלכלה בצפון המדינה?", options: ["מילאנו", "טורינו", "גנואה", "פלורנצה"], correct: 0 },
  { q: "איזה מגדל מפורסם בעולם נטוי הצידה באופן מפורסם?", options: ["המגדל בפיזה", "המגדל ברומא", "המגדל בוונציה", "המגדל בנאפולי"], correct: 0 },
  { q: "איזה הר געש מפורסם שוכן בסמוך לעיר נאפולי והחריב את פומפיי העתיקה?", options: ["סטרומבולי", "אטנה", "וזוב (Vesuvius)", "קולומבו"], correct: 2 },
  { q: "באיזה ים מוקפת איטליה בעיקר?", options: ["הים התיכון", "הים הבלטי", "הים הצפוני", "הים השחור"], correct: 0 },
  { q: "מהי העיר הגדולה ביותר באיטליה לפי אוכלוסייה?", options: ["מילאנו", "רומא", "נאפולי", "טורינו"], correct: 1 },

  // --- קולינריה איטלקית ---
  { q: "איזה מאכל איטלקי מפורסם מורכב מבצק, רוטב עגבניות וגבינת מוצרלה?", options: ["פסטה", "ריזוטו", "פיצה", "לזניה"], correct: 2 },
  { q: "מאיזו עיר באיטליה הומצאה הפיצה המקורית?", options: ["מילאנו", "רומא", "נאפולי", "פלרמו"], correct: 2 },
  { q: "איזה קינוח איטלקי מפורסם מכיל ביסקויטים ספוגים בקפה, מסקרפונה וקקאו?", options: ["פנאקוטה", "טירמיסו (Tiramisu)", "גלידה", "קנולי"], correct: 1 },
  { q: "מהו שמם של הבצקים הקטנים והממולאים באיטליה הדומים לכיסונים?", options: ["ספגטי", "רביולי (Ravioli)", "פנה", "פטוצ'יני"], correct: 1 },
  { q: "איזה גבינה איטלקית קשה ומלוחה נהוג לגרד מעל פסטה?", options: ["מוצרלה", "פרמזן (Parmesan)", "ריקוטה", "גורגונזולה"], correct: 1 },
  { q: "איזה משקה קפה איטלקי מוגש לרוב כמנה קטנה וחזקה מאוד?", options: ["הפוך", "אספרסו (Espresso)", "אייס קפה", "שוקולטה"], correct: 1 },
  { q: "מהו שמה של הגלידה האיטלקית המסורתית?", options: ["גלצ'ה", "ג'לאטו (Gelato)", "סורבה", "אייס קרים"], correct: 1 },
  { q: "איזה רוטב ירוק מפורסם מכינים מבזיליקום, שמן זית, צנוברים ושום?", options: ["פסטו (Pesto)", "בולונז", "נפוליטנה", "אלפרדו"], correct: 0 },
  { q: "איזה סוג אורז משמש להכנת מנה איטלקית קרמית בשם ריזוטו?", options: ["אורז בסמטי", "אורז ארבוריו (Arborio)", "אורז יסמין", "אורז מלא"], correct: 1 },
  { q: "מאיזה אזור באיטליה מגיע יין הפרוסקו המבעבע?", options: ["ונטו ופריולי", "טוסקנה", "סיציליה", "קלבריה"], correct: 0 },

  // --- גיאוגרפיה ועולם ---
  { q: "מהי היבשת הגדולה ביותר בעולם?", options: ["אפריקה", "אסיה", "אמריקה הצפונית", "אירופה"], correct: 1 },
  { q: "איזה אוקיינוס הוא הגדול ביותר בכדור הארץ?", options: ["האוקיינוס האטלנטי", "האוקיינוס ההודי", "האוקיינוס השקט", "האוקיינוס הארקטי"], correct: 2 },
  { q: "מהי המדינה הגדולה ביותר בעולם לפי שטח?", options: ["קנדה", "סין", "ארצות הברית", "רוסיה"], correct: 3 },
  { q: "באיזו מדינה נמצאת העיר ברצלונה?", options: ["איטליה", "פורטוגל", "ספרד", "צרפת"], correct: 2 },
  { q: "איזה נהר הוא הארוך ביותר בעולם?", options: ["האמזונס", "הנילוס", "המיסיסיפי", "היאנגצה"], correct: 1 },
  { q: "איזו עיר היא בירת צרפת?", options: ["לונדון", "ברלין", "פריז", "מדריד"], correct: 2 },
  { q: "איזו מדינה בצורת מגף מופיעה במפה בדרום אירופה?", options: ["יוון", "ספרד", "איטליה", "פורטוגל"], correct: 2 },
  { q: "מהו ההר הגבוה ביותר בעולם?", options: ["המלקי", "הר קלימנג'רו", "אוורסט", "מונט בלן"], correct: 2 },
  { q: "איזה מצר מפריד בין ספרד למרוקו ובין הים התיכון לאוקיינוס האטלנטי?", options: ["מצר גיברלטר", "מצר בוספורוס", "מצר מגלן", "תעלת פנמה"], correct: 0 },
  { q: "באיזו יבשת נמצא מדבר סהרה?", options: ["אסיה", "אוסטרליה", "אפריקה", "אמריקה הדרומית"], correct: 2 },

  // --- תרבות, סרטים וטבע ---
  { q: "איזה חיה נחשבת למלך החיות?", options: ["פיל", "אריה", "נמר", "דוב"], correct: 1 },
  { q: "כמה רגליים יש לעכביש?", options: ["6", "8", "10", "12"], correct: 1 },
  { q: "מהו כוכב הלכת הקרוב ביותר לשמש?", options: ["נוגה", "מאדים", "חמה (מרקורי)", "צדק"], correct: 2 },
  { q: "איזה יסוד כימי מסומן באותיות O בטבלה המחזורית?", options: ["זהב", "מימן", "חמצן (Oxygen)", "פחמן"], correct: 2 },
  { q: "באיזה סרט מופיעה הדמות 'טרמיניאטור' המפורסמת?", options: ["מלחמת הכוכבים", "שליחות קטלנית (Terminator)", "בחזרה העתיד", "מטריקס"], correct: 1 },
  { q: "כמה ימים יש בשנה מעוברת?", options: ["365", "366", "364", "370"], correct: 1 },
  { q: "איזה בעל חיים ימי נחשב לגדול ביותר בעולם?", options: ["כריש לבן", "לוויתן כחול", "תמנון ענק", "דולפין"], correct: 1 },
  { q: "מהי מהירות האור בקירוב?", options: ["300 אלף ק\"מ בשנייה", "3,000 ק\"מ בשנייה", "300 ק\"מ בשנייה", "3 מיליון ק\"מ בשנייה"], correct: 0 },
  { q: "איזה צבע מקבלים כשמערבבים כחול וצהוב?", options: ["סגול", "כתום", "ירוק", "חום"], correct: 2 },
  { q: "מי כתב את המחזה 'רומיאו ויוליה'?", options: ["ויליאם שייקספיר", "צ'ארלס דיקנס", "הנס כריסטיان אנדרסן", "ויקטור הוגו"], correct: 0 }
];

const TRIVIA_BANK = Array.from({ length: 1500 }, (_, i) => {
  const baseQ = BASE_TRIVIA_QUESTIONS[i % BASE_TRIVIA_QUESTIONS.length];
  return {
    ...baseQ,
    q: `שאלה #${i + 1}: ${baseQ.q.replace(/^שאלה #\d+:\s*/, '')}`
  };
});

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('trip-user') || '');
  const [loginInput, setLoginInput] = useState('');
  const [activeTab, setActiveTab] = useState('itinerary'); 
  const [activeDay, setActiveDay] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const [tripDays, setTripDays] = useState(() => {
    try {
      const saved = localStorage.getItem('trip-custom-days');
      return saved ? JSON.parse(saved) : INITIAL_TRIP_DAYS;
    } catch (e) { return INITIAL_TRIP_DAYS; }
  });

  const [myLocation, setMyLocation] = useState(null);
  const [gpsConnected, setGpsConnected] = useState(false);
  const [allUsersLocations, setAllUsersLocations] = useState({});
  const [currentWeather, setCurrentWeather] = useState({ temp: '... ', icon: '⏳' });
  const [incomingPing, setIncomingPing] = useState(null);

  const [customSearchQuery, setCustomSearchQuery] = useState('');

  const [adminModal, setAdminModal] = useState(false);
  const [adminPinInput, setAdminPinInput] = useState('');
  const [manualTitle, setManualTitle] = useState('');
  const [manualDesc, setManualDesc] = useState('');
  const [manualTime, setManualTime] = useState('10:00');

  const [backupModal, setBackupModal] = useState(false);
  const [backupPinInput, setBackupPinInput] = useState('');

  const [triviaState, setTriviaState] = useState(() => {
    try {
      const saved = localStorage.getItem('trip-trivia-state');
      return saved ? JSON.parse(saved) : { idx: 0, scores: {}, isPaused: true }; // מתחיל מראש כ-isPaused: true (ממתין להפעלה ידנית)
    } catch (e) { return { idx: 0, scores: {}, isPaused: true }; }
  });

  const [selectedOpt, setSelectedOpt] = useState(null);
  const [timeLeft, setTimeLeft] = useState(30);
  const [adminTriviaPin, setAdminTriviaPin] = useState('');

  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const updateTriviaInCloud = async (newState) => {
    setTriviaState(newState);
    localStorage.setItem('trip-trivia-state', JSON.stringify(newState));
    try {
      await supabase.from('family_radar').upsert([{
        name: currentUser,
        lat: myLocation?.lat || 45.43,
        lng: myLocation?.lng || 10.68,
        updated_at: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        trivia_state: newState
      }], { onConflict: 'name' });
    } catch (err) {}
  };

  useEffect(() => {
    if (activeTab !== 'trivia' || triviaState.isPaused || selectedOpt !== null) return;

    if (timeLeft <= 0) {
      const nextIdx = triviaState.idx + 1;
      updateTriviaInCloud({ ...triviaState, idx: nextIdx });
      setTimeLeft(30);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeTab, timeLeft, triviaState, selectedOpt]);

  useEffect(() => {
    setTimeLeft(30);
  }, [triviaState.idx]);

  useEffect(() => {
    if (document.getElementById('leaflet-script')) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.id = 'leaflet-script';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (activeTab !== 'radar') return;
    const timer = setTimeout(() => {
      if (!window.L || !mapContainerRef.current) return;

      const defaultLat = myLocation?.lat || 45.4384;
      const defaultLng = myLocation?.lng || 10.6816;

      if (!mapInstanceRef.current) {
        mapInstanceRef.current = window.L.map(mapContainerRef.current, {
          dragging: true,
          touchZoom: true,
          scrollWheelZoom: true,
          doubleClickZoom: true
        }).setView([defaultLat, defaultLng], 12);

        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap'
        }).addTo(mapInstanceRef.current);
      } else {
        mapInstanceRef.current.setView([defaultLat, defaultLng], 12);
        mapInstanceRef.current.invalidateSize();
      }

      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof window.L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      const redPinIcon = window.L.divIcon({
        className: 'custom-red-pin',
        html: `<div style="background-color: #dc2626; width: 22px; height: 22px; border-radius: 50%; border: 3px solid #ffffff; box-shadow: 0 3px 8px rgba(0,0,0,0.4);"></div>`,
        iconSize: [22, 22],
        iconAnchor: [11, 11]
      });

      Object.values(allUsersLocations).forEach(loc => {
        if (loc.lat && loc.lng) {
          const marker = window.L.marker([loc.lat, loc.lng], { icon: redPinIcon }).addTo(mapInstanceRef.current);
          marker.bindPopup(`<b>${loc.name}</b><br/>עדכון: ${loc.updated_at || 'לפני רגע'}`);
        }
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [activeTab, allUsersLocations, myLocation]);

  useEffect(() => {
    if (!currentUser) return;

    const fetchInitialData = async () => {
      try {
        const { data } = await supabase.from('family_radar').select('*');
        if (data) {
          const map = {};
          data.forEach(item => { 
            map[item.name] = item; 
            if (item.trivia_state) {
              setTriviaState(prev => ({
                idx: Math.max(prev.idx, item.trivia_state.idx || 0),
                isPaused: item.trivia_state.isPaused ?? prev.isPaused,
                scores: { ...(item.trivia_state.scores || {}), ...(prev.scores || {}) }
              }));
            }
          });
          setAllUsersLocations(map);
        }
      } catch (err) {}
    };
    fetchInitialData();

    const channel = supabase.channel('trip_sync_v1827')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'family_radar' }, payload => {
        if (payload.new && payload.new.name) {
          setAllUsersLocations(prev => ({ ...prev, [payload.new.name]: payload.new }));
          if (payload.new.trivia_state) {
            setTriviaState(prev => ({
              idx: Math.max(prev.idx, payload.new.trivia_state.idx || 0),
              isPaused: payload.new.trivia_state.isPaused ?? prev.isPaused,
              scores: { ...(payload.new.trivia_state.scores || {}), ...(prev.scores || {}) }
            }));
          }
          if (payload.new.name === currentUser && payload.new.ping_target && payload.new.ping_target === currentUser) {
            setIncomingPing({ from: payload.new.ping_from, msg: payload.new.ping_msg || 'חזור אלי בדחיפות!' });
          }
        }
      })
      .subscribe();

    let watchId = null;
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const timeStr = new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const coords = {
          name: currentUser,
          lat: lat,
          lng: lng,
          updated_at: timeStr,
          trivia_state: triviaState
        };
        setMyLocation(coords);
        setGpsConnected(true);
        
        try {
          const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current_weather=true`);
          const weatherData = await res.json();
          if (weatherData && weatherData.current_weather) {
            const tempVal = Math.round(weatherData.current_weather.temperature);
            const code = weatherData.current_weather.weathercode;
            let condIcon = '☀️';
            if (code >= 1 && code <= 3) condIcon = '🌤️';
            else if (code >= 51 && code <= 67) condIcon = '🌧️';
            else if (code >= 71 && code <= 77) condIcon = '❄️';
            else if (code >= 95) condIcon = '⛈️';
            setCurrentWeather({ temp: `${tempVal}°C`, icon: condIcon });
          }
        } catch (e) {
          setCurrentWeather({ temp: '24°C', icon: '☀️' });
        }

        try {
          await supabase.from('family_radar').upsert([coords], { onConflict: 'name' });
        } catch (err) {}
      }, () => {
        setGpsConnected(false);
        setCurrentWeather({ temp: '24°C', icon: '☀️' });
      }, { enableHighAccuracy: true });
    }

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
      supabase.removeChannel(channel);
    };
  }, [currentUser]);

  const sendPingToUser = async (targetName) => {
    const customMsg = prompt(`שלח הודעת PING אל ${targetName}:`, "היי, איפה אתה? חזור אלי בבקשה!");
    if (customMsg === null) return;

    try {
      const targetUserObj = allUsersLocations[targetName] || { name: targetName, lat: 45.43, lng: 10.68 };
      await supabase.from('family_radar').upsert([{
        ...targetUserObj,
        ping_target: targetName,
        ping_from: currentUser,
        ping_msg: customMsg
      }], { onConflict: 'name' });

      alert(`✅ ה-PING נשלח בהצלחה אל ${targetName}!`);
    } catch (e) {
      alert('❌ שגיאה בשליחת ה-PING');
    }
  };

  const clearIncomingPing = async () => {
    if (!myLocation) return;
    try {
      await supabase.from('family_radar').upsert([{
        ...myLocation,
        ping_target: null,
        ping_from: null,
        ping_msg: null
      }], { onConflict: 'name' });
      setIncomingPing(null);
    } catch (e) {
      setIncomingPing(null);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginInput.trim()) return;
    const name = loginInput.trim();
    setCurrentUser(name);
    localStorage.setItem('trip-user', name);
  };

  const getSatelliteMapsUrl = (lat, lng, queryName) => {
    const isApple = /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
    if (isApple) {
      if (lat && lng) return `maps://maps.apple.com/?q=${lat},${lng}&t=h`;
      return `maps://maps.apple.com/?q=${encodeURIComponent(queryName)}&t=h`;
    } else {
      if (lat && lng) return `https://www.google.com/maps/@?api=1&map_action=map&center=${lat},${lng}&zoom=18&basemap=satellite`;
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(queryName)}`;
    }
