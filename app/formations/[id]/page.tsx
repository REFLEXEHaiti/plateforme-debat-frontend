'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import ModalPaiement from '@/components/paiement/ModalPaiement';

const NIV: Record<string, { bg: string; text: string }> = {
  DEBUTANT: { bg: '#dcfce7', text: '#166534' },
  INTERMEDIAIRE: { bg: '#fef9c3', text: '#854d0e' },
  AVANCE: { bg: '#fce7f3', text: '#9d174d' },
};

export default function PageFormationDetail() {
  const { id } = useParams() as { id: string };
  const { estConnecte, utilisateur } = useAuthStore();
  const router = useRouter();
  const [formation, setFormation] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [modal, setModal] = useState(false);
  const [inscrit, setInscrit] = useState(false);
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';

  useEffect(() => {
    api.get(`/cours/${id}`).then(({ data }) => { setFormation(data); }).catch(() => {}).finally(() => setChargement(false));
  }, [id]);

  const sInscrire = async () => {
    if (!estConnecte) { router.push('/auth/inscription'); return; }
    if (formation?.prix > 0) { setModal(true); return; }
    try { await api.post(`/cours/${id}/inscrire`, {}); setInscrit(true); } catch {}
  };

  if (chargement) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid var(--line2)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (!formation) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}><div style={{ fontSize: 48 }}>📚</div><h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 'normal' }}>Formation introuvable</h2><Link href="/formations" style={{ color: 'var(--red)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>← Retour</Link></div>;

  const niv = NIV[formation.niveau] || NIV.DEBUTANT;

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {modal && <ModalPaiement montant={formation.prix} description={formation.titre} onFermer={() => setModal(false)} onSucces={() => { setModal(false); setInscrit(true); }} />}

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 30%, rgba(27,63,139,0.15) 0%, transparent 50%)', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <span style={{ background: niv.bg, color: niv.text, fontSize: 11, padding: '3px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>{formation.niveau === 'DEBUTANT' ? 'Débutant' : formation.niveau === 'INTERMEDIAIRE' ? 'Intermédiaire' : 'Avancé'}</span>
              <span style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', fontSize: 11, padding: '3px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>{formation.categorie}</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,36px)', fontWeight: 'normal', color: 'white', lineHeight: 1.25, marginBottom: 14 }}>{formation.titre}</h1>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.7, marginBottom: 20, maxWidth: 560 }}>{formation.description}</p>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[`⏱ ${formation.duree}`, `📦 ${formation.modules || formation._count?.lecons} modules`, `👥 ${formation._count?.inscriptions ?? 0} inscrits`].map(s => (
                <span key={s} style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s}</span>
              ))}
            </div>
          </div>
          {/* Card prix */}
          <div style={{ background: 'white', borderRadius: 16, padding: '24px', minWidth: 220, flexShrink: 0 }}>
            <div style={{ fontFamily: 'Georgia,serif', fontSize: 32, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
              {formation.prix === 0 ? <span style={{ color: '#059669' }}>Gratuit</span> : `${formation.prix} USD`}
            </div>
            {formation.prix > 0 && <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', marginBottom: 16 }}>+{Math.round(formation.prix * 130)} HTG</div>}
            <button onClick={sInscrire} disabled={inscrit} style={{ width: '100%', padding: '13px', background: inscrit ? '#059669' : 'linear-gradient(135deg, #C0321A, #A02818)', color: 'white', border: 'none', borderRadius: 10, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 14, cursor: inscrit ? 'default' : 'pointer', marginBottom: 10, boxShadow: '0 4px 16px rgba(192,50,26,0.3)' }}>
              {inscrit ? '✓ Inscrit' : formation.prix === 0 ? 'Commencer gratuitement' : 'S\'inscrire'}
            </button>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', textAlign: 'center' }}>✓ Accès à vie · ✓ Certificat</p>
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(20px,5vw,80px)', display: 'grid', gridTemplateColumns: '1fr 280px', gap: 32 }}>
        {/* Gauche */}
        <div>
          {/* Ce que vous apprendrez */}
          {formation.resume && (
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '24px', marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 14 }}>Ce que vous apprendrez</h2>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{formation.resume}</p>
            </div>
          )}
          {/* Modules / Leçons */}
          {formation.lecons?.length > 0 && (
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '24px' }}>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 16 }}>
                Programme ({formation.lecons.length} leçons)
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {formation.lecons.map((l: any, i: number) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '13px 0', borderBottom: i < formation.lecons.length - 1 ? '1px solid var(--line2)' : 'none' }}>
                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: inscrit ? 'rgba(5,150,105,0.1)' : 'var(--page2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: inscrit ? '#059669' : 'var(--muted)', flexShrink: 0 }}>
                      {inscrit ? '▶' : `${i + 1}`}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 2 }}>
                        {inscrit ? <Link href={`/formations/${id}/lecons/${l.id || i}`} style={{ color: 'var(--ink)', textDecoration: 'none' }}>{l.titre}</Link> : l.titre}
                      </p>
                      <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>⏱ {l.dureeMin} min</span>
                    </div>
                    {!inscrit && i > 0 && <span style={{ fontSize: 14, color: 'var(--muted)' }}>🔒</span>}
                    {inscrit && <span style={{ fontSize: 12, color: '#059669' }}>▶</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Formateur */}
          {formation.formateur && (
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 14 }}>Formateur</h3>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'linear-gradient(135deg, #C0321A, #8B1A0A)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white', fontFamily: 'Georgia,serif', flexShrink: 0 }}>
                  {(formation.formateur.prenom?.[0] || '') + (formation.formateur.nom?.[0] || '')}
                </div>
                <div>
                  <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, fontWeight: 700, color: 'var(--ink)' }}>{formation.formateur.prenom} {formation.formateur.nom}</p>
                  <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)' }}>Formateur certifié</p>
                </div>
              </div>
            </div>
          )}
          {/* Formats */}
          {formation.formats?.length > 0 && (
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '20px' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 12 }}>Formats inclus</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {formation.formats.map((f: string) => (
                  <span key={f} style={{ background: 'var(--page2)', color: 'var(--muted)', fontSize: 12, padding: '5px 12px', borderRadius: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                    {f === 'PDF' ? '📄 PDF' : f === 'Quiz' ? '✏️ Quiz' : f === 'Vidéo' ? '🎥 Vidéo' : f}
                  </span>
                ))}
              </div>
            </div>
          )}
          {/* Prérequis */}
          {formation.prerequis && (
            <div style={{ background: 'var(--page2)', border: '1px solid var(--line2)', borderRadius: 14, padding: '16px 20px' }}>
              <h3 style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Prérequis</h3>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--ink)', lineHeight: 1.6 }}>{formation.prerequis}</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr auto"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: 1fr 280px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
