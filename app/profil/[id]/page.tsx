'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

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
        if (utilisateur?.id === id) {
          setProfil({ prenom: utilisateur.prenom, nom: utilisateur.nom, email: utilisateur.email, role: utilisateur.role, bio: '', ville: '' });
        }
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

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {/* Bannière succès */}
      {succes && (
        <div style={{ background: 'linear-gradient(135deg, #059669, #047857)', color: 'white', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, animation: 'slideDown 0.4s ease' }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, fontSize: 15 }}>Votre profil a été mis à jour avec succès !</span>
          <button onClick={() => setSucces(false)} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', fontSize: 16, marginLeft: 8 }}>×</button>
        </div>
      )}

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)', padding: 'clamp(48px,6vw,80px) clamp(20px,4vw,48px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(192,50,26,0.08) 0%, transparent 50%)', pointerEvents: 'none' }}/>
        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Avatar */}
          <div style={{ width: 96, height: 96, background: 'linear-gradient(135deg, #C0321A, #8B1A0A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 700, color: 'white', fontFamily: 'Georgia,serif', margin: '0 auto 16px', border: '4px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
            {profil?.photoUrl ? <img src={profil.photoUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}/> : initiales.toUpperCase()}
          </div>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(22px,4vw,32px)', color: 'white', fontWeight: 'normal', marginBottom: 6 }}>
            {profil?.prenom} {profil?.nom}
          </h1>
          {profil?.email && <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, marginBottom: 6 }}>{profil.email}</p>}
          {profil?.ville && <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13 }}>📍 {profil.ville}</p>}
          {profil?.role && (
            <span style={{ display: 'inline-block', marginTop: 10, background: 'rgba(192,50,26,0.25)', color: '#F87060', border: '1px solid rgba(192,50,26,0.4)', borderRadius: 100, padding: '4px 16px', fontSize: 11, fontFamily: "'Helvetica Neue',Arial,sans-serif", letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              {profil.role}
            </span>
          )}
          {/* Boutons action */}
          {estMoi && (
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginTop: 28 }}>
              <Link href="/profil/modifier" style={{ padding: '12px 28px', background: 'var(--red)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 700, fontSize: 13, borderRadius: 8, letterSpacing: '0.04em' }}>
                ✏️ Modifier mon profil
              </Link>
              <Link href="/debats" style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, fontSize: 13, borderRadius: 8 }}>
                💬 Commencer le débat
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Contenu profil */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: 'clamp(28px,4vw,48px) clamp(20px,4vw,40px)' }}>
        {profil?.bio && (
          <div style={{ background: 'white', border: '1px solid var(--line2)', borderRadius: 12, padding: '24px 28px', marginBottom: 20, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 17, marginBottom: 10, color: 'var(--ink)' }}>À propos</h3>
            <p style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, color: 'var(--muted)', lineHeight: 1.7 }}>{profil.bio}</p>
          </div>
        )}
        {/* Liens rapides si mon profil */}
        {estMoi && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14 }}>
            {[{ href: '/debats', icon: '💬', label: 'Mes débats' }, { href: '/formations', icon: '📚', label: 'Mes formations' }, { href: '/tournois', icon: '🏆', label: 'Tournois' }, { href: '/dashboard', icon: '📊', label: 'Tableau de bord' }].map(l => (
              <Link key={l.href} href={l.href} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'white', border: '1px solid var(--line2)', borderRadius: 10, padding: '14px 16px', textDecoration: 'none', color: 'var(--ink)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13, fontWeight: 600, transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--red)')}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--line2)')}>
                <span style={{ fontSize: 20 }}>{l.icon}</span> {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown { from{transform:translateY(-100%);opacity:0} to{transform:translateY(0);opacity:1} }
      `}</style>
    </div>
  );
}
