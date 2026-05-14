import React, { useState } from 'react';
import HistoryPanel from './HistoryPanel';

const API_URL = process.env.REACT_APP_API_URL || '';

const SENTIMENT_CFG = {
  Positif: { color: '#C0003C', bg: 'rgba(192,0,60,0.08)', label: 'PRO-VACCINE',  emoji: '✦' },
  Neutre:  { color: '#888780', bg: 'rgba(136,135,128,0.08)', label: 'NEUTRAL',   emoji: '◈' },
  Négatif: { color: '#E24B4A', bg: 'rgba(226,75,74,0.08)', label: 'ANTI-VACCINE', emoji: '✖' },
};

/* ─── Gauge intégrée ─────────────────────────────────────────────────────────── */
function Gauge({ score }) {
  const [displayed, setDisplayed] = React.useState(0);
  React.useEffect(() => { const t = setTimeout(() => setDisplayed(score), 80); return () => clearTimeout(t); }, [score]);
  const pct = Math.max(1, Math.min(99, ((displayed + 1) / 2) * 100));

  return (
    <div>
      <div style={{ position: 'relative', height: '8px', borderRadius: '4px', background: 'rgba(255,255,255,0.06)', marginBottom: '8px' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '33%', borderRadius: '4px 0 0 4px', background: 'rgba(226,75,74,0.5)' }} />
        <div style={{ position: 'absolute', left: '33%', top: 0, bottom: 0, width: '34%', background: 'rgba(136,135,128,0.35)' }} />
        <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '33%', borderRadius: '0 4px 4px 0', background: 'rgba(192,0,60,0.5)' }} />
        <div style={{
          position: 'absolute', top: '50%', left: `${pct}%`,
          transform: 'translate(-50%, -50%)',
          width: '16px', height: '16px', borderRadius: '50%',
          background: '#fff', border: '2.5px solid var(--bordeaux-light)',
          boxShadow: '0 0 8px rgba(192,0,60,0.6)',
          transition: 'left 0.7s cubic-bezier(0.34,1.56,0.64,1)',
          zIndex: 2,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
        <span style={{ color: '#E24B4A' }}>Anti-vaccine</span>
        <span style={{ color: '#888780' }}>Neutral</span>
        <span style={{ color: '#C0003C' }}>Pro-vaccine</span>
      </div>
    </div>
  );
}

/* ─── Résultat ───────────────────────────────────────────────────────────────── */
function ResultCard({ result }) {
  const cfg = SENTIMENT_CFG[result.sentiment] || SENTIMENT_CFG.Neutre;

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: `1px solid ${cfg.color}44`,
      borderRadius: '16px',
      overflow: 'hidden',
      animation: 'fadeIn 0.4s ease both',
    }}>
      {/* Bande colorée en haut */}
      <div style={{ height: '3px', background: `linear-gradient(90deg, ${cfg.color}, transparent)` }} />

      <div style={{ padding: '24px' }}>
        {/* Tweet analysé */}
        <div style={{
          padding: '12px 16px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: '10px',
          marginBottom: '20px',
          borderLeft: `3px solid ${cfg.color}66`,
        }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.6 }}>
            "{result.text.length > 120 ? result.text.slice(0, 120) + '...' : result.text}"
          </p>
        </div>

        {/* Sentiment + score + confiance */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>

          {/* Sentiment principal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px', height: '48px',
              borderRadius: '12px',
              background: cfg.bg,
              border: `1px solid ${cfg.color}44`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', color: cfg.color,
            }}>
              {cfg.emoji}
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '3px' }}>
                SENTIMENT
              </div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: cfg.color, lineHeight: 1 }}>
                {cfg.label}
              </div>
            </div>
          </div>

          {/* Score + confiance */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <div style={{ textAlign: 'center', padding: '10px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: cfg.color, fontVariantNumeric: 'tabular-nums' }}>
                {result.score >= 0 ? '+' : ''}{result.score.toFixed(3)}
              </div>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.06em' }}>SCORE</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 16px', background: cfg.bg, border: `1px solid ${cfg.color}33`, borderRadius: '10px' }}>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: cfg.color }}>
                {result.confidence}%
              </div>
              <div style={{ fontSize: '0.63rem', color: 'var(--text-muted)', marginTop: '2px', letterSpacing: '0.06em' }}>CONFIDENCE</div>
            </div>
          </div>
        </div>

        {/* Gauge */}
        <Gauge score={result.score} />
      </div>
    </div>
  );
}

/* ─── Input ──────────────────────────────────────────────────────────────────── */
function InputCard({ value, onChange, onAnalyze, loading }) {
  const MAX = 280;
  const charsLeft = MAX - value.length;
  const isOver = charsLeft < 0;

  const submit = () => {
    const t = value.trim();
    if (!t) return;
    if (t.split(/\s+/).length < 3) { alert('Please enter at least 3 words.'); return; }
    onAnalyze(t);
  };

  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--bordeaux-border)', borderRadius: '16px', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '16px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--bordeaux-light)', boxShadow: '0 0 6px rgba(192,0,60,0.8)' }} />
        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>Analyze a tweet</span>
      </div>

      {/* Textarea */}
      <div style={{ padding: '20px 24px 16px' }}>
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) submit(); }}
          placeholder="Type or paste a COVID-19 vaccine related tweet..."
          rows={5}
          style={{
            width: '100%',
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${isOver ? '#E24B4A' : 'rgba(192,0,60,0.2)'}`,
            borderRadius: '10px',
            padding: '14px 16px',
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            lineHeight: 1.7,
            resize: 'none',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => { if (!isOver) e.target.style.borderColor = 'var(--bordeaux-light)'; }}
          onBlur={e => { e.target.style.borderColor = isOver ? '#E24B4A' : 'rgba(192,0,60,0.2)'; }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: isOver ? '#E24B4A' : 'var(--text-muted)' }}>
            {isOver ? `${-charsLeft} over limit` : `${charsLeft} characters left`}
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => onChange('')} style={{
              padding: '9px 18px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', color: 'var(--text-secondary)',
              fontSize: '0.83rem', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--bordeaux-border)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
            >
              Clear
            </button>
            <button onClick={submit} disabled={loading || isOver} style={{
              padding: '9px 28px',
              background: loading || isOver ? 'rgba(139,0,38,0.35)' : 'var(--bordeaux)',
              color: 'var(--text-primary)', borderRadius: '8px',
              fontSize: '0.83rem', fontWeight: 600,
              opacity: loading || isOver ? 0.65 : 1,
              transition: 'opacity 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}
              onMouseEnter={e => { if (!loading && !isOver) e.currentTarget.style.opacity = '0.85'; }}
              onMouseLeave={e => { if (!loading && !isOver) e.currentTarget.style.opacity = '1'; }}
            >
              {loading
                ? <><span style={{ width: '13px', height: '13px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Analyzing...</>
                : 'Analyze →'
              }
            </button>
          </div>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', marginTop: '8px' }}>Ctrl+Enter to analyze</p>
      </div>
    </div>
  );
}

/* ─── Page principale ────────────────────────────────────────────────────────── */
export default function AnalyzerPage({ onBack }) {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [tweet,   setTweet]   = useState('');
  const [logoErr, setLogoErr] = useState(false);

  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vaccine-sentiment-history') || '[]'); }
    catch { return []; }
  });

  const analyze = async (text) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: 'Unknown error' }));
        throw new Error(body.detail || 'Prediction error');
      }
      const data = await res.json();
      setResult({ ...data, text });
      const entry = { text, ...data, time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) };
      const updated = [entry, ...history].slice(0, 10);
      localStorage.setItem('vaccine-sentiment-history', JSON.stringify(updated));
      setHistory(updated);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleSelect = (text) => { setTweet(text); analyze(text); };
  const clearHistory = () => { localStorage.removeItem('vaccine-sentiment-history'); setHistory([]); };

  return (
    <div style={{ background: 'var(--bg-dark)', height: '100vh', display: 'flex', flexDirection: 'column', color: 'var(--text-primary)', overflow: 'hidden' }}>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', height: '60px', flexShrink: 0,
        borderBottom: '0.5px solid rgba(255,255,255,0.07)',
        background: 'rgba(13,5,8,0.97)', backdropFilter: 'blur(12px)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={onBack} style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            color: 'var(--text-secondary)', fontSize: '0.82rem',
            padding: '6px 14px',
            border: '1px solid var(--bordeaux-border)', borderRadius: '6px',
            transition: 'all 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--bordeaux-light)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--bordeaux-border)'; }}
          >
            ← Back
          </button>
        </div>

        {/* Logo AIMS */}
        {logoErr
          ? <span style={{ color: 'var(--bordeaux-light)', fontWeight: 700, fontSize: '0.85rem' }}>AIMS</span>
          : <div style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', background: '#fff', borderRadius: '8px', border: '1px solid rgba(192,0,60,0.3)' }}>
              <img src="/logo_aims.jpeg" alt="AIMS" style={{ height: '26px', objectFit: 'contain' }} onError={() => setLogoErr(true)} />
            </div>
        }
      </header>

      {/* ── Contenu : 2 colonnes ────────────────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0,1fr) 300px',
        gap: '0',
        overflow: 'hidden',
      }}>

        {/* Colonne gauche */}
        <div style={{ padding: '28px 32px', display: 'flex', flexDirection: 'column', gap: '18px', overflowY: 'auto' }}>

          <InputCard value={tweet} onChange={setTweet} onAnalyze={analyze} loading={loading} />

          {error && (
            <div style={{
              background: 'rgba(226,75,74,0.08)', border: '1px solid rgba(226,75,74,0.3)',
              borderRadius: '10px', padding: '13px 18px', color: '#E24B4A', fontSize: '0.85rem',
            }}>
              ⚠ {error}
            </div>
          )}

          {!result && !loading && (
            <div style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '40px', textAlign: 'center',
              border: '1px dashed rgba(192,0,60,0.15)', borderRadius: '16px',
              background: 'rgba(192,0,60,0.02)',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '14px', opacity: 0.4 }}>💉</div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7 }}>
                Enter a tweet above and click <strong style={{ color: 'var(--text-secondary)' }}>Analyze</strong><br />
                to get the sentiment prediction.
              </p>
            </div>
          )}

          {result && <ResultCard result={result} />}
        </div>

        {/* Colonne droite — Historique */}
        <div style={{ borderLeft: '0.5px solid rgba(255,255,255,0.06)', overflowY: 'auto' }}>
          <HistoryPanel history={history} onSelect={handleSelect} onClear={clearHistory} />
        </div>
      </div>
    </div>
  );
}
