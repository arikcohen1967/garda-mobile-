{activeTab === 'around' && (
          <div style={{ background: S.cardBg, border: `1px solid ${S.cardBorder}`, borderRadius: S.radius, padding: '20px', textAlign: 'center', boxSizing: 'border-box', width: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📍</div>
            <h2 style={{ fontSize: '17px', fontWeight: '900', color: S.textPrimary, marginBottom: '6px' }}>מה יש סביבי?</h2>
            <p style={{ fontSize: '12px', color: S.textSecondary, marginBottom: '18px' }}>מצא מקומות בקרבת המיקום הנוכחי שלך בלחיצת כפתור:</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px', boxSizing: 'border-box', width: '100%' }}>
              <button type="button" onClick={() => searchAroundMe('מסעדות')} style={{ padding: '14px 10px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                🍽️ מסעדות
              </button>
              <button type="button" onClick={() => searchAroundMe('מוזיאונים')} style={{ padding: '14px 10px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                🏛️ מוזיאונים
              </button>
              <button type="button" onClick={() => searchAroundMe('אטרקציות תיירותיות')} style={{ padding: '14px 10px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                🎢 אטרקציות
              </button>
              <button type="button" onClick={() => searchAroundMe('בתי קפה')} style={{ padding: '14px 10px', borderRadius: '12px', border: `1px solid ${S.cardBorder}`, background: '#f8fafc', color: S.textPrimary, fontWeight: '800', fontSize: '13px', cursor: 'pointer', textAlign: 'center', boxSizing: 'border-box', flexShrink: 0 }}>
                ☕ בתי קפה
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', boxSizing: 'border-box', width: '100%', flexShrink: 0 }}>
              <input 
                type="text" 
                placeholder="הקלד כל דבר (לדוגמה: סופרמרקט...)" 
                value={customSearchQuery} 
                onChange={e => setCustomSearchQuery(e.target.value)}
                style={{ flex: 1, minWidth: 0, padding: '12px', borderRadius: '10px', border: `1px solid ${S.cardBorder}`, fontSize: '16px', boxSizing: 'border-box', outline: 'none', background: '#ffffff', color: '#0f172a' }}
              />
              <button type="button" onClick={() => searchAroundMe(customSearchQuery)} style={{ padding: '12px 18px', background: S.accent, color: '#fff', border: 'none', borderRadius: '10px', fontWeight: '800', fontSize: '13px', cursor: 'pointer', boxSizing: 'border-box', flexShrink: 0 }}>
                חפש 🔍
              </button>
            </div>
          </div>
        )}
