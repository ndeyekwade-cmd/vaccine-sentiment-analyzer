import React, { useEffect, useRef, useState } from 'react';

/* ─── Canvas particules ─────────────────────────────────────────────────────── */
function ParticleCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let pts = [];
    const init = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      pts = Array.from({ length: 60 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
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
        ctx.fillStyle = 'rgba(192,0,60,0.8)'; ctx.fill();
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 90) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(192,0,60,${(1 - d / 90) * 0.35})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    init(); window.addEventListener('resize', init); draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', init); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />;
}

/* ─── Photos alternantes ─────────────────────────────────────────────────────── */
const PHOTOS = ['/groupe-photo.jpeg', '/groupe-photo_1.jpeg'];

function RotatingPhoto() {
  const [idx,  setIdx]  = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => { setIdx(i => (i + 1) % PHOTOS.length); setFade(true); }, 450);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  return (
    <img
      key={idx}
      src={PHOTOS[idx]}
      alt="Équipe"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        objectPosition: 'center top',
        opacity: fade ? 1 : 0,
        transition: 'opacity 0.45s ease',
        display: 'block',
        imageRendering: 'auto',
      }}
    />
  );
}

/* ─── Splash Screen — layout 2 colonnes ─────────────────────────────────────── */
export default function SplashScreen({ onEnter }) {
  const [exiting, setExiting] = useState(false);
  const [logoErr, setLogoErr] = useState(false);

  const handleEnter = () => { setExiting(true); setTimeout(onEnter, 500); };

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--bg-dark)',
      display: 'flex', flexDirection: 'column',
      opacity: exiting ? 0 : 1,
      transition: 'opacity 0.5s ease',
      overflow: 'hidden',
    }}>
      <ParticleCanvas />

      {/* Contenu principal : 2 colonnes */}
      <div style={{
        position: 'relative', zIndex: 1,
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '1fr 1.5fr',
        maxWidth: '1100px',
        width: '100%',
        margin: '0 auto',
        padding: '0 32px',
        alignItems: 'center',
        gap: '48px',
        animation: 'fadeIn 0.8s ease both',
      }}>

        {/* ── Colonne gauche : texte ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>

          {/* Logo AIMS */}
          <div style={{ marginBottom: '20px' }}>
            {logoErr
              ? <span style={{ color: 'var(--bordeaux-light)', fontWeight: 800, fontSize: '1.3rem', letterSpacing: '0.06em' }}>AIMS</span>
              : (
                <div style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  padding: '6px 12px',
                  background: '#fff',
                  border: '2px solid rgba(192,0,60,0.45)',
                  borderRadius: '12px',
                  boxShadow: '0 0 14px rgba(192,0,60,0.2)',
                  overflow: 'hidden',
                }}>
                  <img src="/logo_aims.jpeg" alt="AIMS Sénégal" style={{ height: '42px', objectFit: 'contain' }} onError={() => setLogoErr(true)} />
                </div>
              )
            }
          </div>


          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Welcome to</p>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
            fontWeight: 800, color: 'var(--bordeaux-light)',
            lineHeight: 1.15, marginBottom: '16px',
          }}>
            VaccineSentiment<br />Analyzer
          </h1>

          {/* Divider */}
          <div style={{
            width: '70px', height: '2px',
            background: 'linear-gradient(90deg, var(--bordeaux-light), transparent)',
            marginBottom: '16px',
          }} />

          <p style={{
            color: 'var(--text-secondary)', fontSize: '0.88rem',
            lineHeight: 1.75, marginBottom: '28px', maxWidth: '380px',
          }}>
            A sentiment analysis platform powered by DistilBERT to classify COVID-19 vaccine-related tweets.
          </p>

          {/* Bouton */}
          <button onClick={handleEnter} style={{
            alignSelf: 'flex-start',
            padding: '13px 36px',
            background: 'var(--bordeaux)', color: 'var(--text-primary)',
            borderRadius: '8px', fontSize: '0.95rem', fontWeight: 600,
            transition: 'opacity 0.2s', marginBottom: '24px',
          }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
          >
            Enter the platform →
          </button>

        </div>

        {/* ── Colonne droite : photo + noms ─────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '18px' }}>
          <div style={{
            width: '100%',
            maxWidth: '420px',
            aspectRatio: '4 / 3',
            borderRadius: '16px',
            border: '2px solid rgba(192,0,60,0.45)',
            overflow: 'hidden',
            boxShadow: '0 0 40px rgba(192,0,60,0.15)',
          }}>
            <RotatingPhoto />
          </div>

          {/* Équipe */}
          <div style={{ width: '100%', maxWidth: '420px' }}>

            {/* Cercles initiaux sur une seule ligne */}
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', marginBottom: '12px' }}>
              {[
                { name: 'Ndeye Khady Wade', initials: 'NKW', display: 'Khadija'  },
                { name: 'Maimouna Ndoye',   initials: 'MN',  display: 'Maimouna' },
                { name: 'Soukeyna Touré',   initials: 'ST',  display: 'Soukeyna' },
              ].map(({ name, initials, display }) => (
                <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <div style={{
                    width: '52px', height: '52px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B0026, #C0003C)',
                    border: '2px solid rgba(192,0,60,0.5)',
                    boxShadow: '0 0 14px rgba(192,0,60,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.7rem', fontWeight: 800,
                    color: '#fff', letterSpacing: '0.04em',
                  }}>
                    {initials}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {display}
                  </span>
                </div>
              ))}
            </div>

            {/* Description commune en bas */}
            <p style={{
              fontSize: '0.72rem',
              color: 'var(--text-secondary)',
              textAlign: 'center',
              lineHeight: 1.7,
            }}>
              COOP Students at AIMS Senegal, specializing in Big Data &amp; Data Science.
              This project was completed as part of the NLP course 2026.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
