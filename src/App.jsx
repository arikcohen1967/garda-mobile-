{activeTab === 'radar' && (
          <div style={{ background: '#18181b', color: '#ffffff', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', padding: '20px', textAlign: 'right', boxSizing: 'border-box', width: '100%', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', backdropFilter: 'blur(20px)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: '800', margin: '0 0 2px', letterSpacing: '-0.5px' }}>מפה חיה ורדאר משתמשים</h2>
                <span style={{ fontSize: '10px', color: '#a1a1aa' }}>לחץ פעמיים (Double Click) על המפה למעבר למסך מלא</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button 
                  onClick={() => {
                    const el = mapContainerRef.current;
                    if (!el) return;
                    if (!document.fullscreenElement) {
                      el.requestFullscreen().catch(err => alert(`שגיאה במעבר למסך מלא: ${err.message}`));
                    } else {
                      document.exitFullscreen();
                    }
                  }} 
                  style={{ background: '#3f3f46', color: '#ffffff', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                >
                  ⛶ מסך מלא
                </button>
                <span style={{ fontSize: '11px', background: '#27272a', color: '#22c55e', padding: '3px 8px', borderRadius: '10px', fontWeight: '700', border: '1px solid rgba(34, 197, 94, 0.3)' }}>● Live</span>
              </div>
            </div>

            {/* אזור המפה - לחיצה כפולה (Double Click) תכניס או תצא ממסך מלא */}
            <div 
              ref={mapContainerRef} 
              onDoubleClick={() => {
                const el = mapContainerRef.current;
                if (!el) return;
                if (!document.fullscreenElement) {
                  el.requestFullscreen().catch(err => {});
                } else {
                  document.exitFullscreen().catch(err => {});
                }
              }}
              style={{ width: '100%', height: '500px', borderRadius: '16px', marginBottom: '14px', zIndex: 1, border: '1px solid rgba(255,255,255,0.15)', cursor: 'zoom-in' }}
              title="לחץ פעמיים למסך מלא"
            ></div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', boxSizing: 'border-box', width: '100%' }}>
              {Object.keys(allUsersLocations).length === 0 ? (
                <div style={{ padding: '15px', textAlign: 'center', color: '#a1a1aa', fontSize: '12px' }}>
                  ממתין לנתוני מיקום מהמשתמשים...
                </div>
              ) : (
                Object.values(allUsersLocations).map((loc, idx) => (
                  <div key={idx} style={{ background: '#27272a', border: '1px solid rgba(255,255,255,0.08)', padding: '10px 14px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ position: 'relative' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#3f3f46', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '13px', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                          {loc.name ? loc.name[0] : '👤'}
                        </div>
                        <span style={{ position: 'absolute', bottom: '0px', right: '0px', width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%', border: '1.5px solid #27272a' }}></span>
                      </div>
                      <div>
                        <strong style={{ fontSize: '13px', color: '#ffffff', fontWeight: '700', display: 'inline-block', marginLeft: '6px' }}>
                          {loc.name} {loc.name === currentUser ? '(אתה)' : ''}
                        </strong>
                        {loc.updated_at && (
                          <span style={{ fontSize: '10px', color: '#a1a1aa' }}>
                            ({loc.updated_at})
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '6px' }}>
                      {loc.name !== currentUser && (
                        <button onClick={() => sendPingToUser(loc.name)} style={{ background: '#f59e0b', color: '#ffffff', border: 'none', padding: '6px 8px', borderRadius: '8px', fontSize: '11px', fontWeight: '800', cursor: 'pointer' }} title="שלח פינג התראה">
                          🔔 PING
                        </button>
                      )}
                      <a href={getMapsUrl(loc.lat, loc.lng, loc.name)} target="_blank" rel="noreferrer" style={{ background: '#3b82f6', color: '#ffffff', padding: '6px 10px', borderRadius: '8px', textDecoration: 'none', fontSize: '11px', fontWeight: '700', boxSizing: 'border-box', whiteSpace: 'nowrap' }}>
                        נווט ➔
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
