import React, { useEffect, useState } from 'react';

export default function SentimentGauge({ score }) {
  // Petite pause avant animation pour déclencher la transition CSS
  const [displayed, setDisplayed] = useState(score);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(score), 60);
    return () => clearTimeout(t);
  }, [score]);

  // Convertit [-1, 1] → [0, 100] en pourcentage
  const pct = Math.round(((displayed + 1) / 2) * 100);
  // Clampe pour que le curseur ne sorte pas de la barre
  const cursorPct = Math.max(1, Math.min(99, pct));

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--bordeaux-border)',
      borderRadius: '14px',
      padding: '20px 24px',
    }}>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '16px' }}>
        Échelle de sentiment
      </p>

      {/* Barre des zones */}
      <div style={{ position: 'relative', height: '10px', borderRadius: '5px', overflow: 'visible', marginBottom: '8px' }}>
        {/* Fond zone neutre */}
        <div style={{ position: 'absolute', inset: 0, borderRadius: '5px', background: 'rgba(255,255,255,0.05)' }} />
        {/* Zone négative */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '35%',
          borderRadius: '5px 0 0 5px',
          background: 'linear-gradient(to right, rgba(226,75,74,0.7), rgba(226,75,74,0.35))',
        }} />
        {/* Zone neutre */}
        <div style={{
          position: 'absolute', left: '35%', top: 0, bottom: 0, width: '30%',
          background: 'rgba(136,135,128,0.3)',
        }} />
        {/* Zone positive */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '35%',
          borderRadius: '0 5px 5px 0',
          background: 'linear-gradient(to right, rgba(192,0,60,0.35), rgba(192,0,60,0.8))',
        }} />

        {/* Curseur animé */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: `${cursorPct}%`,
          transform: 'translate(-50%, -50%)',
          width: '18px', height: '18px',
          borderRadius: '50%',
          background: 'var(--text-primary)',
          border: '2.5px solid var(--bordeaux-light)',
          boxShadow: '0 0 8px rgba(192,0,60,0.7)',
          transition: 'left 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)',
          zIndex: 2,
        }} />
      </div>

      {/* Labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
        <span style={{ color: '#E24B4A', fontSize: '0.72rem', fontWeight: 500 }}>Anti-vaccin</span>
        <span style={{ color: '#888780', fontSize: '0.72rem', fontWeight: 500 }}>Neutre</span>
        <span style={{ color: '#C0003C', fontSize: '0.72rem', fontWeight: 500 }}>Pro-vaccin</span>
      </div>

      {/* Graduations */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
        {['−1', '−0.3', '0', '+0.3', '+1'].map(t => (
          <span key={t} style={{ color: 'var(--text-muted)', fontSize: '0.68rem', fontVariantNumeric: 'tabular-nums' }}>{t}</span>
        ))}
      </div>
    </div>
  );
}
