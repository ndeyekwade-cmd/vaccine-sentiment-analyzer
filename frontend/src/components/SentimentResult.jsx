import React from 'react';

const CONFIG = {
  Positif: { color: '#C0003C', icon: '✓', bg: 'rgba(192,0,60,0.08)'  },
  Neutre:  { color: '#888780', icon: '◎', bg: 'rgba(136,135,128,0.08)' },
  Négatif: { color: '#E24B4A', icon: '✗', bg: 'rgba(226,75,74,0.08)'  },
};

export default function SentimentResult({ result }) {
  const { sentiment, score, confidence } = result;
  const cfg = CONFIG[sentiment] || { color: 'var(--text-secondary)', icon: '?', bg: 'transparent' };

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${cfg.color}55`,
      borderRadius: '14px',
      padding: '24px',
      animation: 'fadeIn 0.4s ease both',
    }}>
      {/* Ligne principale : étiquette + badge confiance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
        <div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.78rem', marginBottom: '8px' }}>
            Résultat de l'analyse
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '34px', height: '34px',
              background: cfg.bg, color: cfg.color,
              borderRadius: '8px',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '1rem', flexShrink: 0,
            }}>
              {cfg.icon}
            </span>
            <span style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, color: cfg.color }}>
              {sentiment?.toUpperCase()}
            </span>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          background: cfg.bg,
          border: `1px solid ${cfg.color}44`,
          borderRadius: '10px',
          padding: '10px 18px',
          flexShrink: 0,
        }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: cfg.color, lineHeight: 1 }}>
            {confidence}%
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
            Confiance
          </div>
        </div>
      </div>

      {/* Score numérique */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 16px',
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '8px',
      }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>Score :</span>
        <span style={{
          fontWeight: 700, color: cfg.color,
          fontSize: '1.1rem', fontVariantNumeric: 'tabular-nums',
        }}>
          {score >= 0 ? '+' : ''}{score.toFixed(4)}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>(entre −1 et +1)</span>
      </div>
    </div>
  );
}
