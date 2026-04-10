'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import toast from 'react-hot-toast';

function RubinMark({ size = 28 }: { size?: number }) {
  const h = Math.round(size * 1.18);
  return (
    <svg width={size} height={h} viewBox="0 0 22 26" fill="none" aria-hidden="true">
      <path d="M11 1.2C9 3.2,6.5 5.2,4.8 7.2C3.2 9.2,2.8 11.2,3.8 13.2C4.8 15.2,6.8 17,7.5 19.8C8.2 22.4,9.2 24.2,11 24.2C12.8 24.2,13.8 22.4,14.5 19.8C15.2 17,17.2 15.2,18.2 13.2C19.2 11.2,18.8 9.2,17.2 7.2C15.5 5.2,13 3.2,11 1.2Z" fill="currentColor" />
    </svg>
  );
}

export default function PageMotDePasseOublie() {
  const [email, setEmail] = useState('');
  const [envoye, setEnvoye] = useState(false);
  const [chargement, setChargement] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) { toast.error('Email invalide'); return; }
    setChargement(true);
    try {
      await api.post('/auth/mot-de-passe-oublie', { email });
      setEnvoye(true);
    } catch {
      setEnvoye(true); // Sécurité : afficher succès même en cas d'erreur
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 60%, #0A0F1E 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Décor */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(192,50,26,0.07) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(27,63,139,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,32px)', zIndex: 1 }}>
        {!envoye ? (
          /* ── Formulaire ── */
          <div className="dh-auth-card" style={{ maxWidth: 440 }}>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 56, height: 56, borderRadius: '50%', background: 'rgba(192,50,26,0.08)', border: '1px solid rgba(192,50,26,0.2)', marginBottom: 14, color: '#C0321A' }}>
                <RubinMark size={24} />
              </div>
              <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(20px,4vw,26px)', fontWeight: 'normal', color: '#111', margin: 0, marginBottom: 8 }}>
                Mot de passe oublié
              </h1>
              <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif", lineHeight: 1.6 }}>
                Nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>
            </div>

            <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, color: 'rgba(0,0,0,0.5)', marginBottom: 6, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>E-mail *</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="jean@email.com"
                  required
                  style={{ width: '100%', padding: '12px 14px', border: '1.5px solid rgba(0,0,0,0.12)', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: "'Helvetica Neue',Arial,sans-serif", color: '#111', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = '#C0321A'; e.target.style.boxShadow = '0 0 0 3px rgba(192,50,26,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(0,0,0,0.12)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              <button type="submit" disabled={chargement} style={{ background: chargement ? 'rgba(192,50,26,0.5)' : 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', padding: '14px', borderRadius: 12, border: 'none', fontWeight: 700, fontSize: 15, cursor: chargement ? 'not-allowed' : 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif", boxShadow: '0 4px 16px rgba(192,50,26,0.3)' }}>
                {chargement ? '⏳ Envoi…' : 'Envoyer le lien'}
              </button>

              <div style={{ position: 'relative', textAlign: 'center' }}>
                <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                <span style={{ position: 'relative', background: 'white', padding: '0 12px', fontSize: 12, color: 'rgba(0,0,0,0.35)', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>ou</span>
              </div>

              <a href="https://wa.me/50999999999?text=J%27ai%20oublié%20mon%20mot%20de%20passe" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(37,211,102,0.08)', border: '1.5px solid rgba(37,211,102,0.3)', color: '#1a8a44', padding: '12px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                💬 Récupérer via WhatsApp
              </a>

              <div style={{ textAlign: 'center', paddingTop: 4 }}>
                <Link href="/auth/connexion" style={{ fontSize: 13, color: 'rgba(0,0,0,0.4)', fontFamily: "'Helvetica Neue',Arial,sans-serif", textDecoration: 'none' }}>
                  ← Retour à la connexion
                </Link>
              </div>
            </form>
          </div>
        ) : (
          /* ── Confirmation ── */
          <div className="dh-auth-card" style={{ maxWidth: 440, textAlign: 'center' }}>
            <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(20px,4vw,26px)', fontWeight: 'normal', color: '#111', marginBottom: 12 }}>
              Lien envoyé !
            </h2>
            <p style={{ color: 'rgba(0,0,0,0.5)', fontSize: 14, lineHeight: 1.6, marginBottom: 28, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
              Si un compte existe pour <strong>{email}</strong>, vous recevrez un e-mail dans quelques minutes. Vérifiez vos spams.
            </p>
            <Link href="/auth/connexion" style={{ display: 'block', padding: '13px', borderRadius: 12, background: 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", boxShadow: '0 4px 16px rgba(192,50,26,0.3)' }}>
              ← Retour à la connexion
            </Link>
          </div>
        )}
      </div>

      {/* Partenaires */}
      <div style={{ position: 'absolute', bottom: 24, left: 0, right: 0, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', padding: '0 24px', zIndex: 1 }}>
        {['AyiboPost', 'YWCA Haïti', 'Decathlon', 'Debat Haiti'].map(p => (
          <span key={p} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)', padding: '4px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11 }}>{p}</span>
        ))}
      </div>
    </div>
  );
}
