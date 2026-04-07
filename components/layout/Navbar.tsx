'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import ClochNotifications from '@/components/notifications/ClochNotifications';
import SelecteurLangue from '@/components/layout/SelecteurLangue';

const ROLE_COULEUR: Record<string, string> = {
  ADMIN: '#7B61FF',
  FORMATEUR: '#00D4FF',
  APPRENANT: '#3EB489',
  SPECTATEUR: '#FF9F68',
};
const ROLE_LABEL: Record<string, string> = {
  ADMIN: 'Admin',
  FORMATEUR: 'Formateur',
  APPRENANT: 'Apprenant',
  SPECTATEUR: 'Spectateur',
};

export default function Navbar() {
  const { estConnecte, utilisateur, _hasHydrated } = useAuthStore();
  const { seDeconnecter } = useAuth();
  const { t } = useTranslation();
  const pathname = usePathname();
  const [menuOuvert, setMenuOuvert] = useState(false);
  const [profilOuvert, setProfilOuvert] = useState(false);
  const profilRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMenuOuvert(false); setProfilOuvert(false); }, [pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profilRef.current && !profilRef.current.contains(e.target as Node))
        setProfilOuvert(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Fermer menu si clic dehors sur mobile
  useEffect(() => {
    if (!menuOuvert) return;
    const handler = () => setMenuOuvert(false);
    const timer = setTimeout(() => document.addEventListener('click', handler), 10);
    return () => { clearTimeout(timer); document.removeEventListener('click', handler); };
  }, [menuOuvert]);

  const liensNav = [
    { label: 'Débats',     href: '/debats' },
    { label: 'Formations', href: '/formations' },
    { label: 'Lives',      href: '/lives' },
    { label: 'Tournois',   href: '/tournois' },
    { label: 'Galerie',    href: '/galerie' },
    { label: 'Contact',    href: '/contact' },
  ];

  const initiales = utilisateur
    ? (utilisateur.prenom?.[0] || '') + (utilisateur.nom?.[0] || '')
    : '?';

  const couleurRole = ROLE_COULEUR[utilisateur?.role || 'APPRENANT'];

  return (
    <>
      <style>{`
        .nav-link { transition: color 0.2s, background 0.2s; white-space: nowrap; }
        .nav-link:hover { color: #fff !important; background: rgba(255,255,255,0.08) !important; }
        .nav-link.active { color: #00D4FF !important; }

        /* Desktop */
        .desktop-nav { display: flex; }
        .hamburger   { display: none; }
        .mobile-menu { display: none; }

        /* Barre profil (desktop seulement) */
        .profil-bar  { display: flex; }

        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: flex !important; }
          .profil-bar  { display: none !important; }
          .mobile-menu.open { display: flex !important; }
        }
      `}</style>

      {/* ─── NAVBAR PRINCIPALE ─── */}
      <nav style={{
        background: 'rgba(10,15,30,0.97)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        position: 'sticky', top: 0, zIndex: 200, width: '100%',
      }}>
        <div style={{
          maxWidth: '1200px', margin: '0 auto',
          padding: '0 16px', height: '60px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '12px',
        }}>

          {/* Logo */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <div style={{
              background: 'linear-gradient(135deg,#00D4FF,#7B61FF)',
              borderRadius: '10px', width: '34px', height: '34px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '16px', fontWeight: 800, color: 'white',
            }}>D</div>
            <span style={{ color: 'white', fontWeight: 700, fontSize: '17px' }}>Débat HT</span>
          </Link>

          {/* Liens desktop — centrés */}
          <div className="desktop-nav" style={{ alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
            {liensNav.map(({ label, href }) => (
              <Link key={href} href={href}
                className={`nav-link${pathname === href ? ' active' : ''}`}
                style={{
                  color: pathname === href ? '#00D4FF' : 'rgba(255,255,255,0.65)',
                  textDecoration: 'none', padding: '6px 11px',
                  borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                }}>
                {label}
              </Link>
            ))}
          </div>

          {/* Droite desktop — SANS nom ni statut */}
          <div className="desktop-nav" style={{ alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <SelecteurLangue />

            {!_hasHydrated ? null : estConnecte ? (
              <>
                {utilisateur?.role === 'ADMIN' && (
                  <Link href="/admin" style={{
                    background: 'rgba(123,97,255,0.18)', border: '1px solid rgba(123,97,255,0.35)',
                    color: '#7B61FF', padding: '5px 12px', borderRadius: '8px',
                    textDecoration: 'none', fontSize: '13px', fontWeight: 600,
                  }}>⚙️ Admin</Link>
                )}
                <ClochNotifications />

                {/* Avatar seul — dropdown profil */}
                <div ref={profilRef} style={{ position: 'relative' }}>
                  <button
                    onClick={() => setProfilOuvert(o => !o)}
                    title={`${utilisateur?.prenom} ${utilisateur?.nom}`}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: `linear-gradient(135deg,${couleurRole},#0A2540)`,
                      border: `2px solid ${couleurRole}60`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '12px', fontWeight: 700, color: 'white',
                      cursor: 'pointer', flexShrink: 0,
                    }}
                  >
                    {initiales}
                  </button>

                  {profilOuvert && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      background: '#101828', border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '16px', padding: '8px', minWidth: '210px',
                      boxShadow: '0 16px 48px rgba(0,0,0,0.6)', zIndex: 300,
                    }}>
                      <div style={{ padding: '10px 12px 12px', borderBottom: '1px solid rgba(255,255,255,0.07)', marginBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{
                            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                            background: `linear-gradient(135deg,${couleurRole},#0A2540)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '14px', fontWeight: 700, color: 'white',
                          }}>{initiales}</div>
                          <div>
                            <div style={{ fontWeight: 700, color: 'white', fontSize: '14px' }}>
                              {utilisateur?.prenom} {utilisateur?.nom}
                            </div>
                            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '1px' }}>
                              {utilisateur?.email}
                            </div>
                            <div style={{
                              display: 'inline-block', marginTop: '5px',
                              background: couleurRole + '20', border: '1px solid ' + couleurRole + '40',
                              color: couleurRole, padding: '1px 8px', borderRadius: '6px',
                              fontSize: '10px', fontWeight: 700,
                            }}>
                              {ROLE_LABEL[utilisateur?.role || ''] || utilisateur?.role}
                            </div>
                          </div>
                        </div>
                      </div>

                      {[
                        { href: '/dashboard',      label: '📊 Mon tableau de bord' },
                        { href: '/profil/modifier', label: '✏️ Modifier mon profil' },
                        { href: '/premium',         label: '⭐ Plan Premium' },
                      ].map(({ href, label }) => (
                        <Link key={href} href={href}
                          style={{
                            display: 'block', padding: '9px 12px', borderRadius: '8px',
                            color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
                            fontSize: '13px', fontWeight: 500, transition: 'background 0.15s',
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          {label}
                        </Link>
                      ))}

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: '6px', paddingTop: '6px' }}>
                        <button
                          onClick={() => { setProfilOuvert(false); seDeconnecter(); }}
                          style={{
                            display: 'block', width: '100%', padding: '9px 12px',
                            borderRadius: '8px', background: 'rgba(255,59,48,0.1)',
                            border: 'none', color: '#FF3B30', cursor: 'pointer',
                            fontSize: '13px', fontWeight: 600, textAlign: 'left',
                          }}
                        >
                          🚪 Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/premium" style={{
                  background: 'rgba(255,159,104,0.12)', border: '1px solid rgba(255,159,104,0.3)',
                  color: '#FF9F68', padding: '6px 12px', borderRadius: '8px',
                  textDecoration: 'none', fontWeight: 600, fontSize: '13px',
                }}>Premium</Link>
                <Link href="/auth/connexion" style={{
                  color: 'rgba(255,255,255,0.7)', textDecoration: 'none',
                  padding: '6px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
                }}>Connexion</Link>
                <Link href="/auth/inscription" style={{
                  background: 'linear-gradient(135deg,#00D4FF,#7B61FF)', color: 'white',
                  padding: '7px 18px', borderRadius: '10px', textDecoration: 'none',
                  fontWeight: 600, fontSize: '14px',
                }}>S'inscrire</Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="hamburger"
            onClick={e => { e.stopPropagation(); setMenuOuvert(o => !o); }}
            aria-label="Menu"
            style={{
              background: 'none', border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '8px', padding: '8px', cursor: 'pointer',
              flexDirection: 'column', gap: '5px', flexShrink: 0,
            }}
          >
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                display: 'block', width: '20px', height: '2px',
                background: 'white', borderRadius: '2px', transition: 'all 0.25s',
                transform: menuOuvert
                  ? i === 0 ? 'translateY(7px) rotate(45deg)'
                  : i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'scaleX(0)'
                  : 'none',
                opacity: menuOuvert && i === 1 ? 0 : 1,
              }} />
            ))}
          </button>
        </div>

        {/* ─── BARRE PROFIL — desktop seulement, sous la navbar ─── */}
        {_hasHydrated && estConnecte && (
          <div className="profil-bar" style={{
            background: 'rgba(10,15,30,0.95)',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '5px 20px',
            justifyContent: 'flex-end',
            alignItems: 'center',
            gap: '10px',
            maxWidth: '100%',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Avatar mini */}
              <div style={{
                width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,${couleurRole},#0A2540)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '9px', fontWeight: 700, color: 'white',
              }}>{initiales}</div>
              {/* Nom */}
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                {utilisateur?.prenom} {utilisateur?.nom}
              </span>
              {/* Badge rôle */}
              <span style={{
                fontSize: '10px', padding: '1px 7px', borderRadius: '5px',
                background: couleurRole + '20', border: '1px solid ' + couleurRole + '40',
                color: couleurRole, fontWeight: 700,
              }}>
                {ROLE_LABEL[utilisateur?.role || ''] || utilisateur?.role}
              </span>
            </div>
            <div style={{ width: '1px', height: '14px', background: 'rgba(255,255,255,0.1)' }} />
            <Link href="/dashboard" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
              Tableau de bord
            </Link>
            <Link href="/profil/modifier" style={{ fontSize: '11px', color: 'rgba(255,255,255,0.45)', textDecoration: 'none' }}>
              Mon profil
            </Link>
          </div>
        )}

        {/* ─── MENU MOBILE DÉROULANT ─── */}
        <div
          className={`mobile-menu${menuOuvert ? ' open' : ''}`}
          onClick={e => e.stopPropagation()}
          style={{
            flexDirection: 'column',
            background: '#0D1421',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            padding: '12px 16px 24px',
            gap: '2px',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}
        >
          {/* Profil mobile (si connecté) */}
          {estConnecte && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 16px', background: 'rgba(255,255,255,0.04)',
              borderRadius: '14px', marginBottom: '10px',
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                background: `linear-gradient(135deg,${couleurRole},#0A2540)`,
                border: `2px solid ${couleurRole}60`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '15px', fontWeight: 700, color: 'white',
              }}>{initiales}</div>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '15px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {utilisateur?.prenom} {utilisateur?.nom}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {utilisateur?.email}
                </div>
                <span style={{
                  display: 'inline-block', marginTop: '4px',
                  background: couleurRole + '20', color: couleurRole,
                  padding: '1px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: 700,
                }}>
                  {ROLE_LABEL[utilisateur?.role || ''] || utilisateur?.role}
                </span>
              </div>
            </div>
          )}

          {/* Liens navigation */}
          {liensNav.map(({ label, href }) => (
            <Link key={href} href={href}
              style={{
                display: 'block', padding: '13px 16px', borderRadius: '10px',
                color: pathname === href ? '#00D4FF' : 'rgba(255,255,255,0.75)',
                textDecoration: 'none', fontSize: '15px', fontWeight: 500,
                background: pathname === href ? 'rgba(0,212,255,0.08)' : 'transparent',
                borderLeft: `3px solid ${pathname === href ? '#00D4FF' : 'transparent'}`,
              }}
            >
              {label}
            </Link>
          ))}

          <div style={{ height: '1px', background: 'rgba(255,255,255,0.07)', margin: '10px 0' }} />

          {!_hasHydrated ? null : estConnecte ? (
            <>
              {utilisateur?.role === 'ADMIN' && (
                <Link href="/admin" style={{ display: 'block', padding: '13px 16px', borderRadius: '10px', color: '#7B61FF', textDecoration: 'none', fontSize: '15px', fontWeight: 600 }}>
                  ⚙️ Administration
                </Link>
              )}
              <Link href="/dashboard" style={{ display: 'block', padding: '13px 16px', borderRadius: '10px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '15px' }}>
                📊 Tableau de bord
              </Link>
              <Link href="/profil/modifier" style={{ display: 'block', padding: '13px 16px', borderRadius: '10px', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', fontSize: '15px' }}>
                ✏️ Mon profil
              </Link>
              <Link href="/premium" style={{ display: 'block', padding: '13px 16px', borderRadius: '10px', color: '#FF9F68', textDecoration: 'none', fontSize: '15px' }}>
                ⭐ Premium
              </Link>
              <button
                onClick={seDeconnecter}
                style={{
                  display: 'block', width: '100%', padding: '13px 16px', marginTop: '6px',
                  borderRadius: '10px', background: 'rgba(255,59,48,0.1)',
                  border: '1px solid rgba(255,59,48,0.2)', color: '#FF3B30',
                  cursor: 'pointer', fontSize: '15px', fontWeight: 600, textAlign: 'left',
                }}
              >
                🚪 Se déconnecter
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
              <Link href="/auth/connexion" style={{
                display: 'block', padding: '14px 16px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.15)', color: 'white',
                textDecoration: 'none', fontSize: '15px', fontWeight: 600, textAlign: 'center',
              }}>Se connecter</Link>
              <Link href="/auth/inscription" style={{
                display: 'block', padding: '14px 16px', borderRadius: '12px',
                background: 'linear-gradient(135deg,#00D4FF,#7B61FF)', color: 'white',
                textDecoration: 'none', fontSize: '15px', fontWeight: 700, textAlign: 'center',
              }}>S'inscrire gratuitement</Link>
              <Link href="/premium" style={{
                display: 'block', padding: '11px 16px', borderRadius: '12px',
                background: 'rgba(255,159,104,0.1)', border: '1px solid rgba(255,159,104,0.2)',
                color: '#FF9F68', textDecoration: 'none', fontSize: '14px',
                fontWeight: 600, textAlign: 'center',
              }}>⭐ Premium</Link>
            </div>
          )}

          <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'center' }}>
            <SelecteurLangue />
          </div>
        </div>
      </nav>
    </>
  );
}
