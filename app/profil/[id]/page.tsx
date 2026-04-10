'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function PageProfil() {
  const { id } = useParams() as { id: string };
  const { utilisateur, estConnecte } = useAuthStore();
  const router = useRouter();
  const [profil, setProfil] = useState<any>(null);
  const [chargement, setChargement] = useState(true);
  const [succesModif, setSuccesModif] = useState(false);
  const estMoi = utilisateur?.id === id;

  useEffect(() => {
    // Détection du message "profil mis à jour"
    const params = new URLSearchParams(window.location.search);
    if (params.get('updated') === '1') {
      setSuccesModif(true);
      // Nettoyer l'URL
      window.history.replaceState({}, '', `/profil/${id}`);
    }
    chargerProfil();
  }, [id]);

  const chargerProfil = async () => {
    setChargement(true);
    try {
      const { data } = await api.get(`/profils/${id}`);
      setProfil(data);
    } catch {
      // Fallback avec données du store si c'est mon profil
      if (utilisateur?.id === id) {
        setProfil({
          prenom: utilisateur.prenom,
          nom: utilisateur.nom,
          email: utilisateur.email,
          role: utilisateur.role,
          bio: '',
          ville: '',
          avatar: null,
        });
      }
    } finally {
      setChargement(false);
    }
  };

  const initiales = profil
    ? (profil.prenom?.[0] || '') + (profil.nom?.[0] || '')
    : '?';

  if (chargement) {
    return (
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: 'var(--page)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40, height: 40, border: '3px solid var(--line2)',
            borderTopColor: 'var(--red)', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px'
          }} />
          <p style={{ color: 'var(--muted)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>
            Chargement du profil…
          </p>
        </div>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }

  if (!profil) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--page)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 48, marginBottom: 16 }}>👤</p>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, marginBottom: 8 }}>Profil introuvable</h2>
          <Link href="/" style={{ color: 'var(--red)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14 }}>
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--page)', minHeight: '100vh' }}>
      {/* Bannière succès mise à jour */}
      {succesModif && (
        <div style={{
          background: 'linear-gradient(135deg, #1A6B3A, #2A9A55)',
          color: 'white',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 12,
          animation: 'slideDown 0.4s ease',
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <span style={{ fontFamily: "'Helvetica Neue',Arial,sans-serif", fontWeight: 600, fontSize: 15 }}>
            Votre profil a été mis à jour avec succès !
          </span>
          <button
            onClick={() => setSuccesModif(false)}
            style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: 28, height: 28, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: 8, fontSize: 16 }}
          >×</button>
        </div>
      )}

      {/* Hero profil */}
      <div style={{
        background: 'linear-gradient(135deg, #0D1B2A 0%, #1B263B 100%)',
        padding: '60px 24px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(192,50,26,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(27,63,139,0.12) 0%, transparent 50%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          {/* Si c'est la page de confirmation post-modification */}
          {succesModif && (
            <div style={{ textAlign: 'center', marginBottom: 40 }}>
              <h1 style={{
                fontFamily: 'Georgia,serif', fontSize: 'clamp(28px,5vw,42px)',
                color: 'white', marginBottom: 12, fontWeight: 'normal',
              }}>
                Votre profil a été mis à jour !
              </h1>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 16 }}>
                Vos informations ont été enregistrées avec succès.
              </p>
            </div>
          )}

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{
              width: 100, height: 100,
              background: 'linear-gradient(135deg, #C0321A, #8B1A0A)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 36, fontWeight: 700, color: 'white',
              fontFamily: 'Georgia,serif',
              border: '4px solid rgba(255,255,255,0.15)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              flexShrink: 0,
            }}>
              {profil.avatar ? (
                <img src={profil.avatar} alt={profil.prenom} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
              ) : initiales.toUpperCase()}
            </div>

            <div style={{ textAlign: 'center' }}>
              <h2 style={{
                fontFamily: 'Georgia,serif', fontSize: 28, color: 'white',
                fontWeight: 'normal', marginBottom: 6,
              }}>
                {profil.prenom} {profil.nom}
              </h2>
              {profil.email && (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 14, marginBottom: 6 }}>
                  {profil.email}
                </p>
              )}
              {profil.ville && (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 13 }}>
                  📍 {profil.ville}
                </p>
              )}
              {profil.role && (
                <span style={{
                  display: 'inline-block', marginTop: 10,
                  background: 'rgba(192,50,26,0.25)', color: '#F87060',
                  border: '1px solid rgba(192,50,26,0.4)',
                  borderRadius: 100, padding: '4px 16px',
                  fontSize: 12, fontFamily: "'Helvetica Neue',Arial,sans-serif",
                  letterSpacing: '0.05em', textTransform: 'uppercase',
                }}>
                  {profil.role}
                </span>
              )}
            </div>
          </div>

          {/* Boutons d'action */}
          {estMoi && (
            <div style={{
              display: 'flex', gap: 12, justifyContent: 'center',
              flexWrap: 'wrap', marginTop: 32,
            }}>
              <Link
                href="/profil/modifier"
                style={{
                  padding: '12px 28px', borderRadius: 8,
                  background: 'var(--red)', color: 'white',
                  textDecoration: 'none', fontFamily: "'Helvetica Neue',Arial,sans-serif",
                  fontWeight: 700, fontSize: 14, letterSpacing: '0.04em',
                  transition: 'opacity 0.2s',
                }}
              >
                ✏️ Modifier mon profil
              </Link>
              <Link
                href="/debats"
                style={{
                  padding: '12px 28px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: 'white', textDecoration: 'none',
                  fontFamily: "'Helvetica Neue',Arial,sans-serif",
                  fontWeight: 600, fontSize: 14,
                  backdropFilter: 'blur(8px)',
                }}
              >
                💬 Commencer le débat
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Contenu */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px' }}>
        {profil.bio && (
          <div style={{
            background: 'white', border: '1px solid var(--line)',
            borderRadius: 12, padding: '28px 32px', marginBottom: 24,
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          }}>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 18, marginBottom: 12, color: 'var(--ink)' }}>
              À propos
            </h3>
            <p style={{
              fontFamily: "'Helvetica Neue',Arial,sans-serif", fontSize: 15,
              lineHeight: 1.7, color: 'var(--muted)',
            }}>
              {profil.bio}
            </p>
          </div>
        )}

        {/* Liens rapides si c'est mon profil */}
        {estMoi && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 16,
          }}>
            {[
              { href: '/debats', icon: '💬', label: 'Mes débats' },
              { href: '/formations', icon: '📚', label: 'Mes formations' },
              { href: '/tournois', icon: '🏆', label: 'Tournois' },
              { href: '/dashboard', icon: '📊', label: 'Tableau de bord' },
            ].map(({ href, icon, label }) => (
              <Link key={href} href={href} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                background: 'white', border: '1px solid var(--line)',
                borderRadius: 10, padding: '16px 20px', textDecoration: 'none',
                color: 'var(--ink)', fontFamily: "'Helvetica Neue',Arial,sans-serif",
                fontSize: 14, fontWeight: 600, transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--red)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(192,50,26,0.1)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                <span style={{ fontSize: 22 }}>{icon}</span>
                {label}
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @media (max-width: 600px) {
          .profil-actions { flex-direction: column !important; }
        }
      `}</style>
    </div>
  );
}
