'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';

export default function PageMotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { setErreur('Email invalide'); return; }
    setErreur(''); setChargement(true);
    try {
      await api.post('/auth/mot-de-passe-oublie', { email });
      setEnvoye(true);
    } catch { setEnvoye(true); }
    finally { setChargement(false); }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--page)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,32px)' }}>
        {!envoye ? (
          /* ── Formulaire ── */
          <div style={{ width: '100%', maxWidth: 440 }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              {/* Illustration serrure */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
                <svg viewBox="0 0 200 160" style={{ width: 200 }}>
                  <ellipse cx="100" cy="120" rx="70" ry="30" fill="#E2E8F0" opacity="0.6"/>
                  <ellipse cx="65" cy="110" rx="40" ry="20" fill="#BFDBFE" opacity="0.5"/>
                  {/* Nuage fond */}
                  <ellipse cx="100" cy="80" rx="55" ry="35" fill="#DBEAFE" opacity="0.6"/>
                  <ellipse cx="70" cy="85" rx="35" ry="25" fill="#BFDBFE" opacity="0.5"/>
                  <ellipse cx="130" cy="85" rx="30" ry="22" fill="#BFDBFE" opacity="0.5"/>
                  {/* Personne */}
                  <rect x="75" y="90" width="50" height="60" rx="8" fill="#1E40AF" opacity="0.8"/>
                  <ellipse cx="100" cy="82" rx="18" ry="20" fill="#FCD34D"/>
                  <ellipse cx="100" cy="72" rx="20" ry="16" fill="#1A0800"/>
                  {/* Laptop */}
                  <rect x="78" y="105" width="44" height="28" rx="4" fill="#93C5FD"/>
                  <rect x="82" y="109" width="36" height="20" rx="3" fill="#EFF6FF"/>
                  <rect x="72" y="133" width="56" height="4" rx="2" fill="#64748B" opacity="0.5"/>
                  {/* Serrure */}
                  <rect x="87" y="55" width="26" height="20" rx="4" fill="#1E40AF"/>
                  <path d="M90 55 Q90 44 100 44 Q110 44 110 55" stroke="#1E40AF" strokeWidth="4" fill="none" strokeLinecap="round"/>
                  <circle cx="100" cy="64" r="4" fill="white"/>
                  <rect x="98.5" y="64" width="3" height="6" rx="1" fill="white"/>
                </svg>
              </div>
              <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,28px)', fontWeight: 'normal', color: 'var(--ink)', marginBottom: 6 }}>
                Mot de passe oublié
              </h1>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 15, color: 'var(--muted)', fontStyle: 'italic' }}>
                Besoin d'aide pour vous reconnecter ?
              </p>
            </div>

            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 20, padding: 'clamp(28px,5vw,40px)', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', textAlign: 'center', marginBottom: 24 }}>
                Besoin d'aide pour vous reconnecter ?
              </p>
              <form onSubmit={soumettre} style={{ display: 'flex', gap: 10 }}>
                <input type="email" value={email} onChange={e => { setEmail(e.target.value); setErreur(''); }} placeholder="E-mail" style={{ flex: 1, padding: '13px 16px', border: `1.5px solid ${erreur ? '#ef4444' : 'var(--line2)'}`, borderRadius: 10, fontSize: 14, outline: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--ink)', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                  onBlur={e => e.target.style.borderColor = erreur ? '#ef4444' : 'var(--line2)'}/>
                <button type="submit" disabled={chargement} style={{ padding: '13px 20px', background: '#C0321A', color: 'white', border: 'none', borderRadius: 10, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 14, cursor: chargement ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
                  {chargement ? '...' : 'Envoyer'}
                </button>
              </form>
              {erreur && <p style={{ color: '#ef4444', fontSize: 12, marginTop: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>⚠ {erreur}</p>}
              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <Link href="/auth/connexion" style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)', textDecoration: 'none' }}>
                  ← Retour à la connexion
                </Link>
              </div>
            </div>

            {/* Partenaires bas */}
            <div style={{ marginTop: 28, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {['Boyy Tralore', 'AyiboPost', 'YWCA Haïti', 'Perrat Haiti'].map(p => (
                <span key={p} style={{ background: 'rgba(0,0,0,0.06)', border: '1px solid var(--line2)', color: 'var(--muted)', padding: '5px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11 }}>{p}</span>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', marginTop: 12 }}>
              Inscription rapote · Rejoignez des containes de membres actifs
            </p>
          </div>
        ) : (
          /* ── Confirmation ── */
          <div style={{ width: '100%', maxWidth: 400, background: 'white', border: '1px solid var(--line2)', borderRadius: 20, padding: 'clamp(32px,5vw,48px)', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 10 }}>Lien envoyé !</h2>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28 }}>
              Si un compte existe pour <strong style={{ color: 'var(--ink)' }}>{email}</strong>, vous recevrez un e-mail. Vérifiez vos spams.
            </p>
            <Link href="/auth/connexion" style={{ display: 'block', padding: '13px', borderRadius: 12, background: '#C0321A', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 14 }}>
              ← Retour à la connexion
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
