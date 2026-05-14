import React from 'react';

const COLORS = {
  Positif: '#C0003C',
  Neutre:  '#888780',
  Négatif: '#E24B4A',
};

// history et onClear sont gérés dans AnalyzerPage (state + localStorage)
export default function HistoryPanel({ history = [], onSelect, onClear }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--bordeaux-border)',
      borderRadius: '14px',
      padding: '20px',
      position: 'sticky',
      top: '88px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 600 }}>
          Historique ({history.length}/10)
        </h3>
        {history.length > 0 && (
          <button onClick={onClear} style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            padding: '4px 8px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '4px',
            transition: 'color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = '#E24B4A'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            Effacer
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '28px 0' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Aucune analyse pour l'instant</p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '6px' }}>Les résultats apparaîtront ici</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', maxHeight: '72vh', overflowY: 'auto' }}>
          {history.map((entry, i) => {
            const color = COLORS[entry.sentiment] || 'var(--text-secondary)';
            return (
              <button key={i} onClick={() => onSelect(entry.text)} style={{
                display: 'block', width: '100%', textAlign: 'left',
                padding: '10px 12px',
                background: 'rgba(255,255,255,0.03)',
                border: `1px solid ${color}33`,
                borderRadius: '8px',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ color, fontSize: '0.72rem', fontWeight: 700 }}>{entry.sentiment}</span>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ color, fontSize: '0.78rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                      {(entry.score || 0) >= 0 ? '+' : ''}{(entry.score || 0).toFixed(2)}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.68rem' }}>{entry.time}</span>
                  </div>
                </div>
                <p style={{
                  color: 'var(--text-secondary)', fontSize: '0.78rem',
                  lineHeight: 1.4, overflow: 'hidden',
                  textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {entry.text}
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
