'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const DEBATS_MOCK = [
  { id: '1', titre: 'La réforme de la Constitution haïtienne est-elle nécessaire ?', pour: 63, contre: 37 },
  { id: '2', titre: "L'économie informelle : frein ou moteur pour Haïti ?", pour: 44, contre: 56 },
];

const TOURNOIS_MOCK = [
  { id: 'T1', nom: 'Championnat National de Débat Haïti 2026', lieu: 'Port-au-Prince', dateDebut: '2026-04-02', dateFin: '2026-04-24', equipes: 116, matchs: 88, statut: 'EN_COURS', prix: 35 },
  { id: 'T2', nom: 'Tournoi Jeunesse & Éloquence 2024', lieu: 'Cap-Haïtien', dateDebut: '2024-05-02', dateFin: '2026-04-24', equipes: 22, matchs: 5, statut: 'INSCRIPTION', prix: 35 },
];

export default function PageAccueil() {
  const { estConnecte } = useAuthStore();
  const [debats, setDebats] = useState(DEBATS_MOCK);
  const [tournois, setTournois] = useState(TOURNOIS_MOCK);
  const [sponsors, setSponsors] = useState<any[]>([]);

  useEffect(() => {
    api.get('/debats').then(({ data }) => { if (Array.isArray(data) && data.length) setDebats(data.slice(0, 2)); }).catch(() => {});
    api.get('/tournois').then(({ data }) => { if (Array.isArray(data) && data.length) setTournois(data.slice(0, 2)); }).catch(() => {});
    api.get('/sponsoring/sponsors').then(({ data }) => { if (Array.isArray(data)) setSponsors(data); }).catch(() => {});
  }, []);

  return (
    <div style={{ background: 'var(--page)', fontFamily: 'Georgia,serif' }}>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 0,
        minHeight: 'calc(100vh - 56px)',
        maxHeight: 700,
      }}>
        {/* Gauche — Texte */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px)',
        }}>
          <h1 style={{
            fontSize: 'clamp(36px,5vw,64px)',
            fontWeight: 'normal',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            color: 'var(--ink)',
            marginBottom: 24,
          }}>
            <span style={{ fontWeight: 700 }}>Confrontez</span> les idées
          </h1>
          <p style={{
            fontSize: 'clamp(15px,1.8vw,20px)',
            lineHeight: 1.5,
            color: 'var(--ink)',
            marginBottom: 12,
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
          }}>
            Et participez aux <strong>grands débats</strong> qui façonnent l'avenir d'Haiti.
          </p>
          <p style={{
            fontSize: 'clamp(13px,1.4vw,16px)',
            color: 'var(--muted)',
            lineHeight: 1.7,
            marginBottom: 40,
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
            maxWidth: 420,
          }}>
            La plateforme de débat où chaque idée s'éprouve par la confrontation intellectuelle et dialogue ouvert.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/debats" style={{
              display: 'inline-block', padding: '14px 28px',
              background: 'var(--red)', color: 'white',
              textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontWeight: 700, fontSize: 13, letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Découvrir
            </Link>
            <Link href="/auth/inscription" style={{
              display: 'inline-block', padding: '14px 28px',
              background: 'var(--ink)', color: 'var(--page)',
              textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontWeight: 700, fontSize: 13, letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Droite — Photo + débats */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Photo background */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #c8b89a 0%, #a8926e 50%, #8B7355 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {/* Illustration personnes en débat */}
            <svg viewBox="0 0 600 400" style={{ width: '100%', height: '100%', objectFit: 'cover' }} preserveAspectRatio="xMidYMid slice">
              <rect width="600" height="400" fill="#C4A882"/>
              {/* Fond bibliothèque */}
              <rect x="0" y="0" width="600" height="400" fill="#B8956A" opacity="0.3"/>
              {/* Étagères */}
              {[0,1,2,3,4].map(i => (
                <g key={i}>
                  <rect x={20 + i*110} y="20" width="90" height="12" fill="#8B6914" opacity="0.4"/>
                  {[0,1,2,3,4,5].map(j => (
                    <rect key={j} x={24+i*110+j*14} y="32" width="10" height={30+Math.sin(i+j)*10} fill={['#C0321A','#1B3F8B','#2D5016','#8B4513','#4A4A4A','#8B1A1A'][j%6]} opacity="0.6"/>
                  ))}
                </g>
              ))}
              {/* Personne gauche */}
              <ellipse cx="200" cy="160" rx="35" ry="40" fill="#8B5E3C"/>
              <ellipse cx="200" cy="130" rx="22" ry="26" fill="#A0714F"/>
              {/* cheveux */}
              <ellipse cx="200" cy="115" rx="24" ry="18" fill="#1A0A00"/>
              {/* corps */}
              <rect x="170" y="195" width="60" height="120" rx="8" fill="#F5E6D3" opacity="0.9"/>
              {/* bras gauche levé */}
              <ellipse cx="155" cy="230" rx="12" ry="35" fill="#A0714F" transform="rotate(-30 155 230)"/>
              {/* Personne droite */}
              <ellipse cx="380" cy="170" rx="30" ry="35" fill="#7A4E2D"/>
              <ellipse cx="380" cy="145" rx="26" ry="30" fill="#D4956A"/>
              {/* cheveux */}
              <ellipse cx="380" cy="128" rx="30" ry="22" fill="#1A0800" opacity="0.9"/>
              {/* corps */}
              <rect x="352" y="200" width="56" height="110" rx="8" fill="#C0621A" opacity="0.85"/>
              {/* Lumière ambiance */}
              <radialGradient id="light" cx="50%" cy="30%" r="60%">
                <stop offset="0%" stopColor="#FFE4B5" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="#8B6914" stopOpacity="0"/>
              </radialGradient>
              <rect width="600" height="400" fill="url(#light)"/>
            </svg>
          </div>

          {/* Card débats live — superposée */}
          <div style={{
            position: 'absolute', right: 24, bottom: 40,
            background: 'var(--page)', width: 300,
            padding: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          }}>
            <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)', fontFamily: "'Helvetica Neue',Arial,sans-serif", marginBottom: 12 }}>
              <span style={{ color: 'var(--red)', fontWeight: 700 }}>DÉBATS</span> <span style={{ color: 'var(--muted)' }}>EN DIRECT</span>
            </div>
            {debats.map((d, i) => (
              <div key={d.id} style={{ paddingTop: i > 0 ? 16 : 0, marginTop: i > 0 ? 16 : 0, borderTop: i > 0 ? '1px solid var(--line2)' : 'none' }}>
                <p style={{ fontFamily: 'Georgia,serif', fontSize: 14, lineHeight: 1.4, marginBottom: 8, color: 'var(--ink)' }}>{d.titre}</p>
                <div style={{ height: 2, background: 'var(--line2)', marginBottom: 4, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${d.pour}%`, background: 'var(--ink)' }}/>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)' }}>
                  <span>Pour — {d.pour}%</span>
                  <span style={{ color: 'var(--red)' }}>Contre — {d.contre}%</span>
                </div>
              </div>
            ))}
            <Link href="/debats" style={{
              display: 'block', marginTop: 16, padding: '10px 0',
              background: 'var(--ink)', color: 'var(--page)',
              textAlign: 'center', textDecoration: 'none',
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
            }}>
              Voir tous les débats
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section style={{
        borderTop: '1px solid var(--line2)',
        borderBottom: '1px solid var(--line2)',
        background: 'var(--page2)',
        padding: '32px clamp(24px,5vw,80px)',
        display: 'flex', gap: 0,
      }}>
        {[['500+', 'Discutants'], ['50+', 'Formations'], ['20+', 'Tournois']].map(([n, l], i) => (
          <div key={l} style={{
            flex: 1, textAlign: 'center', padding: '16px 0',
            borderRight: i < 2 ? '1px solid var(--line2)' : 'none',
          }}>
            <div style={{ fontSize: 'clamp(28px,4vw,44px)', fontFamily: 'Georgia,serif', color: 'var(--ink)', letterSpacing: '-0.02em' }}>{n}</div>
            <div style={{ fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', letterSpacing: '0.05em', textTransform: 'uppercase', marginTop: 4 }}>{l}</div>
          </div>
        ))}
      </section>

      {/* ══════════════ TOURNOIS ══════════════ */}
      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: "'Helvetica Neue',Arial,sans-serif", marginBottom: 8 }}>Compétitions</div>
              <h2 style={{ fontSize: 'clamp(24px,3vw,36px)', fontWeight: 'normal', letterSpacing: '-0.015em', color: 'var(--ink)' }}>
                Les tournois de débat
              </h2>
            </div>
            <Link href="/tournois" style={{
              padding: '10px 20px', background: 'var(--ink)', color: 'var(--page)',
              textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Voir tous les tournois
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 1, background: 'var(--line2)' }}>
            {tournois.map(t => (
              <div key={t.id} style={{ background: 'var(--page)', padding: 28 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, padding: '3px 10px',
                    background: t.statut === 'EN_COURS' ? 'rgba(192,50,26,0.1)' : 'rgba(27,63,139,0.1)',
                    color: t.statut === 'EN_COURS' ? 'var(--red)' : 'var(--blue)',
                    fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    {t.statut === 'EN_COURS' ? '⚔ En cours' : '📋 Inscriptions'}
                  </span>
                </div>
                <h3 style={{ fontSize: 16, fontFamily: 'Georgia,serif', fontWeight: 'normal', lineHeight: 1.4, marginBottom: 12, color: 'var(--ink)' }}>
                  {t.nom}
                </h3>
                <div style={{ fontSize: 11, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                  <span>📍 {t.lieu}</span>
                  <span>👥 {t.equipes} équipes</span>
                  <span>⚔ {t.matchs} matchs</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontFamily: 'Georgia,serif', color: 'var(--ink)' }}>{t.prix} USD</span>
                  <Link href={`/tournois/${t.id}`} style={{
                    padding: '8px 18px',
                    background: t.statut === 'EN_COURS' ? 'var(--red)' : 'var(--ink)',
                    color: 'var(--page)', textDecoration: 'none',
                    fontFamily: "'Helvetica Neue',Arial,sans-serif",
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.04em',
                  }}>
                    {t.statut === 'EN_COURS' ? 'Participer' : 'S\'inscrire'}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Link href="/tournois" style={{
              display: 'inline-block', padding: '14px 40px',
              border: '2px solid var(--ink)', color: 'var(--ink)',
              textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}>
              Voir tous les tournois
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ PARTENAIRES ══════════════ */}
      <section style={{
        background: 'var(--page2)',
        borderTop: '1px solid var(--line2)',
        padding: 'clamp(40px,5vw,64px) clamp(24px,5vw,80px)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', fontFamily: "'Helvetica Neue',Arial,sans-serif", marginBottom: 12 }}>Soutiens</div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 'normal', letterSpacing: '-0.015em', marginBottom: 16, color: 'var(--ink)' }}>
              Partenaires & Sponsors
            </h2>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 28, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
              Débat Haïti est soutenu par des organisations qui croient en la force du dialogue et de l'éducation civique.
            </p>
            <Link href="/sponsors" style={{
              display: 'inline-block', padding: '12px 24px',
              background: 'var(--ink)', color: 'var(--page)',
              textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
            }}>
              Devenir partenaire
            </Link>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            {sponsors.length > 0 ? sponsors.map(s => (
              <div key={s.id} style={{ background: 'var(--page)', border: '1px solid var(--line2)', padding: '12px 20px', fontFamily: 'Georgia,serif', fontSize: 14, color: 'var(--ink)' }}>
                {s.nom}
              </div>
            )) : ['AyiboPost', 'YWCA Haïti', 'Decathlon', 'Boyy Tralore Sun Auto'].map(n => (
              <div key={n} style={{ background: 'var(--page)', border: '1px solid var(--line2)', padding: '12px 20px', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)' }}>
                {n}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ RÔLES ══════════════ */}
      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(24px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px,3vw,32px)', fontWeight: 'normal', letterSpacing: '-0.015em', marginBottom: 40, color: 'var(--ink)' }}>
            Une plateforme pour chaque rôle
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 1, background: 'var(--line2)' }}>
            {[
              { role: 'Apprenant', emoji: '🎓', desc: 'Participe aux débats, vote et accède aux formations.', accent: 'var(--green)' },
              { role: 'Spectateur', emoji: '👁️', desc: 'Observe les débats en direct sans prise de position.', accent: 'var(--red)' },
              { role: 'Formateur', emoji: '👨‍🏫', desc: 'Crée les débats, anime les sessions et suit les apprenants.', accent: 'var(--blue)' },
              { role: 'Admin', emoji: '⚙️', desc: 'Gère la plateforme, les tournois et les utilisateurs.', accent: 'var(--ink)' },
            ].map(({ role, emoji, desc, accent }) => (
              <div key={role} style={{ background: 'var(--page)', padding: '28px 24px' }}>
                <div style={{ width: 28, height: 3, background: accent, marginBottom: 16 }}/>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{emoji}</div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 16, marginBottom: 8, color: 'var(--ink)' }}>{role}</div>
                <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ CTA FINAL ══════════════ */}
      {!estConnecte && (
        <section style={{ padding: 'clamp(48px,6vw,80px) 24px', background: 'var(--ink)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 'normal', color: 'var(--page)', marginBottom: 14, letterSpacing: '-0.015em' }}>
            Prêt à débattre ?
          </h2>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'rgba(244,240,233,0.5)', marginBottom: 36, lineHeight: 1.7 }}>
            Rejoignez la communauté. Gratuit pour commencer.
          </p>
          <Link href="/auth/inscription" style={{
            display: 'inline-block', padding: '14px 36px',
            background: 'var(--red)', color: 'white',
            textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif",
            fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase',
          }}>
            Créer mon compte
          </Link>
        </section>
      )}

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ background: 'var(--page2)', padding: '28px clamp(24px,5vw,80px)', borderTop: '1px solid var(--line2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>
            Debat Haiti — Tous droits réservés 2026
          </div>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['Débats', '/debats'], ['Formations', '/formations'], ['Tournois', '/tournois'], ['Lives', '/lives'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.04em' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          section:first-of-type {
            grid-template-columns: 1fr !important;
            max-height: none !important;
          }
          section:first-of-type > div:last-child {
            min-height: 300px;
          }
          section:first-of-type > div:last-child > div:last-child {
            right: 12px !important;
            bottom: 12px !important;
            width: calc(100% - 24px) !important;
          }
        }
      `}</style>
    </div>
  );
}
