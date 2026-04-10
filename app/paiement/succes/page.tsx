'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plateforme-debat-backend.onrender.com/api';

function Contenu() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [statut, setStatut] = useState<'chargement' | 'succes' | 'erreur'>('chargement');
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    if (!sessionId) { setStatut('erreur'); return; }
    fetch(API_URL + '/paiements/stripe/verifier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    }).then(r => r.json())
      .then(data => { setDetails(data); setStatut(data.paye ? 'succes' : 'erreur'); })
      .catch(() => setStatut('erreur'));
  }, [sessionId]);

  if (statut === 'chargement') return (
    <div style={{ textAlign: 'center', color: 'white' }}>
      <div style={{ width: 44, height: 44, border: '3px solid rgba(255,255,255,0.2)', borderTopColor: '#C0321A', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>Vérification du paiement…</p>
    </div>
  );

  if (statut === 'succes') return (
    <div style={{ background: 'white', borderRadius: 24, padding: 'clamp(32px,5vw,48px)', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
      <div style={{ width: 72, height: 72, background: 'rgba(26,107,58,0.1)', border: '2px solid rgba(26,107,58,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 16px' }}>✅</div>
      <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,28px)', fontWeight: 'normal', color: '#111', marginBottom: 12 }}>Paiement réussi !</h1>
      {details?.montant && <p style={{ color: 'rgba(0,0,0,0.5)', marginBottom: 6, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>Montant : <strong style={{ color: '#111' }}>{details.montant} USD</strong></p>}
      <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: 13, marginBottom: 32, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Votre accès sera activé sous quelques minutes.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/formations" style={{ display: 'block', background: 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', padding: '14px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontFamily: "'Helvetica Neue',Arial,sans-serif", boxShadow: '0 4px 16px rgba(192,50,26,0.3)' }}>
          📚 Accéder aux formations
        </Link>
        <Link href="/dashboard" style={{ display: 'block', background: 'rgba(0,0,0,0.05)', color: '#555', padding: '12px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
          Tableau de bord
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'white', borderRadius: 24, padding: 'clamp(32px,5vw,48px)', maxWidth: 440, width: '100%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>❌</div>
      <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 'normal', color: '#111', marginBottom: 12 }}>Paiement non confirmé</h1>
      <p style={{ color: 'rgba(0,0,0,0.45)', marginBottom: 32, fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", lineHeight: 1.6 }}>Contactez-nous via WhatsApp si vous avez été débité.</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link href="/premium" style={{ display: 'block', background: 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', padding: '14px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Réessayer</Link>
        <a href="https://wa.me/50999999999" target="_blank" rel="noreferrer" style={{ display: 'block', background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.3)', color: '#1a8a44', padding: '12px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
          💬 Contacter via WhatsApp
        </a>
      </div>
    </div>
  );
}

export default function PageSucces() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 60%, #0A0F1E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px,4vw,40px)' }}>
      <Suspense fallback={<div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Chargement…</div>}>
        <Contenu />
      </Suspense>
    </div>
  );
}
