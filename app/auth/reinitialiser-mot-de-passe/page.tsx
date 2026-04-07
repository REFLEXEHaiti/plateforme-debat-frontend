'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';

function FormulaireReinit() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmer, setConfirmer] = useState('');
  const [chargement, setChargement] = useState(false);
  const [succes, setSucces] = useState(false);
  const [erreur, setErreur] = useState('');

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (motDePasse.length < 6) { setErreur('Minimum 6 caractères'); return; }
    if (motDePasse !== confirmer) { setErreur('Les mots de passe ne correspondent pas'); return; }
    setChargement(true);
    setErreur('');
    try {
      await api.post('/auth/reinitialiser-mot-de-passe', { token, motDePasse });
      setSucces(true);
      setTimeout(() => router.push('/auth/connexion'), 3000);
    } catch {
      setErreur('Token invalide ou expiré. Refaites la demande.');
    } finally {
      setChargement(false);
    }
  };

  if (!token) return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>❌</div>
      <p style={{ color: '#DC2626', fontWeight: 600 }}>Lien invalide</p>
      <Link href="/auth/mot-de-passe-oublie" style={{ color: '#00D4FF', textDecoration: 'none' }}>Refaire la demande</Link>
    </div>
  );

  return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 20px 60px rgba(0,0,0,0.4)', position: 'relative', zIndex: 1 }}>
      {!succes ? (
        <>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔑</div>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0A2540', margin: 0 }}>Nouveau mot de passe</h1>
            <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '14px', marginTop: '8px' }}>Choisissez un nouveau mot de passe sécurisé</p>
          </div>
          <form onSubmit={soumettre} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '6px', fontWeight: 600 }}>Nouveau mot de passe *</label>
              <input type="password" value={motDePasse} onChange={e => setMotDePasse(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(0,0,0,0.6)', marginBottom: '6px', fontWeight: 600 }}>Confirmer le mot de passe *</label>
              <input type="password" value={confirmer} onChange={e => setConfirmer(e.target.value)} placeholder="••••••••" style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(0,0,0,0.15)', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            {erreur && <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '12px', fontSize: '13px', color: '#DC2626' }}>⚠ {erreur}</div>}
            <button type="submit" disabled={chargement} style={{ background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', border: 'none', fontWeight: 700, fontSize: '15px', cursor: 'pointer', opacity: chargement ? 0.7 : 1 }}>
              {chargement ? 'Enregistrement...' : 'Enregistrer le nouveau mot de passe'}
            </button>
            <div style={{ textAlign: 'center' }}>
              <Link href="/auth/connexion" style={{ fontSize: '14px', color: '#00D4FF', fontWeight: 600, textDecoration: 'none' }}>← Retour à la connexion</Link>
            </div>
          </form>
        </>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0A2540', marginBottom: '12px' }}>Mot de passe modifié !</h2>
          <p style={{ fontSize: '14px', color: 'rgba(0,0,0,0.5)', marginBottom: '24px' }}>Redirection vers la connexion...</p>
          <Link href="/auth/connexion" style={{ display: 'block', background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', textAlign: 'center' }}>
            Se connecter maintenant
          </Link>
        </div>
      )}
    </div>
  );
}

export default function PageReinit() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', background: 'linear-gradient(135deg, #0A2540 0%, #001F3F 50%, #0A0F1E 100%)', position: 'relative' }}>
      <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', opacity: 0.06, pointerEvents: 'none', fontSize: '400px', lineHeight: 1 }}>🌍</div>
      <Suspense fallback={<div style={{ color: 'white' }}>Chargement...</div>}>
        <FormulaireReinit />
      </Suspense>
    </div>
  );
}
