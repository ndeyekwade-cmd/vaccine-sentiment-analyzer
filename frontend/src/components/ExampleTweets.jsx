import React from 'react';

const EXAMPLES = [
  { text: "Vaccines cause autism, do not vaccinate your children!",          label: 'Négatif', color: '#E24B4A' },
  { text: "The government is lying about vaccine safety, this is dangerous", label: 'Négatif', color: '#E24B4A' },
  { text: "Health officials confirm new measles outbreak in the region",     label: 'Neutre',  color: '#888780' },
  { text: "CDC releases updated vaccination guidelines for 2024",            label: 'Neutre',  color: '#888780' },
  { text: "Just got vaccinated! Vaccines are safe and save lives",           label: 'Positif', color: '#C0003C' },
  { text: "Science shows vaccines are our best protection against COVID-19", label: 'Positif', color: '#C0003C' },
];

export default function ExampleTweets({ onSelect }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--bordeaux-border)',
      borderRadius: '14px',
      padding: '20px 24px',
    }}>
      <h3 style={{ fontSize: '0.92rem', fontWeight: 600, marginBottom: '14px' }}>
        Exemples à tester
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {EXAMPLES.map((ex, i) => (
          <button
            key={i}
            onClick={() => onSelect(ex.text)}
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '12px',
              padding: '11px 14px',
              background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${ex.color}33`,
              borderRadius: '8px',
              textAlign: 'left', width: '100%',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = ex.color + '66'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = ex.color + '33'; }}
          >
            <span style={{
              flexShrink: 0,
              padding: '2px 9px',
              background: ex.color + '22',
              color: ex.color,
              borderRadius: '10px',
              fontSize: '0.68rem',
              fontWeight: 600,
              marginTop: '2px',
            }}>
              {ex.label}
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', lineHeight: 1.5 }}>
              {ex.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
