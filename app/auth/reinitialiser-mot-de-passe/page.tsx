'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

function Contenu() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const router = useRouter();
  const [mdp, setMdp] = useState('');
  const [confirm, setConfirm] = useState('');
  const [voirMdp, setVoirMdp] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');
  const [succes, setSucces] = useState(false);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mdp.length < 6) { setErreur('Minimum 6 caractères'); return; }
    if (mdp !== confirm) { setErreur('Les mots de passe ne correspondent pas'); return; }
    setErreur(''); setChargement(true);
    try {
      await api.post('/auth/reinitialiser-mot-de-passe', { token, motDePasse: mdp });
      setSucces(true);
      setTimeout(() => router.push('/auth/connexion'), 3000);
    } catch {
      setErreur('Lien invalide ou expiré. Demandez un nouveau lien.');
    } finally { setChargement(false); }
  };

  const inp: React.CSSProperties = {
    width: '100%', padding: '14px 16px', border: '1.5px solid #E2E8F0',
    borderRadius: 10, fontSize: 15, outline: 'none', boxSizing: 'border-box',
    fontFamily: "'Helvetica Neue',Arial,sans-serif", color: '#0D1B2A',
    background: 'white', transition: 'border-color 0.2s',
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #0A1628 0%, #0D1B2A 40%, #1B2D4A 100%)', position: 'relative', overflow: 'hidden', padding: 'clamp(32px,5vw,60px) clamp(16px,4vw,32px)' }}>
      {/* Fond photo */}
      <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1543269865-cbf427effbad?w=1200&q=60) center/cover', opacity: 0.2 }}/>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.8), rgba(10,22,40,0.7))' }}/>

      <div style={{ width: '100%', maxWidth: 460, position: 'relative', zIndex: 1 }}>
        {/* Card */}
        <div style={{ background: 'white', borderRadius: 20, padding: 'clamp(28px,5vw,44px)', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}>
          {!succes ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>🔐</div>
                <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(20px,4vw,26px)', fontWeight: 'normal', color: '#0D1B2A', marginBottom: 8 }}>
                  Nouveau mot de passe
                </h1>
                <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: '#64748B' }}>
                  Choisissez un nouveau mot de passe sécurisé.
                </p>
              </div>

              {!token && (
                <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: '#DC2626', fontFamily: "'Helvetica Neue',Arial,sans-serif", marginBottom: 20, textAlign: 'center' }}>
                  ⚠ Lien invalide. <Link href="/auth/mot-de-passe-oublie" style={{ color: '#C0321A', fontWeight: 700 }}>Demander un nouveau lien</Link>
                </div>
              )}

              <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Nouveau mot de passe *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input type={voirMdp ? 'text' : 'password'} value={mdp} onChange={e => { setMdp(e.target.value); setErreur(''); }} placeholder="Minimum 6 caractères" required style={{ ...inp, paddingRight: 44, borderColor: erreur ? '#EF4444' : '#E2E8F0' }}
                      onFocus={e => { e.target.style.borderColor = '#0D1B2A'; e.target.style.background = '#F8FAFF'; }}
                      onBlur={e => { e.target.style.borderColor = erreur ? '#EF4444' : '#E2E8F0'; e.target.style.background = 'white'; }}/>
                    <button type="button" onClick={() => setVoirMdp(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: 16 }}>
                      {voirMdp ? '🙈' : '👁'}
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, color: '#475569', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Confirmer le mot de passe *
                  </label>
                  <input type={voirMdp ? 'text' : 'password'} value={confirm} onChange={e => { setConfirm(e.target.value); setErreur(''); }} placeholder="Retapez votre mot de passe" required style={{ ...inp, borderColor: erreur ? '#EF4444' : '#E2E8F0' }}
                    onFocus={e => { e.target.style.borderColor = '#0D1B2A'; e.target.style.background = '#F8FAFF'; }}
                    onBlur={e => { e.target.style.borderColor = erreur ? '#EF4444' : '#E2E8F0'; e.target.style.background = 'white'; }}/>
                </div>
                {erreur && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#DC2626', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>⚠ {erreur}</div>}
                {/* Force mot de passe */}
                {mdp && (
                  <div>
                    <div style={{ height: 4, background: '#E2E8F0', borderRadius: 100, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 100, transition: 'width 0.3s', width: mdp.length < 6 ? '25%' : mdp.length < 10 ? '60%' : '100%', background: mdp.length < 6 ? '#EF4444' : mdp.length < 10 ? '#F97316' : '#059669' }}/>
                    </div>
                    <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: mdp.length < 6 ? '#EF4444' : mdp.length < 10 ? '#F97316' : '#059669', marginTop: 4 }}>
                      {mdp.length < 6 ? 'Trop court' : mdp.length < 10 ? 'Moyen' : 'Fort ✓'}
                    </p>
                  </div>
                )}
                <button type="submit" disabled={chargement || !token} style={{ width: '100%', padding: '15px', borderRadius: 100, background: chargement ? 'rgba(192,50,26,0.5)' : 'linear-gradient(135deg, #E8590C, #C0440A)', color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 16, cursor: chargement || !token ? 'not-allowed' : 'pointer', boxShadow: '0 4px 16px rgba(192,50,26,0.35)' }}>
                  {chargement ? '⏳ Réinitialisation…' : 'Réinitialiser mon mot de passe'}
                </button>
                <div style={{ textAlign: 'center' }}>
                  <Link href="/auth/connexion" style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: '#94A3B8', textDecoration: 'none' }}>← Retour à la connexion</Link>
                </div>
              </form>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 'normal', color: '#0D1B2A', marginBottom: 10 }}>Mot de passe modifié !</h2>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: '#64748B', marginBottom: 24, lineHeight: 1.6 }}>
                Vous allez être redirigé vers la page de connexion dans 3 secondes…
              </p>
              <Link href="/auth/connexion" style={{ display: 'block', padding: '13px', borderRadius: 100, background: 'linear-gradient(135deg, #E8590C, #C0440A)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 14 }}>
                Se connecter maintenant
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function PageReinitialiser() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0D1B2A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>Chargement…</div>}>
      <Contenu />
    </Suspense>
  );
}
