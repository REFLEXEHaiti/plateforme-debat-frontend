'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

function RubinMark({ size = 28 }: { size?: number }) {
  const h = Math.round(size * 1.18);
  return (
    <svg width={size} height={h} viewBox="0 0 22 26" fill="none" aria-hidden="true">
      <path d="M11 1.2C9 3.2,6.5 5.2,4.8 7.2C3.2 9.2,2.8 11.2,3.8 13.2C4.8 15.2,6.8 17,7.5 19.8C8.2 22.4,9.2 24.2,11 24.2C12.8 24.2,13.8 22.4,14.5 19.8C15.2 17,17.2 15.2,18.2 13.2C19.2 11.2,18.8 9.2,17.2 7.2C15.5 5.2,13 3.2,11 1.2Z" fill="currentColor" />
    </svg>
  );
}

const inp = {
  width: '100%', padding: '12px 14px',
  border: '1.5px solid rgba(0,0,0,0.12)',
  borderRadius: 10, fontSize: 14, outline: 'none',
  boxSizing: 'border-box' as const, fontFamily: "'Helvetica Neue',Arial,sans-serif",
  color: '#111', background: 'white', transition: 'border-color 0.2s',
};

export default function PageConnexion() {
  const { seConnecter, chargement } = useAuth();
  const [erreur, setErreur] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [voirMDP, setVoirMDP] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setErreur('Email invalide'); return; }
    setErreur('');
    try {
      await seConnecter(email, motDePasse);
    } catch {
      setErreur('Email ou mot de passe incorrect');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 60%, #0A0F1E 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Décor gauche */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '45%',
        backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(192,50,26,0.08) 0%, transparent 60%), radial-gradient(circle at 70% 80%, rgba(27,63,139,0.1) 0%, transparent 50%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)',
        opacity: 0.04, fontSize: '40vw', lineHeight: 1, pointerEvents: 'none',
        userSelect: 'none', fontFamily: 'Georgia,serif', color: 'white',
        maxWidth: '60%',
      }}>«»</div>

      {/* Contenu centré */}
      <div style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,32px)', zIndex: 1,
      }}>
        <div className="dh-auth-card" style={{ maxWidth: 420 }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16, color: '#C0321A' }}>
              <RubinMark size={28} />
            </div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,28px)', fontWeight: 'normal', color: '#111', margin: 0 }}>
              Se connecter
            </h1>
            <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 13, marginTop: 6, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
              Bienvenue sur Débat Haïti
            </p>
          </div>

          <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 6, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email *</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jean@email.com" required style={inp}
                onFocus={e => { e.target.style.borderColor = '#C0321A'; e.target.style.boxShadow = '0 0 0 3px rgba(192,50,26,0.1)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <label style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mot de passe *</label>
                <Link href="/auth/mot-de-passe-oublie" style={{ fontSize: 12, color: '#C0321A', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600 }}>
                  Oublié ?
                </Link>
              </div>
              <div style={{ position: 'relative' }}>
                <input type={voirMDP ? 'text' : 'password'} value={motDePasse} onChange={e => setMotDePasse(e.target.value)} placeholder="••••••••" required style={{ ...inp, paddingRight: 44 }}
                  onFocus={e => { e.target.style.borderColor = '#C0321A'; e.target.style.boxShadow = '0 0 0 3px rgba(192,50,26,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }} />
                <button type="button" onClick={() => setVoirMDP(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.35)', fontSize: 14 }}>
                  {voirMDP ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {erreur && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                ⚠ {erreur}
              </div>
            )}

            <button type="submit" disabled={chargement} style={{
              background: chargement ? 'rgba(192,50,26,0.5)' : 'linear-gradient(135deg, #C0321A, #A02818)',
              color: 'white', padding: '14px', borderRadius: 12, border: 'none',
              fontWeight: 700, fontSize: 15, cursor: chargement ? 'not-allowed' : 'pointer',
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              boxShadow: '0 4px 16px rgba(192,50,26,0.3)', letterSpacing: '0.02em',
            }}>
              {chargement ? '⏳ Connexion…' : 'Se connecter →'}
            </button>

            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.08)' }} />
              <span style={{ position: 'relative', background: 'white', padding: '0 12px', fontSize: 12, color: 'rgba(0,0,0,0.35)', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>ou</span>
            </div>

            <a href="https://wa.me/50999999999" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(37,211,102,0.08)', border: '1.5px solid rgba(37,211,102,0.3)', color: '#1a8a44', padding: '12px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
              💬 Connexion via WhatsApp
            </a>

            <div style={{ textAlign: 'center', paddingTop: 4 }}>
              <span style={{ fontSize: 13, color: 'rgba(0,0,0,0.45)', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Pas encore de compte ? </span>
              <Link href="/auth/inscription" style={{ color: '#C0321A', fontWeight: 700, textDecoration: 'none', fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                S'inscrire
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Partenaires en bas */}
      <div style={{
        position: 'absolute', bottom: 24, left: 0, right: 0,
        display: 'flex', gap: 12, justifyContent: 'center',
        flexWrap: 'wrap', padding: '0 24px', zIndex: 1,
      }}>
        {['AyiboPost', 'YWCA Haïti', 'Decathlon', 'Debat Haiti'].map(p => (
          <span key={p} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.35)', padding: '4px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11 }}>{p}</span>
        ))}
      </div>
    </div>
  );
}
