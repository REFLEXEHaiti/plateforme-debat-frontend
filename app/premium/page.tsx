'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModalPaiement from '@/components/paiement/ModalPaiement';

const AVANTAGES_GRATUIT = [
  '💬 Accès aux débats publics',
  '🤖 3 feedbacks IA / jour',
  '📚 2 formations gratuites',
  '🎥 Voir les replays',
];

const AVANTAGES_PRIME = [
  '🤖 Feedbacks IA illimités',
  '📚 Toutes les formations',
  '🏆 Inscription aux tournois',
  '🎖️ Badge débatteur certifié',
  '⭐ Support prioritaire',
  '🎥 Replays HD illimités',
];

const FAQS = [
  { q: 'Quels moyens de paiement acceptez-vous ?', r: 'MonCash, PayPal, Zelle, et Visa/Mastercard. Cliquez sur "Payer" pour voir les instructions détaillées.' },
  { q: 'Le plan est-il renouvelable ?', r: 'Oui, tous les 3 mois. Vous pouvez annuler à tout moment via WhatsApp.' },
  { q: 'Les formations sont-elles incluses ?', r: 'Le plan Premium inclut toutes les formations. En Gratuit, 2 formations sont accessibles.' },
];

export default function PagePremium() {
  const [modal, setModal] = useState<{ montant: number; description: string } | null>(null);

  return (
    <div style={{ background: 'linear-gradient(160deg, #0A0F1E 0%, #0D1B2A 40%, #0A0F1E 100%)', minHeight: '100vh', color: 'white' }}>
      {modal && <ModalPaiement montant={modal.montant} description={modal.description} onFermer={() => setModal(null)} />}

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: 'clamp(48px,8vw,96px) 24px clamp(32px,5vw,64px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 50% 0%, rgba(0,212,255,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ display: 'inline-block', background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', borderRadius: 100, padding: '6px 20px', marginBottom: 20, fontSize: 12, color: '#00D4FF', letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>
          Plans & Tarifs
        </div>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,6vw,52px)', fontWeight: 'normal', marginBottom: 14, position: 'relative' }}>
          Choisissez votre plan
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 'clamp(14px,2vw,18px)', fontFamily: "'Helvetica Neue',Arial,sans-serif", maxWidth: 500, margin: '0 auto' }}>
          Investissez dans votre maîtrise du débat
        </p>
      </div>

      {/* Cards */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 clamp(16px,4vw,40px) clamp(48px,6vw,80px)' }}>
        <div className="dh-premium-grid">

          {/* Gratuit */}
          <div className="dh-pricing-card" style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#9CA3AF', marginBottom: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Gratuit</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>0$</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>pour toujours</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AVANTAGES_GRATUIT.map(a => (
                <li key={a} style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: "'Helvetica Neue',Arial,sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>{a}</li>
              ))}
            </ul>
            <Link href="/auth/inscription" style={{ display: 'block', textAlign: 'center', padding: '14px', borderRadius: 12, border: '2px solid rgba(255,255,255,0.18)', color: 'white', textDecoration: 'none', fontWeight: 700, fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", transition: 'border-color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)')}>
              S'inscrire gratuitement
            </Link>
          </div>

          {/* Prime */}
          <div className="dh-pricing-card featured" style={{ background: 'rgba(0,212,255,0.04)', border: '2px solid #00D4FF' }}>
            <div style={{ position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', borderRadius: 100, padding: '5px 20px', fontSize: 11, fontWeight: 800, color: 'white', whiteSpace: 'nowrap', letterSpacing: '0.05em', fontFamily: "'Helvetica Neue',Arial,sans-serif", boxShadow: '0 4px 16px rgba(0,212,255,0.3)' }}>
              ⭐ RECOMMANDÉ
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#00D4FF', marginBottom: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Prime</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 52, fontWeight: 900, lineHeight: 1 }}>100$</span>
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>par 3 mois</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {AVANTAGES_PRIME.map(a => (
                <li key={a} style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', fontFamily: "'Helvetica Neue',Arial,sans-serif", display: 'flex', alignItems: 'center', gap: 8 }}>{a}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {['📱 MonCash', '🅿️ PayPal', '💜 Zelle', '💳 Visa/MC'].map(m => (
                <span key={m} style={{ fontSize: 11, background: 'rgba(255,255,255,0.08)', borderRadius: 6, padding: '3px 8px', color: 'rgba(255,255,255,0.6)', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>{m}</span>
              ))}
            </div>
            <button onClick={() => setModal({ montant: 100, description: 'Plan Prime 3 mois' })}
              style={{ width: '100%', padding: 14, borderRadius: 12, background: 'linear-gradient(135deg, #00D4FF, #7B61FF)', color: 'white', border: 'none', fontWeight: 700, fontSize: 15, cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif", boxShadow: '0 4px 20px rgba(0,212,255,0.3)', transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              💳 Payer maintenant
            </button>
            <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 10, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
              MonCash · PayPal · Zelle · Visa/Mastercard
            </p>
          </div>

          {/* Offres Cours */}
          <div className="dh-pricing-card" style={{ background: 'rgba(255,255,255,0.03)', border: '2px solid rgba(123,97,255,0.35)' }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: '#A78BFA', marginBottom: 20, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Offres Cours</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
              {[
                { label: '2 cours au choix', prix: 60, affiche: '60$', remise: '-14%', montantPayer: 'Payer 60$' },
                { label: '3 cours au choix', prix: 80, affiche: '80$', remise: '-24%', montantPayer: 'Payer 80$' },
              ].map(o => (
                <div key={o.label} style={{ background: 'rgba(123,97,255,0.08)', border: '1px solid rgba(123,97,255,0.25)', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'white', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>{o.label}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Formations payantes</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 24, fontWeight: 900, color: '#A78BFA', lineHeight: 1 }}>{o.affiche}</div>
                      <div style={{ fontSize: 10, background: 'rgba(62,180,137,0.15)', color: '#3EB489', borderRadius: 4, padding: '2px 6px', marginTop: 3, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>{o.remise}</div>
                    </div>
                  </div>
                  <button onClick={() => setModal({ montant: o.prix, description: `${o.label} — Débat Haïti` })}
                    style={{ width: '100%', padding: '10px', borderRadius: 10, background: 'linear-gradient(135deg, #7B61FF, #00D4FF)', color: 'white', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                    💳 {o.montantPayer}
                  </button>
                </div>
              ))}
            </div>
            <a href="https://wa.me/50999999999" target="_blank" rel="noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.25)', color: '#25D366', padding: '12px', borderRadius: 12, textDecoration: 'none', fontWeight: 600, fontSize: 13, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
              💬 Questions ? WhatsApp
            </a>
          </div>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: 72 }}>
          <h3 style={{ fontSize: 'clamp(20px,3vw,28px)', fontFamily: 'Georgia,serif', fontWeight: 'normal', marginBottom: 32, textAlign: 'center' }}>Questions fréquentes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
            {FAQS.map(faq => (
              <div key={faq.q} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 24px' }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, color: '#00D4FF', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>❓ {faq.q}</div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.65, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>{faq.r}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA bas */}
        <div style={{ textAlign: 'center', marginTop: 64, paddingBottom: 48 }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', fontFamily: "'Helvetica Neue',Arial,sans-serif", marginBottom: 16 }}>
            Paiement sécurisé · Support WhatsApp · Accès immédiat
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['🏦 MonCash', '🅿️ PayPal', '💜 Zelle', '💳 Visa', '💳 Mastercard'].map(m => (
              <span key={m} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', padding: '6px 14px', borderRadius: 100, fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
