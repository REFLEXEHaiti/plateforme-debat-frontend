'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import ModalPaiement from '@/components/paiement/ModalPaiement';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plateforme-debat-backend.onrender.com/api';

const MOCK_FORMATIONS = [
  { id: 'F1', titre: 'Introduction au débat juridique', description: 'Apprenez les fondamentaux du débat structuré et de l\'argumentation juridique en contexte haïtien.', niveau: 'DEBUTANT', categorie: 'Droit', duree: '4h 30min', modules: 8, prix: 0, publie: true, formats: ['PDF', 'Quiz'], prerequis: 'Aucun prérequis', resume: 'Ce cours vous initie aux règles fondamentales du débat structuré.', _count: { lecons: 8, inscriptions: 124 }, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80' },
  { id: 'F2', titre: 'Droit constitutionnel haïtien', description: 'Maîtrisez les grands principes constitutionnels et leur application dans le système judiciaire haïtien.', niveau: 'INTERMEDIAIRE', categorie: 'Droit', duree: '8h 15min', modules: 14, prix: 35, publie: true, formats: ['PDF', 'Quiz', 'Vidéo'], prerequis: 'Avoir complété Introduction au débat', resume: 'Ce cours approfondit votre compréhension du système constitutionnel haïtien.', _count: { lecons: 14, inscriptions: 67 }, image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&q=80' },
  { id: 'F3', titre: 'Rhétorique et persuasion avancée', description: 'Techniques avancées de persuasion, de plaidoirie et de négociation pour les débatteurs expérimentés.', niveau: 'AVANCE', categorie: 'Rhétorique', duree: '12h 00min', modules: 18, prix: 35, publie: true, formats: ['PDF', 'Quiz', 'Vidéo'], prerequis: 'Niveau intermédiaire validé', resume: 'Maîtrisez les techniques avancées de la rhétorique et de la persuasion.', _count: { lecons: 18, inscriptions: 32 }, image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600&q=80' },
  { id: 'F4', titre: 'Prise de parole en public', description: 'Développez votre confiance et votre aisance pour intervenir efficacement dans tout type de débat.', niveau: 'DEBUTANT', categorie: 'Communication', duree: '3h 15min', modules: 6, prix: 0, publie: true, formats: ['PDF', 'Quiz', 'Vidéo'], prerequis: 'Aucun prérequis', resume: 'Apprenez à gérer votre stress et structurer vos interventions.', _count: { lecons: 6, inscriptions: 203 }, image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80' },
  { id: 'F5', titre: 'Argumentation et logique formelle', description: 'Construire des arguments solides, identifier les sophismes et démonter les raisonnements fallacieux.', niveau: 'INTERMEDIAIRE', categorie: 'Philosophie', duree: '6h 45min', modules: 11, prix: 35, publie: true, formats: ['PDF', 'Quiz'], prerequis: 'Bases en débat recommandées', resume: 'Maîtrisez l\'art de l\'argumentation logique et formelle.', _count: { lecons: 11, inscriptions: 89 }, image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=600&q=80' },
  { id: 'F6', titre: 'Histoire politique haïtienne', description: 'Comprendre l\'histoire et les grands débats politiques qui ont façonné Haïti depuis 1804.', niveau: 'DEBUTANT', categorie: 'Histoire', duree: '5h 30min', modules: 10, prix: 0, publie: true, formats: ['PDF'], prerequis: 'Aucun prérequis', resume: 'Un voyage dans l\'histoire politique haïtienne.', _count: { lecons: 10, inscriptions: 178 }, image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80' },
];

const NIVEAU_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  DEBUTANT:     { bg: '#dcfce7', text: '#166534', label: 'Débutant' },
  INTERMEDIAIRE:{ bg: '#fef9c3', text: '#854d0e', label: 'Intermédiaire' },
  AVANCE:       { bg: '#fce7f3', text: '#9d174d', label: 'Avancé' },
};

const BTN_COLORS = ['#059669', '#D97706', '#2563EB', '#7C3AED', '#DC2626', '#0891B2'];

export default function PageFormations() {
  const { estConnecte, utilisateur } = useAuthStore();
  const router = useRouter();
  const [formations, setFormations] = useState<any[]>(MOCK_FORMATIONS);
  const [filtrePrix, setFiltrePrix] = useState<'tous' | 'gratuit' | 'payant'>('tous');
  const [filtreNiveau, setFiltreNiveau] = useState<string>('tous');
  const [modal, setModal] = useState<{ montant: number; description: string } | null>(null);
  const [chargement, setChargement] = useState(true);

  const estAdmin = ['ADMIN', 'FORMATEUR'].includes(utilisateur?.role || '');
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';

  useEffect(() => {
    fetch(API_URL + '/cours', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length) setFormations(data); })
      .catch(() => {})
      .finally(() => setChargement(false));
  }, []);

  const filtrees = formations.filter(f => {
    if (!f.publie && !estAdmin) return false;
    if (filtrePrix === 'gratuit' && f.prix > 0) return false;
    if (filtrePrix === 'payant' && f.prix === 0) return false;
    if (filtreNiveau !== 'tous' && f.niveau !== filtreNiveau) return false;
    return true;
  });

  const handleAction = (f: any) => {
    if (f.prix === 0) { router.push(`/formations/${f.id}`); }
    else if (!estConnecte) { router.push('/auth/inscription'); }
    else { setModal({ montant: f.prix, description: f.titre }); }
  };

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {modal && <ModalPaiement montant={modal.montant} description={modal.description} onFermer={() => setModal(null)} />}

      {/* ══ HERO ══ */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(20px,5vw,80px)', maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,4vw,48px)', fontWeight: 'normal', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 12 }}>
          Développez vos compétences d'orateur
        </h1>
        <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 'clamp(13px,1.5vw,17px)', color: 'var(--muted)', maxWidth: 560, margin: '0 auto 40px', lineHeight: 1.6 }}>
          Plongez au cœur de formations conçues pour maîtriser l'art du débat, à votre rythme et à votre niveau.
        </p>

        {/* ── Filtres ── */}
        <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12, alignItems: 'center', background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '20px 24px' }}>
          {/* Ligne 1 : Prix */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: 'tous',   label: 'Gratuites',       dot: '#059669' },
              { id: 'payant', label: `Payantes (35 USD)`, dot: '#F97316' },
              { id: 'gratuit', label: 'Tous les niveaux', dot: '#EAB308' },
            ].map(f => (
              <button key={f.id} onClick={() => setFiltrePrix(f.id as any)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 100,
                border: filtrePrix === f.id ? 'none' : '1.5px solid var(--line2)',
                background: filtrePrix === f.id ? 'var(--ink)' : 'white',
                color: filtrePrix === f.id ? 'var(--page)' : 'var(--muted)',
                fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>
                {filtrePrix !== f.id && <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.dot, display: 'inline-block' }}/>}
                {f.label}
              </button>
            ))}
          </div>
          {/* Ligne 2 : Niveau */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { id: 'tous',         label: 'Débutant',     dot: '#059669' },
              { id: 'INTERMEDIAIRE',label: 'Intermédiaire', dot: '#F97316' },
              { id: 'AVANCE',       label: 'Avancé',        dot: '#EAB308' },
            ].map(f => (
              <button key={f.id} onClick={() => setFiltreNiveau(f.id)} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '7px 16px', borderRadius: 100,
                border: filtreNiveau === f.id ? 'none' : '1.5px solid var(--line2)',
                background: filtreNiveau === f.id ? 'var(--ink)' : 'white',
                color: filtreNiveau === f.id ? 'var(--page)' : 'var(--muted)',
                fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 500, cursor: 'pointer',
              }}>
                {filtreNiveau !== f.id && <span style={{ width: 8, height: 8, borderRadius: '50%', background: f.dot, display: 'inline-block' }}/>}
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ══ GRILLE FORMATIONS ══ */}
      <section style={{ padding: '0 clamp(20px,5vw,80px) clamp(48px,6vw,80px)', maxWidth: 1200, margin: '0 auto' }}>
        {chargement ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 36, height: 36, border: '3px solid var(--line2)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }}/>
          </div>
        ) : filtrees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>Aucune formation dans cette sélection</p>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13 }}>Modifiez les filtres pour voir plus de formations</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 24 }}>
            {filtrees.map((f, idx) => {
              const niv = NIVEAU_COLORS[f.niveau] || NIVEAU_COLORS.DEBUTANT;
              const btnColor = BTN_COLORS[idx % BTN_COLORS.length];
              const gratuit = f.prix === 0;
              return (
                <div key={f.id} style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
                  {/* Image */}
                  <div style={{ height: 180, background: f.image ? `url(${f.image}) center/cover` : 'linear-gradient(135deg, #1f2937, #374151)', position: 'relative', flexShrink: 0 }}>
                    <div style={{ position: 'absolute', top: 12, left: 12 }}>
                      <span style={{ background: niv.bg, color: niv.text, fontSize: 10, padding: '3px 10px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>
                        {niv.label}
                      </span>
                    </div>
                  </div>
                  {/* Contenu */}
                  <div style={{ padding: '18px 18px 16px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 700, lineHeight: 1.4, color: 'var(--ink)', marginBottom: 8 }}>
                      {f.titre}
                    </h3>
                    <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 12, flex: 1 }}>
                      {f.description}
                    </p>
                    {/* Formats */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                      {(f.formats || []).map((fmt: string) => (
                        <span key={fmt} style={{ background: 'var(--page2)', color: 'var(--muted)', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                          {fmt === 'PDF' ? '📄' : fmt === 'Quiz' ? '✏️' : '🎥'} {fmt}
                        </span>
                      ))}
                    </div>
                    {/* Stats */}
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 16 }}>
                      <span>⏱ {f.duree}</span>
                      <span>📦 {f.modules || f._count?.lecons} modules</span>
                      <span>👥 {f._count?.inscriptions ?? 0}</span>
                    </div>
                    {/* Prix + bouton */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {gratuit ? (
                        <div>
                          <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: '#059669', fontWeight: 700 }}>Gratuit</div>
                          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 10, color: 'var(--muted)' }}>Toujours gratuit</div>
                        </div>
                      ) : (
                        <div>
                          <div style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: 'var(--ink)', fontWeight: 700 }}>{f.prix} USD</div>
                          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 10, color: 'var(--muted)' }}>+{Math.round(f.prix * 130)} HTG</div>
                        </div>
                      )}
                      <button onClick={() => handleAction(f)} style={{ padding: '10px 20px', background: btnColor, color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer', borderRadius: 6, letterSpacing: '0.02em' }}>
                        {gratuit ? 'Commencer' : (estConnecte ? 'S\'inscrire' : 'S\'avancer')}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 600px) {
          div[style*="repeat(auto-fill, minmax(280px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
