'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://plateforme-debat-backend.onrender.com/api';

const MOCK_REPLAYS = [
  { id: 'L1', titre: 'Introduction au débat politique haïtien', description: 'Politique : La réforme constitutionnelle en Haïti, ses enjeux et son impact...', categorie: 'Politique', statut: 'TERMINE', vues: 1240, duree: '1h 32min', date: '2026-01-01', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', plateforme: 'youtube', prix: 0 },
  { id: 'L2', titre: 'Droit constitutionnel haïtien', description: 'Politique : la égalité hommes-femmes : Défis et solutions possibles...', categorie: 'Société', statut: 'TERMINE', vues: 940, duree: '46min', date: '2026-04-02', youtubeUrl: 'https://www.youtube.com/watch?v=ysz5S6PUM-U', plateforme: 'youtube', prix: 35 },
  { id: 'L3', titre: 'Quel avenir pour la foi en Haïti ?', description: 'Politique : la liberté religieuse et sa place dans la politique haïtienne...', categorie: 'Religion', statut: 'TERMINE', vues: 703, duree: '38min', date: '2026-03-07', youtubeUrl: 'https://www.youtube.com/watch?v=L_jWHffIx5E', plateforme: 'youtube', prix: 35 },
  { id: 'L4', titre: 'Égalité hommes-femmes : Défis et solutions', description: 'Société : débat sur les inégalités de genre et les réformes nécessaires...', categorie: 'Société', statut: 'TERMINE', vues: 2033, duree: '1h 8min', date: '2026-03-22', youtubeUrl: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ', plateforme: 'youtube', prix: 0 },
  { id: 'L5', titre: 'Réforme de la Constitution haïtienne', description: 'Politique : analyse des enjeux constitutionnels et démocratiques...', categorie: 'Politique', statut: 'TERMINE', vues: 1890, duree: '2h 04min', date: '2026-02-15', youtubeUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0', plateforme: 'youtube', prix: 0 },
  { id: 'L6', titre: "L'économie informelle : moteur ou frein ?", description: "Économie : le rôle du secteur informel dans le développement d'Haïti...", categorie: 'Économie', statut: 'TERMINE', vues: 560, duree: '52min', date: '2026-02-28', youtubeUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk', plateforme: 'youtube', prix: 35 },
];

const CAT_COLORS: Record<string, { bg: string; text: string; icon: string }> = {
  Politique: { bg: 'rgba(124,58,237,0.1)', text: '#7C3AED', icon: '⚖️' },
  Économie:  { bg: 'rgba(217,119,6,0.1)',  text: '#D97706', icon: '💰' },
  Religion:  { bg: 'rgba(239,68,68,0.1)',  text: '#EF4444', icon: '✝️' },
  Société:   { bg: 'rgba(5,150,105,0.1)',  text: '#059669', icon: '🌍' },
  Philosophie:{ bg:'rgba(37,99,235,0.1)', text: '#2563EB', icon: '🧠' },
  Culture:   { bg: 'rgba(219,39,119,0.1)', text: '#DB2777', icon: '🎭' },
};

const getYoutubeThumb = (url: string) => {
  const m = url?.match(/(?:youtube\.com\/(?:watch\?v=|live\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
};

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  const m = url.match(/(?:youtube\.com\/(?:watch\?v=|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (m) return `https://www.youtube.com/embed/${m[1]}?rel=0&autoplay=1`;
  return url;
};

const FORM_VIDE = { titre: '', description: '', categorie: 'Politique', youtubeUrl: '', statut: 'TERMINE', plateforme: 'youtube' };
const CATS_FILTRE = ['Tous', 'Politique', 'Économie', 'Religion', 'Société', 'Philosophie', 'Culture'];

export default function PageLives() {
  const { utilisateur } = useAuthStore();
  const [lives, setLives] = useState<any[]>([]);
  const [replay, setReplay] = useState<any>(null);
  const [filtre, setFiltre] = useState('Tous');
  const [modalAjout, setModalAjout] = useState(false);
  const [form, setForm] = useState<any>(FORM_VIDE);
  const [envoi, setEnvoi] = useState(false);
  const [erreurUrl, setErreurUrl] = useState('');

  const estAdmin = ['ADMIN', 'FORMATEUR'].includes(utilisateur?.role || '');
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';

  useEffect(() => {
    fetch(API_URL + '/lives', { headers: { Authorization: 'Bearer ' + getToken() } })
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (Array.isArray(data) && data.length) setLives(data); else setLives(MOCK_REPLAYS); })
      .catch(() => setLives(MOCK_REPLAYS));
  }, []);

  const livesEnDirect = lives.filter(l => l.statut === 'EN_DIRECT');
  const replays = lives.filter(l => l.statut === 'TERMINE' || l.statut === 'PROGRAMME');
  const replaysFiltres = replays.filter(l => filtre === 'Tous' || l.categorie === filtre);

  const validerUrl = (url: string) => {
    if (!url) { setErreurUrl('URL requise'); return false; }
    const ok = /youtube|youtu\.be|facebook|dailymotion/.test(url);
    if (!ok) { setErreurUrl('Format non reconnu (YouTube, Facebook, Dailymotion)'); return false; }
    setErreurUrl(''); return true;
  };

  const ajouterLive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validerUrl(form.youtubeUrl)) return;
    setEnvoi(true);
    try {
      const res = await fetch(API_URL + '/lives', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() }, body: JSON.stringify(form) });
      const data = await res.json();
      setLives(prev => [data, ...prev]);
    } catch {
      setLives(prev => [{ id: Date.now().toString(), ...form, vues: 0, duree: '--', date: new Date().toISOString() }, ...prev]);
    }
    setModalAjout(false); setForm(FORM_VIDE); setEnvoi(false);
  };

  const supprimerLive = async (id: string) => {
    if (!confirm('Supprimer ce live ?')) return;
    try { await fetch(API_URL + '/lives/' + id, { method: 'DELETE', headers: { Authorization: 'Bearer ' + getToken() } }); } catch {}
    setLives(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>

      {/* ══ HERO ══ */}
      <section style={{ padding: 'clamp(32px,5vw,64px) clamp(20px,5vw,80px)', maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '280px 1fr', gap: 48, alignItems: 'center' }}>
        {/* Illustration */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg viewBox="0 0 280 220" style={{ width: '100%', maxWidth: 280 }}>
            {/* Fond blob orange */}
            <ellipse cx="140" cy="130" rx="120" ry="80" fill="#FED7AA" opacity="0.6"/>
            <ellipse cx="80" cy="160" rx="60" ry="40" fill="#FDE68A" opacity="0.5"/>
            {/* Plante gauche */}
            <ellipse cx="30" cy="180" rx="18" ry="25" fill="#6EE7B7" opacity="0.8"/>
            <ellipse cx="50" cy="170" rx="14" ry="20" fill="#34D399" opacity="0.7"/>
            <rect x="38" y="185" width="6" height="30" fill="#6B7280"/>
            {/* Podium */}
            <rect x="80" y="140" width="120" height="70" rx="6" fill="#92400E" opacity="0.8"/>
            <rect x="90" y="130" width="100" height="20" rx="4" fill="#B45309"/>
            {/* Personne */}
            <ellipse cx="140" cy="115" rx="18" ry="20" fill="#FBBF24"/>
            <ellipse cx="140" cy="100" rx="14" ry="16" fill="#F59E0B"/>
            <rect x="122" y="130" width="36" height="50" rx="8" fill="#3B82F6"/>
            {/* Bras gauche */}
            <ellipse cx="108" cy="148" rx="8" ry="20" fill="#FBBF24" transform="rotate(-20 108 148)"/>
            {/* Micro */}
            <circle cx="118" cy="142" r="6" fill="#1F2937"/>
            <rect x="121" y="142" width="12" height="3" fill="#1F2937"/>
            {/* Téléphone fond */}
            <rect x="160" y="50" width="75" height="130" rx="12" fill="#1E3A5F" opacity="0.9"/>
            <rect x="165" y="60" width="65" height="110" rx="8" fill="#EFF6FF"/>
            {/* Écran téléphone — mini débat */}
            <rect x="168" y="65" width="59" height="40" rx="4" fill="#DBEAFE"/>
            <circle cx="185" cy="85" r="8" fill="#3B82F6"/>
            <rect x="197" y="80" width="25" height="4" rx="2" fill="#93C5FD"/>
            <rect x="197" y="87" width="18" height="3" rx="2" fill="#BFDBFE"/>
            {/* Badge FIN */}
            <rect x="150" y="52" width="36" height="20" rx="4" fill="#1D4ED8"/>
            <text x="168" y="66" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" fontFamily="Arial">FIN</text>
            {/* Bulle chat orange */}
            <rect x="195" y="38" width="40" height="24" rx="8" fill="#F97316"/>
            <polygon points="200,62 208,62 204,68" fill="#F97316"/>
            <circle cx="208" cy="50" r="4" fill="white"/>
            <circle cx="215" cy="50" r="4" fill="white"/>
            <circle cx="222" cy="50" r="4" fill="white"/>
            {/* Étoiles */}
            <text x="155" y="45" fill="#FCD34D" fontSize="14">✦</text>
            <text x="235" y="80" fill="#FCD34D" fontSize="10">✦</text>
          </svg>
        </div>

        {/* Texte hero */}
        <div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 'normal', letterSpacing: '-0.02em', color: 'var(--ink)', marginBottom: 16 }}>
            Les débats en direct
          </h1>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 'clamp(13px,1.5vw,17px)', color: 'var(--muted)', lineHeight: 1.6, marginBottom: 28, maxWidth: 480 }}>
            Participez aux débats en direct ou regardez les replays passés.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="#replays" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'var(--ink)', color: 'var(--page)', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.04em' }}>
              ▶ Regarder les replays ci-dessous
            </a>
            {estAdmin && (
              <button onClick={() => setModalAjout(true)} style={{ padding: '12px 24px', background: 'var(--red)', color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer', letterSpacing: '0.04em' }}>
                + Ajouter un live
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ══ LIVE EN COURS ══ */}
      {livesEnDirect.length > 0 && (
        <section style={{ padding: '0 clamp(20px,5vw,80px) 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--red)', display: 'inline-block', animation: 'pulse 1.5s infinite' }}/>
            <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--red)' }}>EN DIRECT MAINTENANT</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {livesEnDirect.map(live => (
              <div key={live.id} style={{ background: 'var(--ink)', borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
                  <iframe src={getEmbedUrl(live.youtubeUrl || live.replayUrl || '')} title={live.titre} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen/>
                </div>
                <div style={{ padding: '16px 20px' }}>
                  <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, color: 'white', fontWeight: 'normal', marginBottom: 6 }}>{live.titre}</h3>
                  <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{live.categorie}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══ MESSAGE AUCUN LIVE ══ */}
      {livesEnDirect.length === 0 && (
        <section style={{ padding: '0 clamp(20px,5vw,80px) 48px', maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ background: 'var(--page2)', border: '1px solid var(--line2)', borderRadius: 12, padding: '32px', display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 36, opacity: 0.4 }}>📡</div>
            <div>
              <p style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: 'var(--ink)', marginBottom: 4 }}>Pas de live pour l'instant</p>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)' }}>Rejoignez-nous bientôt pour un nouveau débat. En attendant, regardez les replays ci-dessous.</p>
            </div>
          </div>
        </section>
      )}

      {/* ══ REPLAYS ══ */}
      <section id="replays" style={{ padding: '0 clamp(20px,5vw,80px) clamp(48px,6vw,80px)', maxWidth: 1200, margin: '0 auto' }}>
        {/* En-tête section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 16, paddingBottom: 16, borderBottom: '1px solid var(--line2)' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink)' }}>REPLAYS</span>
            <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)' }}>— {replaysFiltres.length} VIDÉO{replaysFiltres.length > 1 ? 'S' : ''}</span>
          </div>
          {/* Filtres catégories */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATS_FILTRE.map(cat => (
              <button key={cat} onClick={() => setFiltre(cat)} style={{ padding: '5px 14px', borderRadius: 100, fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 500, border: filtre === cat ? 'none' : '1.5px solid var(--line2)', background: filtre === cat ? 'var(--ink)' : 'white', color: filtre === cat ? 'var(--page)' : 'var(--muted)', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grille replays */}
        {replaysFiltres.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
            {replaysFiltres.map(live => {
              const thumb = getYoutubeThumb(live.youtubeUrl || live.replayUrl || '');
              const cat = CAT_COLORS[live.categorie] || { bg: 'rgba(107,114,128,0.1)', text: '#6b7280', icon: '💬' };
              return (
                <div key={live.id} style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'box-shadow 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                  onClick={() => setReplay(live)}>
                  {/* Vignette */}
                  <div style={{ position: 'relative', paddingTop: '56.25%', background: thumb ? `url(${thumb}) center/cover` : 'linear-gradient(135deg, #1f2937, #374151)', overflow: 'hidden' }}>
                    {/* Overlay play */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
                      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(239,68,68,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: 'white', fontSize: 16, marginLeft: 3 }}>▶</span>
                      </div>
                    </div>
                    {/* Badges catégorie */}
                    <div style={{ position: 'absolute', top: 10, left: 10, display: 'flex', gap: 6 }}>
                      <span style={{ background: cat.bg, color: cat.text, fontSize: 10, padding: '3px 8px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, backdropFilter: 'blur(4px)' }}>
                        {cat.icon} {live.categorie}
                      </span>
                      {live.titre2 && (
                        <span style={{ background: 'rgba(255,255,255,0.85)', color: 'var(--ink)', fontSize: 10, padding: '3px 8px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>{live.titre2}</span>
                      )}
                    </div>
                    {/* Durée */}
                    <div style={{ position: 'absolute', bottom: 8, right: 10, background: 'rgba(0,0,0,0.75)', color: 'white', fontSize: 11, padding: '2px 8px', borderRadius: 4, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600 }}>
                      {live.duree || '--'}
                    </div>
                  </div>

                  {/* Infos */}
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                      <span style={{ background: cat.bg, color: cat.text, fontSize: 10, padding: '2px 8px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600 }}>{cat.icon} {live.categorie}</span>
                      <span style={{ background: 'var(--page2)', color: 'var(--muted)', fontSize: 10, padding: '2px 8px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>Débat</span>
                    </div>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, lineHeight: 1.4, color: 'var(--ink)', marginBottom: 6 }}>{live.titre}</h3>
                    <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 }}>
                      {live.description || live.categorie + ' : ' + live.titre}
                    </p>
                    <div style={{ display: 'flex', gap: 16, fontSize: 11, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 14 }}>
                      <span>👁 {(live.vues || 0).toLocaleString()} vues</span>
                      <span>📅 {live.date ? new Date(live.date).toLocaleDateString('fr-FR') : '--'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {live.prix > 0 ? (
                        <span style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: 'var(--ink)', fontWeight: 700 }}>{live.prix} USD</span>
                      ) : (
                        <div>
                          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: '#059669', fontWeight: 700 }}>Gratuits</div>
                          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 10, color: 'var(--muted)' }}>VOIR LES REPLAYS</div>
                        </div>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); setReplay(live); }} style={{ padding: '8px 16px', background: live.prix > 0 ? '#EAB308' : '#059669', color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 11, cursor: 'pointer', borderRadius: 6, letterSpacing: '0.04em' }}>
                        {live.prix > 0 ? 'SAC MÈRNES' : 'VOIR TOUS LES'}
                      </button>
                    </div>
                    {estAdmin && (
                      <button onClick={e => { e.stopPropagation(); supprimerLive(live.id); }} style={{ marginTop: 8, width: '100%', padding: '6px', border: '1px solid rgba(220,38,38,0.3)', background: 'rgba(220,38,38,0.05)', color: '#dc2626', fontSize: 11, cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                        Supprimer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🎥</div>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>Aucun replay dans cette catégorie</p>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13 }}>Choisissez une autre catégorie</p>
          </div>
        )}

        {replaysFiltres.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={() => setFiltre('Tous')} style={{ padding: '13px 36px', border: '2px solid var(--ink)', background: 'white', color: 'var(--ink)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 12, cursor: 'pointer', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Voir tous les replays
            </button>
          </div>
        )}
      </section>

      {/* ══ MODAL LECTEUR VIDÉO ══ */}
      {replay && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }} onClick={() => setReplay(null)}>
          <div style={{ width: '100%', maxWidth: 900 }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{replay.categorie} · {replay.duree}</span>
                <p style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: 'white', marginTop: 2 }}>{replay.titre}</p>
              </div>
              <button onClick={() => setReplay(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>
            <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000', borderRadius: 12, overflow: 'hidden' }}>
              <iframe
                src={getEmbedUrl(replay.youtubeUrl || replay.replayUrl || '')}
                title={replay.titre}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ══ MODAL AJOUT LIVE (Admin) ══ */}
      {modalAjout && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 'normal' }}>
                {form.statut === 'EN_DIRECT' ? '🔴 Démarrer un live' : form.statut === 'TERMINE' ? '📼 Ajouter un replay' : '📅 Programmer un live'}
              </h2>
              <button onClick={() => setModalAjout(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
            </div>
            <form onSubmit={ajouterLive} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Type */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
                  {[{ val: 'EN_DIRECT', label: '🔴 En direct' }, { val: 'TERMINE', label: '📼 Replay' }, { val: 'PROGRAMME', label: '📅 Programmé' }].map(s => (
                    <button key={s.val} type="button" onClick={() => setForm((f: any) => ({ ...f, statut: s.val }))} style={{ padding: '10px 8px', border: `2px solid ${form.statut === s.val ? 'var(--ink)' : 'var(--line2)'}`, background: form.statut === s.val ? 'var(--ink)' : 'white', color: form.statut === s.val ? 'var(--page)' : 'var(--muted)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* URL */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>URL YouTube / Live *</label>
                <input type="text" value={form.youtubeUrl} onChange={e => { setForm({ ...form, youtubeUrl: e.target.value }); setErreurUrl(''); }} placeholder="https://youtube.com/watch?v=XXXX" style={{ width: '100%', padding: '10px 12px', border: `1.5px solid ${erreurUrl ? '#ef4444' : 'var(--line2)'}`, outline: 'none', fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", boxSizing: 'border-box' }}/>
                {erreurUrl && <p style={{ color: '#ef4444', fontSize: 11, marginTop: 4, fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>⚠ {erreurUrl}</p>}
              </div>
              {/* Titre */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Titre *</label>
                <input type="text" value={form.titre} onChange={e => setForm({ ...form, titre: e.target.value })} placeholder="Titre du débat" required style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--line2)', outline: 'none', fontSize: 14, fontFamily: "'Helvetica Neue',Arial,sans-serif", boxSizing: 'border-box' }}/>
              </div>
              {/* Catégorie */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--muted)', marginBottom: 6, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catégorie</label>
                <select value={form.categorie} onChange={e => setForm({ ...form, categorie: e.target.value })} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid var(--line2)', outline: 'none', fontSize: 14, background: 'white', fontFamily: "'Helvetica Neue',Arial,sans-serif" }}>
                  {Object.keys(CAT_COLORS).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
                <button type="button" onClick={() => setModalAjout(false)} style={{ flex: 1, padding: '11px', border: '1.5px solid var(--line2)', background: 'white', cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)' }}>Annuler</button>
                <button type="submit" disabled={envoi} style={{ flex: 1, padding: '11px', background: 'var(--ink)', color: 'var(--page)', border: 'none', cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13 }}>
                  {envoi ? 'Publication…' : 'Publier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @media (max-width: 768px) {
          section:first-of-type { grid-template-columns: 1fr !important; }
          section:first-of-type > div:first-child { display: none !important; }
        }
        @media (max-width: 600px) {
          div[style*="repeat(auto-fill, minmax(300px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
