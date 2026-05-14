import React, { useEffect, useRef, useState } from 'react';

/* ─── Canvas particules (arrière-plan colonne gauche) ───────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let pts = [];
    const init = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      pts = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.65,
        vy: (Math.random() - 0.5) * 0.65,
        r: Math.random() * 1.5 + 0.5,
      }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(192,0,60,0.65)'; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 90) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(192,0,60,${(1 - d / 90) * 0.25})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    init(); window.addEventListener('resize', init); draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init); };
  }, []);
  return <canvas ref={ref} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* ─── Données ─────────────────────────────────────────────────────────────── */
const STATS = [
  { value: '9 967',      label: "tweets d'entraînement" },
  { value: '0.5485',     label: 'RMSE sur validation'   },
  { value: 'DistilBERT', label: 'modèle Transformer'    },
];

const STEPS = [
  { n: '1', title: 'Saisir un tweet',     desc: 'Entrez un tweet relatif aux vaccins.' },
  { n: '2', title: 'Analyse DistilBERT',  desc: 'Le modèle analyse le contenu sémantique.' },
  { n: '3', title: 'Résultat instantané', desc: 'Score et sentiment en temps réel.' },
];

const DEMOS = [
  { text: 'Vaccines cause autism, do not vaccinate!',               score: -0.87, label: 'Négatif', color: '#E24B4A' },
  { text: 'CDC releases updated vaccination guidelines',             score:  0.05, label: 'Neutre',  color: '#888780' },
  { text: 'Science shows vaccines are our best protection vs COVID', score:  0.91, label: 'Positif', color: '#C0003C' },
];

/* ─── Landing Page — plein écran sans scroll ─────────────────────────────── */
export default function LandingPage({ onAnalyze }) {
  const [logoErr, setLogoErr] = useState(false);

  return (
    <div style={{
      background: 'var(--bg-dark)',
      color: 'var(--text-primary)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px', height: '60px', flexShrink: 0,
        background: 'rgba(13,5,8,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)',
        zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1rem' }}>
          <span>💉</span><span>VaccineSentiment</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {logoErr
            ? <span style={{ color: 'var(--bordeaux-light)', fontWeight: 700, fontSize: '0.88rem' }}>AIMS</span>
            : (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '4px 10px',
                  background: '#fff',
                  border: '1.5px solid rgba(192,0,60,0.4)',
                  borderRadius: '10px',
                  overflow: 'hidden', flexShrink: 0,
                }}>
                  <img src="/logo_aims.jpeg" alt="AIMS" style={{ height: '28px', objectFit: 'contain' }} onError={() => setLogoErr(true)} />
                </div>
              )
          }
          <button onClick={onAnalyze} style={{
            padding: '7px 20px', background: 'var(--bordeaux)',
            color: 'var(--text-primary)', borderRadius: '6px',
            fontSize: '0.85rem', fontWeight: 600, transition: 'opacity 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Analyser un tweet →
          </button>
        </div>
      </nav>

      {/* ── Corps principal : 2 colonnes ────────────────────────────────── */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        overflow: 'hidden',
      }}>

        {/* ── Colonne gauche : Hero ────────────────────────────────────── */}
        <div style={{
          position: 'relative',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 56px',
          borderRight: '0.5px solid rgba(255,255,255,0.06)',
        }}>
          <ParticleCanvas />
          <div style={{ position: 'relative', zIndex: 1, animation: 'fadeIn 0.7s ease both' }}>

            <div style={{
              display: 'inline-block', padding: '3px 14px',
              border: '1px solid var(--bordeaux-border)', borderRadius: '20px',
              fontSize: '0.67rem', letterSpacing: '0.09em', textTransform: 'uppercase',
              color: 'var(--accent-pink)', marginBottom: '20px',
            }}>
              Compétition Zindi · AIMS Sénégal 2026
            </div>

            <h1 style={{
              fontSize: 'clamp(1.8rem, 3vw, 2.8rem)',
              fontWeight: 800, lineHeight: 1.2, marginBottom: '16px',
            }}>
              Analyser le <span style={{ color: 'var(--bordeaux-light)' }}>sentiment</span><br />
              des tweets sur les vaccins
            </h1>

            <p style={{
              color: 'var(--text-secondary)', fontSize: '0.9rem',
              lineHeight: 1.75, marginBottom: '32px', maxWidth: '400px',
            }}>
              Modèle DistilBERT fine-tuné sur 9 967 tweets — score continu entre −1 (anti-vaccin) et +1 (pro-vaccin).
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '40px' }}>
              <button onClick={onAnalyze} style={{
                padding: '12px 28px', background: 'var(--bordeaux)',
                color: 'var(--text-primary)', borderRadius: '8px',
                fontWeight: 600, fontSize: '0.92rem', transition: 'opacity 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                Tester le modèle →
              </button>
              <a href="https://github.com" target="_blank" rel="noreferrer" style={{
                padding: '12px 28px',
                border: '1px solid var(--bordeaux-border)',
                color: 'var(--text-secondary)', borderRadius: '8px',
                fontWeight: 600, fontSize: '0.92rem', transition: 'all 0.2s',
                display: 'inline-flex', alignItems: 'center',
              }}
                onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.borderColor = 'var(--bordeaux-light)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.borderColor = 'var(--bordeaux-border)'; }}
              >
                Voir le code GitHub
              </a>
            </div>

          </div>
        </div>

        {/* ── Colonne droite : Steps + Demos ──────────────────────────── */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 48px',
          gap: '28px',
          overflow: 'hidden',
        }}>

          {/* Comment ça marche */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Comment ça marche
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px' }}>
              {STEPS.map(s => (
                <div key={s.n} style={{
                  background: 'var(--bg-card)', border: '1px solid var(--bordeaux-border)',
                  borderRadius: '10px', padding: '14px',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <div style={{
                    width: '28px', height: '28px', background: 'var(--bordeaux)',
                    borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 700, fontSize: '0.82rem', marginBottom: '10px',
                  }}>{s.n}</div>
                  <div style={{ fontWeight: 600, fontSize: '0.82rem', marginBottom: '5px' }}>{s.title}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.76rem', lineHeight: 1.55 }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Les 3 sentiments */}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px' }}>
              Les 3 sentiments détectés
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {DEMOS.map(ex => (
                <div key={ex.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'var(--bg-card)', border: `1px solid ${ex.color}44`,
                  borderRadius: '10px', padding: '12px 16px',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-card)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <span style={{
                      flexShrink: 0, padding: '2px 10px',
                      background: ex.color + '22', color: ex.color,
                      borderRadius: '10px', fontSize: '0.7rem', fontWeight: 600,
                    }}>{ex.label}</span>
                    <span style={{
                      color: 'var(--text-secondary)', fontSize: '0.82rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      fontStyle: 'italic',
                    }}>"{ex.text}"</span>
                  </div>
                  <span style={{ color: ex.color, fontWeight: 700, fontSize: '0.95rem', marginLeft: '16px', flexShrink: 0 }}>
                    {ex.score > 0 ? '+' : ''}{ex.score.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
