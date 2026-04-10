'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const DEBATS_RECENTS = [
  { id: '1', titre: 'La réforme constitutionnelle en Haïti', categorie: 'Politique', date: '02/04/2026', messages: 38 },
  { id: '2', titre: "L'économie informelle : frein ou moteur ?", categorie: 'Économie', date: '28/03/2026', messages: 21 },
];
const FORMATIONS_RECENTES = [
  { id: 'F1', titre: 'Introduction au débat juridique', progression: 60, niveau: 'Débutant' },
  { id: 'F2', titre: 'Rhétorique et persuasion', progression: 30, niveau: 'Intermédiaire' },
];

const CAT_COLORS: Record<string, string> = {
  Politique: '#7C3AED', Économie: '#D97706', Société: '#059669', Religion: '#EF4444',
};

export default function PageProfil() {
  const { id } = useParams() as { id: string };
  const { utilisateur } = useAuthStore();
  const [profil, setProfil] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [succes, setSucces] = useState(false);
  const estMoi = utilisateur?.id === id;

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('updated') === '1') {
      setSucces(true);
      window.history.replaceState({}, '', `/profil/${id}`);
    }
    api.get(`/profils/${id}`)
      .then(({ data }) => setProfil(data))
      .catch(() => {
        if (utilisateur?.id === id) setProfil({ prenom: utilisateur.prenom, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role, bio: '', ville: '' });
      })
      .finally(() => setChargement(false));
  }, [id]);

  const initiales = profil ? (profil.prenom?.[0] || '') + (profil.nom?.[0] || '') : '?';

  if (chargement) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--line2)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!profil) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>👤</div>
      <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 'normal', color: 'var(--ink)' }}>Profil introuvable</h2>
      <Link href="/" style={{ color: 'var(--red)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>← Retour à l'accueil</Link>
    </div>
  );

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {/* ── Bannière succès mise à jour ── */}
      {succes && (
        <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, animation: 'slideDown 0.4s ease' }}>
          <span style={{ fontSize: 18 }}>✅</span>
          <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, fontSize: 14 }}>Votre profil a été mis à jour avec succès !</span>
          <button onClick={() => setSucces(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 26, height: 26, borderRadius: '50%', cursor: 'pointer', fontSize: 14, marginLeft: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
        </div>
      )}

      {/* ── Hero profil ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 60%, #0A1525 100%)', padding: 'clamp(40px,6vw,72px) clamp(20px,4vw,48px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(27,63,139,0.15) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(192,50,26,0.08) 0%, transparent 40%)', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 28, alignItems: 'center' }}>
          {/* Avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, #C0321A, #8B1A0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'Georgia,serif', border: '4px solid rgba(255,255,255,0.15)', boxShadow: '0 0 0 8px rgba(192,50,26,0.08), 0 8px 32px rgba(0,0,0,0.3)' }}>
              {profil?.photoUrl ? <img src={profil.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}/> : initiales.toUpperCase()}
            </div>
            <div style={{ position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: '50%', background: '#059669', border: '2px solid #0D1B2A' }}/>
          </div>
          {/* Infos */}
          <div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(20px,3vw,28px)', color: 'white', fontWeight: 'normal', marginBottom: 4 }}>
              {profil.prenom} {profil.nom}
            </h1>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
              {profil.email && <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>✉️ {profil.email}</span>}
              {profil.ville && <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>📍 {profil.ville}</span>}
            </div>
            {profil.role && (
              <span style={{ display: 'inline-block', background: 'rgba(192,50,26,0.2)', color: '#F87060', border: '1px solid rgba(192,50,26,0.35)', borderRadius: 100, padding: '3px 14px', fontSize: 11, fontFamily: "'Helvetica Neue',Arial,sans-serif", letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                {profil.role}
              </span>
            )}
          </div>
          {/* Actions */}
          {estMoi && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link href="/profil/modifier" style={{ padding: '10px 20px', background: '#C0321A', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 12, borderRadius: 8, textAlign: 'center', letterSpacing: '0.03em', whiteSpace: 'nowrap' }}>
                ✏️ Modifier mon profil
              </Link>
              <Link href="/debats" style={{ padding: '10px 20px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, fontSize: 12, borderRadius: 8, textAlign: 'center', whiteSpace: 'nowrap' }}>
                💬 Voir mes activités
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* ── Corps ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(20px,4vw,48px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

          {/* Statistiques */}
          <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '22px 24px', gridColumn: '1 / -1' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 18 }}>Mes statistiques</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--line2)' }}>
              {[
                { n: profil._count?.debats ?? 0, label: 'Débats', icon: '💬' },
                { n: profil._count?.messages ?? 0, label: 'Messages', icon: '✍️' },
                { n: profil._count?.votes ?? 0, label: 'Votes', icon: '✅' },
                { n: profil._count?.abonnes ?? 0, label: 'Abonnés', icon: '👥' },
              ].map(s => (
                <div key={s.label} style={{ background: 'white', padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 700, color: 'var(--ink)' }}>{s.n}</div>
                  <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bio */}
          {profil.bio && (
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '22px 24px' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 12 }}>À propos</h3>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{profil.bio}</p>
            </div>
          )}

          {/* Débats récents */}
          <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 'normal', color: 'var(--ink)' }}>Débats récents</h3>
              <Link href="/debats" style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--red)', textDecoration: 'none' }}>Voir tout →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DEBATS_RECENTS.map(d => (
                <Link key={d.id} href={`/debats/${d.id}`} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', textDecoration: 'none', padding: '10px', borderRadius: 8, transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--page2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: `${CAT_COLORS[d.categorie] || '#64748B'}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>💬</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--ink)', marginBottom: 3, lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any }}>{d.titre}</p>
                    <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>{d.date} · {d.messages} messages</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Formations */}
          <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '22px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, fontWeight: 'normal', color: 'var(--ink)' }}>Formations</h3>
              <Link href="/formations" style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--red)', textDecoration: 'none' }}>Voir tout →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {FORMATIONS_RECENTES.map(f => (
                <Link key={f.id} href={`/formations/${f.id}`} style={{ textDecoration: 'none', display: 'block', padding: 10, borderRadius: 8, transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--page2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{f.titre}</span>
                    <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)' }}>{f.progression}%</span>
                  </div>
                  <div style={{ height: 6, background: 'var(--page3)', borderRadius: 100, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${f.progression}%`, background: f.progression === 100 ? '#059669' : 'var(--red)', borderRadius: 100, transition: 'width 0.5s' }}/>
                  </div>
                  <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', marginTop: 4, display: 'block' }}>{f.niveau}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Liens rapides si mon profil */}
          {estMoi && (
            <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {[
                { href: '/formations', icon: '📚', label: 'Accéder à mes formations', color: '#2563EB' },
                { href: '/tournois', icon: '🏆', label: 'Voir mes tournois', color: '#D97706' },
                { href: '/dashboard', icon: '📊', label: 'Tableau de bord', color: '#059669' },
                { href: '/premium', icon: '⭐', label: 'Plan Premium', color: '#7C3AED' },
              ].map(l => (
                <Link key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid var(--line2)', borderRadius: 10, padding: '13px 16px', textDecoration: 'none', color: 'var(--ink)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600, transition: 'all 0.15s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = l.color; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 12px ${l.color}20`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line2)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}>
                  <span style={{ fontSize: 20 }}>{l.icon}</span>
                  <span style={{ lineHeight: 1.3 }}>{l.label}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slideDown { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 700px) {
          div[style*="grid-template-columns: auto 1fr auto"] { grid-template-columns: 1fr !important; text-align: center; }
          div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4, 1fr)"] { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
