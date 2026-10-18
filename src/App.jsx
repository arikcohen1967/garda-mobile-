import React, { useState } from 'react';

export default function App() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', color: '#0f172a', fontFamily: 'sans-serif', direction: 'rtl', padding: '20px', textAlign: 'center' }}>
      <h1>Garda-Mobile v9.9.5</h1>
      <p>ברוכים הבאים לאפליקציית הטיול המשפחתי לגארדה! 🇮🇹🚗</p>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', margin: '20px 0' }}>
        <button onClick={() => setActiveDay(0)} style={{ padding: '10px 15px', background: activeDay === 0 ? '#2563eb' : '#e2e8f0', color: activeDay === 0 ? '#fff' : '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          יום 1 - נחיתה
        </button>
        <button onClick={() => setActiveDay(1)} style={{ padding: '10px 15px', background: activeDay === 1 ? '#2563eb' : '#e2e8f0', color: activeDay === 1 ? '#fff' : '#0f172a', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          יום 2 - גארדלנד
        </button>
      </div>

      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1', maxWidth: '500px', margin: '0 auto', textAlign: 'right' }}>
        {activeDay === 0 ? (
          <>
            <h3>✈️ נחיתה והגעה למלון (30/09)</h3>
            <p>• 16:00 - נחיתה בשדה התעופה وרונה ואיסוף הרכב השכור.</p>
            <p>• 18:00 - הגעה למלון Bio Agriturismo Vojon בפסקיירה וארוחת ערב.</p>
          </>
        ) : (
          <>
            <h3>🎢 Gardaland – יום פארק מלא (01/10)</h3>
            <p>• 08:30 - יציאה מוקדמת לפארק השעשועים גארדלנד.</p>
            <p>• מתקנים, רכבות הרים ואקסטרים כל היום!</p>
          </>
        )}
      </div>
    </div>
  );
}
