'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

function HeroVisual() {
  return (
    <svg viewBox="0 0 280 280" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id="glowGold" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD700" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="globeGrad" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#1a4a8a" />
          <stop offset="50%" stopColor="#0d2f6e" />
          <stop offset="100%" stopColor="#061a4a" />
        </radialGradient>
        <radialGradient id="continentGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#3EB489" />
          <stop offset="100%" stopColor="#2a8a6a" />
        </radialGradient>
        <linearGradient id="handClaire" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F5CBA7" /><stop offset="100%" stopColor="#E8A87C" />
        </linearGradient>
        <linearGradient id="handMoyenne" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C68642" /><stop offset="100%" stopColor="#A0522D" />
        </linearGradient>
        <linearGradient id="handFoncee" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B3A2A" /><stop offset="100%" stopColor="#4A2518" />
        </linearGradient>
        <clipPath id="globeClip"><circle cx="140" cy="115" r="88" /></clipPath>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <circle cx="140" cy="115" r="110" fill="url(#glowGold)" />
      <circle cx="140" cy="115" r="88" fill="url(#globeGrad)" filter="url(#glow)" />
      <g clipPath="url(#globeClip)" opacity="0.3">
        {[95,115,135].map(y => <line key={y} x1="52" y1={y} x2="228" y2={y} stroke="#4a90d9" strokeWidth="0.5" />)}
        {[100,140,180].map(x => <line key={x} x1={x} y1="27" x2={x} y2="203" stroke="#4a90d9" strokeWidth="0.5" />)}
      </g>
      <g clipPath="url(#globeClip)">
        <path d="M80 70 L105 65 L115 80 L110 100 L95 110 L80 105 L72 90 Z" fill="url(#continentGrad)" opacity="0.9" />
        <path d="M95 115 L115 118 L120 140 L108 160 L90 155 L82 135 Z" fill="url(#continentGrad)" opacity="0.9" />
        <circle cx="100" cy="100" r="4" fill="#FFD700" opacity="0.9" />
        <circle cx="100" cy="100" r="7" fill="#FFD700" opacity="0.3" />
        <path d="M140 65 L165 62 L170 78 L158 85 L143 82 Z" fill="url(#continentGrad)" opacity="0.9" />
        <path d="M148 90 L172 88 L178 115 L170 140 L152 145 L140 130 L138 108 Z" fill="url(#continentGrad)" opacity="0.9" />
        <path d="M175 68 L210 65 L215 90 L200 100 L185 95 L175 82 Z" fill="url(#continentGrad)" opacity="0.9" />
      </g>
      <circle cx="140" cy="115" r="88" fill="none" stroke="rgba(0,212,255,0.6)" strokeWidth="1.5" />
      <ellipse cx="115" cy="85" rx="25" ry="15" fill="rgba(255,255,255,0.08)" transform="rotate(-30 115 85)" />
      <g transform="translate(30, 165)">
        <path d="M0 50 C0 35 5 25 15 20 L35 18 C42 18 48 22 48 32 L48 55 C48 68 42 75 30 75 L18 75 C8 75 0 68 0 58 Z" fill="url(#handClaire)" />
        <rect x="8" y="2" width="9" height="22" rx="4" fill="url(#handClaire)" />
        <rect x="19" y="0" width="9" height="24" rx="4" fill="url(#handClaire)" />
        <rect x="30" y="2" width="9" height="22" rx="4" fill="url(#handClaire)" />
        <rect x="40" y="6" width="8" height="18" rx="4" fill="url(#handClaire)" />
      </g>
      <g transform="translate(198, 165) scale(-1,1) translate(-50,0)">
        <path d="M0 50 C0 35 5 25 15 20 L35 18 C42 18 48 22 48 32 L48 55 C48 68 42 75 30 75 L18 75 C8 75 0 68 0 58 Z" fill="url(#handFoncee)" />
        <rect x="8" y="2" width="9" height="22" rx="4" fill="url(#handFoncee)" />
        <rect x="19" y="0" width="9" height="24" rx="4" fill="url(#handFoncee)" />
        <rect x="30" y="2" width="9" height="22" rx="4" fill="url(#handFoncee)" />
        <rect x="40" y="6" width="8" height="18" rx="4" fill="url(#handFoncee)" />
      </g>
      <g transform="translate(108, 175)">
        <path d="M0 45 C0 30 6 20 18 16 L46 16 C56 16 64 22 64 34 L64 52 C64 66 56 74 44 74 L20 74 C8 74 0 66 0 54 Z" fill="url(#handMoyenne)" />
        <rect x="8" y="0" width="11" height="20" rx="5" fill="url(#handMoyenne)" />
        <rect x="21" y="-2" width="11" height="22" rx="5" fill="url(#handMoyenne)" />
        <rect x="34" y="0" width="11" height="20" rx="5" fill="url(#handMoyenne)" />
        <rect x="47" y="4" width="10" height="16" rx="5" fill="url(#handMoyenne)" />
      </g>
      {[[20,30],[250,20],[265,80],[15,160],[255,170],[130,10]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r="1.5" fill="white" opacity={0.4 + (i%3)*0.2} />
      ))}
    </svg>
  );
}

export default function PageAccueil() {
  const { estConnecte } = useAuthStore();
  const [sponsors, setSponsors] = useState<any[]>([]);
  const [sponsorIdx, setSponsorIdx] = useState(0);
  const [sponsorVisible, setSponsorVisible] = useState(true);

  useEffect(() => {
    api.get('/sponsoring/sponsors')
      .then(({ data }) => { if (Array.isArray(data) && data.length) setSponsors(data); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (sponsors.length < 2) return;
    const t = setTimeout(() => {
      setSponsorVisible(false);
      setTimeout(() => { setSponsorIdx(i => (i + 1) % sponsors.length); setSponsorVisible(true); }, 400);
    }, 4000);
    return () => clearTimeout(t);
  }, [sponsorIdx, sponsors]);

  const sponsor = sponsors[sponsorIdx];

  return (
    <div style={{ background: '#0A0F1E', minHeight: '100vh', color: 'white', overflowX: 'hidden' }}>
      <style>{`
        @keyframes floatGlobe { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
        .globe-float { animation: floatGlobe 4s ease-in-out infinite; }
        .anim-1 { animation: fadeUp 0.7s ease both; }
        .anim-2 { animation: fadeUp 0.7s ease 0.1s both; }
        .anim-3 { animation: fadeUp 0.7s ease 0.2s both; }
        .anim-4 { animation: fadeUp 0.7s ease 0.35s both; }
        .shimmer-text {
          background: linear-gradient(90deg,#00D4FF,#7B61FF,#00D4FF);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 3s linear infinite;
        }

        /* ── HERO LAYOUT ── */
        .hero-wrap {
          max-width: 1200px;
          margin: 0 auto;
          padding: 72px 48px 64px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 56px;
          box-sizing: border-box;
          width: 100%;
        }
        .hero-text  { flex: 1; min-width: 0; }
        .hero-right { flex: 0 0 300px; display: flex; flex-direction: column; align-items: center; gap: 20px; }
        .hero-globe { width: 240px; height: 240px; }
        .hero-cards { display: flex; gap: 12px; width: 100%; }
        .hero-card  { flex: 1; min-width: 0; }

        .stats-row { display: flex; gap: 40px; }
        .btn-row   { display: flex; gap: 14px; flex-wrap: wrap; }

        /* ── RÔLES GRID ── */
        .roles-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
        }

        /* ── TABLET ── */
        @media (max-width: 900px) {
          .hero-wrap {
            flex-direction: column;
            padding: 48px 24px 56px;
            gap: 40px;
            text-align: center;
          }
          .hero-text  { width: 100%; }
          .hero-right { flex: none; width: 100%; }
          .hero-globe { width: 200px; height: 200px; }
          .stats-row  { justify-content: center; gap: 28px; }
          .btn-row    { justify-content: center; }
          .roles-grid { grid-template-columns: repeat(2, 1fr); }
        }

        /* ── MOBILE ── */
        @media (max-width: 480px) {
          .hero-wrap  { padding: 36px 16px 48px; gap: 32px; }
          .hero-globe { width: 160px; height: 160px; }
          .hero-cards { flex-direction: column; }
          .hero-card  { width: 100%; }
          .stats-row  { gap: 16px; }
          .roles-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .btn-row    { flex-direction: column; align-items: center; }
          .btn-row a  { width: 100%; text-align: center; box-sizing: border-box; }
        }
      `}</style>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        background: 'linear-gradient(135deg,#0A2540 0%,#001F3F 55%,#0A0F1E 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%,rgba(0,212,255,0.07) 0%,transparent 60%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 75% 30%,rgba(123,97,255,0.06) 0%,transparent 55%)' }} />

        <div className="hero-wrap" style={{ position: 'relative', zIndex: 1 }}>

          {/* ── Texte gauche ── */}
          <div className="hero-text">
            <div className="anim-1" style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)',
              borderRadius: '100px', padding: '6px 16px', marginBottom: '20px',
              fontSize: '12px', color: '#00D4FF', letterSpacing: '1px', textTransform: 'uppercase',
            }}>
              🇭🇹 Plateforme nationale du débat
            </div>

            <h1 className="anim-2" style={{
              fontSize: 'clamp(28px,4.5vw,56px)', fontWeight: 800,
              lineHeight: 1.1, margin: '0 0 18px',
            }}>
              <span style={{ color: 'white' }}>Formez-vous à </span>
              <span className="shimmer-text">l'art du débat</span>
              <br />
              <span style={{ color: 'white' }}>en Haïti</span>
            </h1>

            <p className="anim-3" style={{
              fontSize: 'clamp(14px,1.8vw,17px)',
              color: 'rgba(255,255,255,0.65)', lineHeight: 1.75,
              margin: '0 0 32px', maxWidth: '460px',
            }}>
              Participez aux compétitions, développez votre pensée critique et rejoignez la communauté des débatteurs haïtiens.
            </p>

            <div className="anim-3 btn-row" style={{ marginBottom: '36px' }}>
              {estConnecte ? (
                <Link href="/debats" style={{
                  background: 'linear-gradient(135deg,#00D4FF,#7B61FF)', color: 'white',
                  padding: '14px 32px', borderRadius: '12px', fontWeight: 700,
                  fontSize: '15px', textDecoration: 'none',
                  boxShadow: '0 6px 24px rgba(0,212,255,0.25)',
                }}>
                  Voir les débats →
                </Link>
              ) : (
                <>
                  <Link href="/auth/inscription" style={{
                    background: 'linear-gradient(135deg,#00D4FF,#7B61FF)', color: 'white',
                    padding: '14px 32px', borderRadius: '12px', fontWeight: 700,
                    fontSize: '15px', textDecoration: 'none',
                    boxShadow: '0 6px 24px rgba(0,212,255,0.25)',
                  }}>
                    Commencer gratuitement
                  </Link>
                  <Link href="/auth/connexion" style={{
                    background: 'rgba(255,255,255,0.07)',
                    border: '1px solid rgba(255,255,255,0.18)',
                    color: 'white', padding: '14px 28px', borderRadius: '12px',
                    fontWeight: 600, fontSize: '15px', textDecoration: 'none',
                  }}>
                    Se connecter
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="anim-4 stats-row" style={{
              paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.08)',
            }}>
              {[['500+','Débatteurs'],['50+','Formations'],['20+','Tournois']].map(([n,l]) => (
                <div key={l} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 800,
                    background: 'linear-gradient(90deg,#00D4FF,#7B61FF)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  }}>{n}</div>
                  <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: '3px' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Visuel droit ── */}
          <div className="hero-right">
            <div className="globe-float hero-globe" style={{
              filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.15)) drop-shadow(0 0 60px rgba(0,212,255,0.12))',
            }}>
              <HeroVisual />
            </div>

            <div className="hero-cards">
              {/* Carte partenaire */}
              <div className="hero-card" style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,215,0,0.18)',
                borderRadius: '16px', padding: '16px 12px',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '8px',
                backdropFilter: 'blur(10px)',
              }}>
                <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.28)', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
                  Partenaire
                </p>
                {sponsor ? (
                  <div style={{ transition: 'opacity 0.4s', opacity: sponsorVisible ? 1 : 0, textAlign: 'center', width: '100%' }}>
                    {sponsor.logoUrl && !sponsor.logoUrl.startsWith('#') ? (
                      <img src={sponsor.logoUrl} alt={sponsor.nom}
                        style={{ height: '30px', maxWidth: '100px', objectFit: 'contain', filter: 'brightness(0) invert(1)', margin: '0 auto', display: 'block' }} />
                    ) : (
                      <div style={{ fontSize: '11px', fontWeight: 700, color: 'white', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '5px 8px' }}>
                        {sponsor.nom}
                      </div>
                    )}
                    {sponsors.length > 1 && (
                      <div style={{ display: 'flex', gap: '3px', justifyContent: 'center', marginTop: '8px' }}>
                        {sponsors.map((_, i) => (
                          <div key={i} style={{
                            width: i === sponsorIdx ? '14px' : '5px', height: '3px',
                            borderRadius: '2px', transition: 'all 0.3s',
                            background: i === sponsorIdx ? '#FFD700' : 'rgba(255,255,255,0.2)',
                          }} />
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)' }}>Digicel Haïti</div>
                )}
                <Link href="/contact" style={{ fontSize: '9px', color: 'rgba(255,215,0,0.55)', textDecoration: 'none' }}>
                  Devenir partenaire →
                </Link>
              </div>

              {/* Carte stats live */}
              <div className="hero-card" style={{
                background: 'rgba(0,212,255,0.05)',
                border: '1px solid rgba(0,212,255,0.12)',
                borderRadius: '16px', padding: '16px 12px',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.35)', marginBottom: '10px', letterSpacing: '1.5px', textTransform: 'uppercase', textAlign: 'center' }}>
                  Aujourd'hui
                </div>
                {[['💬','3 débats actifs'],['👥','127 en ligne'],['🏆','2 tournois']].map(([emoji,txt]) => (
                  <div key={txt} style={{ display: 'flex', alignItems: 'center', gap: '7px', marginBottom: '8px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                    <span>{emoji}</span><span>{txt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════ RÔLES ══════════════ */}
      <section style={{ padding: 'clamp(48px,8vw,80px) clamp(16px,4vw,48px)', background: '#0D1421' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(22px,3vw,36px)', fontWeight: 800,
            textAlign: 'center', marginBottom: 'clamp(28px,5vw,48px)', color: 'white',
          }}>
            Une plateforme pour tous
          </h2>
          <div className="roles-grid">
            {[
              { emoji: '⚙️',  role: 'Admin',      desc: 'Gère la plateforme',        couleur: '#7B61FF' },
              { emoji: '👨‍🏫', role: 'Formateur',  desc: 'Crée et anime les débats',  couleur: '#00D4FF' },
              { emoji: '🎓', role: 'Apprenant',   desc: 'Participe et vote',          couleur: '#3EB489' },
              { emoji: '👁️', role: 'Spectateur',  desc: 'Observe en direct',          couleur: '#FF9F68' },
            ].map(item => (
              <div key={item.role} style={{
                background: item.couleur + '0f',
                border: '1px solid ' + item.couleur + '28',
                borderRadius: '20px',
                padding: 'clamp(20px,3vw,32px)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 'clamp(28px,4vw,42px)', marginBottom: '12px' }}>{item.emoji}</div>
                <h3 style={{ fontSize: 'clamp(14px,1.8vw,18px)', fontWeight: 700, color: item.couleur, marginBottom: '6px', margin: '0 0 6px' }}>
                  {item.role}
                </h3>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA ══════════════ */}
      <section style={{
        padding: 'clamp(60px,10vw,100px) clamp(16px,4vw,48px)',
        background: 'linear-gradient(135deg,#0A2540,#001F3F)',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center,rgba(0,212,255,0.09) 0%,transparent 70%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '620px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(26px,4vw,48px)', fontWeight: 800, marginBottom: '16px', color: 'white' }}>
            Prêt à débattre ?
          </h2>
          <p style={{
            color: 'rgba(255,255,255,0.55)', fontSize: 'clamp(14px,1.8vw,18px)',
            marginBottom: '36px', lineHeight: 1.65,
          }}>
            Rejoignez la communauté des débatteurs haïtiens.<br />Gratuit pour commencer.
          </p>
          {!estConnecte && (
            <Link href="/auth/inscription" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg,#00D4FF,#7B61FF)', color: 'white',
              padding: 'clamp(14px,2vw,18px) clamp(28px,4vw,48px)',
              borderRadius: '14px', fontWeight: 700,
              fontSize: 'clamp(14px,1.8vw,18px)',
              textDecoration: 'none',
              boxShadow: '0 8px 32px rgba(0,212,255,0.28)',
            }}>
              Créer mon compte gratuitement 🚀
            </Link>
          )}
        </div>
      </section>

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{
        background: '#060A14', padding: 'clamp(28px,4vw,40px) clamp(16px,4vw,48px)',
        textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)',
      }}>
        <div style={{ color: 'rgba(255,255,255,0.25)', fontSize: '13px', marginBottom: '16px' }}>
          🇭🇹 Plateforme Débat Haïti — Tous droits réservés 2026
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(12px,2vw,28px)', flexWrap: 'wrap' }}>
          {[['Débats','/debats'],['Formations','/formations'],['Tournois','/tournois'],['Contact','/contact'],['Galerie','/galerie']].map(([label,href]) => (
            <Link key={label} href={href} style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', textDecoration: 'none' }}>
              {label}
            </Link>
          ))}
        </div>
      </footer>
    </div>
  );
}
