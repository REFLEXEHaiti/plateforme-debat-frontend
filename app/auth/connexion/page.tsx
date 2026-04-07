'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

export default function PageConnexion() {
  const { seConnecter, chargement } = useAuth();
  const [erreur, setErreur] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [erreurEmail, setErreurEmail] = useState('');

  const valider = () => {
    if (!email.includes('@')) { setErreurEmail('Email invalide'); return false; }
    setErreurEmail('');
    return true;
  };

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valider()) return;
    try {
     await seConnecter(email, motDePasse);
      } catch {
      setErreur('Email ou mot de passe incorrect');
      }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #0A2540 0%, #001F3F 50%, #0A0F1E 100%)', position: 'relative' }}>
      <div style={{ position: 'absolute', left: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none', fontSize: '400px', lineHeight: 1 }}>🌍</div>
      <div style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🇭🇹</div>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0A2540', margin: 0 }}>Se connecter</h1>
          <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '14px', marginTop: '6px' }}>Bienvenue sur Débat Haïti</p>
        </div>
        <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '6px', fontWeight: 600 }}>Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErreurEmail(''); }}
              placeholder="jean@email.com"
              style={{ width: '100%', padding: '11px 14px', border: erreurEmail ? '1.5px solid #EF4444' : '1.5px solid rgba(0,0,0,0.15)', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
            {erreurEmail && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>⚠ {erreurEmail}</p>}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', color: 'rgba(0,0,0,0.6)', fontWeight: 600 }}>Mot de passe *</label>
              <Link href="/auth/mot-de-passe-oublie" style={{ fontSize: '12px', color: '#00D4FF', textDecoration: 'none', fontWeight: 600 }}>Mot de passe oublié ?</Link>
            </div>
            <input
              type="password"
              value={motDePasse}
              onChange={e => setMotDePasse(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          {erreur && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#DC2626' }}>
              ⚠ {erreur}
            </div>
          )}
          <button type="submit" disabled={chargement} style={{ background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: chargement ? 0.7 : 1 }}>
            {chargement ? 'Connexion...' : 'Se connecter →'}
          </button>
          <a href="https://wa.me/50999999999" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: '#25D366', color: 'white', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
            💬 Connexion via WhatsApp
          </a>
          <div style={{ textAlign: 'center', borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: '16px' }}>
            <span style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)' }}>Pas encore de compte ? </span>
            <Link href="/auth/inscription" style={{ color: '#00D4FF', fontWeight: 700, textDecoration: 'none', fontSize: '14px' }}>S'inscrire</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
