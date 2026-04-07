'use client';

import { useEffect, useState, useRef } from 'react';
import api from '@/lib/api';

interface Sponsor {
  id: string;
  nom: string;
  logoUrl?: string;
  siteWeb?: string;
  typeContrat?: string;
}

export default function BandeauSponsors() {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const defileurRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);

  useEffect(() => {
    api.get('/sponsoring/sponsors')
      .then(({ data }) => {
        if (Array.isArray(data) && data.length > 0) setSponsors(data);
      })
      .catch(() => {});
  }, []);

  // Défilement automatique en boucle
  useEffect(() => {
    const el = defileurRef.current;
    if (!el || sponsors.length === 0) return;
    const anim = setInterval(() => {
      posRef.current += 0.6;
      if (posRef.current >= el.scrollWidth / 2) posRef.current = 0;
      el.scrollLeft = posRef.current;
    }, 16);
    return () => clearInterval(anim);
  }, [sponsors]);

  if (sponsors.length === 0) return null;

  // Dupliquer pour boucle infinie
  const doubled = [...sponsors, ...sponsors];

  return (
    <div style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0', borderBottom: '1px solid #E2E8F0', padding: '12px 0' }}>
      <p style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: 600 }}>
        Nos partenaires
      </p>
      <div ref={defileurRef} style={{ display: 'flex', gap: '0', overflow: 'hidden', scrollBehavior: 'auto', alignItems: 'center' }}>
        {doubled.map((sponsor, i) => (
          <a
            key={i}
            href={sponsor.siteWeb || '#'}
            target={sponsor.siteWeb ? '_blank' : '_self'}
            rel="noreferrer"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '160px',
              height: '56px',
              margin: '0 16px',
              textDecoration: 'none',
              opacity: 0.7,
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '0.7')}
          >
            {sponsor.logoUrl && !sponsor.logoUrl.startsWith('#') ? (
              <img
                src={sponsor.logoUrl}
                alt={sponsor.nom}
                style={{ maxWidth: '140px', maxHeight: '48px', width: 'auto', height: 'auto', objectFit: 'contain', display: 'block' }}
              />
            ) : (
              <div style={{
                padding: '8px 16px', borderRadius: '8px',
                background: '#E2E8F0',
                fontSize: '13px', fontWeight: 700, color: '#475569',
                whiteSpace: 'nowrap', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {sponsor.nom}
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}
