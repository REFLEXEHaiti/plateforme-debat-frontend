'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function PageTournoiDetail() {
  const { id } = useParams() as { id: string };
  const { estConnecte, utilisateur } = useAuthStore();
  const [tournoi, setTournoi] = useState<any>(null);
  const [equipes, setEquipes] = useState<any[]>([]);
  const [classement, setClassement] = useState<any[]>([]);
  const [chargement, setChargement] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ nom: '', membres: ['', '', ''], contact: '' });
  const [envoi, setEnvoi] = useState(false);
  const [succes, setSucces] = useState('');
  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('access_token') || '' : '';

  useEffect(() => {
    Promise.all([
      api.get(`/tournois/${id}`).then(({ data }) => setTournoi(data)).catch(() => {}),
      fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://plateforme-debat-backend.onrender.com/api'}/tournois/${id}/equipes`, { headers: { Authorization: 'Bearer ' + getToken() } }).then(r => r.ok ? r.json() : []).then(data => { if (Array.isArray(data)) setEquipes(data); }).catch(() => {}),
    ]).finally(() => setChargement(false));
  }, [id]);

  const inscrire = async (e: React.FormEvent) => {
    e.preventDefault(); setEnvoi(true);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://plateforme-debat-backend.onrender.com/api'}/tournois/${id}/equipes`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() }, body: JSON.stringify({ nom: form.nom, membres: form.membres.filter(m => m.trim()) }) });
      setSucces(`Équipe « ${form.nom} » inscrite !`); setModal(false); setForm({ nom: '', membres: ['', '', ''], contact: '' });
      setTimeout(() => setSucces(''), 4000);
    } catch { setSucces('Inscription envoyée !'); setModal(false); setTimeout(() => setSucces(''), 4000); }
    setEnvoi(false);
  };

  if (chargement) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><div style={{ width: 36, height: 36, border: '3px solid var(--line2)', borderTopColor: 'var(--red)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}/><style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style></div>;
  if (!tournoi) return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}><div style={{ fontSize: 48 }}>🏆</div><h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 'normal' }}>Tournoi introuvable</h2><Link href="/tournois" style={{ color: 'var(--red)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>← Retour</Link></div>;

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {succes && <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', background: '#059669', color: 'white', padding: '14px 28px', borderRadius: 8, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, fontSize: 14, zIndex: 1000, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>✅ {succes}</div>}

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A, #1B263B)', padding: 'clamp(32px,5vw,56px) clamp(20px,5vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16, display: 'flex', gap: 8 }}>
            <Link href="/tournois" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none' }}>Tournois</Link>
            <span>/</span>
            <span style={{ color: 'rgba(255,255,255,0.7)' }}>{tournoi.nom}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <span style={{ background: tournoi.statut === 'EN_COURS' ? 'rgba(192,50,26,0.2)' : 'rgba(37,99,235,0.2)', color: tournoi.statut === 'EN_COURS' ? '#F87060' : '#93C5FD', fontSize: 11, padding: '3px 12px', borderRadius: 100, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>
              {tournoi.statut === 'EN_COURS' ? '⚔ EN COURS' : '📋 INSCRIPTIONS'}
            </span>
          </div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,38px)', fontWeight: 'normal', color: 'white', marginBottom: 12 }}>{tournoi.nom}</h1>
          <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 560, marginBottom: 24 }}>{tournoi.description}</p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[`📍 ${tournoi.lieu}`, `👥 ${equipes.length}/${tournoi.maxEquipes} équipes`, `💰 ${tournoi.prixInscription} USD`, `📅 ${new Date(tournoi.dateDebut).toLocaleDateString('fr-FR')}`].map(s => (
              <span key={s} style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>{s}</span>
            ))}
          </div>
          {tournoi.statut === 'INSCRIPTION' && (
            <button onClick={() => estConnecte ? setModal(true) : window.location.href = '/auth/inscription'} style={{ marginTop: 24, padding: '13px 28px', background: '#C0321A', color: 'white', border: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 14, cursor: 'pointer', borderRadius: 10, boxShadow: '0 4px 16px rgba(192,50,26,0.35)' }}>
              {estConnecte ? 'Inscrire mon équipe' : 'Se connecter pour s\'inscrire'}
            </button>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: 'clamp(24px,4vw,48px) clamp(20px,5vw,80px)' }}>
        {/* Équipes */}
        {equipes.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 20 }}>Équipes ({equipes.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}>
              {equipes.map((e: any) => (
                <div key={e.id} style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>{e.nom}</h3>
                    <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 100, background: e.statut === 'CONFIRME' ? 'rgba(5,150,105,0.1)' : 'rgba(217,119,6,0.1)', color: e.statut === 'CONFIRME' ? '#059669' : '#D97706', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700 }}>
                      {e.statut === 'CONFIRME' ? '✓ Confirmée' : '⏳ En attente'}
                    </span>
                  </div>
                  {e.membres?.map((m: string, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'var(--page2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: 'var(--muted)', flexShrink: 0 }}>{m[0]}</div>
                      <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)' }}>{m}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Classement */}
        {classement.length > 0 && (
          <div>
            <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 22, fontWeight: 'normal', color: 'var(--ink)', marginBottom: 20 }}>Classement</h2>
            <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 12, overflow: 'hidden' }}>
              {classement.map((e: any, i: number) => (
                <div key={e.rang} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 80px 80px 80px', padding: '14px 20px', borderBottom: i < classement.length - 1 ? '1px solid var(--line2)' : 'none', background: i % 2 === 0 ? 'white' : 'var(--page2)', alignItems: 'center' }}>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 18 }}>{e.rang <= 3 ? ['🥇','🥈','🥉'][e.rang-1] : `#${e.rang}`}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 14, color: 'var(--ink)', fontWeight: e.rang === 1 ? 700 : 'normal' }}>{e.equipe}</div>
                  <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)', textAlign: 'center' }}>{e.matchs}</div>
                  <div style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: '#059669', fontWeight: 700, textAlign: 'center' }}>{e.victoires}</div>
                  <div style={{ fontFamily: 'Georgia,serif', fontSize: 16, color: 'var(--ink)', fontWeight: 700, textAlign: 'center' }}>{e.points}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {equipes.length === 0 && classement.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0', color: 'var(--muted)' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🏆</div>
            <p style={{ fontFamily: 'Georgia,serif', fontSize: 18, color: 'var(--ink)', marginBottom: 8 }}>Aucune équipe inscrite pour l'instant</p>
            {tournoi.statut === 'INSCRIPTION' && <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>Soyez la première équipe à rejoindre ce tournoi !</p>}
          </div>
        )}
      </div>

      {/* Modal inscription */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: 'white', width: '100%', maxWidth: 460, borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--line2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 18, fontWeight: 'normal' }}>Inscrire mon équipe</h2>
              <button onClick={() => setModal(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer', color: 'var(--muted)' }}>✕</button>
            </div>
            <form onSubmit={inscrire} style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Nom de l'équipe *</label><input type="text" value={form.nom} onChange={e => setForm({ ...form, nom: e.target.value })} placeholder="Ex : Les Aigles du Droit" required style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line2)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", boxSizing: 'border-box' }} onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line2)'}/></div>
              <div><label style={{ display: 'block', fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, color: 'var(--muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membres (max 3)</label>
                {form.membres.map((m, i) => <input key={i} type="text" value={m} onChange={e => { const ms = [...form.membres]; ms[i] = e.target.value; setForm({ ...form, membres: ms }); }} placeholder={`Membre ${i+1}`} style={{ width: '100%', padding: '11px 14px', border: '1.5px solid var(--line2)', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", boxSizing: 'border-box', marginBottom: i < 2 ? 8 : 0 }} onFocus={e => e.target.style.borderColor = 'var(--ink)'} onBlur={e => e.target.style.borderColor = 'var(--line2)'}/>)}
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => setModal(false)} style={{ flex: 1, padding: '12px', border: '1.5px solid var(--line2)', background: 'white', cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, color: 'var(--muted)', borderRadius: 8 }}>Annuler</button>
                <button type="submit" disabled={envoi} style={{ flex: 1, padding: '12px', background: 'var(--red)', color: 'white', border: 'none', cursor: 'pointer', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13, borderRadius: 8 }}>{envoi ? 'Envoi…' : 'Confirmer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
