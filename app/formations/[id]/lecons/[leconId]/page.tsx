'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function PageLecon() {
  const { id, leconId } = useParams() as { id: string; leconId: string };
  const { estConnecte } = useAuthStore();
  const router = useRouter();
  const [lecon, setLecon] = useState<any>(null);
  const [formation, setFormation] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [termine, setTermine] = useState(false);
  const [envoi, setEnvoi] = useState(false);

  useEffect(() => {
    if (!estConnecte) { router.push('/auth/connexion'); return; }
    Promise.all([
      api.get(`/lecons/${leconId}`).then(({ data }) => setLecon(data)).catch(() => {}),
      api.get(`/cours/${id}`).then(({ data }) => setFormation(data)).catch(() => {}),
    ]).finally(() => setChargement(false));
  }, [id, leconId]);

  const marquerTermine = async () => {
    setEnvoi(true);
    try { await api.post(`/lecons/${leconId}/terminer`, {}); setTermine(true); } catch { setTermine(true); }
    setEnvoi(false);
  };

  if (chargement) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid var(--line2)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;

  return (
    <div style={{ background: 'white', minHeight: '100vh' }}>
      {/* Barre de progression */}
      <div style={{ height: 3, background: 'var(--line2)', position: 'sticky', top: 56, zIndex: 10 }}>
        <div style={{ height: '100%', width: termine ? '100%' : '60%', background: 'var(--red)', transition: 'width 0.5s' }}/>
      </div>

      {/* Breadcrumb */}
      <div style={{ padding: '16px clamp(20px,5vw,80px)', borderBottom: '1px solid var(--line2)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', background: 'white', position: 'sticky', top: 59, zIndex: 9 }}>
        <Link href="/formations" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Formations</Link>
        <span>/</span>
        <Link href={`/formations/${id}`} style={{ color: 'var(--muted)', textDecoration: 'none' }}>{formation?.titre || 'Formation'}</Link>
        <span>/</span>
        <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{lecon?.titre || 'Leçon'}</span>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(20px,5vw,80px)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 40 }}>
          {/* Contenu principal */}
          <div>
            <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,32px)', fontWeight: 'normal', color: 'var(--ink)', lineHeight: 1.3, marginBottom: 8 }}>
              {lecon?.titre || 'Chargement…'}
            </h1>
            {lecon?.dureeMin && (
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)', marginBottom: 28 }}>⏱ {lecon.dureeMin} min de lecture</p>
            )}

            {/* Vidéo si disponible */}
            {lecon?.videoUrl && (
              <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: 12, overflow: 'hidden', marginBottom: 28 }}>
                <iframe src={lecon.videoUrl} title={lecon.titre} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
              </div>
            )}

            {/* Contenu texte */}
            <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 16, color: 'var(--ink)', lineHeight: 1.8 }}>
              {lecon?.contenu ? (
                <div dangerouslySetInnerHTML={{ __html: lecon.contenu }}/>
              ) : (
                <div>
                  <p style={{ marginBottom: 20 }}>
                    Cette leçon vous guide à travers les concepts fondamentaux avec des exemples pratiques adaptés au contexte haïtien.
                  </p>
                  <div style={{ background: 'var(--page2)', border: '1px solid var(--line2)', borderRadius: 10, padding: '20px 24px', marginBottom: 20 }}>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, marginBottom: 10 }}>Points clés</h3>
                    <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {['Comprendre les bases du débat structuré', 'Construire un argument solide', 'Réfuter efficacement', 'Gérer son temps de parole'].map(p => (
                        <li key={p} style={{ color: 'var(--muted)', fontSize: 14 }}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <p>Prenez le temps d'assimiler chaque concept avant de passer à la section suivante. Des exercices pratiques vous aideront à renforcer votre compréhension.</p>
                </div>
              )}
            </div>

            {/* Ressources */}
            {lecon?.ressources?.length > 0 && (
              <div style={{ marginTop: 32, background: 'var(--page2)', border: '1px solid var(--line2)', borderRadius: 12, padding: '20px 24px' }}>
                <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 16, fontWeight: 'normal', marginBottom: 14 }}>📎 Ressources téléchargeables</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {lecon.ressources.map((r: any, i: number) => (
                    <a key={i} href={r.url} download target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', background: 'white', border: '1px solid var(--line2)', borderRadius: 8, textDecoration: 'none', color: 'var(--ink)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600 }}>
                      <span>📄</span> {r.nom || `Ressource ${i + 1}`}
                      <span style={{ marginLeft: 'auto', color: 'var(--red)', fontSize: 11 }}>Télécharger ↓</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Bouton Terminé */}
            <div style={{ marginTop: 36, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
              <button onClick={marquerTermine} disabled={termine || envoi} style={{ padding: '14px 32px', background: termine ? '#059669' : 'var(--ink)', color: 'var(--page)', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 15, cursor: termine ? 'default' : 'pointer', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                {termine ? '✓ Leçon terminée !' : envoi ? '⏳ Enregistrement…' : '✓ Marquer comme terminé'}
              </button>
              <Link href={`/formations/${id}`} style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', textDecoration: 'none' }}>
                ← Retour à la formation
              </Link>
            </div>
          </div>

          {/* Sidebar — plan du cours */}
          <div style={{ position: 'sticky', top: 112, alignSelf: 'start' }}>
            <div style={{ background: 'var(--page2)', border: '1px solid var(--line2)', borderRadius: 14, padding: '18px' }}>
              <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 14 }}>Plan du cours</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {(formation?.lecons || []).map((l: any, i: number) => {
                  const courant = l.id === leconId || i.toString() === leconId;
                  return (
                    <Link key={i} href={`/formations/${id}/lecons/${l.id || i}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: courant ? 'var(--ink)' : 'transparent', textDecoration: 'none', transition: 'background 0.15s' }}
                      onMouseEnter={e => { if (!courant) (e.currentTarget as HTMLElement).style.background = 'rgba(0,0,0,0.05)'; }}
                      onMouseLeave={e => { if (!courant) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: courant ? 'rgba(255,255,255,0.2)' : 'var(--line2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: courant ? 'white' : 'var(--muted)', flexShrink: 0, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>
                        {i + 1}
                      </span>
                      <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: courant ? 'white' : 'var(--ink)', lineHeight: 1.4, fontWeight: courant ? 700 : 'normal' }}>
                        {l.titre}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 260px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
