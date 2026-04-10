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
    <div style={{ background: 'var(--page)', fontFamily: 'Georgia,serif', overflowX: 'hidden' }}>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        minHeight: 'calc(100vh - 56px)',
        maxHeight: 700,
      }}>
        {/* Gauche — Texte */}
        <div style={{
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(32px,5vw,80px) clamp(24px,5vw,80px)',
          background: 'var(--page)',
        }}>
          <h1 style={{
            fontSize: 'clamp(32px,5vw,64px)',
            fontWeight: 'normal', lineHeight: 1.08,
            letterSpacing: '-0.025em', color: 'var(--ink)',
            marginBottom: 20,
          }}>
            <strong style={{ fontWeight: 800 }}>Confrontez</strong> les idées
          </h1>
          <p style={{
            fontSize: 'clamp(15px,2vw,20px)', lineHeight: 1.5,
            color: 'var(--ink)', marginBottom: 8,
            fontFamily: "'Helvetica Neue',Arial,sans-serif",
          }}>
            Et participez aux <strong>grands débats</strong> qui façonnent l'avenir d'Haiti.
          </p>
          <p style={{
            fontSize: 'clamp(13px,1.4vw,16px)', color: 'var(--muted)',
            lineHeight: 1.7, marginBottom: 36,
            fontFamily: "'Helvetica Neue',Arial,sans-serif", maxWidth: 440,
          }}>
            La plateforme de débat où chaque idée s'éprouve par la confrontation intellectuelle et dialogue ouvert.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/debats" style={{
              display: 'inline-block', padding: '13px 28px',
              background: 'var(--red)', color: 'white',
              textDecoration: 'none',
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontWeight: 700, fontSize: 13, letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Découvrir
            </Link>
            <Link href="/auth/inscription" style={{
              display: 'inline-block', padding: '13px 28px',
              background: 'var(--ink)', color: 'var(--page)',
              textDecoration: 'none',
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontWeight: 700, fontSize: 13, letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}>
              Créer un compte
            </Link>
          </div>
        </div>

        {/* Droite — Photo réelle + débats live */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* VRAIE PHOTO — deux personnes en débat */}
          <img
            src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=85"
            alt="Deux personnes en débat"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center',
              display: 'block',
            }}
          />
          {/* Overlay léger */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.25) 100%)',
          }}/>

          {/* Card débats live — superposée */}
          <div style={{
            position: 'absolute', right: 24, bottom: 32,
            background: 'var(--page)', width: 'clamp(240px,35%,310px)',
            padding: 20, boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
            borderRadius: 4,
          }}>
            <div style={{
              fontFamily: "'Helvetica Neue',Arial,sans-serif",
              fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
              marginBottom: 14, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Link href="/debats" style={{ color: 'var(--red)', fontWeight: 700, textDecoration: 'none' }}>DÉBATS</Link>
              <span style={{ color: 'var(--muted)' }}>EN DIRECT</span>
            </div>
            {debats.map((d, i) => (
              <div key={d.id} style={{
                paddingTop: i > 0 ? 14 : 0,
                marginTop: i > 0 ? 14 : 0,
                borderTop: i > 0 ? '1px solid var(--line2)' : 'none',
              }}>
                <p style={{
                  fontFamily: 'Georgia,serif', fontSize: 14,
                  lineHeight: 1.4, marginBottom: 8, color: 'var(--ink)',
                }}>
                  {d.titre}
                </p>
                <div style={{ height: 2, background: 'var(--line2)', marginBottom: 4, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${d.pour}%`, background: 'var(--ink)' }}/>
                </div>
                <div style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: 11, fontFamily: "'Helvetica Neue',Arial,sans-serif",
                  color: 'var(--muted)',
                }}>
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
              fontSize: 10, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Voir tous les débats
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ STATS ══════════════ */}
      <section style={{
        borderTop: '1px solid var(--line2)', borderBottom: '1px solid var(--line2)',
        background: 'var(--page2)',
        padding: '28px clamp(24px,5vw,80px)',
        display: 'grid',
        gridTemplateColumns: 'repeat(3,1fr)',
      }}>
        {[['500+', 'Discutants'], ['50+', 'Formations'], ['20+', 'Tournois']].map(([n, l], i) => (
          <div key={l} style={{
            textAlign: 'center', padding: '16px 0',
            borderRight: i < 2 ? '1px solid var(--line2)' : 'none',
          }}>
            <div style={{
              fontSize: 'clamp(28px,4vw,44px)',
              fontFamily: 'Georgia,serif', color: 'var(--ink)',
              letterSpacing: '-0.02em',
            }}>{n}</div>
            <div style={{
              fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif",
              color: 'var(--muted)', letterSpacing: '0.05em',
              textTransform: 'uppercase', marginTop: 4,
            }}>{l}</div>
          </div>
        ))}
      </section>

      {/* ══════════════ TOURNOIS ══════════════ */}
      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'baseline', marginBottom: 40, flexWrap: 'wrap', gap: 16,
          }}>
            <div>
              <div style={{
                fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--muted)', fontFamily: "'Helvetica Neue',Arial,sans-serif", marginBottom: 8,
              }}>Compétitions</div>
              <h2 style={{
                fontSize: 'clamp(22px,3vw,36px)', fontWeight: 'normal',
                letterSpacing: '-0.015em', color: 'var(--ink)',
              }}>
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

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 1, background: 'var(--line2)',
          }}>
            {tournois.map(t => (
              <div key={t.id} style={{ background: 'var(--page)', padding: 28 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  <span style={{
                    fontSize: 10, padding: '3px 10px',
                    background: t.statut === 'EN_COURS' ? 'rgba(192,50,26,0.1)' : 'rgba(27,63,139,0.1)',
                    color: t.statut === 'EN_COURS' ? 'var(--red)' : 'var(--blue)',
                    fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700,
                    letterSpacing: '0.05em', textTransform: 'uppercase',
                  }}>
                    {t.statut === 'EN_COURS' ? '⚔ En cours' : '📋 Inscriptions'}
                  </span>
                </div>
                <h3 style={{
                  fontSize: 16, fontFamily: 'Georgia,serif', fontWeight: 'normal',
                  lineHeight: 1.4, marginBottom: 12, color: 'var(--ink)',
                }}>
                  {t.nom}
                </h3>
                <div style={{
                  fontSize: 11, fontFamily: "'Helvetica Neue',Arial,sans-serif",
                  color: 'var(--muted)', display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 16,
                }}>
                  <span>📍 {t.lieu}</span>
                  <span>👥 {t.equipes} équipes</span>
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
                    {t.statut === 'EN_COURS' ? 'Participer' : "S'inscrire"}
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
              fontSize: 11, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}>
              Voir tous les tournois
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════ PARTENAIRES ══════════════ */}
      <section style={{
        background: 'var(--page2)', borderTop: '1px solid var(--line2)',
        padding: 'clamp(40px,5vw,64px) clamp(20px,5vw,80px)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr',
          gap: 48, alignItems: 'center',
        }}>
          <div>
            <div style={{
              fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--muted)', fontFamily: "'Helvetica Neue',Arial,sans-serif", marginBottom: 12,
            }}>Soutiens</div>
            <h2 style={{
              fontSize: 'clamp(20px,3vw,32px)', fontWeight: 'normal',
              letterSpacing: '-0.015em', marginBottom: 16, color: 'var(--ink)',
            }}>
              Partenaires & Sponsors
            </h2>
            <p style={{
              fontSize: 14, color: 'var(--muted)', lineHeight: 1.7,
              marginBottom: 28, fontFamily: "'Helvetica Neue',Arial,sans-serif",
            }}>
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
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            {(sponsors.length > 0 ? sponsors.map(s => s.nom) : ['AyiboPost', 'YWCA Haïti', 'Decathlon', 'Sun Auto']).map(nom => (
              <div key={nom} style={{
                background: 'var(--page)', border: '1px solid var(--line2)',
                padding: '10px 18px', fontFamily: "'Helvetica Neue',Arial,sans-serif",
                fontSize: 13, fontWeight: 600, color: 'var(--ink)',
              }}>
                {nom}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════ RÔLES ══════════════ */}
      <section style={{ padding: 'clamp(40px,6vw,80px) clamp(20px,5vw,80px)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{
            fontSize: 'clamp(20px,3vw,32px)', fontWeight: 'normal',
            letterSpacing: '-0.015em', marginBottom: 40, color: 'var(--ink)',
          }}>
            Une plateforme pour chaque rôle
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 1, background: 'var(--line2)',
          }}>
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

      {/* ══════════════ CTA ══════════════ */}
      {!estConnecte && (
        <section style={{ padding: 'clamp(48px,6vw,80px) 24px', background: 'var(--ink)', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,40px)', fontWeight: 'normal', color: 'var(--page)', marginBottom: 14, letterSpacing: '-0.015em' }}>
            Prêt à débattre ?
          </h2>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'rgba(244,240,233,0.5)', marginBottom: 36, lineHeight: 1.7 }}>
            Rejoignez la communauté. Gratuit pour commencer.
          </p>
          <Link href="/auth/inscription" style={{ display: 'inline-block', padding: '14px 36px', background: 'var(--red)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Créer mon compte
          </Link>
        </section>
      )}

      {/* ══════════════ FOOTER ══════════════ */}
      <footer style={{ background: 'var(--page2)', padding: '28px clamp(20px,5vw,80px)', borderTop: '1px solid var(--line2)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>
            Debat Haiti — Tous droits réservés 2026
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[['Débats', '/debats'], ['Formations', '/formations'], ['Tournois', '/tournois'], ['Lives', '/lives'], ['Contact', '/contact']].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', textDecoration: 'none', letterSpacing: '0.04em' }}>
                {label}
              </Link>
            ))}
          </div>
        </div>
      </footer>

      {/* ══ RESPONSIVE MOBILE ══ */}
      <style>{`
        /* Samsung Galaxy S10 et petits écrans */
        @media (max-width: 768px) {
          /* Hero — colonne unique */
          section:first-of-type {
            grid-template-columns: 1fr !important;
            max-height: none !important;
            min-height: auto !important;
          }
          /* Photo hero — hauteur fixe sur mobile */
          section:first-of-type > div:last-child {
            height: 360px;
            min-height: 0;
          }
          /* Card débats — plein largeur sur mobile */
          section:first-of-type > div:last-child > div:last-child {
            right: 12px !important;
            bottom: 12px !important;
            left: 12px !important;
            width: auto !important;
          }
          /* Partenaires colonne unique */
          section:nth-of-type(5) > div {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 480px) {
          section:first-of-type > div:first-child {
            padding: 28px 20px !important;
          }
          section:first-of-type > div:last-child {
            height: 280px;
          }
        }
      `}</style>
    </div>
  );
}
