'use client';
import Link from 'next/link';
export default function PageAnnule() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 60%, #0A0F1E 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(24px,4vw,40px)' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 'clamp(32px,5vw,48px)', maxWidth: 400, width: '100%', textAlign: 'center', boxShadow: '0 24px 64px rgba(0,0,0,0.35)' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>↩️</div>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(20px,4vw,26px)', fontWeight: 'normal', color: '#111', marginBottom: 10 }}>Paiement annulé</h1>
        <p style={{ color: 'rgba(0,0,0,0.45)', marginBottom: 32, fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", lineHeight: 1.6 }}>Aucun montant n'a été débité. Vous pouvez réessayer quand vous le souhaitez.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Link href="/premium" style={{ display: 'block', background: 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', padding: '14px', borderRadius: 12, textDecoration: 'none', fontWeight: 700, fontFamily: "'Helvetica Neue',Arial,sans-serif", boxShadow: '0 4px 16px rgba(192,50,26,0.3)' }}>
            Voir les plans
          </Link>
          <Link href="/" style={{ display: 'block', background: 'rgba(0,0,0,0.05)', color: '#555', padding: '12px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
