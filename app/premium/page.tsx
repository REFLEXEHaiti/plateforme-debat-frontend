'use client';

import { useState } from 'react';
import Link from 'next/link';
import ModalPaiement from '@/components/paiement/ModalPaiement';

const PLANS = [
  {
    id: 'gratuit', label: 'Gratuit', prix: '0$', periode: 'pour toujours',
    couleur: '#059669', bg: '#F0FDF4', border: '#BBF7D0',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
    avantages: ['Accès aux débats.', '3 commentaires', '3 formations gratuites', 'Sans-élancées.'],
    bouton: "S'inscrire gratuitement", boutonBg: '#0D1B2A', href: '/auth/inscription',
  },
  {
    id: 'prime', label: 'Prime', prix: '100$', periode: 'par 3 mois',
    couleur: '#F97316', bg: '#FFF7ED', border: '#FED7AA',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
    avantages: ['Toutes les formations', '2 formations gratuites', 'Belgamentions certifiée', 'Saminoc-élancées.'],
    bouton: 'Premium', boutonBg: '#F97316', recommended: true,
  },
  {
    id: 'cours', label: 'Offres Cours', prix: '60$', periode: 'par 3 mois',
    couleur: '#7C3AED', bg: '#FAF5FF', border: '#DDD6FE',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80',
    avantages: ['3 clacs greatis', '2 reatore élites', 'Belgamentions certifiée', 'Saminoc-élancées.'],
    bouton: 'Premium', boutonBg: '#7C3AED',
  },
];

export default function PagePremium() {
  const [modal, setModal] = useState<{ montant: number; description: string } | null>(null);

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {modal && <ModalPaiement montant={modal.montant} description={modal.description} onFermer={() => setModal(null)} />}

      {/* ══ HERO IMAGE ══ */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)', padding: 'clamp(48px,7vw,96px) 24px clamp(32px,5vw,64px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'url(https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=60) center/cover', opacity: 0.15, pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,5vw,56px)', fontWeight: 'normal', color: 'white', marginBottom: 12, letterSpacing: '-0.02em' }}>
            Choisissez votre plan
          </h1>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 'clamp(14px,1.8vw,18px)', color: 'rgba(255,255,255,0.6)', maxWidth: 500, margin: '0 auto' }}>
            Investissez dans votre maîtrise du débat
          </p>
        </div>
      </div>

      {/* ══ MESSAGE PROFIL MIS À JOUR (si vient de modifier) ══ */}
      {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('updated') === '1' && (
        <div style={{ background: 'white', padding: '32px 24px', textAlign: 'center', borderBottom: '1px solid var(--line2)' }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(20px,3vw,28px)', color: 'var(--ink)', marginBottom: 8 }}>
            Votre profil a été mis à jour
          </h2>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', marginBottom: 20, fontStyle: 'italic' }}>
            Vos informations ont été sauvegardées. Tout est à jour !
          </p>
          {/* Photos 3 plans */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', maxWidth: 500, margin: '0 auto 20px' }}>
            {PLANS.map(p => (
              <div key={p.id} style={{ flex: 1, position: 'relative' }}>
                <div style={{ height: 100, background: `url(${p.image}) center/cover`, borderRadius: 10 }}/>
                <span style={{ position: 'absolute', bottom: 8, left: '50%', transform: 'translateX(-50%)', background: p.couleur, color: 'white', fontSize: 10, padding: '2px 10px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ CARTES PLANS ══ */}
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(32px,5vw,64px) clamp(16px,4vw,40px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24, alignItems: 'start' }}>
          {PLANS.map(p => (
            <div key={p.id} style={{ background: p.bg, border: `2px solid ${p.recommended ? p.couleur : p.border}`, borderRadius: 20, padding: 28, position: 'relative', transform: p.recommended ? 'scale(1.03)' : 'none', boxShadow: p.recommended ? `0 8px 40px ${p.couleur}30` : 'none', transition: 'transform 0.2s' }}>
              {p.recommended && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: p.couleur, color: 'white', fontSize: 11, padding: '4px 16px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, whiteSpace: 'nowrap' }}>
                  ⭐ RECOMMANDÉ
                </div>
              )}
              {/* Photo */}
              <div style={{ height: 140, background: `url(${p.image}) center/cover`, borderRadius: 12, marginBottom: 20 }}/>
              {/* Badge */}
              <div style={{ display: 'inline-block', background: p.couleur, color: 'white', fontSize: 11, padding: '3px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, marginBottom: 12 }}>
                {p.label}
              </div>
              {/* Prix */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: 'Georgia,serif', fontSize: 44, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{p.prix}</span>
              </div>
              <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{p.periode}</div>
              {/* Avantages */}
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {p.avantages.map(a => (
                  <li key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)' }}>
                    <span style={{ color: p.couleur, fontSize: 14 }}>✓</span> {a}
                  </li>
                ))}
              </ul>
              {/* Bouton */}
              {p.href ? (
                <Link href={p.href} style={{ display: 'block', textAlign: 'center', padding: '13px', borderRadius: 12, background: p.boutonBg, color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 14 }}>
                  {p.bouton}
                </Link>
              ) : (
                <button onClick={() => setModal({ montant: parseInt(p.prix), description: `Plan ${p.label} 3 mois` })} style={{ width: '100%', padding: '13px', borderRadius: 12, background: p.boutonBg, color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
                  {p.bouton}
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Logos paiement */}
        <div style={{ marginTop: 48, textAlign: 'center' }}>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', marginBottom: 16, letterSpacing: '0.04em' }}>
            PAIEMENT SÉCURISÉ
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'MonCash', bg: '#FF6B00', color: 'white' },
              { label: 'YWCA', bg: '#005B8E', color: 'white' },
              { label: 'HiSD', bg: '#1A1A2E', color: 'white' },
              { label: 'DECATHLON', bg: '#0082C8', color: 'white' },
              { label: 'Klarna\nMastercard', bg: '#FFB3C7', color: '#111' },
            ].map(m => (
              <div key={m.label} style={{ background: m.bg, color: m.color, padding: '8px 16px', borderRadius: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, fontWeight: 700, textAlign: 'center', whiteSpace: 'pre' }}>
                {m.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
