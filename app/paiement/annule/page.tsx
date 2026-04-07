'use client';
import Link from 'next/link';
export default function PageAnnule() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0A2540, #001F3F)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: '24px', padding: '48px', maxWidth: '400px', textAlign: 'center' }}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>❌</div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#DC2626' }}>Paiement annulé</h1>
        <p style={{ color: '#6B7280', marginBottom: '32px' }}>Aucun montant n'a été débité.</p>
        <Link href="/premium" style={{ display: 'block', background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', padding: '14px', borderRadius: '12px', textDecoration: 'none', fontWeight: 700 }}>Réessayer</Link>
      </div>
    </div>
  );
}
