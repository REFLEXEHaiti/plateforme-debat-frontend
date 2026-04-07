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
    }).then(r => r.json()).then(data => { setDetails(data); setStatut(data.paye ? 'succes' : 'erreur'); }).catch(() => setStatut('erreur'));
  }, [sessionId]);

  if (statut === 'chargement') return <div style={{ textAlign: 'center', color: 'white' }}>⏳ Vérification...</div>;

  if (statut === 'succes') return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
      <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#065F46', marginBottom: '12px' }}>Paiement réussi !</h1>
      <p style={{ color: '#6B7280', marginBottom: '8px' }}>Montant payé : <strong>{details?.montant} USD</strong></p>
      <p style={{ color: '#6B7280', fontSize: '14px', marginBottom: '32px' }}>Votre accès sera activé sous 24h.</p>
      <Link href="/formations" style={{ display: 'block', background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, marginBottom: '12px' }}>
        📚 Accéder aux formations
      </Link>
      <Link href="/dashboard" style={{ display: 'block', background: '#F3F4F6', color: '#374151', padding: '12px', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>
        Tableau de bord
      </Link>
    </div>
  );

  return (
    <div style={{ background: 'white', borderRadius: '24px', padding: '48px', maxWidth: '480px', width: '100%', textAlign: 'center' }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
      <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626', marginBottom: '12px' }}>Paiement non confirmé</h1>
      <p style={{ color: '#6B7280', marginBottom: '32px' }}>Contactez-nous si vous avez été débité.</p>
      <Link href="/premium" style={{ display: 'block', background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>Réessayer</Link>
    </div>
  );
}

export default function PageSucces() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A2540, #001F3F)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <Suspense fallback={<div style={{ color: 'white' }}>Chargement...</div>}>
        <Contenu />
      </Suspense>
    </div>
  );
}
