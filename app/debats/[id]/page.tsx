'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const CAT_COLORS: Record<string, string> = {
  Politique: '#7C3AED', Économie: '#D97706', Religion: '#EF4444',
  Philosophie: '#2563EB', Société: '#059669', Culture: '#DB2777',
};

export default function PageDebatDetail() {
  const { id } = useParams() as { id: string };
  const { estConnecte, utilisateur } = useAuthStore();
  const router = useRouter();
  const [debat, setDebat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [nouveau, setNouveau] = useState('');
  const [position, setPosition] = useState<'POUR' | 'CONTRE' | null>(null);
  const [envoi, setEnvoi] = useState(false);
  const [chargement, setChargement] = useState(true);
  const messagesRef = useRef<HTMLDivElement>(null);
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';

  useEffect(() => {
    Promise.all([
      api.get(`/debats/${id}`).then(({ data }) => setDebat(data)).catch(() => {}),
      api.get(`/debats/${id}/messages`).catch(() => ({ data: [] })).then(r => { if (Array.isArray(r?.data)) setMessages(r.data); }),
    ]).finally(() => setChargement(false));
  }, [id]);

  useEffect(() => {
    if (messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const envoyerMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nouveau.trim() || !estConnecte) return;
    setEnvoi(true);
    const optimiste = { id: Date.now().toString(), contenu: nouveau, position, auteur: { prenom: utilisateur?.prenom, nom: utilisateur?.nom }, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, optimiste]);
    setNouveau('');
    try {
      await api.post('/messages', { debatId: id, contenu: nouveau, position });
    } catch {}
    setEnvoi(false);
  };

  const initiales = (p: string, n: string) => (p?.[0] || '') + (n?.[0] || '');

  if (chargement) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 36, height: 36, border: '3px solid var(--line2)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  if (!debat) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <div style={{ fontSize: 48 }}>💬</div>
      <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 'normal' }}>Débat introuvable</h2>
      <Link href="/debats" style={{ color: 'var(--red)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>← Retour aux débats</Link>
    </div>
  );

  const catColor = CAT_COLORS[debat.categorie] || '#64748B';
  const pour = messages.filter(m => m.position === 'POUR').length;
  const contre = messages.filter(m => m.position === 'CONTRE').length;
  const total = pour + contre || 1;

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {/* ── Hero ── */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(27,63,139,0.15) 0%, transparent 50%)', pointerEvents: 'none' }}/>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
            <Link href="/debats" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Débats</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{debat.categorie}</span>
          </div>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <span style={{ background: debat.statut === 'OUVERT' ? 'rgba(5,150,105,0.2)' : 'rgba(107,114,128,0.2)', color: debat.statut === 'OUVERT' ? '#34D399' : '#9CA3AF', fontSize: 11, padding: '3px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, border: `1px solid ${debat.statut === 'OUVERT' ? 'rgba(52,211,153,0.3)' : 'rgba(156,163,175,0.3)'}` }}>
              {debat.statut === 'OUVERT' ? '● EN COURS' : '■ TERMINÉ'}
            </span>
            <span style={{ background: `${catColor}20`, color: catColor, fontSize: 11, padding: '3px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, border: `1px solid ${catColor}30` }}>
              {debat.categorie}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,38px)', fontWeight: 'normal', color: 'white', lineHeight: 1.25, marginBottom: 16, maxWidth: 700 }}>
            {debat.titre}
          </h1>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 'clamp(13px,1.5vw,16px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 600, marginBottom: 24 }}>
            {debat.description}
          </p>
          {/* Barre Pour/Contre */}
          <div style={{ maxWidth: 500 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: '#34D399', fontWeight: 700 }}>POUR — {Math.round(pour / total * 100)}%</span>
              <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: '#F87171', fontWeight: 700 }}>CONTRE — {Math.round(contre / total * 100)}%</span>
            </div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden', display: 'flex' }}>
              <div style={{ height: '100%', width: `${pour / total * 100}%`, background: '#34D399', transition: 'width 0.5s' }}/>
              <div style={{ height: '100%', flex: 1, background: '#F87171' }}/>
            </div>
            <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', marginTop: 6 }}>
              {messages.length} argument{messages.length > 1 ? 's' : ''} · {debat.vues ?? 0} vues
            </div>
          </div>
        </div>
      </div>

      {/* ── Corps ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,4vw,40px) clamp(20px,5vw,80px)', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 28 }}>
        {/* Messages */}
        <div>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 20, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 20 }}>
            Arguments ({messages.length})
          </h2>
          <div ref={messagesRef} style={{ display: 'flex', flexDirection: 'column', gap: 14, maxHeight: 500, overflowY: 'auto', paddingRight: 8 }}>
            {messages.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--muted)' }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>Soyez le premier à argumenter</p>
              </div>
            ) : messages.map(msg => (
              <div key={msg.id} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: msg.position === 'POUR' ? 'rgba(5,150,105,0.15)' : msg.position === 'CONTRE' ? 'rgba(239,68,68,0.15)' : 'var(--page2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: msg.position === 'POUR' ? '#059669' : msg.position === 'CONTRE' ? '#EF4444' : 'var(--muted)', fontFamily: 'Georgia,serif', flexShrink: 0 }}>
                  {initiales(msg.auteur?.prenom, msg.auteur?.nom).toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, background: 'white', border: '1px solid var(--line2)', borderRadius: 12, padding: '12px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>{msg.auteur?.prenom} {msg.auteur?.nom}</span>
                    {msg.position && (
                      <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: msg.position === 'POUR' ? 'rgba(5,150,105,0.1)' : 'rgba(239,68,68,0.1)', color: msg.position === 'POUR' ? '#059669' : '#EF4444', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>
                        {msg.position}
                      </span>
                    )}
                  </div>
                  <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--ink)', lineHeight: 1.6 }}>{msg.contenu}</p>
                  <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>
                    {new Date(msg.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Formulaire */}
          {estConnecte && debat.statut === 'OUVERT' ? (
            <form onSubmit={envoyerMessage} style={{ marginTop: 20 }}>
              {/* Position */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {(['POUR', 'CONTRE'] as const).map(p => (
                  <button key={p} type="button" onClick={() => setPosition(prev => prev === p ? null : p)} style={{ padding: '8px 20px', borderRadius: 100, border: `1.5px solid ${position === p ? (p === 'POUR' ? '#059669' : '#EF4444') : 'var(--line2)'}`, background: position === p ? (p === 'POUR' ? 'rgba(5,150,105,0.1)' : 'rgba(239,68,68,0.1)') : 'white', color: position === p ? (p === 'POUR' ? '#059669' : '#EF4444') : 'var(--muted)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    {p === 'POUR' ? '👍 Pour' : '👎 Contre'}
                  </button>
                ))}
                <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', alignSelf: 'center', marginLeft: 4 }}>— ou neutre</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <textarea value={nouveau} onChange={e => setNouveau(e.target.value)} placeholder="Partagez votre argument…" rows={3} style={{ flex: 1, padding: '12px 14px', border: '1.5px solid var(--line2)', borderRadius: 12, fontSize: 14, outline: 'none', resize: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", color: 'var(--ink)', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = 'var(--ink)'}
                  onBlur={e => e.target.style.borderColor = 'var(--line2)'}/>
                <button type="submit" disabled={envoi || !nouveau.trim()} style={{ padding: '12px 20px', background: 'var(--ink)', color: 'var(--page)', border: 'none', borderRadius: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13, cursor: envoi || !nouveau.trim() ? 'not-allowed' : 'pointer', opacity: !nouveau.trim() ? 0.5 : 1, alignSelf: 'flex-end' }}>
                  Envoyer
                </button>
              </div>
            </form>
          ) : !estConnecte ? (
            <div style={{ marginTop: 20, background: 'var(--page2)', border: '1px solid var(--line2)', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
              <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', marginBottom: 14 }}>Connectez-vous pour participer au débat</p>
              <Link href="/auth/connexion" style={{ display: 'inline-block', padding: '10px 24px', background: 'var(--red)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13, borderRadius: 8 }}>Se connecter</Link>
            </div>
          ) : null}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Infos débat */}
          <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 14, padding: '20px' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 16 }}>Informations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Statut', value: debat.statut === 'OUVERT' ? '🟢 Ouvert' : '⚫ Fermé' },
                { label: 'Catégorie', value: debat.categorie },
                { label: 'Date début', value: new Date(debat.dateDebut).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Arguments', value: `${messages.length}` },
                { label: 'Vues', value: `${debat.vues ?? 0}` },
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                  <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
          {/* CTA */}
          <div style={{ background: 'var(--ink)', borderRadius: 14, padding: '20px', textAlign: 'center' }}>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: 'white', marginBottom: 14, lineHeight: 1.5 }}>Rejoignez la communauté et participez aux grands débats haïtiens</p>
            {estConnecte ? (
              <Link href="/debats" style={{ display: 'block', padding: '10px', background: 'var(--red)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 12, borderRadius: 8 }}>← Tous les débats</Link>
            ) : (
              <Link href="/auth/inscription" style={{ display: 'block', padding: '10px', background: 'var(--red)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 12, borderRadius: 8 }}>S'inscrire gratuitement</Link>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 340px"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
