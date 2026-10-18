{activeTab === 'radar' && (
          <div style={{ background: '#18181b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', padding: '20px', textAlign: 'right', boxSizing: 'border-box', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 2px', letterSpacing: '-0.5px' }}>רדאר משפחתי – איתור ברחוב</h2>
                <span style={{ fontSize: '10px', color: '#a1a1aa' }}>לחץ על "נווט ➔" כדי לפתוח את הרחוב המדויק ב-Google/Apple Maps</span>
              </div>
              <span style={{ fontSize: '11px', background: '#27272a', color: '#22c55e', padding: '3px 8px', borderRadius: '10px', fontWeight: '700', border: '1px solid rgba(34, 197, 94, 0.3)' }}>● Live</span>
            </div>

            {/* מפה מוגדלת ונוחה לזום */}
            <div ref={mapContainerRef} style={{ width: '100%', height: '450px', borderRadius: '16px', marginBottom: '14px', zIndex: 1, border: '1px solid rgba(255,255,255,0.15)' }}></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box', width: '100%' }}>
              {Object.keys(allUsersLocations).length === 0 ? (
                <div style={{ padding: '15px', textAlign: 'center', color: '#a1a1aa', fontSize: '12px' }}>
                  ממתין לנתוני מיקום מהבנות...
                </div>
              ) : (
                Object.values(allUsersLocations).map((loc, idx) => (
                  <div key={idx} style={{ background: '#27272a', border: '1px solid rgba(255,255,255,0.08)', padding: '12px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#3f3f46', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '14px', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                          {loc.name ? loc.name[0] : '👤'}
                        </div>
                        <span style={{ position: 'absolute', bottom: '0px', right: '0px', width: '9px', height: '9px', background: '#22c55e', borderRadius: '50%', border: '1.5px solid #27272a' }}></span>
                      </div>
                      <div>
                        <strong style={{ fontSize: '14px', color: '#ffffff', fontWeight: '700', display: 'inline-block', marginLeft: '6px' }}>
                          {loc.name} {loc.name === currentUser ? '(אתה)' : ''}
                        </strong>
                        {loc.updated_at && (
                          <span style={{ fontSize: '10px', color: '#a1a1aa', display: 'block' }}>
                            עודכן לפני: {loc.updated_at}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {loc.name !== currentUser && (
                        <button onClick={() => sendPingToUser(loc.name)} style={{ background: '#f59e0b', color: '#ffffff', border: 'none', padding: '6px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }} title="שלח פינג התראה">
                          🔔 PING
                        </button>
                      )}
                      {/* כפתור זה פותח מיד את מפות Google / Apple ברמת רחוב מדויקת */}
                      <a href={getMapsUrl(loc.lat, loc.lng, loc.name)} target="_blank" rel="noreferrer" style={{ background: '#2563eb', color: '#ffffff', padding: '8px 12px', borderRadius: '8px', textDecoration: 'none', fontSize: '12px', fontWeight: '800', boxSizing: 'border-box', whiteSpace: 'nowrap', boxShadow: '0 2px 6px rgba(37,99,235,0.4)' }}>
                        📍 הצג רחוב ונווט ➔
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
