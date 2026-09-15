import React, { useState, useEffect } from 'react';
import './App.css';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeDay, setActiveDay] = useState(1);
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('trip_documents');
    return saved ? JSON.parse(saved) : [];
  });

  const hotelName = "Bio Agriturismo Vojon";
  const getWazeUrl = (destination) => `https://waze.com/ul?q=${encodeURIComponent(destination)}&navigate=yes`;
  const getGoogleMapsUrl = (destination) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;

  useEffect(() => {
    localStorage.setItem('trip_documents', JSON.stringify(documents));
  }, [documents]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newDoc = {
          id: Date.now() + Math.random(),
          name: file.name,
          type: file.type,
          url: e.target.result
        };
        setDocuments(prev => [...prev, newDoc]);
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteDocument = (id) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const tripDays = [
    {
      day: 1,
      title: "יום 1: נחיתה בורונה והגעעה למלון",
      highlights: ["נחיתה בורונה", "איסוף רכב", "נסיעה למלון Bio Agriturismo Vojon"],
      food: { pizza: "Pizzeria Da Giugiu", pasta: "Trattoria Verona", ice_cream: "Gelateria Luna" }
    },
    {
      day: 2,
      title: "יום 2: פארק שעשועים Gardaland",
      highlights: ["יום שלם ב-Gardaland", "מתקנים ואטרקציות"],
      food: { pizza: "Ristorante Gardaland", pasta: "Osteria del Garda", ice_cream: "Gelateria Ronald" }
    },
    {
      day: 3,
      title: "יום 3: סירמיונה וחצי האי",
      highlights: ["סיור בסירמיונה", "מצודת סקאליג'רו", "שייט באגם"],
      food: { pizza: "Pizzeria Aperto", pasta: "La Nuova Spiaggia", ice_cream: "Waikiki Gelateria" }
    },
    {
      day: 4,
      title: "יום 4: יום טיול לוונציה",
      highlights: ["נסיעה לוונציה", "כיכר סן מרקו", "גונדולות ותעלות"],
      food: { pizza: "Antico Forno", pasta: "Bacarretto San Marco", ice_cream: "Suso Gelateria" }
    },
    {
      day: 5,
      title: "יום 5: מונטה באלדו ובורג'טו",
      highlights: ["רכבל מונטה באלדו (Malcesine)", "ביקור בכפר הציורי בורג'טו (Borghetto)"],
      food: { pizza: "Al Cavalier", pasta: "Locanda Borghetto", ice_cream: "Articioc" }
    },
    {
      day: 6,
      title: "יום 6: Movieland ואקשן",
      highlights: ["Movieland The Hollywood Park", "חווית X-Rafting"],
      food: { pizza: "Hollywood Burger & Pizza", pasta: "Stunt Grill", ice_cream: "CineGelato" }
    },
    {
      day: 7,
      title: "יום 7: קניות וטיסה חזרה",
      highlights: ["השלמות קניות", "נסיעה לשדה התעופה בורונה וטיסה לישראל"],
      food: { pizza: "Airport Pizza", pasta: "Bistrot Verona", ice_cream: "Ultima Gelateria" }
    }
  ];

  const currentData = tripDays.find(d => d.day === activeDay);

  return (
    <div className="app-container" style={{ direction: 'rtl', fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#2c3e50', color: 'white', padding: '15px 20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
        <button 
          onClick={() => setSidebarOpen(true)}
          style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
        >
          ☰
        </button>
        <h1 style={{ fontSize: '18px', margin: 0 }}>🇮🇹 טיול משפחתי לאגם גארדה 2026</h1>
        <div style={{ width: '24px' }}></div>
      </header>

      {/* Quick Return to Hotel Banner */}
      <div style={{ backgroundColor: '#e74c3c', color: 'white', padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>
        <a 
          href={getWazeUrl(hotelName)} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: 'white', textDecoration: 'none', display: 'block' }}
        >
          🚗 ניווט מהיר חזרה למלון ({hotelName}) ב-Waze
        </a>
      </div>

      {/* Main Content Area */}
      <main style={{ padding: '20px' }}>
        {currentData && (
          <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)', marginBottom: '20px' }}>
            <h2 style={{ color: '#2c3e50', marginTop: 0 }}>{currentData.title}</h2>
            
            <h3 style={{ fontSize: '16px', color: '#16a085', borderBottom: '2px solid #eee', paddingBottom: '5px' }}>📍 נקודות מרכזיות:</h3>
            <ul>
              {currentData.highlights.map((h, index) => (
                <li key={index} style={{ marginBottom: '8px' }}>{h}</li>
              ))}
            </ul>

            <h3 style={{ fontSize: '16px', color: '#d35400', borderBottom: '2px solid #eee', paddingBottom: '5px', marginTop: '20px' }}>🍽️ המלצות אוכל וגלידה:</h3>
            <p><strong>🍕 פיצה:</strong> {currentData.food.pizza}</p>
            <p><strong>🍝 פסטה:</strong> {currentData.food.pasta}</p>
            <p><strong>🍦 גלידה:</strong> {currentData.food.ice_cream}</p>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <a 
                href={getWazeUrl(currentData.title)} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ flex: 1, backgroundColor: '#3498db', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              >
                נווט ב-Waze
              </a>
              <a 
                href={getGoogleMapsUrl(currentData.title)} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ flex: 1, backgroundColor: '#27ae60', color: 'white', textAlign: 'center', padding: '10px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold' }}
              >
                Google Maps
              </a>
            </div>
          </div>
        )}

        {/* Universal File/PDF Upload Section */}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <h3 style={{ color: '#2c3e50', marginTop: 0 }}>📂 מסמכים וכרטיסים (PDF / תמונות)</h3>
          <p style={{ fontSize: '13px', color: '#666' }}>העלה לכאן כרטיסי טיסה, ביטוח AIG, אישורי מלון או תמונות לגיבוי מלא אופליין:</p>
          
          <label style={{ display: 'inline-block', backgroundColor: '#8e44ad', color: 'white', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            ➕ בחר קבצים להעלאה
            <input type="file" multiple accept="image/*,application/pdf" onChange={handleFileUpload} style={{ display: 'none' }} />
          </label>

          {documents.length > 0 && (
            <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {documents.map((doc) => (
                <div key={doc.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#f1f2f6', borderRadius: '8px' }}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: '#2980b9', textDecoration: 'none', fontWeight: 'bold', wordBreak: 'break-all' }}>
                    📄 {doc.name}
                  </a>
                  <button 
                    onClick={() => deleteDocument(doc.id)}
                    style={{ background: '#e74c3c', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    מחק
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Right Sidebar (Drawer) */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', top: 0, right: 0, width: '280px', height: '100%', backgroundColor: 'white', boxShadow: '-5px 0 15px rgba(0,0,0,0.2)', zIndex: 1000, padding: '20px', boxSizing: 'border-box', overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '18px', margin: 0, color: '#2c3e50' }}>תפריט הטיול</h2>
            <button 
              onClick={() => setSidebarOpen(false)}
              style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {tripDays.map((d) => (
              <button
                key={d.day}
                onClick={() => {
                  setActiveDay(d.day);
                  setSidebarOpen(false);
                }}
                style={{
                  textAlign: 'right',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: activeDay === d.day ? '#3498db' : '#f1f2f6',
                  color: activeDay === d.day ? 'white' : '#333',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                {d.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop for Sidebar */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 999 }}
        ></div>
      )}

    </div>
  );
}
