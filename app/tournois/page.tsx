'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plateforme-debat-backend.onrender.com/api';

const MOCK_TOURNOIS = [
  { id: 'T1', nom: 'Championnat National de Débat Haïti 2026', description: 'La plus grande compétition de débat juridique du pays.', statut: 'EN_COURS', dateDebut: '2026-04-02', dateFin: '2026-04-24', maxEquipes: 116, lieu: 'Port-au-Prince', prixInscription: 35, image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80', _count: { equipes: 116, matchs: 8 } },
  { id: 'T2', nom: 'Tournoi Jeunesse & Éloquence 2024', description: 'Compétition pour les jeunes orateurs haïtiens.', statut: 'INSCRIPTION', dateDebut: '2024-05-02', dateFin: '2026-04-24', maxEquipes: 28, lieu: 'Cap-Haïtien', prixInscription: 35, image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800&q=80', _count: { equipes: 22, matchs: 0 } },
];

const MOCK_EQUIPES = [
  { rang: 1, equipe: 'Les Aigles du Droit', ville: 'Port-au-Prince', matchs: 6, victoires: 5, points: 15 },
  { rang: 2, equipe: 'Rhéteurs du Nord', ville: 'Cap-Haïtien', matchs: 6, victoires: 4, points: 12 },
  { rang: 3, equipe: 'Forum Légal Pétion-Ville', ville: 'Pétion-Ville', matchs: 6, victoires: 4, points: 12 },
  { rang: 4, equipe: 'Club Débat UNAHE', ville: 'Port-au-Prince', matchs: 6, victoires: 3, points: 9 },
  { rang: 5, equipe: 'Orateurs des Cayes', ville: 'Les Cayes', matchs: 6, victoires: 2, points: 6 },
];

const FORM_EQUIPE_VIDE = { nom: '', membres: ['', '', ''], contact: '' };

export default function PageTournois() {
  const { estConnecte, utilisateur } = useAuthStore();
  const [tournois, setTournois] = useState<any[]>(MOCK_TOURNOIS);
  const [classement] = useState(MOCK_EQUIPES);
  const [modalInscription, setModalInscription] = useState<any>(null);
  const [formEquipe, setFormEquipe] = useState<any>(FORM_EQUIPE_VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState('');

  const estAdmin = ['ADMIN', 'FORMATEUR'].includes(utilisateur?.role || '');
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';

  useEffect(() => {
    fetch(API_URL + '/tournois', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length) setTournois(data); })
      .catch(() => {});
  }, []);

  const enCours = tournois.filter(t => t.statut === 'EN_COURS');
  const inscriptions = tournois.filter(t => t.statut === 'INSCRIPTION');

  const inscrireEquipe = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoi(true);
    const membres = formEquipe.membres.filter((m: string) => m.trim());
    try {
      await fetch(`${API_URL}/tournois/${modalInscription.id}/equipes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
        body: JSON.stringify({ nom: formEquipe.nom, membres }),
      });
    } catch {}
    setSucces(`Équipe « ${formEquipe.nom} » inscrite avec succès !`);
    setModalInscription(null);
    setFormEquipe(FORM_EQUIPE_VIDE);
    setEnvoi(false);
    setTimeout(() => setSucces(''), 4000);
  };

  const CarteTournoi = ({ t, featured }: { t: any; featured?: boolean }) => (
    <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Image */}
      <div style={{ height: featured ? 260 : 200, background: t.image ? `url(${t.image}) center/cover` : 'linear-gradient(135deg, #0D1B2A, #1B263B)', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.6) 100%)' }}/>
        <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 6 }}>
          <span style={{ background: t.statut === 'EN_COURS' ? 'var(--red)' : 'var(--blue)', color: 'white', fontSize: 10, padding: '3px 10px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>
            {t.statut === 'EN_COURS' ? '⚔ En cours' : '📋 Inscriptions'}
          </span>
          {t.lieu && <span style={{ background: 'rgba(255,255,255,0.15)', color: 'white', fontSize: 10, padding: '3px 10px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", backdropFilter: 'blur(4px)' }}>📍 {t.lieu}</span>}
        </div>
        <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
          <h3 style={{ fontFamily: 'Georgia,serif', fontSize: featured ? 20 : 16, color: 'white', fontWeight: 700, lineHeight: 1.3, marginBottom: 4 }}>{t.nom}</h3>
          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>📅 {new Date(t.dateDebut).toLocaleDateString('fr-FR')} → {new Date(t.dateFin).toLocaleDateString('fr-FR')}</div>
        </div>
      </div>
      {/* Stats + actions */}
      <div style={{ padding: '16px 18px 18px' }}>
        <div style={{ display: 'flex', gap: 20, marginBottom: 16 }}>
          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 15 }}>🏆 {t._count?.equipes ?? 0}</span> COURS
          </div>
          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 15 }}>{t._count?.equipes ?? 0}</span> équipes
          </div>
          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>
            <span style={{ color: 'var(--ink)', fontWeight: 700, fontSize: 15 }}>●</span> {t._count?.matchs ?? 0} matchs
          </div>
          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>
            📍 {t.lieu}
          </div>
        </div>
        <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', marginBottom: 16 }}>
          📅 Début le · {new Date(t.dateDebut).toLocaleDateString('fr-FR')} &nbsp;·&nbsp; 🏁 {t.maxEquipes} équipes max
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: 'var(--ink)' }}>{t.prixInscription} USD</span>
          <div style={{ display: 'flex', gap: 8 }}>
            {t.statut === 'INSCRIPTION' && (
              <button onClick={() => estConnecte ? setModalInscription(t) : window.location.href = '/auth/inscription'} style={{ padding: '9px 18px', background: 'var(--red)', color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer', borderRadius: 6 }}>
                {estConnecte ? 'S\'inscrire' : 'Participer'}
              </button>
            )}
            <button onClick={() => window.location.href = `/tournois/${t.id}`} style={{ padding: '9px 18px', background: t.statut === 'EN_COURS' ? 'var(--ink)' : 'white', color: t.statut === 'EN_COURS' ? 'var(--page)' : 'var(--ink)', border: t.statut !== 'EN_COURS' ? '1.5px solid var(--line2)' : 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer', borderRadius: 6 }}>
              Voir détails
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>

      {/* ══ HERO ══ */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(20px,5vw,80px)', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 'normal', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 12 }}>
          Les tournois de débat
        </h1>
        <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 'clamp(13px,1.5vw,17px)', color: 'var(--muted)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}>
          Découvrez les équipes, les saisons et les défis du débat haïtien.
        </p>
        {/* Stats rapides */}
        <div style={{ display: 'inline-flex', gap: 40, background: 'white', border: '1px solid var(--line2)', borderRadius: 12, padding: '16px 32px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>{tournois.length}</div>
            <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Tournois</div>
          </div>
          <div style={{ width: 1, background: 'var(--line2)' }}/>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 28, fontWeight: 700, color: 'var(--ink)' }}>{tournois.reduce((s, t) => s + (t._count?.equipes || 0), 0)}</div>
            <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 10, color: 'var(--muted)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Équipes actives</div>
          </div>
        </div>
      </section>

      {/* ══ IMAGE HERO PLEINE LARGEUR ══ */}
      {enCours[0]?.image && (
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 clamp(20px,5vw,80px) 32px' }}>
          <div style={{ height: 300, background: `url(${enCours[0].image}) center/cover`, borderRadius: 12, overflow: 'hidden' }}/>
        </div>
      )}

      {/* ══ TOURNOIS EN COURS ══ */}
      {enCours.length > 0 && (
        <section style={{ padding: '0 clamp(20px,5vw,80px) 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--red)', display: 'inline-block' }}/>
            <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)' }}>Tournois en cours</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {enCours.map(t => <CarteTournoi key={t.id} t={t} featured />)}
          </div>
        </section>
      )}

      {/* ══ INSCRIPTIONS OUVERTES ══ */}
      {inscriptions.length > 0 && (
        <section style={{ padding: '0 clamp(20px,5vw,80px) 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)' }}>📋 Inscriptions ouvertes</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
            {inscriptions.map(t => <CarteTournoi key={t.id} t={t} />)}
          </div>
        </section>
      )}

      {/* ══ CLASSEMENT ══ */}
      <section id="classement" style={{ padding: '0 clamp(20px,5vw,80px) clamp(48px,6vw,80px)', maxWidth: 1200, margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(20px,3vw,32px)', fontWeight: 'normal', letterSpacing: '-0.015em', color: 'var(--ink)', marginBottom: 24 }}>
          Classement — Saison 2026
        </h2>
        <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 12, overflow: 'hidden' }}>
          {/* En-tête tableau */}
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px 80px 80px 80px', gap: 0, padding: '12px 20px', background: 'var(--page2)', borderBottom: '1px solid var(--line2)' }}>
            {['#', 'Équipe', 'Ville', 'Matchs', 'Victoires', 'Points'].map(h => (
              <div key={h} style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 10, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{h}</div>
            ))}
          </div>
          {classement.map((e, i) => (
            <div key={e.rang} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 120px 80px 80px 80px', gap: 0, padding: '14px 20px', borderBottom: i < classement.length - 1 ? '1px solid var(--line2)' : 'none', background: i % 2 === 0 ? 'white' : 'var(--page2)', alignItems: 'center' }}>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 700, color: e.rang <= 3 ? ['#FFD700','#C0C0C0','#CD7F32'][e.rang-1] : 'var(--muted)' }}>
                {e.rang <= 3 ? ['🥇','🥈','🥉'][e.rang-1] : `#${e.rang}`}
              </div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: 'var(--ink)', fontWeight: e.rang === 1 ? 700 : 'normal' }}>{e.equipe}</div>
              <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)' }}>📍 {e.ville}</div>
              <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--ink)', fontWeight: 600 }}>{e.matchs}</div>
              <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: '#059669', fontWeight: 700 }}>{e.victoires}</div>
              <div style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: 'var(--ink)', fontWeight: 700 }}>{e.points}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Succès inscription */}
      {succes && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#059669', color: 'white', padding: '14px 28px', borderRadius: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, fontSize: 14, zIndex: 1000, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          ✅ {succes}
        </div>
      )}

      {/* Modal inscription équipe */}
      {modalInscription && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: 480, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 'normal', marginBottom: 2 }}>Inscrire mon équipe</h2>
                <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)' }}>{modalInscription.nom}</p>
              </div>
              <button onClick={() => setModalInscription(null)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
            </div>
            <form onSubmit={inscrireEquipe} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nom de l'équipe *</label>
                <input type="text" value={formEquipe.nom} onChange={e => setFormEquipe({ ...formEquipe, nom: e.target.value })} placeholder="Ex : Les Aigles du Droit" required style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--line2)', outline: 'none', fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", boxSizing: 'border-box', borderRadius: 6 }}/>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membres (max 3)</label>
                {formEquipe.membres.map((m: string, i: number) => (
                  <input key={i} type="text" value={m} onChange={e => { const ms = [...formEquipe.membres]; ms[i] = e.target.value; setFormEquipe({ ...formEquipe, membres: ms }); }} placeholder={`Membre ${i + 1}`} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--line2)', outline: 'none', fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", boxSizing: 'border-box', borderRadius: 6, marginBottom: i < 2 ? 8 : 0 }}/>
                ))}
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>WhatsApp contact</label>
                <input type="tel" value={formEquipe.contact} onChange={e => setFormEquipe({ ...formEquipe, contact: e.target.value })} placeholder="+509 XXXX XXXX" style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--line2)', outline: 'none', fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", boxSizing: 'border-box', borderRadius: 6 }}/>
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setModalInscription(null)} style={{ flex: 1, padding: '12px', border: '1.5px solid var(--line2)', background: 'white', cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)', borderRadius: 6 }}>Annuler</button>
                <button type="submit" disabled={envoi} style={{ flex: 1, padding: '12px', background: 'var(--red)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13, borderRadius: 6 }}>
                  {envoi ? 'Inscription…' : 'Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 600px) {
          div[style*="repeat(auto-fill, minmax(320px"] { grid-template-columns: 1fr !important; }
          div[style*="48px 1fr 120px"] { grid-template-columns: 32px 1fr 60px 50px !important; }
          div[style*="48px 1fr 120px"] > div:nth-child(4),
          div[style*="48px 1fr 120px"] > div:nth-child(5) { display: none; }
        }
      `}</style>
    </div>
  );
}
