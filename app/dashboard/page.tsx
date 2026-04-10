'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import api from '@/lib/api';

const NOTIFS_MOCK = [
  { id: '1', texte: 'Nouveau tournoi disponible : Championnat 2026', type: 'tournoi', date: 'Il y a 2h', lu: false },
  { id: '2', texte: 'Votre argument a reçu 12 votes positifs', type: 'vote', date: 'Il y a 5h', lu: false },
  { id: '3', texte: 'Formation "Rhétorique" mise à jour', type: 'formation', date: 'Hier', lu: true },
];
const ACTIVITES_MOCK = [
  { id: '1', type: 'debat', titre: 'La réforme de la Constitution haïtienne', date: '02/04/2026', icon: '💬' },
  { id: '2', type: 'live', titre: 'Débat : Égalité hommes-femmes en Haïti', date: '28/03/2026', icon: '🎥' },
  { id: '3', type: 'formation', titre: 'Introduction au débat juridique — 60%', date: '25/03/2026', icon: '📚' },
];

export default function PageDashboard() {
  const { utilisateur } = useAuthStore();
  const [stats, setStats] = useState({ debats: 0, formations: 0, tournois: 0, votes: 0 });
  const [notifs] = useState(NOTIFS_MOCK);
  const [activites] = useState(ACTIVITES_MOCK);

  useEffect(() => {
    api.get('/gamification/mes-stats').then(({ data }) => {
      setStats({ debats: data.debats ?? 0, formations: data.cours ?? 0, tournois: data.tournois ?? 0, votes: data.votes ?? 0 });
    }).catch(() => {});
  }, []);

  const heure = new Date().getHours();
  const salutation = heure < 12 ? 'Bonjour' : heure < 18 ? 'Bon après-midi' : 'Bonsoir';
  const initiales = utilisateur ? (utilisateur.prenom?.[0] || '') + (utilisateur.nom?.[0] || '') : '?';

  return (
    <ProtectedRoute>
      <div style={{ background: 'var(--page)', minHeight: '100vh' }}>

        {/* ── En-tête ── */}
        <div style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B263B)', padding: 'clamp(28px,4vw,48px) clamp(20px,4vw,48px)' }}>
          <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {/* Avatar miniature */}
              <div style={{ width: 52, height: 52, borderRadius: '50%', background: 'linear-gradient(135deg, #C0321A, #8B1A0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: 'white', fontFamily: 'Georgia,serif', border: '2px solid rgba(255,255,255,0.15)', flexShrink: 0 }}>
                {initiales.toUpperCase()}
              </div>
              <div>
                <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 2 }}>{salutation} 👋</p>
                <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(18px,3vw,26px)', color: 'white', fontWeight: 'normal' }}>
                  {utilisateur?.prenom} {utilisateur?.nom}
                </h1>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/profil/modifier" style={{ padding: '9px 18px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, fontSize: 12, borderRadius: 8 }}>
                ✏️ Mon profil
              </Link>
              <Link href="/premium" style={{ padding: '9px 18px', background: '#C0321A', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 12, borderRadius: 8 }}>
                ⭐ Premium
              </Link>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 1000, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(20px,4vw,48px)' }}>

          {/* ── Statistiques ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
            {[
              { n: stats.debats,    label: 'Débats suivis',     icon: '💬', color: '#7C3AED', href: '/debats' },
              { n: stats.formations,label: 'Formations',         icon: '📚', color: '#2563EB', href: '/formations' },
              { n: stats.tournois,  label: 'Tournois',           icon: '🏆', color: '#D97706', href: '/tournois' },
              { n: stats.votes,     label: 'Votes donnés',       icon: '✅', color: '#059669', href: '/debats' },
            ].map(s => (
              <Link key={s.label} href={s.href} style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 12, padding: '18px 16px', textDecoration: 'none', transition: 'all 0.15s', display: 'block' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = s.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${s.color}18`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line2)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 700, color: 'var(--ink)', lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              </Link>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {/* ── Activités récentes ── */}
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 'normal', color: 'var(--ink)' }}>Activités récentes</h3>
                <Link href="/debats" style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--red)', textDecoration: 'none' }}>Voir tout →</Link>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {activites.map((a, i) => (
                  <div key={a.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < activites.length - 1 ? '1px solid var(--line2)' : 'none' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--page2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>{a.icon}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.4, marginBottom: 3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.titre}</p>
                      <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>{a.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Notifications ── */}
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '22px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
                <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 'normal', color: 'var(--ink)' }}>
                  Notifications
                  {notifs.filter(n => !n.lu).length > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 20, height: 20, borderRadius: '50%', background: 'var(--red)', color: 'white', fontSize: 10, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, marginLeft: 8 }}>
                      {notifs.filter(n => !n.lu).length}
                    </span>
                  )}
                </h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {notifs.map((n, i) => (
                  <div key={n.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '11px 0', borderBottom: i < notifs.length - 1 ? '1px solid var(--line2)' : 'none', opacity: n.lu ? 0.6 : 1 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: n.lu ? 'var(--line2)' : 'var(--red)', marginTop: 5, flexShrink: 0 }}/>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, marginBottom: 2 }}>{n.texte}</p>
                      <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>{n.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Accès rapides ── */}
            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
              {[
                { href: '/formations', icon: '📚', label: 'Accéder à mes formations', bg: '#EFF6FF', color: '#2563EB' },
                { href: '/tournois', icon: '🏆', label: 'Voir mes tournois', bg: '#FFFBEB', color: '#D97706' },
                { href: '/debats', icon: '💬', label: 'Débats en cours', bg: '#F5F3FF', color: '#7C3AED' },
                { href: '/lives', icon: '🎥', label: 'Lives & Replays', bg: '#F0FDF4', color: '#059669' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 12, background: l.bg, border: `1px solid ${l.color}20`, borderRadius: 12, padding: '14px 16px', textDecoration: 'none', transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = l.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${l.color}20`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = `${l.color}20`; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                  <span style={{ fontSize: 22 }}>{l.icon}</span>
                  <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 700, color: l.color, lineHeight: 1.3 }}>{l.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 700px) {
            div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
            div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>
    </ProtectedRoute>
  );
}
