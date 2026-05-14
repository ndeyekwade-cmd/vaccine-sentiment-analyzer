import React from 'react';

const MAX_CHARS = 280;
const MIN_WORDS = 3;

export default function TweetInput({ value, onChange, onAnalyze, loading }) {
  const charsLeft = MAX_CHARS - value.length;
  const isOver      = charsLeft < 0;
  const isNearLimit = charsLeft >= 0 && charsLeft < 20;

  const validate = () => {
    const t = value.trim();
    if (!t) return 'Veuillez entrer un tweet.';
    if (t.split(/\s+/).length < MIN_WORDS) return 'Veuillez entrer au moins 3 mots.';
    return null;
  };

  const handleSubmit = () => {
    const err = validate();
    if (err) { alert(err); return; }
    onAnalyze(value.trim());
  };

  const handleKey = e => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  const borderColor = isOver ? '#E24B4A' : 'var(--bordeaux-border)';

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--bordeaux-border)',
      borderRadius: '14px',
      padding: '24px',
    }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px' }}>
        Entrez un tweet à analyser
      </h2>

      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKey}
        placeholder="Tapez un tweet relatif aux vaccins COVID-19..."
        rows={4}
        style={{
          width: '100%',
          background: 'rgba(255,255,255,0.04)',
          border: `1px solid ${borderColor}`,
          borderRadius: '8px',
          padding: '14px 16px',
          color: 'var(--text-primary)',
          fontSize: '0.92rem',
          lineHeight: 1.65,
          resize: 'vertical',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e  => { if (!isOver) e.target.style.borderColor = 'var(--bordeaux-light)'; }}
        onBlur={e   => { e.target.style.borderColor = borderColor; }}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
        <span style={{
          fontSize: '0.78rem',
          color: isOver ? '#E24B4A' : isNearLimit ? 'var(--accent-pink)' : 'var(--text-muted)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {isOver ? `+${-charsLeft} au-dessus` : `${charsLeft} restant${charsLeft !== 1 ? 's' : ''}`}
        </span>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => onChange('')} style={{
            padding: '8px 16px',
            border: '1px solid var(--bordeaux-border)',
            borderRadius: '6px',
            color: 'var(--text-secondary)', fontSize: '0.85rem',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--bordeaux-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--bordeaux-border)'; }}
          >
            Effacer
          </button>

          <button onClick={handleSubmit} disabled={loading || isOver} style={{
            padding: '8px 22px',
            background: loading || isOver ? 'rgba(139,0,38,0.4)' : 'var(--bordeaux)',
            color: 'var(--text-primary)', borderRadius: '6px',
            fontSize: '0.85rem', fontWeight: 600,
            opacity: loading || isOver ? 0.65 : 1,
            transition: 'opacity 0.2s',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
          }}
            onMouseEnter={e => { if (!loading && !isOver) e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { if (!loading && !isOver) e.currentTarget.style.opacity = '1'; }}
          >
            {loading
              ? <>
                  <span style={{
                    width: '13px', height: '13px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.7s linear infinite',
                    display: 'inline-block',
                  }} />
                  Analyse...
                </>
              : 'Analyser'
            }
          </button>
        </div>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: '8px' }}>
        Ctrl+Entrée pour analyser rapidement
      </p>
    </div>
  );
}
