import React, { useState } from 'react';
import TweetInput      from './TweetInput';
import SentimentResult from './SentimentResult';
import SentimentGauge  from './SentimentGauge';
import HistoryPanel    from './HistoryPanel';

// En développement (proxy dans package.json), API_URL est vide → appels vers /predict
// En production (FastAPI sert le build React), API_URL est aussi vide → même origine
// Pour cibler un autre serveur, définir REACT_APP_API_URL dans .env
const API_URL = process.env.REACT_APP_API_URL || '';

export default function AnalyzerPage({ onBack }) {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [tweet,   setTweet]   = useState('');

  // Historique persisté en localStorage, géré ici (prop drilling vers HistoryPanel)
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('vaccine-sentiment-history') || '[]'); }
    catch { return []; }
  });

  const analyze = async (text) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({ detail: 'Erreur inconnue' }));
        throw new Error(body.detail || 'Erreur lors de la prédiction');
      }
      const data = await res.json();
      setResult({ ...data, text });

      const entry = {
        text,
        ...data,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      };
      const updated = [entry, ...history].slice(0, 10);
      localStorage.setItem('vaccine-sentiment-history', JSON.stringify(updated));
      setHistory(updated);

    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (text) => { setTweet(text); analyze(text); };
  const clearHistory  = () => { localStorage.removeItem('vaccine-sentiment-history'); setHistory([]); };

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100vh', color: 'var(--text-primary)' }}>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '14px 32px',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        background: 'rgba(13,5,8,0.95)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          color: 'var(--text-secondary)', fontSize: '0.85rem',
          padding: '6px 14px',
          border: '1px solid var(--bordeaux-border)', borderRadius: '6px',
          transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--bordeaux-light)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--bordeaux-border)'; }}
        >
          ← Retour
        </button>
        <h1 style={{ fontSize: '1rem', fontWeight: 700 }}>💉 VaccineSentiment — Analyseur</h1>
      </header>

      {/* ── Grid 2 colonnes ───────────────────────────────────────────────── */}
      <div className="analyzer-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) 320px',
        gap: '22px',
        padding: '28px 32px',
        maxWidth: '1100px',
        margin: '0 auto',
        alignItems: 'start',
      }}>

        {/* Colonne gauche : saisie + résultats + exemples */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <TweetInput
            value={tweet}
            onChange={setTweet}
            onAnalyze={analyze}
            loading={loading}
          />

          {error && (
            <div style={{
              background: 'rgba(226,75,74,0.08)',
              border: '1px solid rgba(226,75,74,0.3)',
              borderRadius: '10px', padding: '14px 18px',
              color: '#E24B4A', fontSize: '0.88rem',
            }}>
              ⚠ {error}
            </div>
          )}

          {result && (
            <>
              <SentimentResult result={result} />
              <SentimentGauge  score={result.score} />
            </>
          )}

        </div>

        {/* Colonne droite : historique */}
        <HistoryPanel
          history={history}
          onSelect={handleSelect}
          onClear={clearHistory}
        />
      </div>
    </div>
  );
}
