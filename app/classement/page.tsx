'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

const MOCK = [
  { rang: 1, prenom: 'Jean', nom: 'Pierre', ville: 'Port-au-Prince', points: 1240, debats: 28, badges: ['🏆', '🎖️'] },
  { rang: 2, prenom: 'Marie', nom: 'Paul', ville: 'Cap-Haïtien', points: 980, debats: 22, badges: ['🎖️'] },
  { rang: 3, prenom: 'Louis', nom: 'René', ville: 'Pétion-Ville', points: 875, debats: 19, badges: ['🎖️'] },
  { rang: 4, prenom: 'Anne', nom: 'Joseph', ville: 'Jacmel', points: 720, debats: 16, badges: [] },
  { rang: 5, prenom: 'Marc', nom: 'Dupont', ville: 'Les Cayes', points: 640, debats: 14, badges: [] },
  { rang: 6, prenom: 'Clara', nom: 'René', ville: 'Gonaïves', points: 590, debats: 12, badges: [] },
  { rang: 7, prenom: 'Patrick', nom: 'Fils', ville: 'Port-au-Prince', points: 510, debats: 11, badges: [] },
  { rang: 8, prenom: 'Nadège', nom: 'Saint', ville: 'Cap-Haïtien', points: 440, debats: 9, badges: [] },
];

export default function PageClassement() {
  const [classement, setClassement] = useState(MOCK);
  const [periode, setPeriode] = useState<'semaine' | 'mois' | 'general'>('general');

  useEffect(() => {
    api.get('/gamification/classement').then(({ data }) => { if (Array.isArray(data) && data.length) setClassement(data); }).catch(() => {});
  }, []);

  const podium = classement.slice(0, 3);
  const reste = classement.slice(3);

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B263B)', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,80px)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(26px,4vw,48px)', fontWeight: 'normal', color: 'white', marginBottom: 12 }}>Classement</h1>
        <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.6)', maxWidth: 480, margin: '0 auto 28px' }}>
          Les meilleurs débatteurs de la communauté Débat Haïti
        </p>
        {/* Filtres période */}
        <div style={{ display: 'inline-flex', gap: 0, background: 'rgba(255,255,255,0.08)', borderRadius: 100, padding: 4 }}>
          {[{ id: 'semaine', label: 'Cette semaine' }, { id: 'mois', label: 'Ce mois' }, { id: 'general', label: 'Général' }].map(p => (
            <button key={p.id} onClick={() => setPeriode(p.id as any)} style={{ padding: '8px 20px', borderRadius: 100, border: 'none', background: periode === p.id ? 'white' : 'transparent', color: periode === p.id ? 'var(--ink)' : 'rgba(255,255,255,0.6)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(20px,5vw,80px)' }}>
        {/* Podium top 3 */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 40, alignItems: 'end' }}>
          {[podium[1], podium[0], podium[2]].map((p, i) => {
            if (!p) return <div key={i}/>;
            const rang = i === 0 ? 2 : i === 1 ? 1 : 3;
            const hauteur = rang === 1 ? 160 : rang === 2 ? 130 : 110;
            const medalColors = ['#C0C0C0', '#FFD700', '#CD7F32'];
            const medal = rang === 1 ? medalColors[1] : rang === 2 ? medalColors[0] : medalColors[2];
            return (
              <div key={p.rang} style={{ textAlign: 'center' }}>
                {/* Avatar */}
                <div style={{ width: rang === 1 ? 72 : 56, height: rang === 1 ? 72 : 56, borderRadius: '50%', background: `linear-gradient(135deg, ${medal}, ${medal}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: rang === 1 ? 24 : 18, fontWeight: 700, color: 'white', fontFamily: 'Georgia,serif', margin: '0 auto 8px', border: `3px solid ${medal}` }}>
                  {(p.prenom?.[0] || '') + (p.nom?.[0] || '')}
                </div>
                <p style={{ fontFamily: 'Georgia,serif', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 2 }}>{p.prenom} {p.nom}</p>
                <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', marginBottom: 6 }}>📍 {p.ville}</p>
                {/* Barre */}
                <div style={{ height: hauteur, background: `linear-gradient(to top, ${medal}40, ${medal}20)`, border: `2px solid ${medal}40`, borderRadius: '8px 8px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 12 }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: rang === 1 ? 28 : 22, fontWeight: 700, color: medal }}>{rang === 1 ? '🥇' : rang === 2 ? '🥈' : '🥉'}</div>
                  <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{p.points} pts</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tableau reste */}
        <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, overflow: 'hidden' }}>
          {reste.map((p, i) => (
            <div key={p.rang} style={{ display: 'grid', gridTemplateColumns: '48px 1fr auto', gap: 0, padding: '14px 20px', borderBottom: i < reste.length - 1 ? '1px solid var(--line2)' : 'none', background: i % 2 === 0 ? 'white' : 'var(--page2)', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 700, color: 'var(--muted)' }}>#{p.rang}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #C0321A, #8B1A0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: 'white', fontFamily: 'Georgia,serif', flexShrink: 0 }}>
                  {(p.prenom?.[0] || '') + (p.nom?.[0] || '')}
                </div>
                <div>
                  <p style={{ fontFamily: 'Georgia,serif', fontSize: 14, fontWeight: 700, color: 'var(--ink)', marginBottom: 1 }}>{p.prenom} {p.nom}</p>
                  <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>📍 {p.ville} · {p.debats} débats</p>
                </div>
              </div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 700, color: 'var(--ink)' }}>{p.points} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
